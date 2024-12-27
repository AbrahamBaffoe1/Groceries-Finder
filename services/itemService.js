import { createServer } from 'http';
import { parse } from 'url';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Configure environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// In-memory cache
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const server = createServer((req, res) => {
    const { pathname, query } = parse(req.url, true);
    
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // Handle item statistics endpoint
    if (pathname === '/api/item-stats' && req.method === 'GET') {
        const itemName = query.item;
        
        if (!itemName) {
            res.writeHead(400);
            res.end(JSON.stringify({ error: 'Item name is required' }));
            return;
        }

        // Check cache first
        const cachedData = cache.get(itemName);
        if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(cachedData.data));
            return;
        }

        // Mock statistics data
        const stats = {
            popularity: Math.floor(Math.random() * 100),
            inStock: Math.random() > 0.2,
            lastRestocked: new Date(Date.now() - Math.random() * 86400000).toISOString(),
            averagePrice: (Math.random() * 10 + 1).toFixed(2)
        };

        // Cache the result
        cache.set(itemName, {
            timestamp: Date.now(),
            data: stats
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(stats));
        return;
    }

    // Handle unknown endpoints
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
});

const PORT = process.env.NODE_PORT || 3001;
server.listen(PORT, () => {
    console.log(`Node.js service running on port ${PORT}`);
});
