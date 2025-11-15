const mongoose = require('mongoose');

const MonsterSchema = new mongoose.Schema({
    // Basic Info
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    size: String,
    alignment: String,

    // Description
    description: {
        type: String,
        default: '',
    },

    // Stats - FIXED: armor_class should be an object, not a string
    armor_class: {
        value: {
            type: Number,
            default: 10
        },
        type: {
            type: String,
            default: 'natural armor'
        }
    },
    hit_points: {
        value: Number,
        formula: String,
    },
    speed: {
        walk: String,
        fly: String,
        swim: String,
        climb: String,
        burrow: String,
    },

    // Ability Scores
    strength: Number,
    dexterity: Number,
    constitution: Number,
    intelligence: Number,
    wisdom: Number,
    charisma: Number,

    // Challenge Rating
    challenge_rating: Number,
    xp: Number,

    // Actions
    actions: [{
        name: String,
        description: String,
    }],

    // Special Abilities
    special_abilities: [{
        name: String,
        description: String,
    }],

    // Damage Properties
    damage_vulnerabilities: [String],
    damage_resistances: [String],
    damage_immunities: [String],
    condition_immunities: [String],

    // Proficiencies
    proficiencies: [{
        name: String,
        value: Number,
    }],

    // Senses
    senses: {
        darkvision: String,
        blindsight: String,
        tremorsense: String,
        passive_perception: Number,
    },

    // Languages
    languages: String,

    // Image
    image: {
        type: String,
        default: '',
    },

    // Source tracking
    source: {
        type: String,
        enum: ['api', 'custom'],
        default: 'custom',
    },
    api_index: String, // For API monsters

    // Metadata
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Update timestamp on save
MonsterSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Monster', MonsterSchema);