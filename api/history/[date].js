// Vercel serverless function for dynamic history pages
// This handles /history/{MM-DD}/ routes with SSR

const fs = require('fs');
const path = require('path');
const historyData = require('../../historyData.js');

// Month names for different languages
const monthNames = {
    'zh-CN': [
        '一月', '二月', '三月', '四月', '五月', '六月',
        '七月', '八月', '九月', '十月', '十一月', '十二月'
    ],
    'en-US': [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ]
};

// Parse URL date string (Month-DD) back to month/day numbers  
function parseUrlDate(urlDateStr) {
    const [monthName, dayStr] = urlDateStr.split('-');
    const monthIndex = monthNames['en-US'].findIndex(name => name.toLowerCase() === monthName.toLowerCase());
    const month = monthIndex !== -1 ? monthIndex + 1 : null;
    const day = parseInt(dayStr, 10);
    return month && day ? { month, day } : null;
}

// Format internal date key (MM-DD)
function formatDateKey(month, day) {
    return `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
}

// Get template content
function getTemplate() {
    try {
        const templatePath = path.join(process.cwd(), 'history', '[date]', 'index.html');
        return fs.readFileSync(templatePath, 'utf8');
    } catch (error) {
        console.error('Template not found:', error);
        return null;
    }
}

// Format date display
function formatDateDisplay(month, day, language = 'zh-CN') {
    const monthName = monthNames[language][month - 1];
    return language === 'zh-CN' ? `${month}月${day}日` : `${monthName.toUpperCase()} ${day}`;
}

// Generate page metadata
function generatePageMetadata(date, data, language = 'zh-CN') {
    const [month, day] = date.split('-').map(Number);
    const dateDisplay = formatDateDisplay(month, day, language);
    
    const eventCount = data.events?.length || 0;
    const birthdayCount = data.birthdays?.length || 0;
    const deathCount = data.deaths?.length || 0;
    
    const title = language === 'zh-CN' 
        ? `${dateDisplay} - 历史上的今天 | OnThisDay`
        : `${dateDisplay} - Today in History | OnThisDay`;
    
    const description = language === 'zh-CN'
        ? `${dateDisplay}历史上发生的重要事件，包含${eventCount}个历史事件、${birthdayCount}位名人生日、${deathCount}位名人逝世信息。探索历史，发现精彩。`
        : `Important historical events that happened on ${dateDisplay}, including ${eventCount} historical events, ${birthdayCount} famous birthdays, and ${deathCount} notable deaths. Explore history, discover the extraordinary.`;
    
    const keywords = language === 'zh-CN'
        ? `${dateDisplay}, 历史事件, 名人生日, 历史上的今天, 历史, ${month}月${day}日`
        : `${dateDisplay}, historical events, famous birthdays, today in history, history, ${monthNames['en-US'][month-1]} ${day}`;
    
    return { title, description, keywords, dateDisplay };
}

// Render SSR content for events
function renderEvents(events, language = 'zh-CN') {
    if (!events || events.length === 0) return '';
    
    return events.slice(0, 10).map(event => {
        const description = typeof event.description === 'object' 
            ? event.description[language] || event.description['zh-CN'] || event.description['en-US']
            : event.description;
        
        return `
            <div class="timeline-event">
                <span class="event-year">${event.year}</span>
                <div class="event-content">
                    <p class="event-description">${description}</p>
                    ${event.image ? `
                        <div class="event-image">
                            <img src="${event.image}" alt="${description}" loading="lazy">
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
}

// Render SSR content for people (birthdays/deaths)
function renderPeople(people, language = 'zh-CN') {
    if (!people || people.length === 0) return '';
    
    return people.slice(0, 6).map(person => {
        const name = typeof person.name === 'object' 
            ? person.name[language] || person.name['zh-CN'] || person.name['en-US']
            : person.name;
        const description = typeof person.description === 'object' 
            ? person.description[language] || person.description['zh-CN'] || person.description['en-US']
            : person.description;
        
        return `
            <div class="person-card">
                <div class="person-image">
                    <img src="${person.image}" alt="${name}" loading="lazy">
                </div>
                <div class="person-info">
                    <h4 class="person-name">${name}</h4>
                    <p class="person-years">${person.years}</p>
                    <p class="person-description">${description}</p>
                </div>
            </div>
        `;
    }).join('');
}

// Main handler
export default async function handler(req, res) {
    try {
        // Get date from URL path parameter (from [date] in filename)
        const { date } = req.query;
        const language = req.query.lang || 'zh-CN';
        
        // Parse URL date format (Month-DD) to get month and day
        const parsedDate = parseUrlDate(date);
        if (!parsedDate) {
            return res.status(404).json({ 
                error: 'Invalid date format. Use Month-DD format (e.g., August-21)',
                received: date 
            });
        }
        
        const { month, day } = parsedDate;
        const dateKey = formatDateKey(month, day);
        
        // Get data for the date
        const data = historyData[dateKey] || { events: [], birthdays: [], deaths: [] };
        
        // Get HTML template
        const template = getTemplate();
        if (!template) {
            return res.status(500).json({ error: 'Template not found' });
        }
        
        // Generate page metadata using dateKey
        const metadata = generatePageMetadata(dateKey, data, language);
        
        // Create current date object
        const currentDate = new Date(2024, month - 1, day);
        const dateISO = currentDate.toISOString().split('T')[0];
        
        // Generate subtitle
        const weekdays = language === 'zh-CN' 
            ? ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
            : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        
        const weekday = weekdays[currentDate.getDay()];
        const year = currentDate.getFullYear();
        const subtitle = language === 'zh-CN'
            ? `今天是${year}年${month}月${day}日，${weekday}`
            : `Today is ${weekday}, ${monthNames[language][month-1]} ${day}, ${year}`;
        
        // Render SSR content
        const historyEventsSSR = renderEvents(data.events, language);
        const famousBirthdaysSSR = renderPeople(data.birthdays, language);
        const famousDeathsSSR = renderPeople(data.deaths, language);
        
        // Page URL
        const baseUrl = 'https://tih-sigma.vercel.app';
        const pageUrl = `${baseUrl}/history/${date}/`;
        const pageUrlEn = `${baseUrl}/history/${date}/?lang=en-US`;
        
        // Replace template placeholders
        const html = template
            .replace(/\{\{PAGE_TITLE\}\}/g, metadata.title)
            .replace(/\{\{PAGE_DESCRIPTION\}\}/g, metadata.description)
            .replace(/\{\{PAGE_KEYWORDS\}\}/g, metadata.keywords)
            .replace(/\{\{PAGE_URL\}\}/g, pageUrl)
            .replace(/\{\{PAGE_URL_EN\}\}/g, pageUrlEn)
            .replace(/\{\{PAGE_IMAGE\}\}/g, data.events?.[0]?.image || `${baseUrl}/og-image.jpg`)
            .replace(/\{\{DATE_ISO\}\}/g, dateISO)
            .replace(/\{\{DATE_DISPLAY\}\}/g, metadata.dateDisplay)
            .replace(/\{\{DATE_SUBTITLE\}\}/g, subtitle)
            .replace(/\{\{CURRENT_DATE\}\}/g, date)
            .replace(/\{\{CURRENT_LANG\}\}/g, language)
            .replace(/\{\{HISTORY_EVENTS_SSR\}\}/g, historyEventsSSR)
            .replace(/\{\{FAMOUS_BIRTHDAYS_SSR\}\}/g, famousBirthdaysSSR)
            .replace(/\{\{FAMOUS_DEATHS_SSR\}\}/g, famousDeathsSSR)
            .replace(/\{\{SSR_CONTENT\}\}/g, `${historyEventsSSR}${famousBirthdaysSSR}${famousDeathsSSR}`);
        
        // Set headers for SEO
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=7200'); // Cache for 1 hour, CDN for 2 hours
        res.setHeader('X-Robots-Tag', 'index, follow');
        
        // Add language header
        res.setHeader('Content-Language', language);
        
        res.status(200).send(html);
        
    } catch (error) {
        console.error('SSR Error:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            message: 'Failed to render page'
        });
    }
}