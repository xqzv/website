/**
 * Advanced Portfolio Website JavaScript
 * Handles enhanced interactions and performance optimizations
 */

class PortfolioWebsite {
    constructor() {
        this.init();
    }

    init() {
        // Clean up any existing transform styles on the hero section
        this.cleanupHeroStyles();
        
        this.setupSmoothScrolling();
        this.setupScrollProgress();
        this.setupLazyLoading();
        this.setupNavigation();
        this.setupAnimations();
        this.setupFormHandling();
        this.setupPerformanceOptimizations();
        this.setupAccessibility();
    }
    
    // Clean up any existing styles that might interfere
    cleanupHeroStyles() {
        const hero = document.querySelector('.hero');
        if (hero && hero.style.transform) {
            // Remove the transform style that's causing the bug
            hero.style.transform = '';
        }
    }

    // Smooth Scrolling with offset calculation
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const navHeight = document.querySelector('.nav')?.offsetHeight || 0;
                    const targetPosition = target.offsetTop - navHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Scroll Progress Indicator
    setupScrollProgress() {
        const progressIndicator = this.createElement('div', 'scroll-indicator', [
            this.createElement('div', 'scroll-progress')
        ]);
        document.body.appendChild(progressIndicator);

        const progressBar = progressIndicator.querySelector('.scroll-progress');
        
        window.addEventListener('scroll', () => {
            const scrollPercent = (window.scrollY / 
                (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            progressBar.style.width = Math.min(scrollPercent, 100) + '%';
        });
    }

    // Enhanced Lazy Loading with Intersection Observer
    setupLazyLoading() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('loaded');
                    observer.unobserve(entry.target);
                    
                    // If there's a counter, animate it
                    const counter = entry.target.querySelector('.counter');
                    if (counter) {
                        this.animateCounter(counter);
                    }
                }
            });
        }, observerOptions);

        document.querySelectorAll('.lazy-load').forEach(el => {
            observer.observe(el);
        });
    }

    // Navigation Enhancement
    setupNavigation() {
        const nav = document.querySelector('.nav');
        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            // Background opacity based on scroll
            if (currentScrollY > 100) {
                nav.style.background = 'rgba(254, 252, 248, 0.98)';
                nav.style.boxShadow = '0 2px 20px rgba(139, 69, 19, 0.1)';
            } else {
                nav.style.background = 'rgba(254, 252, 248, 0.95)';
                nav.style.boxShadow = 'none';
            }

            // Hide/show nav on scroll direction
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                nav.style.transform = 'translateY(-100%)';
            } else {
                nav.style.transform = 'translateY(0)';
            }
            
            lastScrollY = currentScrollY;
        });

        // Active section highlighting
        this.highlightActiveSection();
    }

    // Highlight active navigation section
    highlightActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY + 100;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        });
    }

    // Advanced Animations
    setupAnimations() {
        // Parallax effect for hero background (not the entire section)
        const hero = document.querySelector('.hero');
        if (hero) {
            // Create a background element for parallax effect
            const parallaxBg = document.createElement('div');
            parallaxBg.className = 'hero-parallax-bg';
            hero.insertBefore(parallaxBg, hero.firstChild);
            
            // Check if user prefers reduced motion
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            
            if (!prefersReducedMotion) {
                window.addEventListener('scroll', () => {
                    const scrolled = window.pageYOffset;
                    // Reduced parallax effect (0.2 instead of 0.5)
                    const parallax = scrolled * 0.2;
                    parallaxBg.style.transform = `translateY(${parallax}px)`;
                });
            }
        }

        // Hover effects for project cards
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                card.style.setProperty('--mouse-x', x + 'px');
                card.style.setProperty('--mouse-y', y + 'px');
            });
        });
    }

    // Form Handling with Validation
    setupFormHandling() {
        const form = document.querySelector('form');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const formData = {
                    name: form.querySelector('[name="name"]')?.value || '',
                    email: form.querySelector('[name="email"]')?.value || '',
                    message: form.querySelector('[name="message"]')?.value || ''
                };
                
                if (this.validateForm(formData)) {
                    await this.submitForm(formData);
                }
            });

            // Real-time validation
            form.querySelectorAll('input, textarea').forEach(field => {
                field.addEventListener('blur', () => {
                    this.validateField(field);
                });
            });
        }
    }

    // Form Validation
    validateForm(data) {
        let isValid = true;
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            this.showFieldError('email', 'Please enter a valid email address');
            isValid = false;
        }

        // Name validation
        if (data.name.trim().length < 2) {
            this.showFieldError('name', 'Name must be at least 2 characters');
            isValid = false;
        }

        // Message validation
        if (data.message.trim().length < 10) {
            this.showFieldError('message', 'Message must be at least 10 characters');
            isValid = false;
        }

        return isValid;
    }

    // Field Validation
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;

        switch (field.type) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                isValid = emailRegex.test(value);
                break;
            case 'text':
                isValid = value.length >= 2;
                break;
            default:
                isValid = value.length >= 10;
        }

        if (isValid) {
            field.classList.remove('error');
            this.removeFieldError(field.name);
        } else {
            field.classList.add('error');
        }

        return isValid;
    }

    // Show Field Error
    showFieldError(fieldName, message) {
        const field = document.querySelector(`[name="${fieldName}"]`);
        if (!field) return;
        
        this.removeFieldError(fieldName);
        
        const errorDiv = this.createElement('div', 'field-error', [
            document.createTextNode(message)
        ]);
        
        field.parentNode.appendChild(errorDiv);
        field.classList.add('error');
    }

    // Remove Field Error
    removeFieldError(fieldName) {
        const field = document.querySelector(`[name="${fieldName}"]`);
        if (!field) return;
        
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        field.classList.remove('error');
    }

    // Form Submission (placeholder)
    async submitForm(data) {
        const submitButton = document.querySelector('button[type="submit"]');
        if (!submitButton) return;
        
        const originalText = submitButton.textContent;
        
        submitButton.disabled = true;
        submitButton.innerHTML = `
            <span class="loading-spinner"></span>
            Sending...
        `;

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            this.showToast('Message sent successfully!', 'success');
            document.querySelector('form').reset();
        } catch (error) {
            this.showToast('Failed to send message. Please try again.', 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    }

    // Performance Optimizations
    setupPerformanceOptimizations() {
        // Preload critical resources
        this.preloadCriticalResources();
        
        // Optimize images
        this.optimizeImages();
        
        // Service Worker for caching (if needed)
        if ('serviceWorker' in navigator) {
            // Register service worker for offline functionality
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => {
                    console.log('ServiceWorker registration successful');
                })
                .catch(error => {
                    console.log('ServiceWorker registration failed:', error);
                });
        }
    }

    // Preload Critical Resources
    preloadCriticalResources() {
        const criticalResources = [
            'https://fonts.googleapis.com/css2?family=Inter:wght@300..700&display=swap',
            // Add other critical resources
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = resource.includes('.css') ? 'style' : 'image';
            document.head.appendChild(link);
        });
    }

    // Image Optimization
    optimizeImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.onload = () => img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    // Accessibility Enhancements
    setupAccessibility() {
        // Keyboard navigation
        this.setupKeyboardNavigation();
        
        // ARIA attributes
        this.setupAriaAttributes();
        
        // Focus management
        this.setupFocusManagement();
    }

    // Keyboard Navigation
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
            
            if (e.key === 'Escape') {
                // Close modals, dropdowns, mobile menu
                this.closeAllModals();
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    // ARIA Attributes
    setupAriaAttributes() {
        // Add missing ARIA labels
        document.querySelectorAll('button, a').forEach(element => {
            if (!element.hasAttribute('aria-label') && 
                !element.textContent.trim() && 
                element.querySelector('img, svg')) {
                const nearestText = element.getAttribute('title') || 'Interactive element';
                element.setAttribute('aria-label', nearestText);
            }
        });
    }

    // Focus Management
    setupFocusManagement() {
        // Skip links
        const skipLink = this.createElement('a', 'skip-link', [
            document.createTextNode('Skip to main content')
        ]);
        skipLink.href = '#main';
        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    // Utility Functions
    createElement(tag, className, children = []) {
        const element = document.createElement(tag);
        if (className) element.className = className;
        children.forEach(child => element.appendChild(child));
        return element;
    }

    // Animate Counter
    animateCounter(element) {
        const target = parseInt(element.dataset.target) || 
                      parseInt(element.textContent.replace(/[^0-9]/g, ''));
        const duration = 2000;
        const start = performance.now();
        const startValue = 0;

        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = Math.floor(startValue + (target - startValue) * progress);
            element.textContent = element.dataset.suffix ? 
                `${current}${element.dataset.suffix}` : current;

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    // Toast Notifications
    showToast(message, type = 'info') {
        const toast = this.createElement('div', `toast ${type}`, [
            document.createTextNode(message)
        ]);
        
        document.body.appendChild(toast);
        
        // Trigger animation
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        // Auto remove
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    // Close All Modals
    closeAllModals() {
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.classList.remove('active');
        });
        
        // Close mobile menu
        const mobileMenu = document.querySelector('.mobile-menu-container');
        if (mobileMenu) {
            mobileMenu.classList.remove('active');
        }
    }
}

// Performance monitoring
window.addEventListener('load', () => {
    // Log Core Web Vitals
    if ('performance' in window) {
        const paintMetrics = performance.getEntriesByType('paint');
        console.log('Performance metrics:', paintMetrics);
    }
});