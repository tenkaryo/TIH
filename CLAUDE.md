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
# - API服务器 (port 3001)
# - 前端开发服务器 (port 3000) - 支持 /history/{MM-DD}/ 路由

# 或者分别启动：

# 启动API服务器 (port 3001)
npm start
# 开发模式（自动重启）
npm run dev

# 启动前端开发服务器 (port 3000) - 单独运行
npm run dev:frontend

# 完整开发环境（API + 前端都支持热重载）
npm run dev:full
```

**重要提示**：
- 使用 `npm run local` 或 `npm run dev:frontend` 来避免 file:// 协议的SEO URL问题
- 直接打开 index.html 文件会导致 pushState 错误，请使用开发服务器

### Build and Deploy
```bash
# Generate static SEO-optimized pages
npm run build
# or
npm run build:static

# Deploy to Vercel (includes build step)
npm run deploy
# or
vercel --prod
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
- Frontend runs on `http://localhost:3000`
- CORS configured to allow localhost origins

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