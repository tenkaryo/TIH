#!/usr/bin/env node
// 测试Vercel部署配置

const fs = require('fs');
const path = require('path');

console.log('🔍 检查Vercel部署配置...\n');

// 检查vercel.json配置
const vercelConfigPath = path.join(__dirname, '..', 'vercel.json');
if (fs.existsSync(vercelConfigPath)) {
    try {
        const config = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'));
        console.log('✅ vercel.json 格式正确');
        
        // 检查是否同时使用了routes和其他新配置
        const hasRoutes = config.routes && config.routes.length > 0;
        const hasNewConfig = config.rewrites || config.redirects || config.headers || config.cleanUrls || config.trailingSlash;
        
        if (hasRoutes && hasNewConfig) {
            console.log('❌ 错误：不能同时使用 routes 和 rewrites/headers');
            console.log('   当前配置使用了新的 rewrites 和 headers 格式，这是正确的');
        } else if (!hasRoutes && hasNewConfig) {
            console.log('✅ 配置格式正确：使用新的 rewrites 格式');
        } else if (hasRoutes && !hasNewConfig) {
            console.log('⚠️  使用旧的 routes 格式，建议升级到 rewrites');
        }
        
        // 检查API文件是否存在
        console.log('\n📁 检查API文件结构:');
        const apiFiles = [
            'api/index.js',
            'api/sitemap.js', 
            'api/robots.js',
            'api/history/[date].js'
        ];
        
        apiFiles.forEach(file => {
            const filePath = path.join(__dirname, '..', file);
            if (fs.existsSync(filePath)) {
                console.log(`✅ ${file} 存在`);
            } else {
                console.log(`❌ ${file} 不存在`);
            }
        });
        
    } catch (error) {
        console.log('❌ vercel.json 格式错误:', error.message);
    }
} else {
    console.log('❌ vercel.json 文件不存在');
}

// 检查环境变量设置提醒
console.log('\n🔧 环境变量检查清单:');
console.log('请确保在Vercel仪表板中设置了以下环境变量:');
console.log('  ✅ API_TOKEN=onthisday-secure-token-2024');
console.log('  ✅ SECRET_KEY=your-secret-key-here');
console.log('  ✅ FRONTEND_URL=https://tih-sigma.vercel.app');

// 部署建议
console.log('\n🚀 部署建议:');
console.log('1. 确保所有API文件都在 api/ 目录下');
console.log('2. 使用 npm run deploy 进行部署');
console.log('3. 部署后测试以下URL:');
console.log('   - https://tih-sigma.vercel.app/');
console.log('   - https://tih-sigma.vercel.app/history/08-21/');
console.log('   - https://tih-sigma.vercel.app/sitemap.xml');
console.log('   - https://tih-sigma.vercel.app/robots.txt');
console.log('   - https://tih-sigma.vercel.app/api/health');

console.log('\n✨ 配置检查完成！');