// OnThisDay API Server
// This file implements the history data API with anti-scraping protection

const express = require('express');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const crypto = require('crypto');
const historyData = require('./historyData.js');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for frontend
app.use(cors({
    origin: [
        process.env.FRONTEND_URL || 'http://localhost:3090',
        'null', // Allow file:// protocol
        'http://127.0.0.1:3090',
        'http://localhost:3090',
        'https://localhost:3090',
        // Keep old 3000 port for backward compatibility
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'https://localhost:3000',
        'https://tih-sigma.vercel.app' // Production domain
    ],
    credentials: true
}));

// Parse JSON requests
app.use(express.json());

// Anti-scraping measures
const rateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute window
    max: 10, // Limit each IP to 10 requests per windowMs
    message: {
        error: 'Too many requests, please try again later',
        retryAfter: 60
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// API Key-based dynamic token authentication
const API_KEY = process.env.API_KEY || 'TGnKAY@9$Q$5ryex4D5523';
const TOKEN_EXPIRE_SECONDS = 300; // 5 minutes

// Generate token hash (same algorithm as frontend)
function generateTokenHash(timestamp, apiKey) {
    function simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString(36);
    }
    
    const tokenPayload = timestamp + apiKey;
    return simpleHash(tokenPayload);
}

// Verify dynamic token
function verifyToken(token) {
    try {
        const [timestampStr, providedHash] = token.split('.');
        
        if (!timestampStr || !providedHash) {
            return { valid: false, error: 'Invalid token format' };
        }
        
        const timestamp = parseInt(timestampStr, 10);
        const currentTimestamp = Math.floor(Date.now() / 1000);
        
        // Check if token is expired
        if (currentTimestamp - timestamp > TOKEN_EXPIRE_SECONDS) {
            return { valid: false, error: 'Token expired' };
        }
        
        // Generate expected hash
        const expectedHash = generateTokenHash(timestamp, API_KEY);
        
        // Verify hash
        if (providedHash !== expectedHash) {
            return { valid: false, error: 'Invalid token signature' };
        }
        
        return { valid: true };
    } catch (error) {
        return { valid: false, error: 'Token verification failed' };
    }
}

// Middleware for dynamic token authentication
const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.replace('Bearer ', '') || req.query.token;
    
    if (!token) {
        return res.status(401).json({ error: 'Authentication token required' });
    }
    
    const verification = verifyToken(token);
    if (!verification.valid) {
        return res.status(403).json({ 
            error: 'Invalid authentication token',
            details: verification.error
        });
    }
    
    next();
};

// Middleware for request signature verification (optional)
const verifySignature = (req, res, next) => {
    // Skip signature verification if no timestamp provided
    const timestamp = req.headers['x-timestamp'];
    const signature = req.headers['x-signature'];
    
    if (!timestamp || !signature) {
        return next();
    }
    
    // Check if timestamp is within acceptable range (5 minutes)
    const currentTime = Math.floor(Date.now() / 1000);
    const requestTime = parseInt(timestamp);
    
    if (Math.abs(currentTime - requestTime) > 300) {
        return res.status(401).json({ error: 'Request timestamp expired' });
    }
    
    // Verify signature
    const expectedSignature = crypto
        .createHmac('sha256', SECRET_KEY)
        .update(timestamp + JSON.stringify(req.body || {}))
        .digest('hex');
    
    if (signature !== expectedSignature) {
        return res.status(401).json({ error: 'Invalid request signature' });
    }
    
    next();
};

// Apply rate limiting to all routes
app.use('/api/', rateLimiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Token generation endpoint
app.get('/api/token', (req, res) => {
    try {
        // Generate token
        const timestamp = Math.floor(Date.now() / 1000);
        const tokenHash = generateTokenHash(timestamp, API_KEY);
        const token = `${timestamp}.${tokenHash}`;
        
        // Set headers for security
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        
        // Return token
        res.json({
            success: true,
            token: token,
            timestamp: timestamp,
            expiresIn: TOKEN_EXPIRE_SECONDS
        });
        
    } catch (error) {
        console.error('Token generation error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate token'
        });
    }
});

// Main API endpoint for historical data
app.get('/api/history/:date', authenticateToken, verifySignature, (req, res) => {
    try {
        const { date } = req.params;
        
        // Validate date format (MM-DD)
        const dateRegex = /^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
        if (!dateRegex.test(date)) {
            return res.status(400).json({
                error: 'Invalid date format. Use MM-DD format (e.g., 08-20)'
            });
        }
        
        // Get data for the requested date
        const data = historyData[date];
        
        if (!data) {
            return res.status(404).json({
                error: 'No data available for this date',
                date: date
            });
        }
        
        // Add request metadata
        const response = {
            success: true,
            date: date,
            timestamp: new Date().toISOString(),
            data: data,
            total: {
                events: data.events?.length || 0,
                birthdays: data.birthdays?.length || 0,
                deaths: data.deaths?.length || 0
            }
        };
        
        // Set cache headers (optional - for performance)
        res.set('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
        
        res.json(response);
        
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Please try again later'
        });
    }
});

// Batch endpoint for multiple dates (limited to prevent abuse)
app.post('/api/history/batch', authenticateToken, verifySignature, (req, res) => {
    try {
        const { dates } = req.body;
        
        if (!Array.isArray(dates) || dates.length === 0) {
            return res.status(400).json({
                error: 'Dates array is required'
            });
        }
        
        // Limit batch size to prevent abuse
        if (dates.length > 7) {
            return res.status(400).json({
                error: 'Maximum 7 dates allowed per batch request'
            });
        }
        
        const results = {};
        
        dates.forEach(date => {
            // Validate date format
            const dateRegex = /^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
            if (dateRegex.test(date) && historyData[date]) {
                results[date] = historyData[date];
            }
        });
        
        res.json({
            success: true,
            timestamp: new Date().toISOString(),
            requested: dates.length,
            found: Object.keys(results).length,
            data: results
        });
        
    } catch (error) {
        console.error('Batch API Error:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Please try again later'
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: 'Something went wrong'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        message: 'Please check the API documentation'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`OnThisDay API server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
    console.log(`Main endpoint: http://localhost:${PORT}/api/history/{MM-DD}`);
});

module.exports = app;