// Generate dynamic sitemap.xml for SEO
const historyData = require('../historyData.js');

export default function handler(_req, res) {
    try {
        // Get all available dates
        const dates = Object.keys(historyData);
        const baseUrl = 'https://tih-sigma.vercel.app';
        const currentDate = new Date().toISOString().split('T')[0];
        
        // Generate sitemap XML
        const urlEntries = [
            // Main pages
            {
                loc: baseUrl,
                lastmod: currentDate,
                changefreq: 'daily',
                priority: '1.0'
            },
            // History pages for each date
            ...dates.map(date => ({
                loc: `${baseUrl}/history/${date}/`,
                lastmod: currentDate,
                changefreq: 'weekly',
                priority: '0.8'
            })),
            // English versions
            ...dates.map(date => ({
                loc: `${baseUrl}/history/${date}/?lang=en-US`,
                lastmod: currentDate,
                changefreq: 'weekly',
                priority: '0.7'
            }))
        ];
        
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlEntries.map(entry => `
    <url>
        <loc>${entry.loc}</loc>
        <lastmod>${entry.lastmod}</lastmod>
        <changefreq>${entry.changefreq}</changefreq>
        <priority>${entry.priority}</priority>
        ${entry.loc.includes('/history/') && !entry.loc.includes('lang=') ? `
        <xhtml:link rel="alternate" hreflang="zh-CN" href="${entry.loc}" />
        <xhtml:link rel="alternate" hreflang="en-US" href="${entry.loc}?lang=en-US" />
        ` : ''}
    </url>`).join('')}
</urlset>`;
        
        res.setHeader('Content-Type', 'application/xml');
        res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400'); // Cache for 1 hour, CDN for 1 day
        res.status(200).send(sitemap);
        
    } catch (error) {
        console.error('Sitemap generation error:', error);
        res.status(500).json({ error: 'Failed to generate sitemap' });
    }
}