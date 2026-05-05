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
    if (!panel || !inner) return;

    var manifestoText = 'During my years at Stanford, I often thought of Sylvia Plath\u2019s The Bell Jar. Most of the time, I saw my life branching out before me like that fig tree in the story, each fig a beautiful future, beckoning and winking. One is a humanitarian, changing the world one person at a time. Another one was a businessman, with a loving family. Another, a storm chaser with his horse in rural America, working the land and living authentically, and another, a man stuck in a town which slowly drains him of life until he concedes to whatever is demanded of him, coddled by a suffocating comfort. But as I sat at the crotch of that fig tree, starving, each of these figs fell to the ground, rotting at my feet. The words of Marguerite Duras often echoed through my being: \u201cthat very early in my life it was too late.\u201d Studying abroad at the University of Oxford, and then another semester in Washington, changed all of that. I realized that Politics, Philosophy, and Art were my interests. But Design. Design was what I wanted to do for the rest of my life. A search for meaning and inspiration in everything. To create, and not just consume. To put beauty and love back into the world that has given me so much.';

    var oldFig = document.getElementById('panel-2-fig');
    var oldSwordWrap = document.getElementById('panel-2-sword-wrap');
    if (oldFig) oldFig.style.setProperty('display', 'none', 'important');
    if (oldSwordWrap && oldSwordWrap.parentNode) oldSwordWrap.parentNode.removeChild(oldSwordWrap);

    var cornerFig = document.getElementById('panel-2-uncut-fig');
    if (!cornerFig) {
      cornerFig = document.createElement('img');
      cornerFig.id = 'panel-2-uncut-fig';
      cornerFig.alt = '';
      cornerFig.setAttribute('aria-hidden', 'true');
      panel.appendChild(cornerFig);
    }
    cornerFig.src = 'uploads/Uncut%20Fig%201.png';

    var style = document.createElement('style');
    style.textContent = [
      '#panel-2-inner{display:block!important;padding:0!important;overflow:hidden!important;}',
      '#panel-2-manifesto{display:none!important;}',
      '#panel-2-manuscript{display:none!important;}',
      '#panel-2 .p2-quote-wrap{display:none!important;}',
      '#panel-2-fig,#panel-2-sword-wrap{display:none!important;}',
      '#panel-2-uncut-fig{display:block!important;position:absolute!important;right:clamp(20px,4.2vw,66px)!important;bottom:clamp(22px,5vh,70px)!important;left:auto!important;width:clamp(96px,12.5vw,196px)!important;height:auto!important;z-index:4!important;pointer-events:none!important;user-select:none!important;filter:drop-shadow(0 12px 24px rgba(0,0,0,.3));}',
      '#panel-2-flow{position:absolute;inset:0;z-index:2;pointer-events:none;}',
      '#panel-2-flow span{position:absolute;white-space:pre;font-family:Lora,Georgia,serif;font-style:italic;font-weight:400;line-height:1;color:rgba(240,240,240,.9);will-change:transform,opacity;}',
      'html[data-theme="light"] #panel-2-flow span{color:rgba(10,10,10,.93);}',
      '#panel-2-flow .p2-flow-attr{font-family:VT323,monospace;font-style:normal;letter-spacing:.08em;color:rgba(240,240,240,.5);will-change:auto;}',
      'html[data-theme="light"] #panel-2-flow .p2-flow-attr{color:rgba(10,10,10,.58);}',
      '@media(max-width:600px){#panel-2-uncut-fig{right:18px!important;bottom:24px!important;width:clamp(78px,24vw,118px)!important;}#panel-2-flow span{white-space:pre;}}'
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
    var lastLayoutKey = '';
    var widthCacheKey = '';
    var widthCache = Object.create(null);
    var letters = [];
    var pointerActive = false;
    var targetX = 0;
    var targetY = 0;
    var fieldX = 0;
    var fieldY = 0;

    function clamp(value, min, max) {
      return Math.max(min, Math.min(max, value));
    }

    function textWidth(value, font) {
      ctx.font = font;
      return ctx.measureText(value).width;
    }

    function charWidth(ch, font) {
      if (font !== widthCacheKey) {
        widthCacheKey = font;
        widthCache = Object.create(null);
      }
      if (widthCache[ch] == null) widthCache[ch] = textWidth(ch, font);
      return widthCache[ch];
    }

    function panelSize() {
      return {
        width: Math.max(1, panel.clientWidth || window.innerWidth),
        height: Math.max(1, panel.clientHeight || window.innerHeight)
      };
    }

    function setPointer(clientX, clientY) {
      var rect = panel.getBoundingClientRect();
      var active = clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
      pointerActive = active;
      if (!active) return;
      var size = panelSize();
      targetX = clamp(clientX - rect.left, 0, size.width);
      targetY = clamp(clientY - rect.top, 0, size.height);
      if (!fieldX && !fieldY) {
        fieldX = targetX;
        fieldY = targetY;
      }
    }

    document.addEventListener('mousemove', function (event) {
      setPointer(event.clientX, event.clientY);
    });

    document.addEventListener('touchmove', function (event) {
      if (!event.touches.length) return;
      setPointer(event.touches[0].clientX, event.touches[0].clientY);
    }, { passive: true });

    document.addEventListener('mouseleave', function () {
      pointerActive = false;
    });

    function buildLines(font, boxWidth) {
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
      return lines;
    }

    function buildTextLayout() {
      var size = panelSize();
      var isMobile = window.innerWidth < 600;
      var figRect = cornerFig.getBoundingClientRect();
      var panelRect = panel.getBoundingClientRect();
      var figTop = figRect.height ? figRect.top - panelRect.top : size.height;
      var boxWidth = isMobile ? size.width - 34 : Math.min(1000, size.width * 0.78);
      var fontSize = isMobile ? Math.max(10.5, Math.min(12.8, boxWidth * 0.033)) : Math.max(12.5, Math.min(16.8, boxWidth * 0.0158));
      var lineHeight = fontSize * (isMobile ? 1.36 : 1.48);
      var font = 'italic 400 ' + fontSize + 'px Lora, Georgia, serif';
      var lines = buildLines(font, boxWidth);
      var maxHeight = Math.min(size.height * (isMobile ? 0.78 : 0.72), Math.max(260, figTop - 72));

      while (fontSize > 10 && lines.length * lineHeight > maxHeight) {
        fontSize -= 0.5;
        lineHeight = fontSize * (isMobile ? 1.34 : 1.46);
        font = 'italic 400 ' + fontSize + 'px Lora, Georgia, serif';
        lines = buildLines(font, boxWidth);
      }

      var attrSize = Math.max(10.5, fontSize * 0.78);
      var attrFont = '400 ' + attrSize + 'px VT323, monospace';
      var textHeight = lines.length * lineHeight + lineHeight * 1.35;
      var availableBottom = Math.min(size.height - 42, figTop - 34);
      var startY = Math.max(58, (availableBottom - textHeight) / 2 + 24);
      var boxStart = Math.max(16, (size.width - boxWidth) / 2);
      var layoutKey = [
        Math.round(size.width),
        Math.round(size.height),
        Math.round(boxWidth),
        Math.round(fontSize * 10),
        Math.round(figTop),
        root.dataset.theme || ''
      ].join(':');

      if (layoutKey === lastLayoutKey) return;
      lastLayoutKey = layoutKey;
      letters = [];

      var frag = document.createDocumentFragment();
      flow.replaceChildren();
      flow.style.width = size.width + 'px';
      flow.style.height = size.height + 'px';

      lines.forEach(function (lineText, lineIndex) {
        var lineWidth = textWidth(lineText, font);
        var x = boxStart + Math.max(0, (boxWidth - lineWidth) / 2);
        var y = startY + lineIndex * lineHeight;
        for (var i = 0; i < lineText.length; i += 1) {
          var ch = lineText[i];
          var w = charWidth(ch, font);
          var span = document.createElement('span');
          span.textContent = ch;
          span.style.left = x.toFixed(1) + 'px';
          span.style.top = y.toFixed(1) + 'px';
          span.style.fontSize = fontSize.toFixed(1) + 'px';
          frag.appendChild(span);
          letters.push({ el: span, x: x, y: y, width: w, height: lineHeight, ox: 0, oy: 0, opacity: 1 });
          x += w;
        }
      });

      var attrSpan = document.createElement('span');
      var attrWidth = textWidth(attribution, attrFont);
      attrSpan.className = 'p2-flow-attr';
      attrSpan.textContent = attribution;
      attrSpan.style.left = Math.max(0, (size.width - attrWidth) / 2).toFixed(1) + 'px';
      attrSpan.style.top = (startY + lines.length * lineHeight + lineHeight * 0.5).toFixed(1) + 'px';
      attrSpan.style.fontSize = attrSize.toFixed(1) + 'px';
      frag.appendChild(attrSpan);

      flow.appendChild(frag);
    }

    function shapeTextAroundPointer() {
      var radius = window.innerWidth < 600 ? 64 : 92;
      var core = window.innerWidth < 600 ? 16 : 24;
      var pushMax = window.innerWidth < 600 ? 24 : 38;
      if (pointerActive) {
        fieldX += (targetX - fieldX) * 0.2;
        fieldY += (targetY - fieldY) * 0.2;
      }

      letters.forEach(function (item) {
        var nextX = 0;
        var nextY = 0;
        var nextOpacity = 1;
        if (pointerActive) {
          var cx = item.x + item.width * 0.5;
          var cy = item.y + item.height * 0.48;
          var dx = cx - fieldX;
          var dy = cy - fieldY;
          var distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < radius) {
            var strength = 1 - distance / radius;
            var unitX = distance > 0.001 ? dx / distance : 0;
            var unitY = distance > 0.001 ? dy / distance : -1;
            var push = strength * strength * pushMax;
            nextX = unitX * push;
            nextY = unitY * push;
            nextOpacity = distance < core ? 0.22 : clamp(0.46 + distance / radius * 0.54, 0.46, 1);
          }
        }

        item.ox += (nextX - item.ox) * 0.26;
        item.oy += (nextY - item.oy) * 0.26;
        item.opacity += (nextOpacity - item.opacity) * 0.22;
        item.el.style.transform = 'translate(' + item.ox.toFixed(2) + 'px,' + item.oy.toFixed(2) + 'px)';
        item.el.style.opacity = item.opacity.toFixed(3);
      });
    }

    function animate() {
      buildTextLayout();
      shapeTextAroundPointer();
      requestAnimationFrame(animate);
    }

    cornerFig.addEventListener('load', function () {
      lastLayoutKey = '';
    });

    window.addEventListener('resize', function () {
      lastLayoutKey = '';
    });

    requestAnimationFrame(animate);
  }

  function initAll() {
    initThemeToggle();
    initPanel2Manuscript();
  }

  if (document.body) initAll();
  else document.addEventListener('DOMContentLoaded', initAll);
})();
