# D&D Monster Builder

A full-stack web application for creating, managing, and viewing Dungeons & Dragons 5th Edition monsters. Built with Vue.js, Node.js, Express, and MongoDB.

## Project Overview

The D&D Monster Builder is a comprehensive web application that allows users to browse official D&D 5E monsters from the D&D API and create custom monster stat blocks. It features a medieval-themed interface, real-time previews, and full CRUD operations for custom monsters.

## Tech Stack

### Frontend
- **Vue 3** - Progressive JavaScript framework with Composition API
- **Vue Router** - Client-side routing
- **Pinia** - State management
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework with custom medieval theme
- **Axios** - HTTP client for API requests

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **CORS** - Cross-origin resource sharing

### External API
- **D&D 5E API** - RESTful API for official D&D content

## Features

### Frontend Features

- **Monster Browsing**
  - View official D&D 5E monsters from the API
  - View custom user-created monsters
  - Grid and list view modes
  - Real-time search functionality
  - Filter by monster type
  - Filter by Challenge Rating (CR)

- **Monster Details**
  - Complete stat blocks with all D&D 5E attributes
  - Ability scores with calculated modifiers
  - Actions, special abilities, and traits
  - Armor class, hit points, and speed
  - Damage resistances, immunities, and vulnerabilities
  - Senses and languages

- **Custom Monster Builder**
  - Create new monsters with full customization
  - Edit existing custom monsters
  - Image URL support
  - Real-time preview as you build
  - Automatic modifier calculations
  - Comprehensive form validation

- **User Interface**
  - Medieval/fantasy themed design
  - Responsive layout for all devices
  - Animated D20 dice loading indicator
  - Smooth transitions and hover effects
  - Parchment-style stat blocks

### Backend Features

- **RESTful API**
  - GET all monsters (combines database and D&D API)
  - GET single monster by ID or index
  - POST create new custom monster
  - PUT update existing custom monster
  - DELETE custom monster
  - GET export monster as JSON

- **Database Management**
  - MongoDB integration with Mongoose
  - Custom monster schema validation
  - Automatic timestamps
  - Data persistence

- **Hybrid Data Sources**
  - Seamlessly combines custom monsters from database
  - Integrates official monsters from D&D 5E API
  - Source tracking (custom vs API)

## Getting Started

### Prerequisites

- **Node.js** v14 or higher
- **npm** v6 or higher
- **MongoDB** v4.4 or higher (local installation or MongoDB Atlas account)
- **Git** for version control

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/DefNotS1y/dnd-monster-builder.git
cd dnd-monster-builder
```

2. **Set up the Backend**

```bash
cd server
npm install
```

3. **Configure Environment Variables**

Create a `.env` file in the `server` directory:

```env
MONGODB_URI=mongodb://localhost:27017/dnd-monsters
PORT=5000
```

For MongoDB Atlas (cloud database):
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dnd-monsters
PORT=5000
```

4. **Set up the Frontend**

```bash
cd ../monster-builder
npm install
```

### Running the Application

1. **Start MongoDB** (if running locally)

```bash
# On Windows
mongod

# On macOS/Linux
sudo systemctl start mongod
```

2. **Start the Backend Server**

```bash
cd server
npm run dev
```

The backend will run on `http://localhost:5000`

3. **Start the Frontend Development Server**

In a new terminal:

```bash
cd monster-builder
npm run dev
```

The frontend will run on `http://localhost:5173`

4. **Access the Application**

Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
dnd-monster-builder/
├── monster-builder/          # Frontend Vue.js application
│   ├── src/
│   │   ├── components/      # Reusable Vue components
│   │   ├── views/           # Page-level components
│   │   ├── stores/          # Pinia state management
│   │   ├── router/          # Vue Router configuration
│   │   └── assets/          # Static assets
│   ├── public/              # Public static files
│   └── package.json
│
├── server/                   # Backend Node.js/Express application
│   ├── models/              # Mongoose schemas
│   ├── routes/              # Express route handlers
│   ├── server.js            # Main server file
│   └── package.json
│
└── README.md
```

## API Endpoints

### Backend API Routes

- `GET /api/monsters` - Get all monsters (custom + API)
- `GET /api/monsters/:id` - Get single monster by ID
- `POST /api/monsters` - Create new custom monster
- `PUT /api/monsters/:id` - Update custom monster
- `DELETE /api/monsters/:id` - Delete custom monster
- `GET /api/monsters/:id/export` - Export monster as JSON

### External API

- D&D 5E API: `https://www.dnd5eapi.co/api/monsters`

## Development

### Frontend Development

```bash
cd monster-builder
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend Development

```bash
cd server
npm run dev          # Start with nodemon (auto-restart)
npm start            # Start production server
```

## Technical Skills Demonstrated

### Frontend Development
- Vue 3 Composition API
- Component-based architecture
- Reactive state management with Pinia
- Vue Router for SPA navigation
- Computed properties and watchers
- Form handling and validation
- API integration with Axios
- Responsive design with Tailwind CSS

### Backend Development
- RESTful API design
- Express middleware
- MongoDB database integration
- Mongoose ODM
- Error handling
- CORS configuration
- Environment variables
- Async/await patterns

### Full-Stack Integration
- Frontend-backend communication
- State synchronization
- API error handling
- Data transformation between sources
- Image URL handling

### Software Engineering
- Clean code architecture
- Component reusability
- Separation of concerns
- Git version control
- Environment configuration
- Error handling and validation

## Building for Production

### Frontend

```bash
cd monster-builder
npm run build
```

The production files will be in `monster-builder/dist`

### Backend

Set `NODE_ENV=production` in your environment variables and run:

```bash
cd server
npm start
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Troubleshooting

### MongoDB Connection Issues

- Ensure MongoDB is running on your system
- Check the `MONGODB_URI` in your `.env` file
- For MongoDB Atlas, ensure your IP is whitelisted

### Port Already in Use

- Change the `PORT` in `server/.env` to a different port
- Update the API base URL in `monster-builder/src/stores/monsters.js`

### CORS Errors

- Ensure the backend CORS configuration includes your frontend URL
- Check that both servers are running

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

This project is not affiliated with Wizards of the Coast. Dungeons & Dragons and all related properties are trademarks of Wizards of the Coast LLC.
