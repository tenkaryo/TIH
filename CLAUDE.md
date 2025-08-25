# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a bilingual (Chinese/English) "Today in History" web application that displays historical events, famous birthdays, and deaths for any given date. The project consists of both frontend and backend components deployed on Vercel.

## Architecture

### Frontend
- **Entry Point**: `index.html` - Single page application with responsive design
- **Styling**: `styles.css` - Modern design with gradient backgrounds and animations
- **Logic**: `script.js` - Main application class `OnThisDay` handling UI interactions and data loading
- **Data Management**: `data.js` - API client with caching, translations, and utility functions
- **Static Pages**: `about.html`, `privacy.html`, `terms.html` - Single-page multilingual static pages
- **Language Support**: Built-in Chinese/English switching with complete translations

### Backend API
- **Server**: `api.js` - Express.js API server with anti-scraping protection
- **Data Source**: `historyData.js` - Historical data for events, birthdays, and deaths
- **Features**: Token authentication, rate limiting, CORS configuration, batch endpoints

## Development Commands

### Local Development
```bash
# Install dependencies
npm install

# 推荐方式：同时启动API和前端服务器（支持SEO友好URL）
npm run local
# 这会启动：
# - API服务器 (port 3001) - 提供数据API
# - 前端开发服务器 (port 3090) - 支持 /history/{MM-DD}/ 路由和主页动态日期

# 或者分别启动：

# 启动API服务器 (port 3001)
npm start
# 开发模式（自动重启）
npm run dev

# 启动前端开发服务器 (port 3090) - 单独运行
npm run dev:frontend

# 完整开发环境（API + 前端都支持热重载）
npm run dev:full
```

### 主页逻辑说明
- **主页** (`/`): 自动显示服务器当前日期的历史内容，通过 `/api/today` 获取
- **特定日期页面** (`/history/{MM-DD}/`): 显示指定日期的历史内容
- **日期索引** (`/dates-index.html`): 所有可用日期页面的索引

**重要提示**：
- 使用 `npm run local` 或 `npm run dev:frontend` 来避免 file:// 协议的SEO URL问题
- 直接打开 index.html 文件会导致 pushState 错误，请使用开发服务器

### Build and Deploy
```bash
# 构建项目（准备静态文件 + 生成SEO页面）
npm run build
# 这会执行：
# 1. npm run build:prepare - 复制静态文件到 public/
# 2. node scripts/generate-static-pages.js - 生成SEO优化页面

# 单独构建步骤
npm run build:prepare  # 只复制静态文件
npm run build:static   # 只生成静态页面

# 检查部署配置
npm run deploy:check

# 部署到Vercel
npm run deploy
# 或
vercel --prod
```

**构建输出结构**：
```
public/
├── index.html          # 主页
├── styles.css          # 样式文件
├── script.js           # 前端逻辑
├── data.js             # 数据和API客户端
└── history/            # SEO优化的静态页面
    ├── 08-20/
    │   ├── index.html      # 中文版
    │   └── index.en.html   # 英文版
    └── 08-21/
        ├── index.html
        └── index.en.html
```

### SEO Testing and Validation
```bash
# Test SEO optimization
npm run seo:test

# Validate SEO implementation
npm run seo:validate
```

### Testing
No formal test suite configured. Manual testing by:
1. Starting both servers
2. Testing API endpoints with curl
3. Verifying frontend functionality in browser

## Key Components

### Main Application Class (`script.js`)
- `OnThisDay` class manages all frontend functionality
- Handles date navigation, language switching, modal controls
- Manages data loading and display
- Implements smooth scrolling and responsive navigation

### API Client (`data.js`)
- `getDataForDate()` - Primary function to fetch historical data
- Built-in caching (5 minutes) to reduce API calls
- Fallback handling for API failures
- Automatic preloading of adjacent dates

### API Server (`api.js`)
- Rate limiting: 10 requests/minute per IP
- Token authentication required for all endpoints
- CORS configured for frontend domains
- Batch endpoint for multiple dates (max 7)

## Environment Configuration

### Required Environment Variables
```bash
# API server (set in Vercel dashboard)
API_TOKEN=onthisday-secure-token-2024
SECRET_KEY=your-secret-key-here
FRONTEND_URL=https://tih-sigma.vercel.app
NODE_ENV=production
```

### Local Development
- API runs on `http://localhost:3001`
- Frontend runs on `http://localhost:3090`
- CORS configured to allow localhost origins
- **Important**: All local development should use port 3090, not 3001 for frontend

## API Endpoints

### Main Endpoints
- `GET /api/health` - Health check (no auth required)
- `GET /api/history/{MM-DD}` - Get data for specific date (auth required)
- `POST /api/history/batch` - Batch request for multiple dates (auth required)

### Authentication
All data endpoints require `Authorization: Bearer onthisday-secure-token-2024` header.

## Data Structure

Historical data organized by date key (MM-DD) with three categories:
- `events[]` - Historical events with year, bilingual descriptions, images
- `birthdays[]` - Famous people born on this date
- `deaths[]` - Famous people who died on this date

Each item supports bilingual content with `zh-CN` and `en-US` keys.

## Deployment

### Vercel Configuration
- `vercel.json` configures Node.js API and static file routing
- Environment variables must be set in Vercel dashboard
- Auto-deployment from git pushes
- Production domain: `https://tih-sigma.vercel.app`

### File Structure
```
TIH/
├── index.html          # Main SPA page
├── styles.css          # All styling and animations
├── script.js           # Frontend application logic
├── data.js             # API client and utilities
├── api.js              # Express.js server
├── historyData.js      # Historical data storage
├── package.json        # Dependencies and scripts
├── vercel.json         # Deployment configuration
└── *.md               # Documentation files
```

## Features

### Core Features
- Responsive design (mobile/desktop)
- Bilingual support (Chinese/English)
- Date navigation with previous/next buttons
- Birthday checker functionality
- Smooth scrolling navigation
- Image lazy loading
- Data caching and preloading
- Anti-scraping protection
- Modern UI with animations and transitions

### SEO Optimizations
- **URL Structure**: Each date has dedicated URL `/history/{MM-DD}/`
- **Server-Side Rendering**: Pre-rendered HTML for better crawling
- **Meta Tags**: Dynamic title, description, keywords for each page
- **Open Graph**: Social sharing optimization
- **Structured Data**: JSON-LD schema markup
- **Sitemap**: Auto-generated XML sitemap
- **Robots.txt**: SEO-friendly crawler instructions
- **Canonical URLs**: Prevent duplicate content issues
- **Language Tags**: Proper hreflang implementation
- **Cache Headers**: Optimized caching strategy

## Development Notes

- No build process required for frontend (vanilla JS/CSS/HTML)
- API server handles CORS and authentication
- Historical data is stored in `historyData.js` - add new dates here
- Translations are centralized in `data.js`
- All UI interactions are handled by the `OnThisDay` class
- Rate limiting and authentication prevent abuse

## Multilingual Static Pages Architecture

### Single-Page Multilingual System
The static pages (`about.html`, `privacy.html`, `terms.html`) use a single-page multilingual approach:

**Language Detection**:
- URL parameters take priority: `?lang=en-US` or `?lang=zh-CN`
- Falls back to browser language detection
- Default language is Chinese (zh-CN)

**Translation System**:
- Embedded JavaScript translation dictionaries in each page
- Uses `data-i18n` attributes for marking translatable content
- Real-time DOM content replacement without page refresh
- Example: `<h1 data-i18n="pageTitle">关于我们</h1>`

**Footer Links Navigation**:
- Main app footer links automatically pass current language as URL parameter
- Links format: `/about?lang=zh-CN` instead of separate files like `/about-zh`

**Key Functions in Each Static Page**:
- `detectAndInitLanguage()` - Detects language from URL params or browser
- `applyTranslations(lang)` - Updates all elements with data-i18n attributes
- `switchLanguage(newLang)` - Handles language switching from modal

### Responsive Design Consistency
All static pages maintain consistent width alignment:
- `content-section` and `hero-section` have identical max-widths and padding
- Responsive breakpoints: 1400px (PC), 1000px (tablet), mobile-first below 768px
- Ensures uniform layout across all screen sizes

## Important Development Guidelines

### Language System Initialization
- Main app (`script.js`): Call `updateLanguageDisplay(this.currentLanguage)` in `init()` method
- Static pages: Call `detectAndInitLanguage()` in `DOMContentLoaded` event listener
- Always ensure language selector shows correct flag and text on page load

### Port Configuration
- API server always runs on port 3001
- Frontend development server runs on port 3090 (configured in dev-server.js)
- Never hardcode localhost URLs - use relative paths in data.js for API calls
- Local token endpoint available at `/api/token` for development

### Static Page Maintenance
- When adding new static pages, include complete multilingual setup
- Ensure `content-section` width matches `hero-section` across all responsive breakpoints
- Add language detection and initialization in JavaScript section
- Include `data-i18n` attributes for all translatable content