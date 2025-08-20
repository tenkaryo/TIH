# OnThisDay 部署说明

## Vercel 部署配置

### 1. 环境变量设置

在 Vercel 项目设置中配置以下环境变量：

```bash
API_TOKEN=onthisday-secure-token-2024
SECRET_KEY=your-secret-key-here
NODE_ENV=production
FRONTEND_URL=https://tih-sigma.vercel.app
```

### 2. 部署域名

- **生产域名**: https://tih-sigma.vercel.app
- **本地开发**: http://localhost:3000

### 3. API 端点

#### 生产环境
- API Base URL: `https://tih-sigma.vercel.app/api`
- 健康检查: `https://tih-sigma.vercel.app/api/health`
- 历史数据: `https://tih-sigma.vercel.app/api/history/{MM-DD}`

#### 本地开发环境
- API Base URL: `http://localhost:3001/api`
- 前端服务: `http://localhost:3000`

### 4. 部署步骤

#### 自动部署 (推荐)
1. 将代码推送到 GitHub 仓库
2. 在 Vercel 中连接 GitHub 仓库
3. 配置环境变量
4. 自动部署完成

#### 手动部署
```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录 Vercel
vercel login

# 部署
vercel --prod
```

### 5. 本地开发

```bash
# 安装依赖
npm install

# 启动 API 服务器 (端口 3001)
npm start

# 启动前端服务器 (端口 3000)
python3 -m http.server 3000
```

### 6. 项目结构

```
TIH/
├── index.html          # 主页面
├── styles.css          # 样式文件
├── script.js           # 前端逻辑
├── data.js             # 数据处理和API配置
├── api.js              # API 服务器
├── historyData.js      # 历史数据
├── package.json        # Node.js 依赖
├── vercel.json         # Vercel 配置
├── API_README.md       # API 文档
└── DEPLOYMENT.md       # 部署说明
```

### 7. API 认证

所有 API 请求需要包含认证头：
```
Authorization: Bearer onthisday-secure-token-2024
```

### 8. CORS 配置

支持的域名：
- `http://localhost:3000` (本地开发)
- `https://tih-sigma.vercel.app` (生产环境)
- `null` (file:// 协议)

### 9. 功能特性

- ✅ 响应式设计 (移动端和桌面端)
- ✅ 中英文语言切换
- ✅ 历史事件数据展示
- ✅ 名人生日和逝世信息
- ✅ 日期导航功能
- ✅ 生日查询功能
- ✅ API 数据缓存
- ✅ 防抓取机制

### 10. 性能优化

- API 响应缓存 (5分钟)
- 图片懒加载
- 请求频率限制
- Gzip 压缩
- CDN 加速

### 11. 监控和调试

#### 检查 API 状态
```bash
curl https://tih-sigma.vercel.app/api/health
```

#### 检查数据接口
```bash
curl -H "Authorization: Bearer onthisday-secure-token-2024" \
     https://tih-sigma.vercel.app/api/history/08-20
```

### 12. 故障排除

#### 常见问题

1. **CORS 错误**: 确保域名已添加到 CORS 配置中
2. **API 认证失败**: 检查 Authorization 头是否正确
3. **数据加载失败**: 检查网络连接和 API 服务状态
4. **样式显示异常**: 清除浏览器缓存

#### 日志查看
- Vercel 控制台查看部署日志
- 浏览器开发者工具查看前端错误
- API 错误会在服务器日志中显示

### 13. 更新部署

1. 修改代码并推送到 GitHub
2. Vercel 会自动触发重新部署
3. 部署完成后自动更新生产环境

### 14. 回滚操作

在 Vercel 控制台中可以快速回滚到之前的部署版本。

---

**注意**: 确保所有环境变量正确配置，特别是 API_TOKEN 和 SECRET_KEY。