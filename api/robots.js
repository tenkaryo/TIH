// Generate robots.txt for SEO
export default function handler(_req, res) {
    const baseUrl = 'https://tih-sigma.vercel.app';
    
    const robotsTxt = `# OnThisDay - 历史上的今天
# Generated robots.txt for SEO optimization

User-agent: *
Allow: /
Allow: /history/

# Block API endpoints from crawling
Disallow: /api/

# Allow important files
Allow: /sitemap.xml
Allow: /robots.txt

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml

# Crawl delay (optional - adjust based on server capacity)
Crawl-delay: 1

# Specific rules for major search engines
User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Bingbot
Allow: /
Crawl-delay: 1

User-agent: Baiduspider
Allow: /
Crawl-delay: 2

# Block common bot patterns that might be abusive
User-agent: AhrefsBot
Disallow: /

User-agent: MJ12bot
Disallow: /

User-agent: DotBot
Disallow: /`;

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 1 day
    res.status(200).send(robotsTxt);
}