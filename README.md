# Grocery Store Item Locator Web App

A full-stack web application that helps users locate items in a grocery store. Built with React, Python Flask, and Node.js.

## Features

- Search for grocery items
- View item locations and categories
- Real-time item statistics (popularity, stock status, price)
- Responsive design
- Caching system for improved performance

## Tech Stack

- Frontend: React + Vite
- Backend API: Python Flask
- Additional Services: Node.js
- Styling: Pure CSS

## Prerequisites

- Node.js (v14 or higher)
- Python 3.x
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd grocery-store-locator
```

2. Install frontend dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash
cd backend
npm install
python3 -m pip install flask flask-cors python-dotenv
```

## Running the Application

1. Start the backend services (from the backend directory):
```bash
npm run dev
```
This will start both the Python Flask API (port 5000) and Node.js service (port 3001)

2. Start the frontend development server (from the project root):
```bash
npm run dev
```
The frontend will be available at http://localhost:5173

## Application Structure

```
grocery-store-locator/
├── src/                    # Frontend source files
│   ├── App.jsx            # Main React component
│   └── App.css            # Styles
├── backend/
│   ├── app.py             # Flask API
│   ├── services/
│   │   └── itemService.js # Node.js service
│   └── .env               # Backend configuration
└── README.md
```

## API Endpoints

### Flask API (Port 5000)
- GET `/api/items` - Get all grocery items
- GET `/api/search?q={query}` - Search for items

### Node.js Service (Port 3001)
- GET `/api/item-stats?item={itemName}` - Get item statistics

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
