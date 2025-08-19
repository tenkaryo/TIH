// OnThisDay Website - Professional News Style

class OnThisDay {
    constructor() {
        this.currentDate = new Date();
        this.currentLanguage = 'zh-CN';
        this.activeSection = 'events';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeSelectors();
        this.loadContent();
        this.updateDateDisplay();
        this.setupNavigation();
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

        // Date navigation
        const prevDate = document.getElementById('prevDate');
        const nextDate = document.getElementById('nextDate');
        prevDate.addEventListener('click', () => this.navigateDate(-1));
        nextDate.addEventListener('click', () => this.navigateDate(1));

        // Sidebar navigation
        this.setupSidebarNavigation();

        // Modal controls
        this.setupModalControls();
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
        const dateSubtitle = document.querySelector('.date-subtitle');
        
        const dateText = formatDateDisplay(
            this.currentDate.getMonth() + 1,
            this.currentDate.getDate(),
            this.currentLanguage
        );
        currentDateElement.textContent = dateText;

        // Update subtitle
        const weekdays = this.currentLanguage === 'zh-CN' 
            ? ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
            : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth() + 1;
        const day = this.currentDate.getDate();
        const weekday = weekdays[this.currentDate.getDay()];
        
        const subtitleText = this.currentLanguage === 'zh-CN'
            ? `今天是${year}年${month}月${day}日，${weekday}`
            : `Today is ${weekday}, ${monthNames[this.currentLanguage][month-1]} ${day}, ${year}`;
        
        if (dateSubtitle) {
            dateSubtitle.textContent = subtitleText;
        }

        // Update navigation buttons
        this.updateNavigationButtons();
    }

    updateNavigationButtons() {
        const prevDate = new Date(this.currentDate);
        prevDate.setDate(prevDate.getDate() - 1);
        
        const nextDate = new Date(this.currentDate);
        nextDate.setDate(nextDate.getDate() + 1);

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
    }

    loadContent() {
        const month = this.currentDate.getMonth() + 1;
        const day = this.currentDate.getDate();
        
        this.loadHistoryEvents(month, day);
        this.loadFamousPeople(month, day);
        this.updateLanguageContent();
    }

    loadHistoryEvents(month, day) {
        const data = getDataForDate(month, day);
        const container = document.getElementById('historyEvents');
        
        if (!data.events || data.events.length === 0) {
            container.innerHTML = '<div class="loading">暂无历史事件数据</div>';
            return;
        }

        container.innerHTML = data.events.slice(0, 10).map(event => `
            <div class="timeline-event">
                <span class="event-year">${event.year}</span>
                <div class="event-content">
                    <p class="event-description">${event.description}</p>
                    ${event.image ? `
                        <div class="event-image">
                            <img src="${event.image}" alt="${event.description}" onerror="this.style.display='none'">
                        </div>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }

    loadFamousPeople(month, day) {
        const data = getDataForDate(month, day);
        
        // Load famous birthdays
        const birthdaysContainer = document.getElementById('famousBirthdays');
        if (data.birthdays && data.birthdays.length > 0) {
            birthdaysContainer.innerHTML = data.birthdays.slice(0, 6).map(person => `
                <div class="person-card">
                    <div class="person-image">
                        <img src="${person.image}" alt="${person.name}" onerror="this.style.display='none'">
                    </div>
                    <div class="person-info">
                        <h4 class="person-name">${person.name}</h4>
                        <p class="person-years">${person.years}</p>
                        <p class="person-description">${person.description}</p>
                    </div>
                </div>
            `).join('');
        } else {
            birthdaysContainer.innerHTML = '<div class="loading">暂无名人生日数据</div>';
        }

        // Load famous deaths
        const deathsContainer = document.getElementById('famousDeaths');
        if (data.deaths && data.deaths.length > 0) {
            deathsContainer.innerHTML = data.deaths.slice(0, 6).map(person => `
                <div class="person-card">
                    <div class="person-image">
                        <img src="${person.image}" alt="${person.name}" onerror="this.style.display='none'">
                    </div>
                    <div class="person-info">
                        <h4 class="person-name">${person.name}</h4>
                        <p class="person-years">${person.years}</p>
                        <p class="person-description">${person.description}</p>
                    </div>
                </div>
            `).join('');
        } else {
            deathsContainer.innerHTML = '<div class="loading">暂无名人逝世数据</div>';
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
            this.loadContent();
            this.updateDateDisplay();
            this.hideModal('dateModal');
        }
    }

    selectLanguage(language) {
        this.currentLanguage = language;
        
        // Update active language option
        const langOptions = document.querySelectorAll('.lang-option');
        langOptions.forEach(option => {
            option.classList.toggle('active', option.dataset.lang === language);
        });
        
        // Update flag in header
        const flag = document.querySelector('.language-selector .flag');
        flag.textContent = language === 'zh-CN' ? '🇨🇳' : '🇺🇸';
        
        // Update content
        this.updateLanguageContent();
        this.initializeSelectors();
        this.updateDateDisplay();
        this.hideModal('languageModal');
    }

    updateLanguageContent() {
        const t = translations[this.currentLanguage];
        
        // Update site title
        document.querySelector('.site-title').textContent = t.siteTitle;
        
        // Update section titles
        const sectionTitles = [
            { selector: '.history-section .section-title', text: t.todayInHistory },
            { selector: '.famous-section:nth-of-type(3) .section-title', text: t.famousBirthdays },
            { selector: '.famous-section:nth-of-type(4) .section-title', text: t.famousDeaths }
        ];
        
        sectionTitles.forEach(item => {
            const element = document.querySelector(item.selector);
            if (element) {
                const icon = element.querySelector('i');
                element.innerHTML = icon.outerHTML + ' ' + item.text;
            }
        });
        
        // Update birthday checker
        document.querySelector('.birthday-title').textContent = t.birthdayChecker;
        document.querySelector('.birthday-subtitle').textContent = t.birthdaySubtitle;
        document.getElementById('checkBirthday').textContent = t.checkButton;
        
        // Update footer
        const footerLinks = document.querySelectorAll('.footer-links a');
        const linkTexts = [t.about, t.contact, t.privacy, t.terms];
        footerLinks.forEach((link, index) => {
            if (linkTexts[index]) link.textContent = linkTexts[index];
        });
        
        const footerInfo = document.querySelector('.footer-info');
        footerInfo.innerHTML = `
            <p>${t.copyright}</p>
            <p>${t.dataSource}</p>
        `;
        
        // Update modal buttons
        document.getElementById('modalCancel').textContent = t.cancel;
        document.getElementById('modalConfirm').textContent = t.confirm;
    }

    navigateDate(direction) {
        this.currentDate.setDate(this.currentDate.getDate() + direction);
        this.loadContent();
        this.updateDateDisplay();
    }


    checkBirthday() {
        const birthMonth = document.getElementById('birthMonth');
        const birthDay = document.getElementById('birthDay');
        
        const month = parseInt(birthMonth.value);
        const day = parseInt(birthDay.value);
        
        if (month && day) {
            this.currentDate.setMonth(month - 1);
            this.currentDate.setDate(day);
            this.loadContent();
            this.updateDateDisplay();
            
            // Smooth scroll to events section
            this.scrollToSection('events');
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
    const imageObserver = new IntersectionObserver((entries, observer) => {
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