// 主页API - 返回今天的历史数据
const historyData = require('../historyData.js');

export default function handler(req, res) {
    try {
        // 获取服务器当前日期
        const now = new Date();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const todayKey = `${month}-${day}`;
        
        // 获取今天的数据
        const data = historyData[todayKey] || { events: [], birthdays: [], deaths: [] };
        
        // 设置响应头
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'public, max-age=300'); // 5分钟缓存
        res.setHeader('Access-Control-Allow-Origin', '*');
        
        // 返回今天的数据
        res.status(200).json({
            success: true,
            date: todayKey,
            serverDate: now.toISOString(),
            data: data,
            total: {
                events: data.events?.length || 0,
                birthdays: data.birthdays?.length || 0,
                deaths: data.deaths?.length || 0
            }
        });
        
    } catch (error) {
        console.error('Today API Error:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to get today\'s data'
        });
    }
}