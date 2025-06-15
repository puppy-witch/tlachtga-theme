/**
 * Tlachtga Theme Switcher
 * Anti-Capitalist Software License 1.4
 * Accessible multi-theme switcher with reduced motion support
 */

class TlachtgaThemeSwitcher {
  constructor() {
    this.themes = ['dark', 'light', 'retro', 'high-contrast'];
    this.storageKey = 'tlachtga-theme';
    this.currentTheme = this.getStoredTheme() || this.getSystemTheme();
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    this.init();
  }
  
  init() {
    this.createSwitcherUI();
    this.setTheme(this.currentTheme);
    this.bindEvents();
    this.announceTheme();
  }
  
  getSystemTheme() {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }
  
  getStoredTheme() {
    try {
      return localStorage.getItem(this.storageKey);
    } catch (e) {
      console.warn('Theme Switcher: LocalStorage not available');
      return null;
    }
  }
  
  storeTheme(theme) {
    try {
      localStorage.setItem(this.storageKey, theme);
    } catch (e) {
      console.warn('Theme Switcher: Could not store theme preference');
    }
  }
  
  createSwitcherUI() {
    const switcher = document.createElement('div');
    switcher.className = 'theme-switcher';
    switcher.innerHTML = `
      <button 
        id="theme-toggle" 
        class="theme-toggle" 
        aria-label="Switch theme (current: ${this.currentTheme})"
        aria-expanded="false"
        aria-haspopup="true"
      >
        <span class="theme-icon" aria-hidden="true">${this.getThemeIcon(this.currentTheme)}</span>
        <span class="sr-only">Current theme: ${this.currentTheme}</span>
      </button>
      <div class="theme-menu" role="menu" aria-labelledby="theme-toggle">
        ${this.themes.map(theme => `
          <button 
            class="theme-option" 
            data-theme="${theme}"
            role="menuitem"
            aria-label="Switch to ${theme} theme"
          >
            <span class="theme-icon" aria-hidden="true">${this.getThemeIcon(theme)}</span>
            <span class="theme-name">${this.capitalize(theme)}</span>
          </button>
        `).join('')}
      </div>
    `;
    
    // Insert into header
    const header = document.querySelector('.site-header');
    if (header) {
      header.appendChild(switcher);
    }
  }
  
  getThemeIcon(theme) {
    const icons = {
      dark: '🌙',
      light: '☀️', 
      retro: '📟',
      high-contrast: '🔳'
      amber: '🟡'
    };
    return icons[theme] || '🎨';
  }
  
  capitalize(str) {
    return str.replace(/\b\w/g, l => l.toUpperCase());
  }
  
  setTheme(theme, announce = false) {
    if (!this.themes.includes(theme)) {
      console.warn(`Theme Switcher: Invalid theme "${theme}"`);
      return;
    }
    
    // Apply theme
    document.documentElement.setAttribute('data-theme', theme);
    this.currentTheme = theme;
    this.storeTheme(theme);
    
    // Update UI
    this.updateToggleButton();
    this.updateActiveOption();
    
    // Announce to screen readers
    if (announce) {
      this.announceTheme();
    }
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('themeChanged', {
      detail: { theme, previousTheme: this.currentTheme }
    }));
  }
  
  updateToggleButton() {
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      const icon = toggle.querySelector('.theme-icon');
      const srText = toggle.querySelector('.sr-only');
      
      if (icon) icon.textContent = this.getThemeIcon(this.currentTheme);
      if (srText) srText.textContent = `Current theme: ${this.currentTheme}`;
      
      toggle.setAttribute('aria-label', `Switch theme (current: ${this.currentTheme})`);
    }
  }
  
  updateActiveOption() {
    const options = document.querySelectorAll('.theme-option');
    options.forEach(option => {
      const isActive = option.dataset.theme === this.currentTheme;
      option.classList.toggle('active', isActive);
      option.setAttribute('aria-current', isActive ? 'true' : 'false');
    });
  }
  
  announceTheme() {
    // Create announcement for screen readers
    const announcement = document.createElement('div');
    announcement.className = 'sr-only';
    announcement.setAttribute('aria-live', 'polite');
    announcement.textContent = `Theme changed to ${this.currentTheme}`;
    
    document.body.appendChild(announcement);
    
    // Clean up after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }
  
  bindEvents() {
    // Toggle button
    document.addEventListener('click', (e) => {
      if (e.target.closest('#theme-toggle')) {
        e.preventDefault();
        this.toggleMenu();
      }
      
      if (e.target.closest('.theme-option')) {
        e.preventDefault();
        const theme = e.target.closest('.theme-option').dataset.theme;
        this.setTheme(theme, true);
        this.closeMenu();
      }
      
      // Close menu on outside click
      if (!e.target.closest('.theme-switcher')) {
        this.closeMenu();
      }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.target.closest('.theme-switcher')) {
        this.handleKeyboard(e);
      }
    });
    
    // System theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!this.getStoredTheme()) {
        this.setTheme(e.matches ? 'dark' : 'light');
      }
    });
    
    // Reduced motion changes
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      this.reducedMotion = e.matches;
    });
  }
  
  toggleMenu() {
    const toggle = document.getElementById('theme-toggle');
    const menu = document.querySelector('.theme-menu');
    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
    
    toggle.setAttribute('aria-expanded', !isExpanded);
    menu.classList.toggle('open', !isExpanded);
    
    if (!isExpanded) {
      // Focus first option
      const firstOption = menu.querySelector('.theme-option');
      if (firstOption) firstOption.focus();
    }
  }
  
  closeMenu() {
    const toggle = document.getElementById('theme-toggle');
    const menu = document.querySelector('.theme-menu');
    
    toggle.setAttribute('aria-expanded', 'false');
    menu.classList.remove('open');
  }
  
  handleKeyboard(e) {
    const { key } = e;
    const toggle = document.getElementById('theme-toggle');
    const menu = document.querySelector('.theme-menu');
    const options = Array.from(menu.querySelectorAll('.theme-option'));
    const currentIndex = options.indexOf(document.activeElement);
    
    switch (key) {
      case 'Escape':
        this.closeMenu();
        toggle.focus();
        break;
        
      case 'Enter':
      case ' ':
        if (e.target === toggle) {
          e.preventDefault();
          this.toggleMenu();
        }
        break;
        
      case 'ArrowDown':
        if (menu.classList.contains('open')) {
          e.preventDefault();
          const nextIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0;
          options[nextIndex].focus();
        }
        break;
        
      case 'ArrowUp':
        if (menu.classList.contains('open')) {
          e.preventDefault();
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1;
          options[prevIndex].focus();
        }
        break;
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new TlachtgaThemeSwitcher();
  });
} else {
  new TlachtgaThemeSwitcher();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TlachtgaThemeSwitcher;
}
