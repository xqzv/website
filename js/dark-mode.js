/**
 * Dark Mode Toggle Functionality
 * Handles theme switching independent of system preferences
 */

// Cache DOM elements and preferences
const initDarkMode = () => {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;
    
    // Check system preference first
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Then check for saved preference in localStorage
    const savedTheme = localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light');
    
    // Apply theme without unnecessary reflows
    document.body.classList.add(savedTheme === 'dark' ? 'dark-mode' : 'light-mode');
    
    // Toggle theme efficiently when button is clicked
    themeToggle.addEventListener('click', () => {
        const isDark = document.body.classList.contains('dark-mode');
        
        // Toggle with single classList manipulation to reduce reflows
        document.body.classList.replace(
            isDark ? 'dark-mode' : 'light-mode',
            isDark ? 'light-mode' : 'dark-mode'
        );
        
        // Save preference
        localStorage.setItem('theme', isDark ? 'light' : 'dark');
        
        // Update navigation styles
        fixNavigationStyles();
    });
    
    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark-mode' : 'light-mode';
            const oldTheme = e.matches ? 'light-mode' : 'dark-mode';
            document.body.classList.replace(oldTheme, newTheme);
        }
    });
    
    // Initialize navigation styles
    fixNavigationStyles();
};

// Function to fix navigation bar styles - optimized to reduce style calculations
function fixNavigationStyles() {
    const nav = document.querySelector('.nav');
    if (!nav) return;
    
    const isDarkMode = document.body.classList.contains('dark-mode');
    
    // Apply styles with a single batch update
    Object.assign(nav.style, {
        background: isDarkMode ? 'rgba(26, 26, 26, 0.95)' : 'rgba(250, 250, 251, 0.95)',
        borderBottom: isDarkMode ? 
            '1px solid rgba(255, 255, 255, 0.1)' : 
            '1px solid rgba(30, 58, 138, 0.1)'
    });
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDarkMode);
} else {
    initDarkMode();
}