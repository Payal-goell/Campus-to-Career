/**
 * Tiny blocking inline script to run in <head> before CSS or JS bundles.
 * Guarantees zero flash of unstyled content (FOUC).
 */
export const themeInitScript = `(function() {
  try {
    var storedTheme = localStorage.getItem('theme-preference') || 'system';
    var storedPalette = localStorage.getItem('palette-preference') || 'forest';
    var resolved = storedTheme;
    if (storedTheme === 'system') {
      resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    var validPalettes = ['forest', 'ocean', 'ember', 'plum', 'graphite', 'rosewood'];
    if (validPalettes.indexOf(storedPalette) === -1) {
      storedPalette = 'forest';
    }
    var root = document.documentElement;
    root.setAttribute('data-theme', resolved);
    root.setAttribute('data-palette', storedPalette);
    root.style.colorScheme = resolved;

    var themeMeta = document.querySelector('meta[name="theme-color"]');
    if (!themeMeta) {
      themeMeta = document.createElement('meta');
      themeMeta.setAttribute('name', 'theme-color');
      document.head.appendChild(themeMeta);
    }
    var bgColors = {
      forest: { light: '#FAF7F2', dark: '#0B120D' },
      ocean: { light: '#F5FAFC', dark: '#07131A' },
      ember: { light: '#FFF8F1', dark: '#140C08' },
      plum: { light: '#FAF7FD', dark: '#0F0A18' },
      graphite: { light: '#F6F8F8', dark: '#0A0F10' },
      rosewood: { light: '#FFF7FA', dark: '#16090F' }
    };
    var currentBg = (bgColors[storedPalette] && bgColors[storedPalette][resolved]) || (resolved === 'dark' ? '#0B120D' : '#FAF7F2');
    themeMeta.setAttribute('content', currentBg);
  } catch (e) {
    console.error('Theme script initialization failed:', e);
  }
})();`;
