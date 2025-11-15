const express = require('express');
const router = express.Router();
const Monster = require('../models/Monster');
const axios = require('axios');

// Get all monsters (from DB + API)
router.get('/', async (req, res) => {
    try {
        // Get custom monsters from database
        const customMonsters = await Monster.find();

        // Get monsters from D&D API
        const apiResponse = await axios.get('https://www.dnd5eapi.co/api/monsters');
        const apiMonsters = apiResponse.data.results;

        
        const allMonsters = [
            ...customMonsters.map(m => ({
                ...m.toObject(),
                source: 'custom'
            })),
            ...apiMonsters.map(m => ({
                ...m,
                source: 'api'
            }))
        ];

        res.json(allMonsters);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single monster by ID or index - FIXED VERSION
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;


        const isMongoId = /^[0-9a-fA-F]{24}$/.test(id);

        if (isMongoId) {

            const monster = await Monster.findById(id);
            if (monster) {
                return res.json({
                    ...monster.toObject(),
                    source: 'custom'
                });
            }
        }

        try {
            const apiResponse = await axios.get(`https://www.dnd5eapi.co/api/monsters/${id}`);
            const monster = {
                ...apiResponse.data,
                source: 'api'
            };
            return res.json(monster);
        } catch (apiError) {

            return res.status(404).json({
                message: 'Monster not found',
                searchedId: id,
                details: 'Not found in database or D&D API'
            });
        }

    } catch (error) {
        console.error('Error fetching monster:', error);
        res.status(500).json({ message: error.message });
    }
});

// Create new custom monster
router.post('/', async (req, res) => {
    const monster = new Monster({
        ...req.body,
        source: 'custom'
    });

    try {
        const newMonster = await monster.save();
        res.status(201).json(newMonster);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update monster
router.put('/:id', async (req, res) => {
    try {
        const updatedMonster = await Monster.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedMonster) {
            return res.status(404).json({ message: 'Monster not found' });
        }

        res.json(updatedMonster);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete monster
router.delete('/:id', async (req, res) => {
    try {
        const monster = await Monster.findByIdAndDelete(req.params.id);

        if (!monster) {
            return res.status(404).json({ message: 'Monster not found' });
        }

        res.json({ message: 'Monster deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Export monster as JSON
router.get('/:id/export', async (req, res) => {
    try {
        const monster = await Monster.findById(req.params.id);

        if (!monster) {
            return res.status(404).json({ message: 'Monster not found' });
        }

        res.setHeader('Content-Disposition', `attachment; filename="${monster.name}.json"`);
        res.setHeader('Content-Type', 'application/json');
        res.json(monster);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;