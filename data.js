// Sample data for the history website
// In production, this would be replaced with API calls

const sampleHistoryData = {
    "08-19": {
        events: [
            {
                year: "1969",
                description: "美国阿波罗11号宇航员尼尔·阿姆斯特朗和巴兹·奥尔德林首次登月成功",
                image: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=200&h=150&fit=crop"
            },
            {
                year: "1991",
                description: "苏联发生八一九事件，保守派发动政变试图阻止苏联解体",
                image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=150&fit=crop"
            },
            {
                year: "1960",
                description: "苏联发射载有两只狗的宇宙飞船，为载人航天做准备",
                image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=200&h=150&fit=crop"
            },
            {
                year: "2005",
                description: "YouTube网站正式上线，改变了全球视频分享方式",
                image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&h=150&fit=crop"
            },
            {
                year: "1839",
                description: "法国政府宣布达盖尔摄影法为公共财产，摄影技术开始普及",
                image: "https://images.unsplash.com/photo-1495121605193-b116b5b9c5fe?w=200&h=150&fit=crop"
            }
        ],
        birthdays: [
            {
                name: "比尔·克林顿",
                nameEn: "Bill Clinton",
                years: "1946-",
                description: "美国第42任总统",
                image: "https://images.unsplash.com/photo-1559268950-2d7ceb2efa3a?w=100&h=100&fit=crop&crop=face"
            },
            {
                name: "马修·佩里",
                nameEn: "Matthew Perry",
                years: "1969-2023",
                description: "美国演员，以《老友记》中钱德勒一角闻名",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
            },
            {
                name: "奥维尔·莱特",
                nameEn: "Orville Wright",
                years: "1871-1948",
                description: "美国航空先驱，与其兄弟发明了世界上第一架飞机",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
            },
            {
                name: "可可·香奈儿",
                nameEn: "Coco Chanel",
                years: "1883-1971",
                description: "法国时装设计师，香奈儿品牌创始人",
                image: "https://images.unsplash.com/photo-1494790108755-2616c768ca22?w=100&h=100&fit=crop&crop=face"
            },
            {
                name: "约翰·德赖登",
                nameEn: "John Dryden",
                years: "1631-1700",
                description: "英国诗人、文学批评家和戏剧家",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
            },
            {
                name: "弗雷德里克·威廉·德·克拉克",
                nameEn: "Frederick William de Klerk",
                years: "1936-2021",
                description: "南非前总统，诺贝尔和平奖获得者",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
            }
        ],
        deaths: [
            {
                name: "奥古斯都",
                nameEn: "Augustus",
                years: "63 BC-14 AD",
                description: "罗马帝国第一位皇帝",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
            },
            {
                name: "布莱兹·帕斯卡",
                nameEn: "Blaise Pascal",
                years: "1623-1662",
                description: "法国数学家、物理学家和哲学家",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
            },
            {
                name: "奥古斯特·罗丹",
                nameEn: "Auguste Rodin",
                years: "1840-1917",
                description: "法国雕塑家，《思想者》作者",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
            },
            {
                name: "格拉迪·斯通",
                nameEn: "Grady Stanton",
                years: "1890-1977",
                description: "美国发明家和企业家",
                image: "https://images.unsplash.com/photo-1494790108755-2616c768ca22?w=100&h=100&fit=crop&crop=face"
            },
            {
                name: "莱纳斯·鲍林",
                nameEn: "Linus Pauling",
                years: "1901-1994",
                description: "美国化学家，两次诺贝尔奖获得者",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
            },
            {
                name: "弗雷德里克·桑格",
                nameEn: "Frederick Sanger",
                years: "1918-2013",
                description: "英国生物化学家，两次诺贝尔化学奖获得者",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
            }
        ]
    }
};

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
        siteTitle: '历史上的今天',
        todayInHistory: '历史上的今天 Today in History',
        famousBirthdays: 'Famous Birthdays',
        famousDeaths: 'Famous Deaths',
        birthdayChecker: '查看你的生日当天发生了啥？',
        birthdaySubtitle: 'What happened on your birthday?',
        checkButton: '查看',
        selectMonth: '选择月份',
        selectDay: '选择日期',
        selectDate: '选择日期',
        selectLanguage: '选择语言',
        about: '关于',
        contact: '联系我们',
        privacy: '隐私协议',
        terms: '使用条款',
        copyright: '© 2024 历史上的今天. All rights reserved.',
        dataSource: '数据来源：维基百科、历史数据库',
        cancel: '取消',
        confirm: '确认',
        loading: '加载中...'
    },
    'en-US': {
        siteTitle: 'Today in History',
        todayInHistory: 'Today in History',
        famousBirthdays: 'Famous Birthdays',
        famousDeaths: 'Famous Deaths',
        birthdayChecker: 'What happened on your birthday?',
        birthdaySubtitle: '查看你的生日当天发生了啥？',
        checkButton: 'Check',
        selectMonth: 'Select Month',
        selectDay: 'Select Day',
        selectDate: 'Select Date',
        selectLanguage: 'Select Language',
        about: 'About',
        contact: 'Contact',
        privacy: 'Privacy',
        terms: 'Terms',
        copyright: '© 2024 Today in History. All rights reserved.',
        dataSource: 'Data Source: Wikipedia, Historical Database',
        cancel: 'Cancel',
        confirm: 'Confirm',
        loading: 'Loading...'
    }
};

// Utility functions for data handling
function formatDateKey(month, day) {
    return `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
}

function getDataForDate(month, day) {
    const key = formatDateKey(month, day);
    return sampleHistoryData[key] || {
        events: [],
        birthdays: [],
        deaths: []
    };
}

function formatDateDisplay(month, day, language = 'zh-CN') {
    const monthName = monthNames[language][month - 1];
    return language === 'zh-CN' ? `${month}月${day}日` : `${monthName.toUpperCase()} ${day}`;
}

// Generate sample data for other dates (placeholder function)
function generateSampleData(month, day) {
    return {
        events: [
            {
                year: "1969",
                description: `${month}月${day}日的历史事件示例`,
                image: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=200&h=150&fit=crop"
            }
        ],
        birthdays: [
            {
                name: "示例名人",
                nameEn: "Example Celebrity",
                years: "1950-",
                description: "示例描述",
                image: "https://images.unsplash.com/photo-1559268950-2d7ceb2efa3a?w=100&h=100&fit=crop&crop=face"
            }
        ],
        deaths: [
            {
                name: "示例历史人物",
                nameEn: "Example Historical Figure",
                years: "1900-1980",
                description: "示例描述",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
            }
        ]
    };
}