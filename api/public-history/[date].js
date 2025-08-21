// 公开的历史数据API - 不需要身份验证
const historyData = require('../../historyData.js');

// Month names mapping
const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

// Parse URL date string (Month-DD) back to month/day numbers  
function parseUrlDate(urlDateStr) {
    const [monthName, dayStr] = urlDateStr.split('-');
    const monthIndex = monthNames.findIndex(name => name.toLowerCase() === monthName.toLowerCase());
    const month = monthIndex !== -1 ? monthIndex + 1 : null;
    const day = parseInt(dayStr, 10);
    return month && day ? { month, day } : null;
}

// Format internal date key (MM-DD)
function formatDateKey(month, day) {
    return `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
}

export default function handler(req, res) {
    try {
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
        
        // 获取日期数据
        const data = historyData[dateKey] || { events: [], birthdays: [], deaths: [] };
        
        // 设置响应头
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'public, max-age=1800'); // 30分钟缓存
        res.setHeader('Access-Control-Allow-Origin', '*');
        
        // 返回数据
        res.status(200).json({
            success: true,
            date: dateKey,
            timestamp: new Date().toISOString(),
            data: data,
            total: {
                events: data.events?.length || 0,
                birthdays: data.birthdays?.length || 0,
                deaths: data.deaths?.length || 0
            }
        });
        
    } catch (error) {
        console.error('Public History API Error:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to get historical data'
        });
    }
}