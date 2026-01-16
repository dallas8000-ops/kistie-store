// ---------- THEME.JS ----------
// Dark/Light mode toggle
(function() {
    const btn = document.getElementById('themeToggle') || document.getElementById('theme-toggle-btn');
    const body = document.documentElement;
    
    const getStoredTheme = () => localStorage.getItem('nalumansi-theme');
    
    const applyTheme = (theme) => {
        body.setAttribute('data-theme', theme);
        if (btn) {
            btn.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
        }
    };
    
    // Initialize theme
    applyTheme(getStoredTheme() || 'light');
    
    // Toggle on button click
    if (btn) {
        btn.addEventListener('click', () => {
            const currentTheme = body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            localStorage.setItem('nalumansi-theme', newTheme);
            applyTheme(newTheme);
        });
    }
})();
