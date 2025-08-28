// TimeRemind.Today Website - Professional News Style

class OnThisDay {
    constructor(initialDate = null) {
        // Initialize from URL or passed date
        if (initialDate) {
            // Parse URL date format if it contains month name
            let month, day;
            if (initialDate.includes('-') && isNaN(initialDate.split('-')[0])) {
                // New format: Month-DD
                const parsedDate = parseUrlDate(initialDate);
                if (parsedDate) {
                    month = parsedDate.month;
                    day = parsedDate.day;
                } else {
                    // Fallback to current date
                    const today = new Date();
                    month = today.getMonth() + 1;
                    day = today.getDate();
                }
            } else {
                // Old format: MM-DD (for backward compatibility)
                [month, day] = initialDate.split('-').map(Number);
            }
            this.currentDate = new Date(2024, month - 1, day);
            this.isHomePage = false;
        } else {
            // 主页 - 将由loadTodayFromServer设置正确的日期
            this.currentDate = new Date();
            this.isHomePage = true;
        }
        
        this.currentLanguage = 'en-US'; // 临时默认值，将在init中异步更新
        this.activeSection = 'events';
        this.lastClickTime = 0;
        this.originalSubtitle = '';
        this.init();
    }
    
    async detectLanguage() {
        // Get multi-language config first
        let config = { enabled: false, defaultLanguage: 'en-US' };
        if (typeof getMultiLangConfig === 'function') {
            try {
                config = await getMultiLangConfig();
            } catch (error) {
                console.warn('Failed to get multi-language config:', error);
            }
        }
        
        // If multi-language is disabled, always return default language
        if (!config.enabled) {
            return config.defaultLanguage;
        }
        
        // If multi-language is enabled, check URL parameter first
        const urlParams = new URLSearchParams(window.location.search);
        const langParam = urlParams.get('lang');
        if (langParam && ['zh-CN', 'en-US'].includes(langParam)) {
            return langParam;
        }
        
        // Check browser language
        const browserLang = navigator.language || navigator.userLanguage;
        return browserLang.startsWith('zh') ? 'zh-CN' : 'en-US';
    }

    async init() {
        // 首先异步检测正确的语言
        this.currentLanguage = await this.detectLanguage();
        
        this.setupEventListeners();
        this.initializeSelectors();
        
        // 初始化语言显示
        this.updateLanguageContent();
        
        // 检查并处理多语言开关
        await this.handleMultiLanguageToggle();
        
        // 如果是主页，先获取服务器今天的日期
        if (this.isHomePage) {
            await this.loadTodayFromServer();
        }
        
        // 确保日期显示在数据加载之前就更新
        this.updateDateDisplay();
        this.loadContent();
        this.setupNavigation();
        this.setupScrollListener();
        this.saveOriginalSubtitle();
        this.updatePageTitle();
        this.setupPopstateListener();
    }
    
    // 从服务器获取今天的日期和数据
    async loadTodayFromServer() {
        try {
            // 使用本地当前日期作为基准
            const today = new Date();
            const month = today.getMonth() + 1;
            const day = today.getDate();
            
            // 确保使用当前日期（今天的真实日期）
            this.currentDate = new Date(2024, month - 1, day);
            
            console.log('已设置今天的日期:', `${month}-${day}`);
            
            // 预加载今天的数据以确保API正常工作
            if (typeof getDataForDate === 'function') {
                const testData = await getDataForDate(month, day);
                console.log('今日数据预加载结果:', testData?.events?.length || 0, '个事件');
            }
            
        } catch (error) {
            console.warn('无法获取今天的数据，使用本地日期:', error);
            // 继续使用本地日期作为fallback
        }
    }
    
    // 处理多语言开关
    async handleMultiLanguageToggle() {
        let config = { enabled: false };
        if (typeof getMultiLangConfig === 'function') {
            try {
                config = await getMultiLangConfig();
            } catch (error) {
                console.warn('Failed to get multi-language config:', error);
            }
        }
        
        // 如果多语言功能关闭，隐藏语言切换按钮
        if (!config.enabled) {
            const languageSelector = document.getElementById('languageSelector');
            if (languageSelector) {
                languageSelector.style.display = 'none';
            }
            
            console.log('Multi-language feature is disabled, language selector hidden');
        }
    }
    
    setupPopstateListener() {
        // 监听浏览器的后退/前进按钮
        window.addEventListener('popstate', (event) => {
            if (event.state && event.state.date) {
                const [month, day] = event.state.date.split('-').map(Number);
                this.currentDate.setMonth(month - 1);
                this.currentDate.setDate(day);
                
                if (event.state.lang) {
                    this.currentLanguage = event.state.lang;
                }
                
                // 重新加载内容但不更新URL（避免循环）
                this.loadContent();
                this.updateDateDisplay();
                this.updateLanguageContent();
                this.updateBrandSubtitle();
            }
        });
    }

    setupEventListeners() {
        // Navigation buttons
        const dateSelector = document.getElementById('dateSelector');
        dateSelector.addEventListener('click', () => this.showDateModal());

        const languageSelector = document.getElementById('languageSelector');
        languageSelector.addEventListener('click', () => this.showLanguageModal());

        // Birthday checker
        const checkBirthday = document.getElementById('checkBirthday');
        checkBirthday.addEventListener('click', () => this.checkBirthday());

        // Date navigation - Desktop
        const prevDate = document.getElementById('prevDate');
        const nextDate = document.getElementById('nextDate');
        if (prevDate && nextDate) {
            prevDate.addEventListener('click', () => this.navigateDate(-1));
            nextDate.addEventListener('click', () => this.navigateDate(1));
        }

        // Date navigation - Mobile
        const prevDateMobile = document.getElementById('prevDateMobile');
        const nextDateMobile = document.getElementById('nextDateMobile');
        if (prevDateMobile && nextDateMobile) {
            prevDateMobile.addEventListener('click', () => this.navigateDate(-1));
            nextDateMobile.addEventListener('click', () => this.navigateDate(1));
        }

        // Sidebar navigation
        this.setupSidebarNavigation();

        // Modal controls
        this.setupModalControls();

        // Nav brand click to go home
        const navBrand = document.querySelector('.nav-brand');
        if (navBrand) {
            navBrand.addEventListener('click', (e) => {
                e.preventDefault();
                // Navigate to homepage
                window.location.href = '/';
            });
        }

        // Back to top button setup
        this.setupBackToTopButton();
    }

    setupSidebarNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetSection = link.getAttribute('href').substring(1);
                this.switchSection(targetSection);
                this.scrollToSection(targetSection);
            });
        });
    }

    switchSection(sectionId) {
        // Update active navigation
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
        });
        this.activeSection = sectionId;
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    setupBackToTopButton() {
        // Create back to top button
        const backToTopBtn = document.createElement('button');
        backToTopBtn.id = 'backToTop';
        backToTopBtn.className = 'back-to-top-btn';
        backToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
        backToTopBtn.setAttribute('aria-label', 'Back to top');
        backToTopBtn.style.display = 'none';
        
        // Add click handler
        backToTopBtn.addEventListener('click', () => {
            this.scrollToTop();
        });

        // Add to page
        document.body.appendChild(backToTopBtn);

        // Show/hide based on scroll position
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const viewportHeight = window.innerHeight;
            
            // Show button when scrolled past the first screen
            if (scrollTop > viewportHeight) {
                backToTopBtn.style.display = 'flex';
            } else {
                backToTopBtn.style.display = 'none';
            }
        });
    }

    saveOriginalSubtitle() {
        const brandSubtitle = document.querySelector('.brand-subtitle');
        if (brandSubtitle) {
            const t = translations[this.currentLanguage];
            this.originalSubtitle = t.siteSubtitle;
        }
    }

    setupScrollListener() {
        let ticking = false;
        
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateBrandSubtitle();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    updateBrandSubtitle() {
        const heroSection = document.querySelector('.hero-section');
        const brandSubtitle = document.querySelector('.brand-subtitle');
        
        if (!heroSection || !brandSubtitle) return;

        const heroRect = heroSection.getBoundingClientRect();
        const isHeroVisible = heroRect.bottom > 0;

        if (isHeroVisible) {
            // Hero section is visible, show original subtitle
            brandSubtitle.textContent = this.originalSubtitle;
        } else {
            // Hero section is not visible, show current date
            const currentDateText = this.getCurrentDateText();
            brandSubtitle.textContent = currentDateText;
        }
    }

    getCurrentDateText() {
        const month = this.currentDate.getMonth() + 1;
        const day = this.currentDate.getDate();
        return formatDateDisplay(month, day, this.currentLanguage);
    }

    updatePageTitle() {
        const t = translations[this.currentLanguage];
        document.title = t.pageTitle;
        document.documentElement.lang = this.currentLanguage;
    }

    showLoadingState() {
        const t = translations[this.currentLanguage];
        const loadingHtml = `
            <div class="loading">
                <div class="loading-spinner"></div>
                ${t.loading || 'Loading...'}
            </div>
        `;
        
        document.getElementById('historyEvents').innerHTML = loadingHtml;
        document.getElementById('famousBirthdays').innerHTML = loadingHtml;
        document.getElementById('famousDeaths').innerHTML = loadingHtml;
    }

    showErrorState() {
        const t = translations[this.currentLanguage];
        const errorHtml = `<div class="loading">${t.noData || 'Unable to load data. Please try again later.'}</div>`;
        
        document.getElementById('historyEvents').innerHTML = errorHtml;
        document.getElementById('famousBirthdays').innerHTML = errorHtml;
        document.getElementById('famousDeaths').innerHTML = errorHtml;
    }

    setupModalControls() {
        // Date modal controls
        const dateModal = document.getElementById('dateModal');
        const modalClose = document.getElementById('modalClose');
        const modalCancel = document.getElementById('modalCancel');
        const modalConfirm = document.getElementById('modalConfirm');

        modalClose.addEventListener('click', () => this.hideModal('dateModal'));
        modalCancel.addEventListener('click', () => this.hideModal('dateModal'));
        modalConfirm.addEventListener('click', () => this.confirmDateSelection());

        // Language modal controls
        const languageModal = document.getElementById('languageModal');
        const langModalClose = document.getElementById('langModalClose');
        langModalClose.addEventListener('click', () => this.hideModal('languageModal'));

        // Language options
        const langOptions = document.querySelectorAll('.lang-option');
        langOptions.forEach(option => {
            option.addEventListener('click', () => this.selectLanguage(option.dataset.lang));
        });

        // Close modal on outside click
        dateModal.addEventListener('click', (e) => {
            if (e.target === dateModal) this.hideModal('dateModal');
        });

        languageModal.addEventListener('click', (e) => {
            if (e.target === languageModal) this.hideModal('languageModal');
        });
    }

    setupNavigation() {
        // Smooth scroll for anchor links
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href^="#"]')) {
                e.preventDefault();
                const targetId = e.target.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
            }
        });
    }

    initializeSelectors() {
        this.populateMonthSelector('birthMonth');
        this.populateMonthSelector('modalMonth');
        this.populateDaySelector('birthDay');
        this.populateDaySelector('modalDay');
    }

    populateMonthSelector(selectId) {
        const select = document.getElementById(selectId);
        if (!select) return;
        
        const months = monthNames[this.currentLanguage];
        const t = translations[this.currentLanguage];
        
        select.innerHTML = `<option value="">${t.selectMonth || '选择月份'}</option>`;
        
        months.forEach((month, index) => {
            const option = document.createElement('option');
            option.value = index + 1;
            option.textContent = month;
            select.appendChild(option);
        });
    }

    populateDaySelector(selectId) {
        const select = document.getElementById(selectId);
        if (!select) return;
        
        const t = translations[this.currentLanguage];
        select.innerHTML = `<option value="">${t.selectDay || '选择日期'}</option>`;
        
        for (let day = 1; day <= 31; day++) {
            const option = document.createElement('option');
            option.value = day;
            option.textContent = day;
            select.appendChild(option);
        }
    }

    updateDateDisplay() {
        const currentDateElement = document.getElementById('currentDate');
        
        const dateText = formatDateDisplay(
            this.currentDate.getMonth() + 1,
            this.currentDate.getDate(),
            this.currentLanguage
        );
        currentDateElement.textContent = dateText;

        // Update navigation buttons
        this.updateNavigationButtons();
    }

    updateNavigationButtons() {
        const prevDate = new Date(this.currentDate);
        prevDate.setDate(prevDate.getDate() - 1);
        
        const nextDate = new Date(this.currentDate);
        nextDate.setDate(nextDate.getDate() + 1);

        // Update desktop navigation
        const prevDateText = document.getElementById('prevDateText');
        const nextDateText = document.getElementById('nextDateText');

        if (prevDateText && nextDateText) {
            const prevText = this.currentLanguage === 'zh-CN' 
                ? `${prevDate.getDate()}日`
                : `${prevDate.getDate()}`;

            const nextText = this.currentLanguage === 'zh-CN' 
                ? `${nextDate.getDate()}日`
                : `${nextDate.getDate()}`;

            prevDateText.textContent = prevText;
            nextDateText.textContent = nextText;
        }

        // Update mobile navigation
        const prevDateTextMobile = document.getElementById('prevDateTextMobile');
        const nextDateTextMobile = document.getElementById('nextDateTextMobile');

        if (prevDateTextMobile && nextDateTextMobile) {
            const prevTextMobile = this.currentLanguage === 'zh-CN' 
                ? `${prevDate.getDate()}日`
                : `${prevDate.getDate()}`;

            const nextTextMobile = this.currentLanguage === 'zh-CN' 
                ? `${nextDate.getDate()}日`
                : `${nextDate.getDate()}`;

            prevDateTextMobile.textContent = prevTextMobile;
            nextDateTextMobile.textContent = nextTextMobile;
        }
    }

    async loadContent() {
        const month = this.currentDate.getMonth() + 1;
        const day = this.currentDate.getDate();
        
        // Show loading state
        this.showLoadingState();
        
        try {
            await this.loadHistoryEvents(month, day);
            await this.loadFamousPeople(month, day);
            this.updateLanguageContent();
            
            // Preload adjacent dates
            if (typeof preloadAdjacentDates === 'function') {
                preloadAdjacentDates(month, day);
            }
        } catch (error) {
            console.error('Failed to load content:', error);
            this.showErrorState();
        }
    }

    async loadHistoryEvents(month, day) {
        const container = document.getElementById('historyEvents');
        const t = translations[this.currentLanguage];
        
        try {
            const data = await getDataForDate(month, day);
            
            if (!data.events || data.events.length === 0) {
                container.innerHTML = `<div class="loading">${t.noData || 'No historical events data available'}</div>`;
                return;
            }

            container.innerHTML = data.events.slice(0, 10).map(event => {
                const description = typeof event.description === 'object' 
                    ? event.description[this.currentLanguage] || event.description['zh-CN'] || event.description['en-US']
                    : event.description;
                
                return `
                    <div class="timeline-event">
                        <span class="event-year">${event.year}</span>
                        <div class="event-content">
                            <p class="event-description">${description}</p>
                            ${event.image ? `
                                <div class="event-image">
                                    <img src="${event.image}" alt="${description}" onerror="this.style.display='none'">
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `;
            }).join('');
        } catch (error) {
            console.error('Failed to load historical events:', error);
            container.innerHTML = `<div class="loading">${t.loading || 'Loading error'}</div>`;
        }
    }

    async loadFamousPeople(month, day) {
        const t = translations[this.currentLanguage];
        
        try {
            const data = await getDataForDate(month, day);
            
            // Load famous birthdays
            const birthdaysContainer = document.getElementById('famousBirthdays');
            if (data.birthdays && data.birthdays.length > 0) {
                birthdaysContainer.innerHTML = data.birthdays.slice(0, 6).map(person => {
                    const name = typeof person.name === 'object' 
                        ? person.name[this.currentLanguage] || person.name['zh-CN'] || person.name['en-US']
                        : person.name;
                    const description = typeof person.description === 'object' 
                        ? person.description[this.currentLanguage] || person.description['zh-CN'] || person.description['en-US']
                        : person.description;
                    
                    return `
                        <div class="person-card">
                            <div class="person-image">
                                <img src="${person.image}" alt="${name}" onerror="this.src='/avatar.png'">
                            </div>
                            <div class="person-info">
                                <h4 class="person-name">${name}</h4>
                                <p class="person-years">${person.years}</p>
                                <p class="person-description">${description}</p>
                            </div>
                        </div>
                    `;
                }).join('');
            } else {
                birthdaysContainer.innerHTML = `<div class="loading">${t.noData || 'No birthday data available'}</div>`;
            }

            // Load famous deaths
            const deathsContainer = document.getElementById('famousDeaths');
            if (data.deaths && data.deaths.length > 0) {
                deathsContainer.innerHTML = data.deaths.slice(0, 6).map(person => {
                    const name = typeof person.name === 'object' 
                        ? person.name[this.currentLanguage] || person.name['zh-CN'] || person.name['en-US']
                        : person.name;
                    const description = typeof person.description === 'object' 
                        ? person.description[this.currentLanguage] || person.description['zh-CN'] || person.description['en-US']
                        : person.description;
                    
                    return `
                        <div class="person-card">
                            <div class="person-image">
                                <img src="${person.image}" alt="${name}" onerror="this.src='/avatar.png'">
                            </div>
                            <div class="person-info">
                                <h4 class="person-name">${name}</h4>
                                <p class="person-years">${person.years}</p>
                                <p class="person-description">${description}</p>
                            </div>
                        </div>
                    `;
                }).join('');
            } else {
                deathsContainer.innerHTML = `<div class="loading">${t.noData || 'No death data available'}</div>`;
            }
        } catch (error) {
            console.error('Failed to load famous people:', error);
            document.getElementById('famousBirthdays').innerHTML = `<div class="loading">${t.loading || 'Loading error'}</div>`;
            document.getElementById('famousDeaths').innerHTML = `<div class="loading">${t.loading || 'Loading error'}</div>`;
        }
    }

    showDateModal() {
        this.showModal('dateModal');
        
        // Set current date in modal
        const modalMonth = document.getElementById('modalMonth');
        const modalDay = document.getElementById('modalDay');
        
        modalMonth.value = this.currentDate.getMonth() + 1;
        modalDay.value = this.currentDate.getDate();
    }

    showLanguageModal() {
        this.showModal('languageModal');
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.add('active');
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.remove('active');
    }

    confirmDateSelection() {
        const modalMonth = document.getElementById('modalMonth');
        const modalDay = document.getElementById('modalDay');
        
        const month = parseInt(modalMonth.value);
        const day = parseInt(modalDay.value);
        
        if (month && day) {
            this.currentDate.setMonth(month - 1);
            this.currentDate.setDate(day);
            
            // Update URL for SEO
            this.updateURL();
            
            this.loadContent();
            this.updateDateDisplay();
            this.hideModal('dateModal');
            this.updateBrandSubtitle(); // Update subtitle with new date
            this.scrollToTop();
        }
    }

    selectLanguage(language) {
        this.currentLanguage = language;
        
        // Update active language option
        const langOptions = document.querySelectorAll('.lang-option');
        langOptions.forEach(option => {
            option.classList.toggle('active', option.dataset.lang === language);
        });
        
        // Update flag and text in header
        const flag = document.querySelector('#languageSelector .flag');
        const langText = document.querySelector('#languageSelector span:not(.flag)');
        
        if (flag) {
            flag.textContent = language === 'zh-CN' ? '🇨🇳' : '🇺🇸';
        }
        
        if (langText) {
            const t = translations[language];
            langText.textContent = t.languageSelector;
        }
        
        // Update content
        this.updateLanguageContent();
        this.initializeSelectors();
        this.updateDateDisplay();
        this.loadContent(); // Reload content to display in the new language
        this.saveOriginalSubtitle(); // Update original subtitle for new language
        this.updateBrandSubtitle(); // Update current subtitle display
        this.updatePageTitle(); // Update page title for new language
        this.hideModal('languageModal');
    }

    updateLanguageContent() {
        const t = translations[this.currentLanguage];
        
        // Update brand
        const brandSubtitle = document.querySelector('.brand-subtitle');
        // Note: brand contains logo image, so we don't update brand title textContent
        if (brandSubtitle) brandSubtitle.textContent = t.siteSubtitle;
        
        // Update navigation buttons
        const dateBtn = document.querySelector('#dateSelector span');
        if (dateBtn) dateBtn.textContent = t.dateSelector;
        
        // Update section titles and subtitles
        const historyTitle = document.querySelector('#events .section-title');
        const historySubtitle = document.querySelector('#events .section-subtitle');
        if (historyTitle) historyTitle.textContent = t.todayInHistory;
        if (historySubtitle) historySubtitle.textContent = t.todayInHistoryEn;
        
        const birthdayTitle = document.querySelector('#births .section-title');
        const birthdaySubtitle = document.querySelector('#births .section-subtitle');
        if (birthdayTitle) birthdayTitle.textContent = t.famousBirthdays;
        if (birthdaySubtitle) birthdaySubtitle.textContent = t.famousBirthdaysEn;
        
        const deathTitle = document.querySelector('#deaths .section-title');
        const deathSubtitle = document.querySelector('#deaths .section-subtitle');
        if (deathTitle) deathTitle.textContent = t.famousDeaths;
        if (deathSubtitle) deathSubtitle.textContent = t.famousDeathsEn;
        
        // Update sidebar
        const sidebarTitles = document.querySelectorAll('.sidebar-title');
        if (sidebarTitles[0]) sidebarTitles[0].textContent = t.birthdayChecker;
        if (sidebarTitles[1]) sidebarTitles[1].textContent = t.todayNavigation;
        
        const sidebarDesc = document.querySelector('.sidebar-desc');
        if (sidebarDesc) sidebarDesc.textContent = t.birthdayCheckerDesc;
        
        const birthdayBtn = document.getElementById('checkBirthday');
        if (birthdayBtn) birthdayBtn.textContent = t.birthdayButton;
        
        // Update navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        if (navLinks[0]) navLinks[0].textContent = t.historyEvents;
        if (navLinks[1]) navLinks[1].textContent = t.famousBirthdays;
        if (navLinks[2]) navLinks[2].textContent = t.famousDeaths;
        
        // Update footer
        const footerBrand = document.querySelector('.footer-brand h3');
        const footerDesc = document.querySelector('.footer-brand p');
        if (footerBrand) footerBrand.textContent = t.siteTitle;
        if (footerDesc) footerDesc.textContent = t.footerDesc;
        
        // Update footer links - simplified structure with language-specific URLs
        const aboutLink = document.getElementById('about-link');
        const privacyLink = document.getElementById('privacy-link');
        const termsLink = document.getElementById('terms-link');
        
        if (aboutLink) {
            aboutLink.textContent = t.about;
            aboutLink.href = `/about?lang=${this.currentLanguage}`;
        }
        if (privacyLink) {
            privacyLink.textContent = t.privacy;
            privacyLink.href = `/privacy?lang=${this.currentLanguage}`;
        }
        if (termsLink) {
            termsLink.textContent = t.terms;
            termsLink.href = `/terms?lang=${this.currentLanguage}`;
        }
        
        // Update footer bottom
        const footerBottom = document.querySelectorAll('.footer-bottom p');
        if (footerBottom[0]) footerBottom[0].textContent = t.copyright;
        if (footerBottom[1]) footerBottom[1].textContent = t.dataSource;
        
        // Update modal content
        const modalTitles = document.querySelectorAll('.modal-header h3');
        if (modalTitles[0]) modalTitles[0].textContent = t.selectDate;
        if (modalTitles[1]) modalTitles[1].textContent = t.selectLanguage;
        
        const modalCancel = document.getElementById('modalCancel');
        const modalConfirm = document.getElementById('modalConfirm');
        if (modalCancel) modalCancel.textContent = t.cancel;
        if (modalConfirm) modalConfirm.textContent = t.confirm;
    }

    navigateDate(direction) {
        this.currentDate.setDate(this.currentDate.getDate() + direction);
        
        // Update URL for SEO
        this.updateURL();
        
        this.loadContent();
        this.updateDateDisplay();
        this.updateBrandSubtitle(); // Update subtitle with new date
        this.scrollToTop();
    }
    
    // Update URL to SEO-friendly format
    updateURL() {
        const month = this.currentDate.getMonth() + 1;
        const day = this.currentDate.getDate();
        const monthName = monthNames['en-US'][month - 1]; // Use English month name for URL
        const dateStr = `${monthName}-${day}`;
        
        // Only update URL if we're running on a server (not file://)
        if (window.location.protocol !== 'file:' && window.history && window.history.pushState) {
            try {
                const newUrl = `/history/${dateStr}/`;
                const urlParams = new URLSearchParams();
                
                // Add language parameter if not default
                if (this.currentLanguage !== 'zh-CN') {
                    urlParams.set('lang', this.currentLanguage);
                }
                
                const fullUrl = newUrl + (urlParams.toString() ? '?' + urlParams.toString() : '');
                
                // Update browser history without reload
                if (window.location.pathname !== newUrl || window.location.search !== ('?' + urlParams.toString())) {
                    window.history.pushState({ date: dateStr, lang: this.currentLanguage }, '', fullUrl);
                }
            } catch (error) {
                console.warn('Unable to update URL (running in restricted environment):', error.message);
            }
        }
        
        // Always update page metadata for SEO
        this.updatePageMetadata(dateStr);
    }
    
    // Update page metadata dynamically
    updatePageMetadata(dateStr) {
        const parsedDate = parseUrlDate(dateStr);
        if (!parsedDate) {
            console.error('Failed to parse date string:', dateStr);
            return;
        }
        const { month, day } = parsedDate;
        const dateDisplay = formatDateDisplay(month, day, this.currentLanguage);
        
        const title = this.currentLanguage === 'zh-CN' 
            ? `${dateDisplay} - 历史上的今天 | TimeRemind.Today`
            : `${dateDisplay} - Today in History | TimeRemind.Today`;
        
        const description = this.currentLanguage === 'zh-CN'
            ? `${dateDisplay}历史上发生的重要事件，包含历史事件、名人生日、名人逝世信息。探索历史，发现精彩。`
            : `Important historical events that happened on ${dateDisplay}. Explore history, discover the extraordinary.`;
        
        // Update document title
        document.title = title;
        
        // Update meta description
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute('content', description);
        }
        
        // Update Open Graph meta tags
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) {
            ogTitle.setAttribute('content', title);
        }
        
        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) {
            ogDesc.setAttribute('content', description);
        }
        
        const ogUrl = document.querySelector('meta[property="og:url"]');
        if (ogUrl) {
            const baseUrl = 'https://timeremind.today';
            ogUrl.setAttribute('content', `${baseUrl}/history/${dateStr}/`);
        }
        
        // Update canonical URL
        const canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) {
            const baseUrl = 'https://timeremind.today';
            canonical.setAttribute('href', `${baseUrl}/history/${dateStr}/`);
        }
    }


    checkBirthday() {
        const birthMonth = document.getElementById('birthMonth');
        const birthDay = document.getElementById('birthDay');
        
        const month = parseInt(birthMonth.value);
        const day = parseInt(birthDay.value);
        
        if (month && day) {
            this.currentDate.setMonth(month - 1);
            this.currentDate.setDate(day);
            
            // Update URL for SEO
            this.updateURL();
            
            this.loadContent();
            this.updateDateDisplay();
            
            // Update subtitle with new date and scroll to top
            this.updateBrandSubtitle();
            this.scrollToTop();
        } else {
            alert(this.currentLanguage === 'zh-CN' ? '请选择完整的日期' : 'Please select a complete date');
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new OnThisDay();
});

// Add smooth scrolling for anchor links
document.addEventListener('click', (e) => {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// Add loading animations
function showLoading(containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = `
        <div class="loading">
            <div class="loading-spinner"></div>
            ${translations[window.app?.currentLanguage || 'zh-CN']?.loading || '加载中...'}
        </div>
    `;
}

// Image lazy loading
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Service worker registration for PWA features
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}