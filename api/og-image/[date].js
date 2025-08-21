// Generate Open Graph images for each date
// This creates dynamic social sharing images

export default async function handler(req, res) {
    try {
        const { date } = req.query;
        const language = req.query.lang || 'zh-CN';
        
        // Validate date format
        const dateRegex = /^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
        if (!dateRegex.test(date)) {
            return res.status(404).json({ error: 'Invalid date format' });
        }
        
        const [month, day] = date.split('-').map(Number);
        
        // Format date display
        const monthNames = {
            'zh-CN': ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            'en-US': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        };
        
        const dateDisplay = language === 'zh-CN' 
            ? `${month}月${day}日`
            : `${monthNames[language][month - 1]} ${day}`;
        
        const title = language === 'zh-CN'
            ? `${dateDisplay} - 历史上的今天`
            : `${dateDisplay} - Today in History`;
        
        const subtitle = language === 'zh-CN'
            ? '探索历史，发现精彩'
            : 'Explore History, Discover the Extraordinary';
        
        // Generate SVG image
        const svg = `
        <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
                </linearGradient>
                <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="2" dy="4" stdDeviation="3" flood-color="rgba(0,0,0,0.3)"/>
                </filter>
            </defs>
            
            <!-- Background -->
            <rect width="1200" height="630" fill="url(#bg)"/>
            
            <!-- Overlay pattern -->
            <circle cx="100" cy="100" r="60" fill="rgba(255,255,255,0.1)"/>
            <circle cx="1100" cy="530" r="80" fill="rgba(255,255,255,0.1)"/>
            <circle cx="200" cy="530" r="40" fill="rgba(255,255,255,0.1)"/>
            
            <!-- Main content -->
            <rect x="80" y="120" width="1040" height="390" rx="20" fill="rgba(255,255,255,0.95)" filter="url(#shadow)"/>
            
            <!-- Logo/Brand -->
            <text x="120" y="180" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="#2d3748">OnThisDay</text>
            
            <!-- Main title -->
            <text x="120" y="260" font-family="Arial, sans-serif" font-size="64" font-weight="bold" fill="#1a202c">${title}</text>
            
            <!-- Subtitle -->
            <text x="120" y="320" font-family="Arial, sans-serif" font-size="28" fill="#4a5568">${subtitle}</text>
            
            <!-- Date highlight -->
            <rect x="120" y="360" width="200" height="60" rx="30" fill="#667eea"/>
            <text x="220" y="400" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="white" text-anchor="middle">${dateDisplay}</text>
            
            <!-- Decorative elements -->
            <rect x="120" y="450" width="960" height="4" fill="#e2e8f0"/>
            <circle cx="140" cy="452" r="8" fill="#667eea"/>
            <circle cx="1080" cy="452" r="8" fill="#764ba2"/>
        </svg>`;
        
        // Convert SVG to PNG would require additional libraries
        // For now, return SVG (browsers can display SVG as OG images)
        res.setHeader('Content-Type', 'image/svg+xml');
        res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 1 day
        res.status(200).send(svg);
        
    } catch (error) {
        console.error('OG Image generation error:', error);
        res.status(500).json({ error: 'Failed to generate OG image' });
    }
}