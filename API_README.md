# OnThisDay API Server

## 概述

这是OnThisDay网站的后端API服务器，提供历史数据查询功能，包含防抓取机制。

## 安装和启动

### 1. 安装依赖

```bash
npm install
```

### 2. 启动服务器

```bash
# 生产环境
npm start

# 开发环境（自动重启）
npm run dev
```

服务器将在端口3001上运行。

## API 端点

### 健康检查
```
GET /api/health
```

### 获取历史数据
```
GET /api/history/{MM-DD}
Authorization: Bearer onthisday-secure-token-2024
```

示例：
```bash
curl -H "Authorization: Bearer onthisday-secure-token-2024" \
     http://localhost:3001/api/history/08-20
```

### 批量获取数据
```
POST /api/history/batch
Authorization: Bearer onthisday-secure-token-2024
Content-Type: application/json

{
  "dates": ["08-20", "08-21"]
}
```

## 防抓取机制

1. **频率限制**: 每IP每分钟最多10次请求
2. **Token认证**: 需要有效的API Token
3. **请求签名**: 支持HMAC-SHA256签名验证（可选）
4. **批量限制**: 单次最多查询7个日期

## 环境变量

```bash
PORT=3001                                    # 服务器端口
API_TOKEN=onthisday-secure-token-2024       # API访问令牌
SECRET_KEY=your-secret-key-here             # 签名密钥
FRONTEND_URL=http://localhost:3000          # 前端URL（CORS）
```

## 数据格式

### 响应格式
```json
{
  "success": true,
  "date": "08-20",
  "timestamp": "2024-08-20T10:30:00.000Z",
  "data": {
    "events": [...],
    "birthdays": [...],
    "deaths": [...]
  },
  "total": {
    "events": 5,
    "birthdays": 6,
    "deaths": 6
  }
}
```

### 数据项结构
```json
{
  "events": [
    {
      "year": "1969",
      "description": {
        "zh-CN": "中文描述",
        "en-US": "English description"
      },
      "image": "https://example.com/image.jpg"
    }
  ],
  "birthdays": [
    {
      "name": {
        "zh-CN": "中文名",
        "en-US": "English Name"
      },
      "years": "1946-",
      "description": {
        "zh-CN": "中文描述",
        "en-US": "English description"
      },
      "image": "https://example.com/image.jpg"
    }
  ]
}
```

## 错误处理

- `400`: 请求格式错误
- `401`: 认证失败
- `403`: 无效Token
- `404`: 数据不存在
- `429`: 请求频率超限
- `500`: 服务器内部错误

## 部署建议

1. 使用PM2进行进程管理
2. 配置Nginx作为反向代理
3. 启用HTTPS
4. 设置适当的环境变量
5. 配置日志记录
6. 定期备份历史数据

## 安全注意事项

1. 定期更换API Token
2. 监控API访问日志
3. 根据需要调整频率限制
4. 考虑添加IP白名单
5. 启用请求签名验证（生产环境推荐）