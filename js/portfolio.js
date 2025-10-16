/**
 * Portfolio Website JavaScript - Optimized for Performance
 */

class PortfolioWebsite {
    constructor() {
        this.dom = this.cacheDOMElements();
        this.state = {
            lastScrollY: window.scrollY,
            prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
            isScrolling: false
        };
        
        // Throttled and debounced handlers for better performance
        this.throttledScrollHandler = this.throttle(this.handleScroll.bind(this), 16);
        this.throttledHighlightSection = this.throttle(this.highlightActiveSection.bind(this), 100);
        
        this.init();
    }

    cacheDOMElements() {
        return {
            nav: document.querySelector('.nav'),
            sections: document.querySelectorAll('section[id]'),
            navLinks: document.querySelectorAll('.nav-link'),
            lazyElements: document.querySelectorAll('.lazy-load'),
            mobileMenuButton: document.querySelector('.mobile-menu'),
            mobileMenuContainer: document.querySelector('.mobile-menu-container'),
            hero: document.querySelector('.hero')
        };
    }

    init() {
        this.setupSmoothScrolling();
        this.setupScrollProgress();
        this.setupLazyLoading();
        this.setupNavigation();
        this.setupMobileMenu();
        this.setupAnimations();
        this.setupAccessibility();
        this.updateCopyrightYear();
    }
    
    throttle(callback, delay) {
        let lastCall = 0;
        return (...args) => {
            const now = Date.now();
            if (now - lastCall >= delay) {
                lastCall = now;
                callback(...args);
            }
        };
    }

    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const navHeight = this.dom.nav?.offsetHeight || 0;
                    const targetPosition = target.offsetTop - navHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    setupScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        
        const progressIndicator = document.createElement('div');
        progressIndicator.className = 'scroll-indicator';
        progressIndicator.appendChild(progressBar);
        
        document.body.appendChild(progressIndicator);
        
        window.addEventListener('scroll', () => {
            requestAnimationFrame(() => {
                const scrollPercent = (window.scrollY / 
                    (document.documentElement.scrollHeight - window.innerHeight)) * 100;
                progressBar.style.width = Math.min(scrollPercent, 100) + '%';
            });
        }, { passive: true });
    }

    setupLazyLoading() {
        if (!('IntersectionObserver' in window)) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('loaded');
                    observer.unobserve(entry.target);
                    
                    const counter = entry.target.querySelector('.counter');
                    if (counter) {
                        this.animateCounter(counter);
                    }
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        this.dom.lazyElements.forEach(el => {
            observer.observe(el);
        });
    }

    setupNavigation() {
        if (!this.dom.nav) return;
        
        window.addEventListener('scroll', this.throttledScrollHandler, { passive: true });
        window.addEventListener('scroll', this.throttledHighlightSection, { passive: true });
    }
    
    handleScroll() {
        const currentScrollY = window.scrollY;
        const isDarkMode = document.body.classList.contains('dark-mode');
        
        if (currentScrollY > 100) {
            const bgColor = isDarkMode ? 
                'rgba(26, 26, 26, 0.98)' : 
                'rgba(250, 250, 251, 0.98)';
            const shadow = isDarkMode ? 
                '0 2px 20px rgba(0, 0, 0, 0.2)' : 
                '0 2px 20px rgba(30, 58, 138, 0.1)';
                
            this.dom.nav.style.background = bgColor;
            this.dom.nav.style.boxShadow = shadow;
        } else {
            const bgColor = isDarkMode ? 
                'rgba(26, 26, 26, 0.95)' : 
                'rgba(250, 250, 251, 0.95)';
                
            this.dom.nav.style.background = bgColor;
            this.dom.nav.style.boxShadow = 'none';
        }

        if (currentScrollY > this.state.lastScrollY && currentScrollY > 200) {
            this.dom.nav.style.transform = 'translateY(-100%)';
        } else {
            this.dom.nav.style.transform = 'translateY(0)';
        }
        
        this.state.lastScrollY = currentScrollY;
    }

    highlightActiveSection() {
        const scrollPosition = window.scrollY + 100;

        this.dom.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                this.dom.navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
                });
            }
        });
    }

    setupMobileMenu() {
        const { mobileMenuButton, mobileMenuContainer } = this.dom;
        
        if (!mobileMenuButton || !mobileMenuContainer) return;

        // Toggle mobile menu
        mobileMenuButton.addEventListener('click', () => {
            const isOpen = mobileMenuContainer.classList.contains('active');
            isOpen ? this.closeMobileMenu() : this.openMobileMenu();
        });

        // Close menu on navigation
        mobileMenuContainer.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (!mobileMenuContainer.contains(e.target) && !mobileMenuButton.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenuContainer.classList.contains('active')) {
                this.closeMobileMenu();
            }
        });
    }

    openMobileMenu() {
        const { mobileMenuContainer, mobileMenuButton } = this.dom;
        
        mobileMenuContainer.classList.add('active');
        mobileMenuButton.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    closeMobileMenu() {
        const { mobileMenuContainer, mobileMenuButton } = this.dom;
        
        mobileMenuContainer.classList.remove('active');
        mobileMenuButton.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    setupAnimations() {
        if (this.state.prefersReducedMotion) return;
        
        const { hero } = this.dom;
        if (!hero) return;
        
        const parallaxBg = document.createElement('div');
        parallaxBg.className = 'hero-parallax-bg';
        hero.insertBefore(parallaxBg, hero.firstChild);
        
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrolled = window.pageYOffset;
                    const parallax = scrolled * 0.2;
                    parallaxBg.style.transform = `translateY(${parallax}px)`;
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    setupAccessibility() {
        // Add ARIA labels for interactive elements
        document.querySelectorAll('[data-tooltip]').forEach(element => {
            element.setAttribute('aria-label', element.dataset.tooltip);
        });

        // Ensure mobile menu button has proper ARIA attributes
        const { mobileMenuButton } = this.dom;
        if (mobileMenuButton) {
            mobileMenuButton.setAttribute('aria-label', 'Toggle mobile menu');
            mobileMenuButton.setAttribute('aria-expanded', 'false');
        }
    }

    updateCopyrightYear() {
        // Dynamically update the copyright year to current year
        const yearElement = document.getElementById('current-year');
        if (yearElement) {
            const currentYear = new Date().getFullYear();
            yearElement.textContent = currentYear;
        }
    }

    animateCounter(counter) {
        const target = parseInt(counter.dataset.target);
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };

        updateCounter();
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new PortfolioWebsite());
} else {
    new PortfolioWebsite();
}