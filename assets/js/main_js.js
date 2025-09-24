/**
 * Portfolio Website JavaScript
 * Optimized for performance and accessibility
 */

class PortfolioSite {
  constructor() {
    this.nav = document.querySelector('.nav');
    this.mobileToggle = document.querySelector('.nav__mobile-toggle');
    this.navLinks = document.querySelectorAll('.nav__link');
    this.form = document.querySelector('.contact-form');
    
    // Throttled scroll handler
    this.lastScrollY = 0;
    this.scrollTimeout = null;
    
    // Animation observers
    this.intersectionObserver = null;
    
    // Initialize
    this.init();
  }

  init() {
    this.setupNavigation();
    this.setupScrollEffects();
    this.setupFormHandling();
    this.setupAnimations();
    this.setupMobileMenu();
  }

  /**
   * Navigation Setup
   */
  setupNavigation() {
    // Smooth scrolling for navigation links
    this.navLinks.forEach(link => {
      link.addEventListener('click', this.handleNavClick.bind(this));
    });

    // Scroll-based navigation updates
    this.setupScrollNavigation();
  }

  handleNavClick(e) {
    const href = e.target.getAttribute('href');
    
    if (href?.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      
      if (target) {
        const navHeight = this.nav.offsetHeight;
        const targetPosition = target.offsetTop - navHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Close mobile menu if open
        this.closeMobileMenu();
      }
    }
  }

  setupScrollNavigation() {
    const sections = document.querySelectorAll('section[id]');
    
    // Throttled scroll handler for better performance
    const handleScroll = () => {
      if (this.scrollTimeout) {
        clearTimeout(this.scrollTimeout);
      }
      
      this.scrollTimeout = setTimeout(() => {
        const currentScrollY = window.scrollY;
        const navHeight = this.nav.offsetHeight;
        
        // Update navigation background
        this.updateNavBackground(currentScrollY);
        
        // Update active navigation link
        this.updateActiveNavLink(sections, currentScrollY, navHeight);
        
        // Hide/show navigation on mobile
        this.updateNavVisibility(currentScrollY);
        
        this.lastScrollY = currentScrollY;
      }, 16); // ~60fps
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  updateNavBackground(scrollY) {
    if (scrollY > 100) {
      this.nav.classList.add('nav--scrolled');
    } else {
      this.nav.classList.remove('nav--scrolled');
    }
  }

  updateActiveNavLink(sections, scrollY, navHeight) {
    const scrollPosition = scrollY + navHeight + 50;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && 
          scrollPosition < sectionTop + sectionHeight) {
        
        // Remove active class from all links
        this.navLinks.forEach(link => link.classList.remove('active'));
        
        // Add active class to current section link
        const activeLink = document.querySelector(`[href="#${sectionId}"]`);
        if (activeLink) {
          activeLink.classList.add('active');
        }
      }
    });
  }

  updateNavVisibility(currentScrollY) {
    // Hide nav when scrolling down, show when scrolling up
    if (window.innerWidth <= 768) {
      if (currentScrollY > this.lastScrollY && currentScrollY > 200) {
        this.nav.classList.add('nav--hidden');
      } else {
        this.nav.classList.remove('nav--hidden');
      }
    }
  }

  /**
   * Mobile Menu Functionality
   */
  setupMobileMenu() {
    if (this.mobileToggle) {
      this.mobileToggle.addEventListener('click', this.toggleMobileMenu.bind(this));
      
      // Close mobile menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!this.nav.contains(e.target)) {
          this.closeMobileMenu();
        }
      });
      
      // Close mobile menu on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.closeMobileMenu();
        }
      });
    }
  }

  toggleMobileMenu() {
    const isExpanded = this.mobileToggle.getAttribute('aria-expanded') === 'true';
    
    this.mobileToggle.setAttribute('aria-expanded', !isExpanded);
    
    // Create mobile menu if it doesn't exist
    let mobileMenu = this.nav.querySelector('.nav__mobile-menu');
    if (!mobileMenu) {
      mobileMenu = this.createMobileMenu();
    }
    
    if (isExpanded) {
      this.closeMobileMenu();
    } else {
      mobileMenu.classList.add('open');
      // Focus management
      const firstLink = mobileMenu.querySelector('.nav__link');
      if (firstLink) firstLink.focus();
    }
  }

  createMobileMenu() {
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'nav__mobile-menu';
    mobileMenu.setAttribute('id', 'mobile-nav-menu');
    
    const linksList = document.createElement('ul');
    linksList.className = 'nav__links';
    
    // Clone existing nav links
    this.navLinks.forEach(link => {
      const li = document.createElement('li');
      const clonedLink = link.cloneNode(true);
      clonedLink.addEventListener('click', this.handleNavClick.bind(this));
      li.appendChild(clonedLink);
      linksList.appendChild(li);
    });
    
    mobileMenu.appendChild(linksList);
    this.nav.appendChild(mobileMenu);
    
    return mobileMenu;
  }

  closeMobileMenu() {
    this.mobileToggle?.setAttribute('aria-expanded', 'false');
    const mobileMenu = this.nav.querySelector('.nav__mobile-menu');
    if (mobileMenu) {
      mobileMenu.classList.remove('open');
    }
  }

  /**
   * Scroll Effects and Animations
   */
  setupScrollEffects() {
    // Intersection Observer for animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-slideUp');
          this.intersectionObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
      '.skill-card, .project-card, .profile-card, .section__header'
    );
    
    animatedElements.forEach(el => {
      this.intersectionObserver.observe(el);
    });
  }

  setupAnimations() {
    // Add CSS classes for elements that should animate
    const animatedElements = document.querySelectorAll(
      '.skill-card, .project-card, .profile-card'
    );
    
    animatedElements.forEach((el, index) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    });
  }

  /**
   * Form Handling
   */
  setupFormHandling() {
    if (!this.form) return;

    this.form.addEventListener('submit', this.handleFormSubmit.bind(this));
    
    // Real-time validation
    const inputs = this.form.querySelectorAll('.form-input');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearFieldError(input));
    });
  }

  async handleFormSubmit(e) {
    e.preventDefault();

    const formData = new FormData(this.form);
    const data = Object.fromEntries(formData);

    // Validate form
    if (!this.validateForm(data)) {
      return;
    }

    // Show loading state
    const submitButton = this.form.querySelector('button[type="submit"]');
    const buttonText = submitButton.querySelector('.btn__text');
    const buttonLoading = submitButton.querySelector('.btn__loading');
    
    submitButton.disabled = true;
    buttonText.hidden = true;
    buttonLoading.hidden = false;

    try {
      // Simulate form submission (replace with actual API call)
      await this.simulateFormSubmission(data);
      
      this.showToast('Message sent successfully!', 'success');
      this.form.reset();
      this.clearAllErrors();
      
    } catch (error) {
      console.error('Form submission error:', error);
      this.showToast('Failed to send message. Please try again.', 'error');
    } finally {
      // Reset button state
      submitButton.disabled = false;
      buttonText.hidden = false;
      buttonLoading.hidden = true;
    }
  }

  validateForm(data) {
    let isValid = true;
    
    // Name validation
    if (!data.name || data.name.trim().length < 2) {
      this.showFieldError('name', 'Name must be at least 2 characters');
      isValid = false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email.trim())) {
      this.showFieldError('email', 'Please enter a valid email address');
      isValid = false;
    }
    
    // Message validation
    if (!data.message || data.message.trim().length < 10) {
      this.showFieldError('message', 'Message must be at least 10 characters');
      isValid = false;
    }
    
    return isValid;
  }

  validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    
    this.clearFieldError(field);
    
    switch (fieldName) {
      case 'name':
        if (value.length > 0 && value.length < 2) {
          this.showFieldError(fieldName, 'Name must be at least 2 characters');
          return false;
        }
        break;
      case 'email':
        if (value.length > 0) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            this.showFieldError(fieldName, 'Please enter a valid email address');
            return false;
          }
        }
        break;
      case 'message':
        if (value.length > 0 && value.length < 10) {
          this.showFieldError(fieldName, 'Message must be at least 10 characters');
          return false;
        }
        break;
    }
    
    return true;
  }

  showFieldError(fieldName, message) {
    const field = document.querySelector(`[name="${fieldName}"]`);
    const errorElement = document.querySelector(`#${fieldName}-error`);
    
    if (field && errorElement) {
      field.classList.add('error');
      errorElement.textContent = message;
      errorElement.setAttribute('aria-live', 'polite');
    }
  }

  clearFieldError(field) {
    const fieldName = field.name;
    const errorElement = document.querySelector(`#${fieldName}-error`);
    
    field.classList.remove('error');
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.removeAttribute('aria-live');
    }
  }

  clearAllErrors() {
    const errorElements = this.form.querySelectorAll('.form-error');
    const inputElements = this.form.querySelectorAll('.form-input');
    
    errorElements.forEach(error => error.textContent = '');
    inputElements.forEach(input => input.classList.remove('error'));
  }

  /**
   * Utility Methods
   */
  async simulateFormSubmission(data) {
    // Simulate API call delay
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate occasional failures for testing
        if (Math.random() > 0.9) {
          reject(new Error('Simulated network error'));
        } else {
          resolve({ success: true, data });
        }
      }, 1500);
    });
  }

  showToast(message, type = 'info') {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.toast');
    existingToasts.forEach(toast => toast.remove());
    
    // Create new toast
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.textContent = message;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');
    
    document.body.appendChild(toast);
    
    // Show toast
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });
    
    // Auto-remove toast
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 4000);
  }

  /**
   * Cleanup method
   */
  destroy() {
    // Remove event listeners
    window.removeEventListener('scroll', this.handleScroll);
    
    // Disconnect observers
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
    
    // Clear timeouts
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    // Disable animations for users who prefer reduced motion
    document.documentElement.style.setProperty('--transition-fast', '0ms');
    document.documentElement.style.setProperty('--transition-base', '0ms');
    document.documentElement.style.setProperty('--transition-slow', '0ms');
  }
  
  // Initialize the portfolio site
  const portfolio = new PortfolioSite();
  
  // Make it globally available for debugging
  if (process?.env?.NODE_ENV === 'development') {
    window.portfolio = portfolio;
  }
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    // Resume animations or refresh data if needed
    console.log('Page is now visible');
  } else {
    // Pause animations or background processes
    console.log('Page is now hidden');
  }
});

// Service worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}