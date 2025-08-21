// Token generation API endpoint
// This endpoint generates dynamic tokens using server-side API key

const API_KEY = process.env.API_KEY || 'TGnKAY@9$Q$5ryex4D5523';

// Generate token hash (same algorithm as before)
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

// Generate dynamic token
function generateToken() {
    const timestamp = Math.floor(Date.now() / 1000); // Unix timestamp
    const tokenHash = generateTokenHash(timestamp, API_KEY);
    const token = `${timestamp}.${tokenHash}`;
    return token;
}

export default function handler(req, res) {
    try {
        // Only allow GET requests
        if (req.method !== 'GET') {
            return res.status(405).json({ error: 'Method not allowed' });
        }

        // Generate token
        const token = generateToken();
        
        // Set headers for security
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        
        // Return token
        res.status(200).json({
            success: true,
            token: token,
            timestamp: Math.floor(Date.now() / 1000),
            expiresIn: 300 // 5 minutes
        });
        
    } catch (error) {
        console.error('Token generation error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate token'
        });
    }
}