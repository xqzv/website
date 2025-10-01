/**
 * Advanced Portfolio Website JavaScript
 * Handles enhanced interactions and performance optimizations
 */

class PortfolioWebsite {
    constructor() {
        // Cache DOM selectors for frequent access
        this.dom = {
            nav: document.querySelector('.nav'),
            hero: document.querySelector('.hero'),
            sections: document.querySelectorAll('section[id]'),
            navLinks: document.querySelectorAll('.nav-link'),
            projectCards: document.querySelectorAll('.project-card'),
            form: document.querySelector('form'),
            lazyElements: document.querySelectorAll('.lazy-load'),
            images: document.querySelectorAll('img[data-src]')
        };
        
        // Store state to reduce DOM access
        this.state = {
            lastScrollY: window.scrollY,
            prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        };
        
        // Throttled functions to improve performance
        this.throttledScrollHandler = this.throttle(this.handleScroll.bind(this), 10);
        this.throttledHighlightSection = this.throttle(this.highlightActiveSection.bind(this), 100);
        
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
        if (this.dom.hero && this.dom.hero.style.transform) {
            // Remove the transform style that's causing the bug
            this.dom.hero.style.transform = '';
        }
    }
    
    // Throttle function to limit execution frequency
    throttle(callback, delay) {
        let lastCall = 0;
        return function(...args) {
            const now = Date.now();
            if (now - lastCall >= delay) {
                lastCall = now;
                callback(...args);
            }
        };
    }

    // Smooth Scrolling with offset calculation
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

    // Scroll Progress Indicator - Created once, updated efficiently
    setupScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        
        const progressIndicator = document.createElement('div');
        progressIndicator.className = 'scroll-indicator';
        progressIndicator.appendChild(progressBar);
        
        document.body.appendChild(progressIndicator);
        
        // Update progress with throttled scroll handler
        window.addEventListener('scroll', () => {
            requestAnimationFrame(() => {
                const scrollPercent = (window.scrollY / 
                    (document.documentElement.scrollHeight - window.innerHeight)) * 100;
                progressBar.style.width = Math.min(scrollPercent, 100) + '%';
            });
        }, { passive: true });
    }

    // Enhanced Lazy Loading with Intersection Observer
    setupLazyLoading() {
        if (!('IntersectionObserver' in window)) return;
        
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

        this.dom.lazyElements.forEach(el => {
            observer.observe(el);
        });
    }

    // Navigation Enhancement
    setupNavigation() {
        if (!this.dom.nav) return;
        
        window.addEventListener('scroll', this.throttledScrollHandler, { passive: true });
        
        // Active section highlighting with throttling
        window.addEventListener('scroll', this.throttledHighlightSection, { passive: true });
    }
    
    // Handle scroll events efficiently
    handleScroll() {
        const currentScrollY = window.scrollY;
        const isDarkMode = document.body.classList.contains('dark-mode');
        
        // Background and shadow based on scroll position
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

        // Hide/show nav on scroll direction
        if (currentScrollY > this.state.lastScrollY && currentScrollY > 200) {
            this.dom.nav.style.transform = 'translateY(-100%)';
        } else {
            this.dom.nav.style.transform = 'translateY(0)';
        }
        
        this.state.lastScrollY = currentScrollY;
    }

    // Highlight active navigation section
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

    // Advanced Animations with performance considerations
    setupAnimations() {
        if (!this.dom.hero) return;
        
        // Only create parallax if reduced motion is not preferred
        if (!this.state.prefersReducedMotion) {
            // Create a background element for parallax effect
            const parallaxBg = document.createElement('div');
            parallaxBg.className = 'hero-parallax-bg';
            this.dom.hero.insertBefore(parallaxBg, this.dom.hero.firstChild);
            
            // Use requestAnimationFrame for smooth parallax
            let ticking = false;
            window.addEventListener('scroll', () => {
                if (!ticking) {
                    requestAnimationFrame(() => {
                        const scrolled = window.pageYOffset;
                        // Reduced parallax effect (0.2 instead of 0.5)
                        const parallax = scrolled * 0.2;
                        parallaxBg.style.transform = `translateY(${parallax}px)`;
                        ticking = false;
                    });
                    ticking = true;
                }
            }, { passive: true });
        }

        // Hover effects for project cards with event delegation
        const handleCardHover = function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            this.style.setProperty('--mouse-x', x + 'px');
            this.style.setProperty('--mouse-y', y + 'px');
        };
        
        this.dom.projectCards.forEach(card => {
            card.addEventListener('mousemove', handleCardHover);
            card.addEventListener('mouseleave', () => {
                // Reset custom properties on leave for better performance
                card.style.removeProperty('--mouse-x');
                card.style.removeProperty('--mouse-y');
            });
        });
    }

    // Form Handling with Validation
    setupFormHandling() {
        if (!this.dom.form) return;
        
        // Use form data API for more efficient form handling
        this.dom.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Create FormData object and convert to regular object
            const formData = new FormData(this.dom.form);
            const data = {
                name: formData.get('name') || '',
                email: formData.get('email') || '',
                message: formData.get('message') || ''
            };
            
            if (this.validateForm(data)) {
                await this.submitForm(data);
            }
        });

        // Real-time validation with event delegation
        this.dom.form.addEventListener('blur', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                this.validateField(e.target);
            }
        }, true);
    }

    // Form Validation with enhanced regex
    validateForm(data) {
        let isValid = true;
        
        // Email validation - using a more comprehensive regex
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
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

    // Field Validation based on field name rather than type
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;

        switch (field.name) {
            case 'email':
                const emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
                isValid = emailRegex.test(value);
                break;
            case 'name':
                isValid = value.length >= 2;
                break;
            case 'message':
                isValid = value.length >= 10;
                break;
            default:
                isValid = value.length > 0;
        }

        // Toggle class instead of add/remove for better performance
        field.classList.toggle('error', !isValid);
        
        if (isValid) {
            this.removeFieldError(field.name);
        }

        return isValid;
    }

    // Show Field Error - optimized with createElement directly
    showFieldError(fieldName, message) {
        const field = document.querySelector(`[name="${fieldName}"]`);
        if (!field) return;
        
        this.removeFieldError(fieldName);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        
        field.parentNode.appendChild(errorDiv);
        field.classList.add('error');
        field.setAttribute('aria-invalid', 'true');
    }

    // Remove Field Error with proper ARIA attribute management
    removeFieldError(fieldName) {
        const field = document.querySelector(`[name="${fieldName}"]`);
        if (!field) return;
        
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        field.classList.remove('error');
        field.removeAttribute('aria-invalid');
    }

    // Form Submission with optimized button state management
    async submitForm(data) {
        const submitButton = this.dom.form.querySelector('button[type="submit"]');
        if (!submitButton) return;
        
        const originalText = submitButton.textContent;
        const loadingSpinner = document.createElement('span');
        loadingSpinner.className = 'loading-spinner';
        
        // More efficient button state management
        submitButton.disabled = true;
        submitButton.textContent = '';
        submitButton.appendChild(loadingSpinner);
        submitButton.appendChild(document.createTextNode(' Sending...'));

        try {
            // Simulate API call with timeout for demonstration
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            this.showToast('Message sent successfully!', 'success');
            this.dom.form.reset();
            
            // Return focus to an appropriate element after success
            const nameInput = this.dom.form.querySelector('[name="name"]');
            if (nameInput) {
                nameInput.focus();
            }
        } catch (error) {
            console.error('Form submission error:', error);
            this.showToast('Failed to send message. Please try again.', 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    }

    // Performance Optimizations
    setupPerformanceOptimizations() {
        // Optimize images with native lazy loading where supported
        this.optimizeImages();
        
        // Service Worker registration with error handling
        if ('serviceWorker' in navigator) {
            // Defer registration until page load for better performance
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/service-worker.js')
                    .catch(error => {
                        console.error('ServiceWorker registration failed:', error);
                    });
            });
        }
    }

    // Image Optimization with native lazy loading where possible
    optimizeImages() {
        // Check for native lazy loading support
        const supportsNativeLazy = 'loading' in HTMLImageElement.prototype;
        
        this.dom.images.forEach(img => {
            if (supportsNativeLazy) {
                // Use native lazy loading when available
                img.loading = 'lazy';
                img.src = img.dataset.src;
                img.onload = () => img.classList.add('loaded');
            } else {
                // Fall back to IntersectionObserver
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
                
                imageObserver.observe(img);
            }
        });
    }

    // Accessibility Enhancements
    setupAccessibility() {
        // Keyboard navigation
        this.setupKeyboardNavigation();
        
        // ARIA attributes
        this.setupAriaAttributes();
        
        // Skip to content link is already in the HTML
    }

    // Keyboard Navigation with optimized event handling
    setupKeyboardNavigation() {
        // Using passive event listeners where appropriate
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                requestAnimationFrame(() => {
                    document.body.classList.add('keyboard-navigation');
                });
            }
            
            if (e.key === 'Escape') {
                // Close modals, dropdowns, mobile menu
                this.closeAllModals();
            }
        });

        document.addEventListener('mousedown', () => {
            requestAnimationFrame(() => {
                document.body.classList.remove('keyboard-navigation');
            });
        }, { passive: true });
    }

    // ARIA Attributes - optimized selector for better performance
    setupAriaAttributes() {
        // Add missing ARIA labels - more specific selector for better performance
        document.querySelectorAll('button:not([aria-label]), a:not([aria-label])').forEach(element => {
            if (!element.textContent.trim() && element.querySelector('img, svg')) {
                const nearestText = element.getAttribute('title') || 'Interactive element';
                element.setAttribute('aria-label', nearestText);
            }
        });
        
        // Ensure all form fields have associated labels
        const formFields = document.querySelectorAll('input, textarea, select');
        formFields.forEach(field => {
            const id = field.id;
            if (id && !document.querySelector(`label[for="${id}"]`)) {
                const label = document.createElement('label');
                label.setAttribute('for', id);
                label.textContent = field.placeholder || field.name || 'Field';
                field.parentNode.insertBefore(label, field);
            }
        });
    }

    // Animate Counter with requestAnimationFrame for better performance
    animateCounter(element) {
        if (!element) return;
        
        const target = parseInt(element.dataset.target) || 
                      parseInt(element.textContent.replace(/[^0-9]/g, ''));
        const duration = 2000;
        const start = performance.now();
        const startValue = 0;

        // Use requestAnimationFrame for smooth animation
        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            // Use easing for smoother animation
            const easedProgress = this.easeOutQuad(progress);
            const current = Math.floor(startValue + (target - startValue) * easedProgress);
            
            element.textContent = element.dataset.suffix ? 
                `${current}${element.dataset.suffix}` : current;

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }
    
    // Easing function for smoother animations
    easeOutQuad(x) {
        return 1 - (1 - x) * (1 - x);
    }

    // Toast Notifications with ARIA live region for accessibility
    showToast(message, type = 'info') {
        // Create toast container if it doesn't exist
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            toastContainer.setAttribute('aria-live', 'polite');
            document.body.appendChild(toastContainer);
        }
        
        // Create toast with proper ARIA role
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.setAttribute('role', 'status');
        toast.textContent = message;
        
        toastContainer.appendChild(toast);
        
        // Use requestAnimationFrame for smoother animations
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        // Auto remove with cleanup to prevent memory leaks
        const toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
            toast.addEventListener('transitionend', () => {
                toast.remove();
                
                // Clean up container if empty
                if (!toastContainer.hasChildNodes()) {
                    toastContainer.remove();
                }
            }, { once: true });
        }, 4000);
        
        // Store timeout ID on element for potential early removal
        toast.dataset.timeoutId = toastTimeout;
        
        return toast;
    }

    // Close All Modals with improved ARIA management
    closeAllModals() {
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.classList.remove('active');
            
            // Ensure ARIA states are updated
            const modal = overlay.querySelector('[role="dialog"]');
            if (modal) {
                modal.setAttribute('aria-hidden', 'true');
                
                // Return focus to trigger element if stored
                const triggerId = modal.getAttribute('data-trigger-id');
                if (triggerId) {
                    const trigger = document.getElementById(triggerId);
                    if (trigger) trigger.focus();
                }
            }
        });
        
        // Close mobile menu
        const mobileMenu = document.querySelector('.mobile-menu-container');
        if (mobileMenu) {
            mobileMenu.classList.remove('active');
            
            // Toggle ARIA expanded state on the button
            const mobileMenuButton = document.querySelector('.mobile-menu');
            if (mobileMenuButton) {
                mobileMenuButton.setAttribute('aria-expanded', 'false');
            }
        }
    }
}

// Initialize on DOMContentLoaded for faster loading
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioWebsite();
    
    // Performance metrics logging with Web Vitals API if available
    if ('performance' in window) {
        // Wait for load event to measure LCP
        window.addEventListener('load', () => {
            setTimeout(() => {
                const metrics = {};
                const paintMetrics = performance.getEntriesByType('paint');
                
                paintMetrics.forEach(entry => {
                    metrics[entry.name] = Math.round(entry.startTime);
                });
                
                console.log('Performance metrics:', metrics);
            }, 0);
        });
    }
});