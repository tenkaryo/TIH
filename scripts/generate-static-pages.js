#!/usr/bin/env node
// 静态页面生成器 - 为每个日期生成预渲染的HTML文件
// 这将为Google爬虫提供最佳的SEO体验

const fs = require('fs');
const path = require('path');
const historyData = require('../historyData.js');

// 月份名称
const monthNames = {
    'zh-CN': ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    'en-US': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
};

// Format URL-friendly date string (Month-DD)
function formatUrlDate(month, day) {
    const monthName = monthNames['en-US'][month - 1];
    return `${monthName}-${day}`;
}

// 格式化日期显示
function formatDateDisplay(month, day, language = 'zh-CN') {
    const monthName = monthNames[language][month - 1];
    return language === 'zh-CN' ? `${month}月${day}日` : `${monthName.toUpperCase()} ${day}`;
}

// 生成页面元数据
function generatePageMetadata(date, data, language = 'zh-CN') {
    const [month, day] = date.split('-').map(Number);
    const dateDisplay = formatDateDisplay(month, day, language);
    
    const eventCount = data.events?.length || 0;
    const birthdayCount = data.birthdays?.length || 0;
    const deathCount = data.deaths?.length || 0;
    
    const title = language === 'zh-CN' 
        ? `${dateDisplay} - 历史上的今天 | TimeRemind.Today`
        : `${dateDisplay} - Today in History | TimeRemind.Today`;
    
    const description = language === 'zh-CN'
        ? `${dateDisplay}历史上发生的重要事件，包含${eventCount}个历史事件、${birthdayCount}位名人生日、${deathCount}位名人逝世信息。探索历史，发现精彩。`
        : `Important historical events that happened on ${dateDisplay}, including ${eventCount} historical events, ${birthdayCount} famous birthdays, and ${deathCount} notable deaths. Explore history, discover the extraordinary.`;
    
    const keywords = language === 'zh-CN'
        ? `${dateDisplay}, 历史事件, 名人生日, 历史上的今天, 历史, ${month}月${day}日`
        : `${dateDisplay}, historical events, famous birthdays, today in history, history, ${monthNames['en-US'][month-1]} ${day}`;
    
    return { title, description, keywords, dateDisplay };
}

// 渲染事件HTML
function renderEvents(events, language = 'zh-CN') {
    if (!events || events.length === 0) {
        const noDataText = language === 'zh-CN' ? '暂无历史事件数据' : 'No historical events data available';
        return `<div class="loading">${noDataText}</div>`;
    }
    
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
                            <img src="${event.image}" alt="${description}" loading="lazy" onerror="this.style.display='none'">
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
}

// 渲染人物HTML
function renderPeople(people, language = 'zh-CN') {
    if (!people || people.length === 0) {
        const noDataText = language === 'zh-CN' ? '暂无数据' : 'No data available';
        return `<div class="loading">${noDataText}</div>`;
    }
    
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
                    <img src="${person.image}" alt="${name}" loading="lazy" onerror="this.src='/avatar.png'">
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

// 读取HTML模板
function getTemplate() {
    const templatePath = path.join(__dirname, '..', 'history', '[date]', 'index.html');
    return fs.readFileSync(templatePath, 'utf8');
}

// 生成单个日期页面
function generateDatePage(date, language = 'zh-CN') {
    const data = historyData[date] || { events: [], birthdays: [], deaths: [] };
    const template = getTemplate();
    const metadata = generatePageMetadata(date, data, language);
    const [month, day] = date.split('-').map(Number);
    
    // 创建当前日期对象
    const currentDate = new Date(2024, month - 1, day);
    const dateISO = currentDate.toISOString().split('T')[0];
    
    // 生成副标题
    const weekdays = language === 'zh-CN' 
        ? ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
        : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    const weekday = weekdays[currentDate.getDay()];
    const year = currentDate.getFullYear();
    const subtitle = language === 'zh-CN'
        ? `今天是${year}年${month}月${day}日，${weekday}`
        : `Today is ${weekday}, ${monthNames[language][month-1]} ${day}, ${year}`;
    
    // 渲染内容
    const historyEventsSSR = renderEvents(data.events, language);
    const famousBirthdaysSSR = renderPeople(data.birthdays, language);
    const famousDeathsSSR = renderPeople(data.deaths, language);
    
    // 页面URL - 使用URL格式
    const urlDate = formatUrlDate(month, day);
    const baseUrl = 'https://tih-sigma.vercel.app';
    const pageUrl = `${baseUrl}/history/${urlDate}/`;
    const pageUrlEn = `${baseUrl}/history/${urlDate}/?lang=en-US`;
    const ogImageUrl = `${baseUrl}/api/og-image/${urlDate}?lang=${language}`;
    
    // 替换模板占位符
    const html = template
        .replace(/\{\{PAGE_TITLE\}\}/g, metadata.title)
        .replace(/\{\{PAGE_DESCRIPTION\}\}/g, metadata.description)
        .replace(/\{\{PAGE_KEYWORDS\}\}/g, metadata.keywords)
        .replace(/\{\{PAGE_URL\}\}/g, pageUrl)
        .replace(/\{\{PAGE_URL_EN\}\}/g, pageUrlEn)
        .replace(/\{\{PAGE_IMAGE\}\}/g, ogImageUrl)
        .replace(/\{\{DATE_ISO\}\}/g, dateISO)
        .replace(/\{\{DATE_DISPLAY\}\}/g, metadata.dateDisplay)
        .replace(/\{\{DATE_SUBTITLE\}\}/g, subtitle)
        .replace(/\{\{CURRENT_DATE\}\}/g, formatUrlDate(month, day))
        .replace(/\{\{CURRENT_LANG\}\}/g, language)
        .replace(/\{\{HISTORY_EVENTS_SSR\}\}/g, historyEventsSSR)
        .replace(/\{\{FAMOUS_BIRTHDAYS_SSR\}\}/g, famousBirthdaysSSR)
        .replace(/\{\{FAMOUS_DEATHS_SSR\}\}/g, famousDeathsSSR)
        .replace(/\{\{SSR_CONTENT\}\}/g, `${historyEventsSSR}${famousBirthdaysSSR}${famousDeathsSSR}`);
    
    return html;
}

// 主生成函数
function generateAllPages() {
    const outputDir = path.join(__dirname, '..', 'public');
    
    // 创建输出目录
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const dates = Object.keys(historyData);
    const languages = ['zh-CN', 'en-US'];
    
    console.log(`开始生成 ${dates.length} 个日期的静态页面...`);
    
    let generatedCount = 0;
    
    dates.forEach(date => {
        languages.forEach(language => {
            try {
                const html = generateDatePage(date, language);
                
                // 创建目录结构 - 使用新的URL格式
                const [month, day] = date.split('-').map(Number);
                const urlDate = formatUrlDate(month, day);
                const dateDir = path.join(outputDir, 'history', urlDate);
                if (!fs.existsSync(dateDir)) {
                    fs.mkdirSync(dateDir, { recursive: true });
                }
                
                // 写入文件
                const filename = language === 'zh-CN' ? 'index.html' : 'index.en.html';
                const filePath = path.join(dateDir, filename);
                fs.writeFileSync(filePath, html, 'utf8');
                
                generatedCount++;
                console.log(`✅ 生成: /history/${urlDate}/${filename}`);
                
            } catch (error) {
                console.error(`❌ 生成失败: ${date} (${language})`, error.message);
            }
        });
    });
    
    console.log(`\n🎉 完成! 总共生成了 ${generatedCount} 个静态页面`);
    console.log(`📁 输出目录: ${outputDir}`);
    
    // 生成日期索引页面（不覆盖主页）
    generateDateIndexPage(dates, outputDir);
}

// 生成日期索引页面（不覆盖主页）
function generateDateIndexPage(dates, outputDir) {
    const indexHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TimeRemind.Today - 历史上的今天 | 所有日期页面</title>
    <meta name="description" content="TimeRemind.Today历史上的今天网站的所有日期页面索引，包含${dates.length}个日期的历史事件、名人生日和逝世信息">
    <style>
        body { font-family: Arial, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 40px; }
        .date-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; }
        .date-card { border: 1px solid #ddd; border-radius: 8px; padding: 15px; text-align: center; }
        .date-card h3 { margin: 0 0 10px 0; color: #333; }
        .date-card a { color: #667eea; text-decoration: none; margin: 0 5px; }
        .date-card a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="header">
        <h1>TimeRemind.Today - 历史上的今天</h1>
        <p>所有日期页面索引 (${dates.length} 个日期)</p>
        <p><a href="/">返回主页</a></p>
    </div>
    
    <div class="date-grid">
        ${dates.map(date => {
            const [month, day] = date.split('-').map(Number);
            const urlDate = formatUrlDate(month, day);
            const dateDisplay = `${month}月${day}日`;
            return `
                <div class="date-card">
                    <h3>${dateDisplay}</h3>
                    <p>
                        <a href="/history/${urlDate}/">中文</a>
                        <a href="/history/${urlDate}/?lang=en-US">English</a>
                    </p>
                </div>
            `;
        }).join('')}
    </div>
</body>
</html>`;
    
    const indexPath = path.join(outputDir, 'dates-index.html');
    fs.writeFileSync(indexPath, indexHtml, 'utf8');
    console.log(`📋 生成日期索引页面: ${indexPath}`);
}

// 如果直接运行脚本
if (require.main === module) {
    generateAllPages();
}

module.exports = { generateAllPages, generateDatePage };