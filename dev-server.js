// 本地开发服务器 - 支持SEO友好的URL路由
const express = require('express');
const path = require('path');
const fs = require('fs');
const historyData = require('./historyData.js');

const app = express();
const PORT = process.env.DEV_PORT || 3000;

// 静态文件服务
app.use('/styles.css', express.static(path.join(__dirname, 'styles.css')));
app.use('/script.js', express.static(path.join(__dirname, 'script.js')));
app.use('/data.js', express.static(path.join(__dirname, 'data.js')));
app.use('/historyData.js', express.static(path.join(__dirname, 'historyData.js')));

// 今天的数据API
app.get('/api/today', (req, res) => {
    try {
        const now = new Date();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const todayKey = `${month}-${day}`;
        
        const data = historyData[todayKey] || { events: [], birthdays: [], deaths: [] };
        
        res.json({
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
        res.status(500).json({ error: 'Failed to get today\'s data' });
    }
});

// 主页路由
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 历史页面路由 - 支持 /history/{MM-DD}/ 格式
app.get('/history/:date/', (req, res) => {
    const { date } = req.params;
    const language = req.query.lang || 'zh-CN';
    
    // 验证日期格式
    const dateRegex = /^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
    if (!dateRegex.test(date)) {
        return res.status(404).send('Invalid date format');
    }
    
    // 读取主页HTML文件
    const indexPath = path.join(__dirname, 'index.html');
    let html = fs.readFileSync(indexPath, 'utf8');
    
    // 为SEO添加基本的元数据
    const [month, day] = date.split('-').map(Number);
    const dateDisplay = language === 'zh-CN' ? `${month}月${day}日` : `${new Date(2024, month-1, day).toLocaleDateString('en-US', {month: 'long', day: 'numeric'})}`;
    const title = language === 'zh-CN' 
        ? `${dateDisplay} - 历史上的今天 | OnThisDay`
        : `${dateDisplay} - Today in History | OnThisDay`;
    
    // 更新页面标题
    html = html.replace(/<title>.*?<\/title>/i, `<title>${title}</title>`);
    
    // 添加当前日期的JavaScript变量
    html = html.replace('</body>', `
        <script>
            window.CURRENT_DATE = '${date}';
            window.CURRENT_LANG = '${language}';
        </script>
        </body>
    `);
    
    res.send(html);
});

// 404处理
app.use((req, res) => {
    res.status(404).send(`
        <h1>页面未找到</h1>
        <p>请访问 <a href="/">主页</a> 或 <a href="/history/08-21/">示例日期页面</a></p>
    `);
});

app.listen(PORT, () => {
    console.log(`🚀 本地开发服务器运行在: http://localhost:${PORT}`);
    console.log(`📅 示例页面: http://localhost:${PORT}/history/08-21/`);
    console.log(`🌐 英文版本: http://localhost:${PORT}/history/08-21/?lang=en-US`);
    console.log('');
    console.log('💡 提示: 这个服务器支持SEO友好的URL，解决了file://协议的限制');
});