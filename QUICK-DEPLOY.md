# 快速部署指南

## 🚀 Vercel 一键部署

### 步骤 1: 准备代码
确保所有文件已提交到 Git 仓库：
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### 步骤 2: Vercel 部署
1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 "New Project"
3. 选择你的 GitHub 仓库
4. 项目设置保持默认，点击 "Deploy"

### 步骤 3: 配置环境变量
部署完成后，进入项目设置：
1. 点击 "Settings" → "Environment Variables"
2. 添加以下变量：

```
API_TOKEN = onthisday-secure-token-2024
SECRET_KEY = your-secret-key-here  
FRONTEND_URL = https://tih-sigma.vercel.app
```

### 步骤 4: 重新部署
添加环境变量后：
1. 进入 "Deployments" 页面
2. 点击最新部署的 "..." 菜单
3. 选择 "Redeploy"

### 步骤 5: 验证部署
访问 https://tih-sigma.vercel.app 检查网站是否正常工作。

## 🔧 常见问题

### 问题 1: CORS 错误
**解决方案**: 确保 `FRONTEND_URL` 环境变量设置正确。

### 问题 2: API 调用失败
**解决方案**: 检查 `API_TOKEN` 是否正确设置。

### 问题 3: 页面显示空白
**解决方案**: 检查浏览器控制台错误，通常是 JavaScript 加载问题。

## 📝 部署后检查清单

- [ ] 网站首页正常加载
- [ ] 语言切换功能工作
- [ ] 日期导航功能正常
- [ ] 历史事件数据显示
- [ ] 名人信息显示正确
- [ ] 移动端响应式正常

## 🛠 本地开发环境

如需本地开发，运行：
```bash
# 启动 API 服务器 (端口 3001)
npm start

# 启动前端服务器 (端口 3000) 
python3 -m http.server 3000
```

访问: http://localhost:3000

---

**部署时间**: 约 3-5 分钟  
**域名**: https://tih-sigma.vercel.app