// Data utilities and API integration for OnThisDay website

// API Configuration
const API_CONFIG = {
    baseUrl: (typeof window !== 'undefined' && window.location.hostname === 'tih-sigma.vercel.app') 
        ? 'https://tih-sigma.vercel.app/api' 
        : 'http://localhost:3001/api',
    token: 'onthisday-secure-token-2024',
    timeout: 10000 // 10 seconds timeout for production
};

// Cache for storing API responses to reduce requests
const dataCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Month and day names for localization
const monthNames = {
    'zh-CN': [
        '一月', '二月', '三月', '四月', '五月', '六月',
        '七月', '八月', '九月', '十月', '十一月', '十二月'
    ],
    'en-US': [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ]
};

const monthNamesShort = {
    'zh-CN': [
        '1月', '2月', '3月', '4月', '5月', '6月',
        '7月', '8月', '9月', '10月', '11月', '12月'
    ],
    'en-US': [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ]
};

// Language translations
const translations = {
    'zh-CN': {
        siteTitle: 'OnThisDay',
        siteSubtitle: '历史上的今天',
        pageTitle: 'OnThisDay - 历史上的今天',
        todayInHistory: '历史上的今天',
        todayInHistoryEn: 'Today in History',
        famousBirthdays: '名人生日',
        famousBirthdaysEn: 'Famous Birthdays',
        famousDeaths: '名人逝世',
        famousDeathsEn: 'Famous Deaths',
        birthdayChecker: '生日查询',
        birthdayCheckerDesc: '查看你的生日当天发生了什么',
        birthdayButton: '查看生日',
        todayNavigation: '今日导航',
        historyEvents: '历史事件',
        selectMonth: '月份',
        selectDay: '日期',
        selectDate: '选择日期',
        selectLanguage: '选择语言',
        dateSelector: '选择日期',
        languageSelector: '中文',
        about: '关于我们',
        contact: '联系方式',
        dataSourceNav: '数据源',
        privacy: '隐私政策',
        terms: '使用条款',
        cookies: 'Cookie政策',
        followUs: '关注我们',
        websiteInfo: '网站信息',
        legalTerms: '法律条款',
        copyright: '© 2024 OnThisDay. 保留所有权利',
        dataSource: '数据来源：维基百科、历史数据库',
        footerDesc: '探索历史，发现精彩',
        cancel: '取消',
        confirm: '确认',
        loading: '加载中...',
        noData: '暂无数据'
    },
    'en-US': {
        siteTitle: 'OnThisDay',
        siteSubtitle: 'Today in History',
        pageTitle: 'OnThisDay - Today in History',
        todayInHistory: 'Today in History',
        todayInHistoryEn: 'Historical Events',
        famousBirthdays: 'Famous Birthdays',
        famousBirthdaysEn: 'Born on This Day',
        famousDeaths: 'Famous Deaths',
        famousDeathsEn: 'Died on This Day',
        birthdayChecker: 'Birthday Query',
        birthdayCheckerDesc: 'What happened on your birthday?',
        birthdayButton: 'Check Birthday',
        todayNavigation: 'Navigation',
        historyEvents: 'Historical Events',
        selectMonth: 'Month',
        selectDay: 'Day',
        selectDate: 'Select Date',
        selectLanguage: 'Select Language',
        dateSelector: 'Select Date',
        languageSelector: 'English',
        about: 'About',
        contact: 'Contact',
        dataSourceNav: 'Data Source',
        privacy: 'Privacy Policy',
        terms: 'Terms of Service',
        cookies: 'Cookie Policy',
        followUs: 'Follow Us',
        websiteInfo: 'Website Info',
        legalTerms: 'Legal Terms',
        copyright: '© 2024 OnThisDay. All rights reserved',
        dataSource: 'Data Source: Wikipedia, Historical Database',
        footerDesc: 'Explore history, discover the extraordinary',
        cancel: 'Cancel',
        confirm: 'Confirm',
        loading: 'Loading...',
        noData: 'No data available'
    }
};

// Utility functions for data handling
function formatDateKey(month, day) {
    return `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
}

// API request with authentication and error handling
async function makeApiRequest(endpoint) {
    const url = `${API_CONFIG.baseUrl}${endpoint}`;
    
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${API_CONFIG.token}`,
                'Content-Type': 'application/json',
                'User-Agent': 'OnThisDay-Frontend/1.0'
            },
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.error || 'API returned unsuccessful response');
        }
        
        return data.data;
        
    } catch (error) {
        console.error('API Request Error:', error);
        
        // Return fallback data structure
        return {
            events: [],
            birthdays: [],
            deaths: []
        };
    }
}

// Get cached data or fetch from API
async function getDataForDate(month, day) {
    const key = formatDateKey(month, day);
    
    // Check cache first
    const cachedData = dataCache.get(key);
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
        return cachedData.data;
    }
    
    // Fetch from API
    try {
        const data = await makeApiRequest(`/history/${key}`);
        
        // Cache the result
        dataCache.set(key, {
            data: data,
            timestamp: Date.now()
        });
        
        return data;
        
    } catch (error) {
        console.error('Failed to fetch data for date:', key, error);
        
        // Return cached data if available, even if expired
        if (cachedData) {
            return cachedData.data;
        }
        
        // Fallback: return empty structure
        return {
            events: [],
            birthdays: [],
            deaths: []
        };
    }
}

// Preload data for adjacent dates to improve user experience
function preloadAdjacentDates(month, day) {
    const currentDate = new Date(2024, month - 1, day); // Year doesn't matter for this calculation
    
    // Previous day
    const prevDate = new Date(currentDate);
    prevDate.setDate(prevDate.getDate() - 1);
    
    // Next day
    const nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + 1);
    
    // Preload asynchronously
    setTimeout(() => {
        getDataForDate(prevDate.getMonth() + 1, prevDate.getDate());
        getDataForDate(nextDate.getMonth() + 1, nextDate.getDate());
    }, 1000); // Wait 1 second before preloading
}

function formatDateDisplay(month, day, language = 'zh-CN') {
    const monthName = monthNames[language][month - 1];
    return language === 'zh-CN' ? `${month}月${day}日` : `${monthName.toUpperCase()} ${day}`;
}

// Generate sample data for other dates (placeholder function)
function generateSampleData(month, day) {
    const dateStr = `${month}月${day}日`;
    const dateStrEn = `${monthNames['en-US'][month - 1]} ${day}`;
    
    return {
        events: [
            {
                year: "1969",
                description: {
                    "zh-CN": `${dateStr}：阿波罗11号宇航员阿姆斯特朗成为第一个踏上月球表面的人类`,
                    "en-US": `${dateStrEn}: Apollo 11 astronaut Neil Armstrong becomes the first human to step on the lunar surface`
                },
                image: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=200&h=150&fit=crop"
            },
            {
                year: "1989",
                description: {
                    "zh-CN": `${dateStr}：柏林墙倒塌，标志着德国分裂时代的结束`,
                    "en-US": `${dateStrEn}: The Berlin Wall falls, marking the end of Germany's division era`
                },
                image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=200&h=150&fit=crop"
            },
            {
                year: "2001",
                description: {
                    "zh-CN": `${dateStr}：维基百科正式上线，成为世界上最大的在线百科全书`,
                    "en-US": `${dateStrEn}: Wikipedia officially launches, becoming the world's largest online encyclopedia`
                },
                image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=150&fit=crop"
            }
        ],
        birthdays: [
            {
                name: {
                    "zh-CN": "阿尔伯特·爱因斯坦",
                    "en-US": "Albert Einstein"
                },
                years: "1879-1955",
                description: {
                    "zh-CN": "德国裔理论物理学家，相对论创立者，1921年诺贝尔物理学奖获得者",
                    "en-US": "German-born theoretical physicist, creator of relativity theory, Nobel Prize winner in Physics 1921"
                },
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
            },
            {
                name: {
                    "zh-CN": "莱昂纳多·达·芬奇",
                    "en-US": "Leonardo da Vinci"
                },
                years: "1452-1519",
                description: {
                    "zh-CN": "意大利文艺复兴时期的博学者，画家、发明家、科学家",
                    "en-US": "Italian Renaissance polymath, painter, inventor, and scientist"
                },
                image: "https://images.unsplash.com/photo-1559268950-2d7ceb2efa3a?w=100&h=100&fit=crop&crop=face"
            },
            {
                name: {
                    "zh-CN": "玛丽·居里",
                    "en-US": "Marie Curie"
                },
                years: "1867-1934",
                description: {
                    "zh-CN": "波兰裔法国物理学家和化学家，两次获得诺贝尔奖",
                    "en-US": "Polish-born French physicist and chemist, two-time Nobel Prize winner"
                },
                image: "https://images.unsplash.com/photo-1494790108755-2616c9a4b1f4?w=100&h=100&fit=crop&crop=face"
            }
        ],
        deaths: [
            {
                name: {
                    "zh-CN": "威廉·莎士比亚",
                    "en-US": "William Shakespeare"
                },
                years: "1564-1616",
                description: {
                    "zh-CN": "英国文艺复兴时期剧作家、诗人，被誉为英国文学史上最杰出的戏剧家",
                    "en-US": "English Renaissance playwright and poet, widely regarded as the greatest writer in English literature"
                },
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
            },
            {
                name: {
                    "zh-CN": "查尔斯·达尔文",
                    "en-US": "Charles Darwin"
                },
                years: "1809-1882",
                description: {
                    "zh-CN": "英国自然学家，进化论的奠基人，《物种起源》作者",
                    "en-US": "British naturalist, founder of evolutionary theory, author of 'On the Origin of Species'"
                },
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
            },
            {
                name: {
                    "zh-CN": "史蒂夫·乔布斯",
                    "en-US": "Steve Jobs"
                },
                years: "1955-2011",
                description: {
                    "zh-CN": "苹果公司联合创始人，现代个人计算机革命的先驱者",
                    "en-US": "Co-founder of Apple Inc., pioneer of the modern personal computer revolution"
                },
                image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face"
            }
        ]
    };
}