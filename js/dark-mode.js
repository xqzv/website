/**
 * Dark Mode Toggle - Optimized
 */

const initDarkMode = () => {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;
    
    // Apply saved or system preference theme immediately
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light');
    applyTheme(savedTheme);
    
    // Theme toggle handler
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });
    
    // System preference change listener
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });
};

function applyTheme(theme) {
    const isDark = theme === 'dark';
    document.body.classList.remove('light-mode', 'dark-mode');
    document.body.classList.add(isDark ? 'dark-mode' : 'light-mode');
    updateNavigationStyles(isDark);
}

function updateNavigationStyles(isDark) {
    const nav = document.querySelector('.nav');
    if (!nav) return;
    
    // Update navigation background based on theme - using CSS custom properties
    nav.style.background = isDark ? 
        'rgba(15, 15, 15, 0.95)' : 
        'rgba(250, 250, 251, 0.95)';
    nav.style.borderBottom = isDark ? 
        '1px solid var(--dark-border-light)' : 
        '1px solid rgba(30, 58, 138, 0.1)';
}

// Initialize when DOM is ready or immediately if already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDarkMode);
} else {
    initDarkMode();
}