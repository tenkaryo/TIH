// OnThisDay Website - Professional News Style

class OnThisDay {
    constructor() {
        this.currentDate = new Date();
        this.currentLanguage = 'en-US';
        this.activeSection = 'events';
        this.lastClickTime = 0;
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

        // Nav brand double-click to scroll to top
        const navBrand = document.querySelector('.nav-brand');
        if (navBrand) {
            // Use custom double-click detection to avoid zoom issues
            navBrand.addEventListener('click', (e) => {
                e.preventDefault();
                const currentTime = new Date().getTime();
                const timeDiff = currentTime - this.lastClickTime;
                
                if (timeDiff < 500 && timeDiff > 0) {
                    // This is a double click
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    this.scrollToTop();
                }
                
                this.lastClickTime = currentTime;
            });
            
            // Also handle the native dblclick event with prevention
            navBrand.addEventListener('dblclick', (e) => {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
            });
        }
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
        const t = translations[this.currentLanguage];
        
        if (!data.events || data.events.length === 0) {
            container.innerHTML = `<div class="loading">${t.noData || '暂无历史事件数据'}</div>`;
            return;
        }

        container.innerHTML = data.events.slice(0, 10).map(event => {
            const description = typeof event.description === 'object' 
                ? event.description[this.currentLanguage] || event.description['zh-CN']
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
    }

    loadFamousPeople(month, day) {
        const data = getDataForDate(month, day);
        const t = translations[this.currentLanguage];
        
        // Load famous birthdays
        const birthdaysContainer = document.getElementById('famousBirthdays');
        if (data.birthdays && data.birthdays.length > 0) {
            birthdaysContainer.innerHTML = data.birthdays.slice(0, 6).map(person => {
                const name = typeof person.name === 'object' 
                    ? person.name[this.currentLanguage] || person.name['zh-CN']
                    : person.name;
                const description = typeof person.description === 'object' 
                    ? person.description[this.currentLanguage] || person.description['zh-CN']
                    : person.description;
                
                return `
                    <div class="person-card">
                        <div class="person-image">
                            <img src="${person.image}" alt="${name}" onerror="this.style.display='none'">
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
            birthdaysContainer.innerHTML = `<div class="loading">${t.noData || '暂无名人生日数据'}</div>`;
        }

        // Load famous deaths
        const deathsContainer = document.getElementById('famousDeaths');
        if (data.deaths && data.deaths.length > 0) {
            deathsContainer.innerHTML = data.deaths.slice(0, 6).map(person => {
                const name = typeof person.name === 'object' 
                    ? person.name[this.currentLanguage] || person.name['zh-CN']
                    : person.name;
                const description = typeof person.description === 'object' 
                    ? person.description[this.currentLanguage] || person.description['zh-CN']
                    : person.description;
                
                return `
                    <div class="person-card">
                        <div class="person-image">
                            <img src="${person.image}" alt="${name}" onerror="this.style.display='none'">
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
            deathsContainer.innerHTML = `<div class="loading">${t.noData || '暂无名人逝世数据'}</div>`;
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
        this.hideModal('languageModal');
    }

    updateLanguageContent() {
        const t = translations[this.currentLanguage];
        
        // Update brand
        const brandTitle = document.querySelector('.brand-title');
        const brandSubtitle = document.querySelector('.brand-subtitle');
        if (brandTitle) brandTitle.textContent = t.siteTitle;
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
        
        // Update footer columns
        const footerH4s = document.querySelectorAll('.footer-column h4');
        if (footerH4s[0]) footerH4s[0].textContent = t.websiteInfo;
        if (footerH4s[1]) footerH4s[1].textContent = t.legalTerms;
        if (footerH4s[2]) footerH4s[2].textContent = t.followUs;
        
        // Update footer links
        const footerLinks = document.querySelectorAll('.footer-column a');
        const linkTexts = [
            t.about, t.contact, t.dataSourceNav,
            t.privacy, t.terms, t.cookies
        ];
        footerLinks.forEach((link, index) => {
            if (linkTexts[index]) link.textContent = linkTexts[index];
        });
        
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