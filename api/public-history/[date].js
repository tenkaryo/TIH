// 公开的历史数据API - 不需要身份验证
const historyData = require('../../historyData.js');

export default function handler(req, res) {
    try {
        const { date } = req.query;
        const language = req.query.lang || 'zh-CN';
        
        // 验证日期格式 (MM-DD)
        const dateRegex = /^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
        if (!date || !dateRegex.test(date)) {
            return res.status(404).json({ 
                error: 'Invalid date format. Use MM-DD format (e.g., 08-21)',
                received: date 
            });
        }
        
        // 获取日期数据
        const data = historyData[date] || { events: [], birthdays: [], deaths: [] };
        
        // 设置响应头
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'public, max-age=1800'); // 30分钟缓存
        res.setHeader('Access-Control-Allow-Origin', '*');
        
        // 返回数据
        res.status(200).json({
            success: true,
            date: date,
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