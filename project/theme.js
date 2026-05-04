(function () {
  var storageKey = 'zaydan-theme';
  var root = document.documentElement;

  function getThemeOrder() {
    return ['light', 'dark'];
  }

  function getDefaultTheme() {
    return 'light';
  }

  function normalizeTheme(theme) {
    return theme === 'light' || theme === 'dark' ? theme : getDefaultTheme();
  }

  function getStoredTheme() {
    try {
      return localStorage.getItem(storageKey);
    } catch (err) {
      return null;
    }
  }

  function setStoredTheme(theme) {
    try {
      localStorage.setItem(storageKey, theme);
    } catch (err) {}
  }

  root.dataset.theme = normalizeTheme(getStoredTheme());

  function applyTheme(theme) {
    theme = normalizeTheme(theme);
    root.dataset.theme = theme;
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', theme === 'light' ? '#f0f0f0' : '#0a0a0a');
    }
    var wordmarkFilter = theme === 'light'
      ? 'invert(1) drop-shadow(0 0 22px rgba(0,0,0,0.08))'
      : 'none';
    var textColor = theme === 'light' ? '#0a0a0a' : '#f0f0f0';
    var guideColor = theme === 'light' ? 'rgba(10,10,10,.42)' : 'rgba(255,255,255,.24)';
    document.querySelectorAll('#intro-wordmark, #masthead-reference').forEach(function (img) {
      img.style.filter = wordmarkFilter;
    });
    document.querySelectorAll('#intro-title, #intro-name, #masthead-text, #z-masthead-text').forEach(function (el) {
      el.style.color = textColor;
    });
    document.querySelectorAll('#masthead-guide, #masthead-replay').forEach(function (el) {
      el.style.color = guideColor;
    });
    var toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.querySelectorAll('button[data-theme-option]').forEach(function (button) {
        var active = button.dataset.themeOption === theme;
        button.classList.toggle('active', active);
        button.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
    }
  }

  function initThemeToggle() {
    var theme = normalizeTheme(getStoredTheme());
    applyTheme(theme);

    if (document.getElementById('theme-toggle')) return;

    var toggle = document.createElement('div');
    toggle.id = 'theme-toggle';
    toggle.setAttribute('role', 'group');
    toggle.setAttribute('aria-label', 'Theme');
    getThemeOrder().forEach(function (themeName) {
      var button = document.createElement('button');
      button.type = 'button';
      button.dataset.themeOption = themeName;
      button.textContent = themeName;
      button.addEventListener('click', function () {
        theme = themeName;
        setStoredTheme(theme);
        applyTheme(theme);
      });
      toggle.appendChild(button);
    });
    document.body.appendChild(toggle);
    applyTheme(theme);
  }

  function initPanel2Manifesto() {
    var panel = document.getElementById('panel-2');
    var inner = document.getElementById('panel-2-inner');
    if (!panel || !inner) return;

    var style = document.createElement('style');
    style.textContent = [
      '#panel-2-inner{display:block!important;padding:0!important;overflow:hidden!important;}',
      '#panel-2-manuscript,#panel-2-flow,#panel-2 .p2-quote-wrap{display:none!important;opacity:0!important;visibility:hidden!important;}',
      '#panel-2-manifesto{position:absolute;left:50%;top:52%;width:min(56vw,760px);height:min(74vh,820px);transform:translate(-50%,-50%);z-index:3;border:1px solid color-mix(in srgb,var(--ink) 18%,transparent);background:color-mix(in srgb,var(--bg) 88%,var(--ink) 12%);box-shadow:0 24px 60px rgba(0,0,0,.28);overflow:hidden;}',
      '#panel-2-manifesto object{display:block;width:100%;height:100%;border:0;background:transparent;pointer-events:none;}',
      '#panel-2-manifesto-fallback{height:100%;display:flex;align-items:center;justify-content:center;padding:28px;text-align:center;font-family:Lora,Georgia,serif;font-size:clamp(14px,1.1vw,17px);line-height:1.45;color:var(--ink);}',
      '#panel-2-manifesto-fallback a{color:inherit;text-decoration:none;border-bottom:1px solid currentColor;}',
      '#panel-2-fig{z-index:4!important;}',
      '@media(max-width:600px){#panel-2-manifesto{top:52%;width:min(86vw,430px);height:min(66vh,570px);}}'
    ].join('\n');
    document.head.appendChild(style);

    var existing = document.getElementById('panel-2-manifesto');
    if (existing) return;

    var manifesto = document.createElement('div');
    manifesto.id = 'panel-2-manifesto';
    manifesto.setAttribute('aria-label', 'Design Manifesto');
    manifesto.innerHTML = [
      '<object data="uploads/Design%20Manifesto-2.pdf#toolbar=0&navpanes=0&scrollbar=0" type="application/pdf">',
      '<div id="panel-2-manifesto-fallback">',
      '<a href="uploads/Design%20Manifesto-2.pdf" target="_blank" rel="noopener noreferrer">Open Design Manifesto</a>',
      '</div>',
      '</object>'
    ].join('');
    inner.insertBefore(manifesto, inner.firstChild);
  }

  function initAll() {
    initThemeToggle();
    initPanel2Manifesto();
  }

  if (document.body) initAll();
  else document.addEventListener('DOMContentLoaded', initAll);
})();
