(function () {
  var storageKey = 'zaydan-theme';
  var root = document.documentElement;

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
    if (meta) meta.setAttribute('content', theme === 'light' ? '#f0f0f0' : '#0a0a0a');

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

    ['light', 'dark'].forEach(function (themeName) {
      var button = document.createElement('button');
      button.type = 'button';
      button.dataset.themeOption = themeName;
      button.textContent = themeName;
      button.addEventListener('click', function () {
        setStoredTheme(themeName);
        applyTheme(themeName);
      });
      toggle.appendChild(button);
    });

    document.body.appendChild(toggle);
    applyTheme(theme);
  }

  function initPanel2Manuscript() {
    var panel = document.getElementById('panel-2');
    var inner = document.getElementById('panel-2-inner');
    var fig = document.getElementById('panel-2-fig');
    if (!panel || !inner || !fig) return;

    var manifestoText = 'During my years at Stanford, I often thought of Sylvia Plath\u2019s The Bell Jar. Most of the time, I saw my life branching out before me like that fig tree in the story, each fig a beautiful future, beckoning and winking. One is a humanitarian, changing the world one person at a time. Another one was a businessman, with a loving family. Another, a storm chaser with his horse in rural America, working the land and living authentically, and another, a man stuck in a town which slowly drains him of life until he concedes to whatever is demanded of him, coddled by a suffocating comfort. But as I sat at the crotch of that fig tree, starving, each of these figs fell to the ground, rotting at my feet. The words of Marguerite Duras often echoed through my being: \u201cthat very early in my life it was too late.\u201d Studying abroad at the University of Oxford, and then another semester in Washington, changed all of that. I realized that Politics, Philosophy, and Art were my interests. But Design. Design was what I wanted to do for the rest of my life. A search for meaning and inspiration in everything. To create, and not just consume. To put beauty and love back into the world that has given me so much.';

    fig.src = 'uploads/Hilt%20Modification%201.png';
    fig.alt = 'Hilt modification';

    var style = document.createElement('style');
    style.textContent = [
      '#panel-2-inner{display:block!important;padding:0!important;overflow:hidden!important;}',
      '#panel-2-manifesto{display:none!important;}',
      '#panel-2-manuscript{display:none!important;}',
      '#panel-2 .p2-quote-wrap{display:none!important;}',
      '#panel-2-flow{position:absolute;z-index:2;pointer-events:none;}',
      '#panel-2-flow span{position:absolute;white-space:pre;font-family:Lora,Georgia,serif;font-style:italic;font-weight:400;line-height:1;color:rgba(240,240,240,.88);text-align:center;}',
      'html[data-theme="light"] #panel-2-flow span{color:rgba(10,10,10,.92);}',
      '#panel-2-flow .p2-flow-attr{font-family:VT323,monospace;font-style:normal;letter-spacing:.08em;color:rgba(240,240,240,.5);}',
      'html[data-theme="light"] #panel-2-flow .p2-flow-attr{color:rgba(10,10,10,.58);}',
      '#panel-2-fig{position:absolute!important;left:auto!important;top:auto!important;right:auto!important;bottom:auto!important;width:clamp(104px,13vw,210px)!important;height:auto!important;z-index:5!important;pointer-events:none!important;transform:translate(-50%,-50%) rotate(var(--p2-hilt-rotate,0deg))!important;filter:drop-shadow(0 12px 22px rgba(0,0,0,.3));will-change:left,top,transform;}',
      'body.panel-2-pointer-active #trail-canvas{display:none!important;opacity:0!important;}',
      '@media(max-width:600px){#panel-2-flow span{white-space:pre-wrap;}#panel-2-fig{width:clamp(78px,25vw,128px)!important;}}'
    ].join('\n');
    document.head.appendChild(style);

    var flow = document.getElementById('panel-2-flow');
    if (!flow) {
      flow = document.createElement('div');
      flow.id = 'panel-2-flow';
      flow.setAttribute('aria-hidden', 'true');
      inner.insertBefore(flow, inner.firstChild);
    }

    var measureCanvas = document.createElement('canvas');
    var ctx = measureCanvas.getContext('2d');
    var words = manifestoText.split(/\s+/);
    var attribution = 'Design Manifesto';
    var pointerHasMoved = false;
    var releaseStarted = false;
    var releaseDone = false;
    var releaseStart = 0;
    var visibleInPanel = false;
    var lastLayoutKey = '';
    var figX = 0;
    var figY = 0;
    var targetX = 0;
    var targetY = 0;
    var currentRotation = 0;

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function textWidth(value, font) {
      ctx.font = font;
      return ctx.measureText(value).width;
    }

    function getAnchor() {
      var panelWidth = Math.max(1, panel.clientWidth || window.innerWidth);
      var panelHeight = Math.max(1, panel.clientHeight || window.innerHeight);
      var figWidth = Math.max(90, fig.getBoundingClientRect().width || panelWidth * 0.13);
      var marginX = Math.max(26, figWidth * 0.62);
      var marginY = Math.max(28, figWidth * 0.5);
      return {
        x: panelWidth - marginX,
        y: panelHeight - marginY
      };
    }

    function clampToPanel(x, y) {
      var panelWidth = Math.max(1, panel.clientWidth || window.innerWidth);
      var panelHeight = Math.max(1, panel.clientHeight || window.innerHeight);
      var figWidth = Math.max(90, fig.getBoundingClientRect().width || panelWidth * 0.13);
      var marginX = Math.max(22, figWidth * 0.48);
      var marginY = Math.max(26, figWidth * 0.42);
      return {
        x: Math.max(marginX, Math.min(panelWidth - marginX, x)),
        y: Math.max(marginY, Math.min(panelHeight - marginY, y))
      };
    }

    function placeAtAnchor() {
      var anchor = getAnchor();
      figX = anchor.x;
      figY = anchor.y;
      targetX = anchor.x;
      targetY = anchor.y;
      currentRotation = 0;
      fig.style.setProperty('left', figX.toFixed(1) + 'px', 'important');
      fig.style.setProperty('top', figY.toFixed(1) + 'px', 'important');
      fig.style.setProperty('--p2-hilt-rotate', '0deg');
    }

    function beginRelease() {
      if (releaseStarted) return;
      releaseStarted = true;
      releaseDone = false;
      releaseStart = performance.now();
      placeAtAnchor();
    }

    function setPanelPointerState(clientX, clientY) {
      var rect = panel.getBoundingClientRect();
      var active = clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
      document.body.classList.toggle('panel-2-pointer-active', active);
      if (active) {
        var trail = document.getElementById('trail-canvas');
        if (trail && trail.getContext) trail.getContext('2d').clearRect(0, 0, trail.width, trail.height);
      }
      return active;
    }

    function setTarget(clientX, clientY) {
      if (!setPanelPointerState(clientX, clientY)) return;
      var rect = panel.getBoundingClientRect();
      var point = clampToPanel(clientX - rect.left, clientY - rect.top);
      pointerHasMoved = true;
      targetX = point.x;
      targetY = point.y;
      if (!releaseStarted && visibleInPanel) beginRelease();
    }

    document.addEventListener('mousemove', function (event) {
      setTarget(event.clientX, event.clientY);
    });

    document.addEventListener('touchmove', function (event) {
      if (!event.touches.length) return;
      setTarget(event.touches[0].clientX, event.touches[0].clientY);
    }, { passive: true });

    function buildCenteredLayout() {
      var panelWidth = Math.max(1, panel.clientWidth || window.innerWidth);
      var panelHeight = Math.max(1, panel.clientHeight || window.innerHeight);
      var isMobile = window.innerWidth < 600;
      var boxWidth = isMobile ? panelWidth - 42 : Math.min(980, panelWidth * 0.76);
      var fontSize = Math.max(12, Math.min(isMobile ? 15 : 18, boxWidth * (isMobile ? 0.04 : 0.017)));
      var lineHeight = fontSize * (isMobile ? 1.5 : 1.55);
      var font = 'italic 400 ' + fontSize + 'px Lora, Georgia, serif';
      var attrSize = Math.max(11, fontSize * 0.78);
      var attrFont = '400 ' + attrSize + 'px VT323, monospace';
      var layoutKey = [Math.round(panelWidth), Math.round(panelHeight), Math.round(boxWidth), Math.round(fontSize), root.dataset.theme || ''].join(':');

      if (layoutKey === lastLayoutKey) return;
      lastLayoutKey = layoutKey;

      var lines = [];
      var line = '';
      words.forEach(function (word) {
        var proposed = line ? line + ' ' + word : word;
        if (line && textWidth(proposed, font) > boxWidth) {
          lines.push(line);
          line = word;
        } else {
          line = proposed;
        }
      });
      if (line) lines.push(line);

      var totalHeight = lines.length * lineHeight + lineHeight * 1.25;
      var startY = Math.max(0, (panelHeight - totalHeight) / 2);
      var startX = Math.max(0, (panelWidth - boxWidth) / 2);
      var frag = document.createDocumentFragment();

      flow.replaceChildren();
      flow.style.left = '0px';
      flow.style.top = '0px';
      flow.style.width = panelWidth + 'px';
      flow.style.height = panelHeight + 'px';

      lines.forEach(function (lineText, index) {
        var span = document.createElement('span');
        var width = textWidth(lineText, font);
        span.textContent = lineText;
        span.style.left = (startX + Math.max(0, (boxWidth - width) / 2)).toFixed(1) + 'px';
        span.style.top = (startY + index * lineHeight).toFixed(1) + 'px';
        span.style.fontSize = fontSize.toFixed(1) + 'px';
        frag.appendChild(span);
      });

      var attrSpan = document.createElement('span');
      var attrWidth = textWidth(attribution, attrFont);
      attrSpan.className = 'p2-flow-attr';
      attrSpan.textContent = attribution;
      attrSpan.style.left = Math.max(0, (panelWidth - attrWidth) / 2).toFixed(1) + 'px';
      attrSpan.style.top = (startY + lines.length * lineHeight + lineHeight * 0.5).toFixed(1) + 'px';
      attrSpan.style.fontSize = attrSize.toFixed(1) + 'px';
      frag.appendChild(attrSpan);

      flow.appendChild(frag);
    }

    function checkPanelVisible() {
      var rect = panel.getBoundingClientRect();
      var visibleX = Math.max(0, Math.min(rect.right, window.innerWidth) - Math.max(rect.left, 0));
      var visibleY = Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0));
      var ratio = (visibleX * visibleY) / Math.max(1, rect.width * rect.height);
      visibleInPanel = ratio > 0.14;
      if (visibleInPanel) beginRelease();
    }

    function animate() {
      buildCenteredLayout();
      if (!releaseStarted) {
        placeAtAnchor();
      } else if (!releaseDone) {
        var anchor = getAnchor();
        var elapsed = performance.now() - releaseStart;
        var t = Math.min(1, elapsed / 1350);
        var eased = easeOutCubic(t);
        var loosen = Math.sin(t * Math.PI * 11) * (1 - t);
        var lift = 30 * eased;
        var pull = 38 * eased;
        figX = anchor.x - pull + loosen * 18;
        figY = anchor.y - lift + Math.cos(t * Math.PI * 13) * (1 - t) * 12;
        currentRotation = loosen * 13;
        if (t >= 1) {
          releaseDone = true;
          var resting = pointerHasMoved ? clampToPanel(targetX, targetY) : clampToPanel(figX, figY);
          targetX = resting.x;
          targetY = resting.y;
          currentRotation = 0;
        }
      } else {
        figX += (targetX - figX) * 0.16;
        figY += (targetY - figY) * 0.16;
        currentRotation += (0 - currentRotation) * 0.18;
      }

      fig.style.setProperty('left', figX.toFixed(1) + 'px', 'important');
      fig.style.setProperty('top', figY.toFixed(1) + 'px', 'important');
      fig.style.setProperty('--p2-hilt-rotate', currentRotation.toFixed(2) + 'deg');
      requestAnimationFrame(animate);
    }

    fig.addEventListener('load', function () {
      lastLayoutKey = '';
      if (!releaseStarted) placeAtAnchor();
    });

    window.addEventListener('resize', function () {
      lastLayoutKey = '';
      if (!releaseDone) {
        placeAtAnchor();
        if (releaseStarted) releaseStart = performance.now();
      } else {
        var point = clampToPanel(targetX, targetY);
        targetX = point.x;
        targetY = point.y;
      }
      checkPanelVisible();
    });
    window.addEventListener('scroll', checkPanelVisible, { passive: true });

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          visibleInPanel = entry.isIntersecting && entry.intersectionRatio > 0.14;
          if (visibleInPanel) beginRelease();
        });
      }, { threshold: [0, 0.14, 0.28] });
      observer.observe(panel);
    }

    placeAtAnchor();
    checkPanelVisible();
    requestAnimationFrame(animate);
  }

  function initAll() {
    initThemeToggle();
    initPanel2Manuscript();
  }

  if (document.body) initAll();
  else document.addEventListener('DOMContentLoaded', initAll);
})();
