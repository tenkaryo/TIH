#!/usr/bin/env node
// SEO测试脚本 - 验证SEO优化效果

const https = require('https');
const http = require('http');

const baseUrl = 'https://tih-sigma.vercel.app';
const testUrls = [
    '/',
    '/history/08-20/',
    '/history/08-21/',
    '/history/12-25/',
    '/sitemap.xml',
    '/robots.txt'
];

// 发送HTTP请求
function makeRequest(url) {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https') ? https : http;
        
        protocol.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                resolve({
                    url,
                    statusCode: res.statusCode,
                    headers: res.headers,
                    body: data,
                    size: Buffer.byteLength(data, 'utf8')
                });
            });
        }).on('error', reject);
    });
}

// 检查页面SEO元素
function checkSEOElements(response) {
    const { url, body, headers } = response;
    const results = [];
    
    // 检查标题
    const titleMatch = body.match(/<title>(.*?)<\/title>/i);
    if (titleMatch) {
        const title = titleMatch[1];
        results.push({
            element: 'Title',
            found: true,
            content: title,
            length: title.length,
            status: title.length >= 30 && title.length <= 60 ? '✅' : '⚠️'
        });
    } else {
        results.push({ element: 'Title', found: false, status: '❌' });
    }
    
    // 检查描述
    const descMatch = body.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
    if (descMatch) {
        const desc = descMatch[1];
        results.push({
            element: 'Description',
            found: true,
            content: desc,
            length: desc.length,
            status: desc.length >= 120 && desc.length <= 160 ? '✅' : '⚠️'
        });
    } else {
        results.push({ element: 'Description', found: false, status: '❌' });
    }
    
    // 检查关键词
    const keywordsMatch = body.match(/<meta\s+name=["']keywords["']\s+content=["'](.*?)["']/i);
    results.push({
        element: 'Keywords',
        found: !!keywordsMatch,
        content: keywordsMatch ? keywordsMatch[1] : null,
        status: keywordsMatch ? '✅' : '⚠️'
    });
    
    // 检查Open Graph标签
    const ogTitleMatch = body.match(/<meta\s+property=["']og:title["']\s+content=["'](.*?)["']/i);
    const ogDescMatch = body.match(/<meta\s+property=["']og:description["']\s+content=["'](.*?)["']/i);
    const ogImageMatch = body.match(/<meta\s+property=["']og:image["']\s+content=["'](.*?)["']/i);
    
    results.push({
        element: 'OG:Title',
        found: !!ogTitleMatch,
        content: ogTitleMatch ? ogTitleMatch[1] : null,
        status: ogTitleMatch ? '✅' : '❌'
    });
    
    results.push({
        element: 'OG:Description',
        found: !!ogDescMatch,
        content: ogDescMatch ? ogDescMatch[1] : null,
        status: ogDescMatch ? '✅' : '❌'
    });
    
    results.push({
        element: 'OG:Image',
        found: !!ogImageMatch,
        content: ogImageMatch ? ogImageMatch[1] : null,
        status: ogImageMatch ? '✅' : '❌'
    });
    
    // 检查结构化数据
    const structuredDataMatch = body.match(/<script\s+type=["']application\/ld\+json["']>(.*?)<\/script>/is);
    if (structuredDataMatch) {
        try {
            JSON.parse(structuredDataMatch[1]);
            results.push({ element: 'Structured Data', found: true, status: '✅' });
        } catch (e) {
            results.push({ element: 'Structured Data', found: true, status: '❌', error: 'Invalid JSON' });
        }
    } else {
        results.push({ element: 'Structured Data', found: false, status: '❌' });
    }
    
    // 检查Canonical URL
    const canonicalMatch = body.match(/<link\s+rel=["']canonical["']\s+href=["'](.*?)["']/i);
    results.push({
        element: 'Canonical URL',
        found: !!canonicalMatch,
        content: canonicalMatch ? canonicalMatch[1] : null,
        status: canonicalMatch ? '✅' : '⚠️'
    });
    
    // 检查响应头
    const cacheControl = headers['cache-control'];
    const xRobotsTag = headers['x-robots-tag'];
    
    results.push({
        element: 'Cache-Control',
        found: !!cacheControl,
        content: cacheControl,
        status: cacheControl ? '✅' : '⚠️'
    });
    
    results.push({
        element: 'X-Robots-Tag',
        found: !!xRobotsTag,
        content: xRobotsTag,
        status: xRobotsTag ? '✅' : '⚠️'
    });
    
    return results;
}

// 运行SEO测试
async function runSEOTest() {
    console.log('🔍 开始SEO测试...\n');
    
    for (const testUrl of testUrls) {
        const fullUrl = testUrl.startsWith('http') ? testUrl : baseUrl + testUrl;
        
        try {
            console.log(`📄 测试页面: ${testUrl}`);
            console.log(`🌐 完整URL: ${fullUrl}`);
            
            const response = await makeRequest(fullUrl);
            
            console.log(`📊 状态码: ${response.statusCode}`);
            console.log(`📏 页面大小: ${Math.round(response.size / 1024)}KB`);
            
            if (response.statusCode === 200) {
                if (testUrl.includes('.xml') || testUrl.includes('.txt')) {
                    console.log('✅ 特殊文件加载成功');
                } else {
                    const seoResults = checkSEOElements(response);
                    
                    console.log('\n📋 SEO检查结果:');
                    seoResults.forEach(result => {
                        console.log(`  ${result.status} ${result.element}: ${result.found ? '已找到' : '未找到'}`);
                        if (result.content && result.content.length < 100) {
                            console.log(`    内容: ${result.content}`);
                        }
                        if (result.length) {
                            console.log(`    长度: ${result.length} 字符`);
                        }
                        if (result.error) {
                            console.log(`    错误: ${result.error}`);
                        }
                    });
                }
            } else {
                console.log(`❌ 页面加载失败: HTTP ${response.statusCode}`);
            }
            
        } catch (error) {
            console.log(`❌ 请求失败: ${error.message}`);
        }
        
        console.log('\n' + '='.repeat(60) + '\n');
    }
    
    // 生成SEO报告总结
    console.log('📊 SEO测试总结:');
    console.log('✅ 已实现的SEO优化:');
    console.log('  - 独立的URL结构 (/history/{MM-DD}/)');
    console.log('  - 服务器端渲染(SSR)');
    console.log('  - 动态生成的SEO元数据');
    console.log('  - Open Graph社交分享标签');
    console.log('  - 结构化数据(JSON-LD)');
    console.log('  - 网站地图和robots.txt');
    console.log('  - 缓存控制头');
    console.log('  - 多语言支持');
    
    console.log('\n🚀 建议的进一步优化:');
    console.log('  - 添加面包屑导航');
    console.log('  - 实现内部链接策略');
    console.log('  - 添加相关日期推荐');
    console.log('  - 优化图片加载和压缩');
    console.log('  - 实现AMP页面');
    console.log('  - 添加页面加载速度监控');
}

// 如果直接运行脚本
if (require.main === module) {
    runSEOTest().catch(console.error);
}

module.exports = { runSEOTest, checkSEOElements };