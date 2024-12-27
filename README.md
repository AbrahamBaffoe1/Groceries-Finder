# Grocery Store Item Locator

A web application that helps users locate items in Target and Walmart stores using natural language processing. The app maintains a shopping list and provides specific shelf locations for each item.

## Features

- Store selection (Target/Walmart)
- Shopping list management
- Real-time item location lookup
- Natural language processing for item queries
- Store-specific location data
- Clean, responsive UI with Chakra UI

## Tech Stack

### Frontend
- React
- Chakra UI
- Vite
- Axios for API calls

### Backend
- Flask
- OpenAI GPT-3.5 for natural language processing
- Python-dotenv for environment variables
- Flask-CORS for cross-origin requests

## Setup

### Prerequisites
- Node.js
- Python 3.x
- OpenAI API key

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install flask flask-cors python-dotenv openai
   ```

4. Create a .env file in the backend directory:
   ```
   FLASK_PORT=5000
   OPENAI_API_KEY=your_openai_api_key_here
   ```

### Frontend Setup
1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

## Running the Application

1. Start the backend server:
   ```bash
   cd backend
   source venv/bin/activate
   python app.py
   ```

2. In a new terminal, start the frontend:
   ```bash
   npm run dev
   ```

3. Open http://localhost:5173 in your browser

## Usage

1. Select your preferred store (Target or Walmart)
2. Add items to your shopping list
3. View the specific location of each item in the selected store
4. Remove items from the list as needed

## API Endpoints

- GET `/api/items`: Get all items and their locations
- GET `/api/search?q=item1,item2&store=target`: Search for specific items in a store

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
