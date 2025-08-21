// 主API端点 - /api/ 路由处理
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const historyData = require('../historyData.js');

// 在Vercel中每个API文件都是独立的函数
export default function handler(req, res) {
    // 设置CORS
    const allowedOrigins = [
        process.env.FRONTEND_URL || 'http://localhost:3000',
        'null', // Allow file:// protocol
        'http://127.0.0.1:3000',
        'https://localhost:3000',
        'https://tih-sigma.vercel.app'
    ];
    
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin) || !origin) {
        res.setHeader('Access-Control-Allow-Origin', origin || '*');
    }
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type, User-Agent, x-timestamp, x-signature');

    // 处理预检请求
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { method, url } = req;
    const urlPath = new URL(url, `http://${req.headers.host}`).pathname;

    try {
        // API Token验证
        const API_TOKENS = [
            process.env.API_TOKEN || 'onthisday-secure-token-2024',
        ];

        const authenticateToken = () => {
            const token = req.headers.authorization?.replace('Bearer ', '') || req.query.token;
            
            if (!token) {
                res.status(401).json({ error: 'Authentication token required' });
                return false;
            }
            
            if (!API_TOKENS.includes(token)) {
                res.status(403).json({ error: 'Invalid authentication token' });
                return false;
            }
            
            return true;
        };

        // 健康检查端点
        if (urlPath === '/api/health') {
            res.json({ status: 'OK', timestamp: new Date().toISOString() });
            return;
        }

        // 历史数据端点
        const historyMatch = urlPath.match(/^\/api\/history\/([0-9]{2}-[0-9]{2})$/);
        if (historyMatch && method === 'GET') {
            if (!authenticateToken()) return;

            const date = historyMatch[1];
            const data = historyData[date];
            
            if (!data) {
                res.status(404).json({
                    error: 'No data available for this date',
                    date: date
                });
                return;
            }
            
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
            
            res.setHeader('Cache-Control', 'public, max-age=3600');
            res.json(response);
            return;
        }

        // 批量端点
        if (urlPath === '/api/history/batch' && method === 'POST') {
            if (!authenticateToken()) return;

            const { dates } = req.body;
            
            if (!Array.isArray(dates) || dates.length === 0) {
                res.status(400).json({ error: 'Dates array is required' });
                return;
            }
            
            if (dates.length > 7) {
                res.status(400).json({ error: 'Maximum 7 dates allowed per batch request' });
                return;
            }
            
            const results = {};
            dates.forEach(date => {
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
            return;
        }

        // 404 处理
        res.status(404).json({
            error: 'Endpoint not found',
            message: 'Please check the API documentation'
        });

    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Please try again later'
        });
    }
}