from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import os
import openai
from typing import Dict, List

load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure OpenAI
openai.api_key = os.getenv('OPENAI_API_KEY')

# Store-specific mock databases
target_items = {
    'fruits': {
        'apples': 'Produce Section, Front Left',
        'bananas': 'Produce Section, Front Center',
        'oranges': 'Produce Section, Front Right',
        'strawberries': 'Produce Section, Back Left',
        'grapes': 'Produce Section, Back Center',
    },
    'vegetables': {
        'carrots': 'Produce Section, Middle Left',
        'broccoli': 'Produce Section, Middle Right',
        'spinach': 'Produce Section, Back Wall',
        'tomatoes': 'Produce Section, Middle Center',
        'lettuce': 'Produce Section, Back Right',
    },
    'dairy': {
        'milk': 'Back Wall, Aisle 12',
        'cheese': 'Back Wall, Aisle 11',
        'yogurt': 'Back Wall, Aisle 12',
        'butter': 'Back Wall, Aisle 11',
        'eggs': 'Back Wall, Aisle 12',
    },
    'pantry': {
        'rice': 'Aisle 7, Left Side',
        'pasta': 'Aisle 7, Right Side',
        'cereal': 'Aisle 4, Both Sides',
        'flour': 'Aisle 8, Baking Section',
        'sugar': 'Aisle 8, Baking Section',
    }
}

walmart_items = {
    'fruits': {
        'apples': 'Produce Area, Left Wall',
        'bananas': 'Produce Area, Center Island',
        'oranges': 'Produce Area, Right Wall',
        'strawberries': 'Produce Area, Berry Section',
        'grapes': 'Produce Area, Center Display',
    },
    'vegetables': {
        'carrots': 'Produce Area, Back Left',
        'broccoli': 'Produce Area, Back Right',
        'spinach': 'Produce Area, Leafy Greens Section',
        'tomatoes': 'Produce Area, Center Right',
        'lettuce': 'Produce Area, Leafy Greens Section',
    },
    'dairy': {
        'milk': 'Dairy Wall, Last Section',
        'cheese': 'Dairy Wall, Middle Section',
        'yogurt': 'Dairy Wall, First Section',
        'butter': 'Dairy Wall, Middle Section',
        'eggs': 'Dairy Wall, First Section',
    },
    'pantry': {
        'rice': 'Aisle 12, International Foods',
        'pasta': 'Aisle 12, Left Side',
        'cereal': 'Aisle 8, Both Sides',
        'flour': 'Aisle 13, Baking Needs',
        'sugar': 'Aisle 13, Baking Needs',
    }
}

def get_store_items(store: str) -> Dict:
    return target_items if store == 'target' else walmart_items

def process_with_llm(items: List[str], store_items: Dict) -> Dict:
    """Use OpenAI to process items and find best matches"""
    try:
        # Convert store items to a string format for the prompt
        store_items_str = "\n".join([
            f"{category}:\n" + "\n".join([f"- {item}: {location}" 
            for item, location in items.items()])
            for category, items in store_items.items()
        ])
        
        prompt = f"""Given the following store layout:

{store_items_str}

Find the most likely locations for these items:
{', '.join(items)}

Return only the matching items and their locations in a clear, concise way."""

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that helps locate items in a store."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=150
        )
        
        # Process the response to extract locations
        result = {}
        for category, category_items in store_items.items():
            matching_items = {
                item: location for item, location in category_items.items()
                if any(search_item.lower() in item.lower() for search_item in items)
            }
            if matching_items:
                result[category] = matching_items
        
        return result
    except Exception as e:
        print(f"Error processing with LLM: {e}")
        return {}

@app.route('/api/items', methods=['GET'])
def get_items():
    store = request.args.get('store', 'target')
    return jsonify(get_store_items(store))

@app.route('/api/search', methods=['GET'])
def search_items():
    query = request.args.get('q', '')
    store = request.args.get('store', 'target')
    
    if not query:
        return jsonify({})
    
    # Split query into individual items
    items = [item.strip().lower() for item in query.split(',')]
    store_items = get_store_items(store)
    
    # Process items with LLM
    results = process_with_llm(items, store_items)
    
    return jsonify(results)

if __name__ == '__main__':
    if not os.getenv('OPENAI_API_KEY'):
        print("Warning: OPENAI_API_KEY not set in environment")
    
    port = int(os.getenv('FLASK_PORT', 5000))
    app.run(debug=True, port=port)
