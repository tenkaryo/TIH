// Sample data for the history website
// In production, this would be replaced with API calls

const sampleHistoryData = {
    "08-20": {
        events: [
            {
                year: "1969",
                description: {
                    "zh-CN": "美国阿波罗11号宇航员尼尔·阿姆斯特朗和巴兹·奥尔德林首次登月成功",
                    "en-US": "American astronauts Neil Armstrong and Buzz Aldrin successfully land on the moon during the Apollo 11 mission"
                },
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQabuqJXLYG_5zAZlzuzdsAwg09ecJZJLrEpw&s"
            },
            {
                year: "1991",
                description: {
                    "zh-CN": "苏联发生八一九事件，保守派发动政变试图阻止苏联解体",
                    "en-US": "The August Coup occurs in the Soviet Union, as hardliners attempt to prevent the dissolution of the USSR"
                },
                image: "https://upload.wikimedia.org/wikipedia/commons/a/a5/1991_coup_attempt1.jpg"
            },
            {
                year: "1960",
                description: {
                    "zh-CN": "苏联发射载有两只狗的宇宙飞船，为载人航天做准备",
                    "en-US": "The Soviet Union launches a spacecraft carrying two dogs to prepare for human spaceflight"
                },
                image: "https://starwalk.space/gallery/images/belka-and-strelka-space/1920x1080.jpg"
            },
            {
                year: "2005",
                description: {
                    "zh-CN": "YouTube网站正式上线，改变了全球视频分享方式",
                    "en-US": "YouTube officially launches, revolutionizing global video sharing"
                },
                image: "https://q7.itc.cn/images01/20250707/731964ef563d4facb566632e24402e9e.jpeg"
            },
            {
                year: "1839",
                description: {
                    "zh-CN": "法国政府宣布达盖尔摄影法为公共财产，摄影技术开始普及",
                    "en-US": "The French government announces the daguerreotype photography process as public property, popularizing photography"
                },
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQVTRyb-ZUkGkisBbvrW5X77CvMT2rZ9cswQ&s"
            }
        ],
        birthdays: [
            {
                name: {
                    "zh-CN": "比尔·克林顿",
                    "en-US": "Bill Clinton"
                },
                years: "1946-",
                description: {
                    "zh-CN": "美国第42任总统",
                    "en-US": "42nd President of the United States"
                },
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Bill_Clinton.jpg/250px-Bill_Clinton.jpg"
            },
            {
                name: {
                    "zh-CN": "马修·佩里",
                    "en-US": "Matthew Perry"
                },
                years: "1969-2023",
                description: {
                    "zh-CN": "美国演员，以《老友记》中钱德勒一角闻名",
                    "en-US": "American actor, famous for playing Chandler in 'Friends'"
                },
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Matthew_Perry_in_support_of_Awareness_on_Drug_Courts_and_Reduced_Substance_Abuse.jpg/250px-Matthew_Perry_in_support_of_Awareness_on_Drug_Courts_and_Reduced_Substance_Abuse.jpg"
            },
            {
                name: {
                    "zh-CN": "奥维尔·莱特",
                    "en-US": "Orville Wright"
                },
                years: "1871-1948",
                description: {
                    "zh-CN": "美国航空先驱，与其兄弟发明了世界上第一架飞机",
                    "en-US": "American aviation pioneer who invented the first airplane with his brother"
                },
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Orville_Wright_1905-crop.jpg/1200px-Orville_Wright_1905-crop.jpg"
            },
            {
                name: {
                    "zh-CN": "可可·香奈儿",
                    "en-US": "Coco Chanel"
                },
                years: "1883-1971",
                description: {
                    "zh-CN": "法国时装设计师，香奈儿品牌创始人",
                    "en-US": "French fashion designer and founder of the Chanel brand"
                },
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzQcXwFBALkrZxvcPCTGV3itsFAZ7EVImmjw&s"
            },
            {
                name: {
                    "zh-CN": "约翰·德赖登",
                    "en-US": "John Dryden"
                },
                years: "1631-1700",
                description: {
                    "zh-CN": "英国诗人、文学批评家和戏剧家",
                    "en-US": "English poet, literary critic, and playwright"
                },
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYf0nkeXRwAQuDf4FXyIi2zDCNOLJ8UEg8rg&s"
            },
            {
                name: {
                    "zh-CN": "弗雷德里克·威廉·德·克拉克",
                    "en-US": "Frederick William de Klerk"
                },
                years: "1936-2021",
                description: {
                    "zh-CN": "南非前总统，诺贝尔和平奖获得者",
                    "en-US": "Former President of South Africa, Nobel Peace Prize winner"
                },
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Frederik_Willem_de_Klerk%2C_1990.jpg/250px-Frederik_Willem_de_Klerk%2C_1990.jpg"
            }
        ],
        deaths: [
            {
                name: {
                    "zh-CN": "奥古斯都",
                    "en-US": "Augustus"
                },
                years: "63 BC-14 AD",
                description: {
                    "zh-CN": "罗马帝国第一位皇帝",
                    "en-US": "First Emperor of the Roman Empire"
                },
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Statue-Augustus.jpg/960px-Statue-Augustus.jpg"
            },
            {
                name: {
                    "zh-CN": "布莱兹·帕斯卡",
                    "en-US": "Blaise Pascal"
                },
                years: "1623-1662",
                description: {
                    "zh-CN": "法国数学家、物理学家和哲学家",
                    "en-US": "French mathematician, physicist, and philosopher"
                },
                image: "https://upload.wikimedia.org/wikipedia/commons/9/98/Blaise_Pascal_Versailles.JPG"
            },
            {
                name: {
                    "zh-CN": "奥古斯特·罗丹",
                    "en-US": "Auguste Rodin"
                },
                years: "1840-1917",
                description: {
                    "zh-CN": "法国雕塑家，《思想者》作者",
                    "en-US": "French sculptor, creator of 'The Thinker'"
                },
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6m1-xlIPRA-wzQPQXtDWy3GaGsnelmpNGiA&s"
            },
            {
                name: {
                    "zh-CN": "格拉迪·斯通",
                    "en-US": "Grady Stanton"
                },
                years: "1890-1977",
                description: {
                    "zh-CN": "美国发明家和企业家",
                    "en-US": "American inventor and entrepreneur"
                },
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAK4RszVSq1ONtqRolzIdb0Ea8dSNGoyZxQw&s"
            },
            {
                name: {
                    "zh-CN": "莱纳斯·鲍林",
                    "en-US": "Linus Pauling"
                },
                years: "1901-1994",
                description: {
                    "zh-CN": "美国化学家，两次诺贝尔奖获得者",
                    "en-US": "American chemist, two-time Nobel Prize winner"
                },
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlpFqJ6RMa9KuwqAnvjRHlaEDwHHijQwELew&s"
            },
            {
                name: {
                    "zh-CN": "弗雷德里克·桑格",
                    "en-US": "Frederick Sanger"
                },
                years: "1918-2013",
                description: {
                    "zh-CN": "英国生物化学家，两次诺贝尔化学奖获得者",
                    "en-US": "British biochemist, two-time Nobel Prize winner in Chemistry"
                },
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAow2fCLmmETJEgNlScuRtJN1rPnaIW5rQLw&s"
            }
        ]
    },
    "08-21": {
        events: [
            {
                year: "1969",
                description: {
                    "zh-CN": "美国阿波罗11号宇航员尼尔·阿姆斯特朗和巴兹·奥尔德林首次登月成功",
                    "en-US": "American astronauts Neil Armstrong and Buzz Aldrin successfully land on the moon during the Apollo 11 mission"
                },
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQabuqJXLYG_5zAZlzuzdsAwg09ecJZJLrEpw&s"
            },
            {
                year: "1991",
                description: {
                    "zh-CN": "苏联发生八一九事件，保守派发动政变试图阻止苏联解体",
                    "en-US": "The August Coup occurs in the Soviet Union, as hardliners attempt to prevent the dissolution of the USSR"
                },
                image: "https://upload.wikimedia.org/wikipedia/commons/a/a5/1991_coup_attempt1.jpg"
            },
            {
                year: "1960",
                description: {
                    "zh-CN": "苏联发射载有两只狗的宇宙飞船，为载人航天做准备",
                    "en-US": "The Soviet Union launches a spacecraft carrying two dogs to prepare for human spaceflight"
                },
                image: "https://starwalk.space/gallery/images/belka-and-strelka-space/1920x1080.jpg"
            },
            {
                year: "2005",
                description: {
                    "zh-CN": "YouTube网站正式上线，改变了全球视频分享方式",
                    "en-US": "YouTube officially launches, revolutionizing global video sharing"
                },
                image: "https://q7.itc.cn/images01/20250707/731964ef563d4facb566632e24402e9e.jpeg"
            },
            {
                year: "1839",
                description: {
                    "zh-CN": "法国政府宣布达盖尔摄影法为公共财产，摄影技术开始普及",
                    "en-US": "The French government announces the daguerreotype photography process as public property, popularizing photography"
                },
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQVTRyb-ZUkGkisBbvrW5X77CvMT2rZ9cswQ&s"
            }
        ],
        birthdays: [
            {
                name: {
                    "zh-CN": "比尔·克林顿",
                    "en-US": "Bill Clinton"
                },
                years: "1946-",
                description: {
                    "zh-CN": "美国第42任总统",
                    "en-US": "42nd President of the United States"
                },
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Bill_Clinton.jpg/250px-Bill_Clinton.jpg"
            },
            {
                name: {
                    "zh-CN": "马修·佩里",
                    "en-US": "Matthew Perry"
                },
                years: "1969-2023",
                description: {
                    "zh-CN": "美国演员，以《老友记》中钱德勒一角闻名",
                    "en-US": "American actor, famous for playing Chandler in 'Friends'"
                },
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Matthew_Perry_in_support_of_Awareness_on_Drug_Courts_and_Reduced_Substance_Abuse.jpg/250px-Matthew_Perry_in_support_of_Awareness_on_Drug_Courts_and_Reduced_Substance_Abuse.jpg"
            },
            {
                name: {
                    "zh-CN": "奥维尔·莱特",
                    "en-US": "Orville Wright"
                },
                years: "1871-1948",
                description: {
                    "zh-CN": "美国航空先驱，与其兄弟发明了世界上第一架飞机",
                    "en-US": "American aviation pioneer who invented the first airplane with his brother"
                },
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Orville_Wright_1905-crop.jpg/1200px-Orville_Wright_1905-crop.jpg"
            },
            {
                name: {
                    "zh-CN": "可可·香奈儿",
                    "en-US": "Coco Chanel"
                },
                years: "1883-1971",
                description: {
                    "zh-CN": "法国时装设计师，香奈儿品牌创始人",
                    "en-US": "French fashion designer and founder of the Chanel brand"
                },
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzQcXwFBALkrZxvcPCTGV3itsFAZ7EVImmjw&s"
            },
            {
                name: {
                    "zh-CN": "约翰·德赖登",
                    "en-US": "John Dryden"
                },
                years: "1631-1700",
                description: {
                    "zh-CN": "英国诗人、文学批评家和戏剧家",
                    "en-US": "English poet, literary critic, and playwright"
                },
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYf0nkeXRwAQuDf4FXyIi2zDCNOLJ8UEg8rg&s"
            },
            {
                name: {
                    "zh-CN": "弗雷德里克·威廉·德·克拉克",
                    "en-US": "Frederick William de Klerk"
                },
                years: "1936-2021",
                description: {
                    "zh-CN": "南非前总统，诺贝尔和平奖获得者",
                    "en-US": "Former President of South Africa, Nobel Peace Prize winner"
                },
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Frederik_Willem_de_Klerk%2C_1990.jpg/250px-Frederik_Willem_de_Klerk%2C_1990.jpg"
            }
        ],
        deaths: [
            {
                name: {
                    "zh-CN": "奥古斯都",
                    "en-US": "Augustus"
                },
                years: "63 BC-14 AD",
                description: {
                    "zh-CN": "罗马帝国第一位皇帝",
                    "en-US": "First Emperor of the Roman Empire"
                },
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Statue-Augustus.jpg/960px-Statue-Augustus.jpg"
            },
            {
                name: {
                    "zh-CN": "布莱兹·帕斯卡",
                    "en-US": "Blaise Pascal"
                },
                years: "1623-1662",
                description: {
                    "zh-CN": "法国数学家、物理学家和哲学家",
                    "en-US": "French mathematician, physicist, and philosopher"
                },
                image: "https://upload.wikimedia.org/wikipedia/commons/9/98/Blaise_Pascal_Versailles.JPG"
            },
            {
                name: {
                    "zh-CN": "奥古斯特·罗丹",
                    "en-US": "Auguste Rodin"
                },
                years: "1840-1917",
                description: {
                    "zh-CN": "法国雕塑家，《思想者》作者",
                    "en-US": "French sculptor, creator of 'The Thinker'"
                },
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6m1-xlIPRA-wzQPQXtDWy3GaGsnelmpNGiA&s"
            },
            {
                name: {
                    "zh-CN": "格拉迪·斯通",
                    "en-US": "Grady Stanton"
                },
                years: "1890-1977",
                description: {
                    "zh-CN": "美国发明家和企业家",
                    "en-US": "American inventor and entrepreneur"
                },
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAK4RszVSq1ONtqRolzIdb0Ea8dSNGoyZxQw&s"
            },
            {
                name: {
                    "zh-CN": "莱纳斯·鲍林",
                    "en-US": "Linus Pauling"
                },
                years: "1901-1994",
                description: {
                    "zh-CN": "美国化学家，两次诺贝尔奖获得者",
                    "en-US": "American chemist, two-time Nobel Prize winner"
                },
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlpFqJ6RMa9KuwqAnvjRHlaEDwHHijQwELew&s"
            },
            {
                name: {
                    "zh-CN": "弗雷德里克·桑格",
                    "en-US": "Frederick Sanger"
                },
                years: "1918-2013",
                description: {
                    "zh-CN": "英国生物化学家，两次诺贝尔化学奖获得者",
                    "en-US": "British biochemist, two-time Nobel Prize winner in Chemistry"
                },
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAow2fCLmmETJEgNlScuRtJN1rPnaIW5rQLw&s"
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
        siteTitle: 'OnThisDay',
        siteSubtitle: '历史上的今天',
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
                description: {
                    "zh-CN": `${month}月${day}日的历史事件示例`,
                    "en-US": `Sample historical event for ${month}/${day}`
                },
                image: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=200&h=150&fit=crop"
            }
        ],
        birthdays: [
            {
                name: {
                    "zh-CN": "示例名人",
                    "en-US": "Example Celebrity"
                },
                years: "1950-",
                description: {
                    "zh-CN": "示例描述",
                    "en-US": "Sample description"
                },
                image: "https://images.unsplash.com/photo-1559268950-2d7ceb2efa3a?w=100&h=100&fit=crop&crop=face"
            }
        ],
        deaths: [
            {
                name: {
                    "zh-CN": "示例历史人物",
                    "en-US": "Example Historical Figure"
                },
                years: "1900-1980",
                description: {
                    "zh-CN": "示例描述",
                    "en-US": "Sample description"
                },
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
            }
        ]
    };
}