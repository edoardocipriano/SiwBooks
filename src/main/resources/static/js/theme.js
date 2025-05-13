/**
 * SiwBooks - Theme Switching JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    initializeThemeSelector();
});

/**
 * Theme selector and dark mode toggle
 */
function initializeThemeSelector() {
    // Create theme toggle button
    createThemeToggle();
    
    // Check for saved theme preference or respect OS preference
    const savedTheme = localStorage.getItem('siwbooks-theme');
    
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('siwbooks-theme', 'dark');
    }
    
    // Update toggle button state
    updateToggleState();
}

/**
 * Create and append the theme toggle button
 */
function createThemeToggle() {
    const header = document.querySelector('header');
    if (!header) return;
    
    const nav = header.querySelector('nav');
    if (!nav) return;
    
    // Create the toggle element
    const themeToggle = document.createElement('div');
    themeToggle.classList.add('theme-toggle');
    themeToggle.innerHTML = `
        <button id="theme-toggle-btn" aria-label="Cambia tema">
            <span class="theme-toggle-icon light-icon">☀️</span>
            <span class="theme-toggle-icon dark-icon">🌙</span>
        </button>
    `;
    
    // Append to navigation
    nav.appendChild(themeToggle);
    
    // Add event listener
    document.getElementById('theme-toggle-btn').addEventListener('click', toggleTheme);
}

/**
 * Toggle between light and dark themes
 */
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    // Apply the theme
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('siwbooks-theme', newTheme);
    
    // Update button state
    updateToggleState();
    
    // Add transition effect to body
    document.body.classList.add('theme-transition');
    setTimeout(() => {
        document.body.classList.remove('theme-transition');
    }, 1000);
}

/**
 * Update the toggle button to match current theme
 */
function updateToggleState() {
    const toggleBtn = document.getElementById('theme-toggle-btn');
    if (!toggleBtn) return;
    
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    
    if (currentTheme === 'dark') {
        toggleBtn.classList.add('dark-mode');
    } else {
        toggleBtn.classList.remove('dark-mode');
    }
} 