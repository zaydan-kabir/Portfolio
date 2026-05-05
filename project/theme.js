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
    var sword = document.getElementById('panel-2-fig');
    if (!panel || !inner || !sword) return;

    var manifestoText = 'During my years at Stanford, I often thought of Sylvia Plath\u2019s The Bell Jar. Most of the time, I saw my life branching out before me like that fig tree in the story, each fig a beautiful future, beckoning and winking. One is a humanitarian, changing the world one person at a time. Another one was a businessman, with a loving family. Another, a storm chaser with his horse in rural America, working the land and living authentically, and another, a man stuck in a town which slowly drains him of life until he concedes to whatever is demanded of him, coddled by a suffocating comfort. But as I sat at the crotch of that fig tree, starving, each of these figs fell to the ground, rotting at my feet. The words of Marguerite Duras often echoed through my being: \u201cthat very early in my life it was too late.\u201d Studying abroad at the University of Oxford, and then another semester in Washington, changed all of that. I realized that Politics, Philosophy, and Art were my interests. But Design. Design was what I wanted to do for the rest of my life. A search for meaning and inspiration in everything. To create, and not just consume. To put beauty and love back into the world that has given me so much.';

    var stuckFig = document.getElementById('panel-2-uncut-fig');
    if (!stuckFig) {
      stuckFig = document.createElement('img');
      stuckFig.id = 'panel-2-uncut-fig';
      stuckFig.setAttribute('aria-hidden', 'true');
      stuckFig.alt = '';
      panel.insertBefore(stuckFig, panel.firstChild);
    }
    stuckFig.src = 'uploads/Uncut%20Fig%201.png';

    var swordWrap = document.getElementById('panel-2-sword-wrap');
    if (!swordWrap) {
      swordWrap = document.createElement('div');
      swordWrap.id = 'panel-2-sword-wrap';
      panel.appendChild(swordWrap);
    }
    if (sword.parentNode !== swordWrap) swordWrap.appendChild(sword);
    sword.src = 'uploads/Hilt%20Modification%201.png';
    sword.alt = 'Sword hilt modification';

    var style = document.createElement('style');
    style.textContent = [
      '#panel-2-inner{display:block!important;padding:0!important;overflow:hidden!important;}',
      '#panel-2-manifesto{display:none!important;}',
      '#panel-2-manuscript{display:none!important;}',
      '#panel-2 .p2-quote-wrap{display:none!important;}',
      '#panel-2-flow{position:absolute;inset:0;z-index:2;pointer-events:none;}',
      '#panel-2-flow span{position:absolute;white-space:pre;font-family:Lora,Georgia,serif;font-style:italic;font-weight:400;line-height:1;color:rgba(240,240,240,.9);will-change:transform,opacity;}',
      'html[data-theme="light"] #panel-2-flow span{color:rgba(10,10,10,.93);}',
      '#panel-2-flow .p2-flow-attr{font-family:VT323,monospace;font-style:normal;letter-spacing:.08em;color:rgba(240,240,240,.5);will-change:auto;}',
      'html[data-theme="light"] #panel-2-flow .p2-flow-attr{color:rgba(10,10,10,.58);}',
      '#panel-2-uncut-fig{position:absolute!important;right:clamp(20px,4.2vw,66px)!important;bottom:clamp(22px,5vh,70px)!important;left:auto!important;width:clamp(96px,12.5vw,196px)!important;height:auto!important;z-index:4!important;pointer-events:none!important;user-select:none!important;filter:drop-shadow(0 12px 24px rgba(0,0,0,.3));}',
      '#panel-2-sword-wrap{position:absolute!important;left:0;top:0;z-index:6!important;pointer-events:none!important;transform-origin:0 50%;will-change:left,top,transform;}',
      '#panel-2-sword-wrap #panel-2-fig{position:absolute!important;left:0!important;top:50%!important;right:auto!important;bottom:auto!important;width:100%!important;height:auto!important;z-index:1!important;pointer-events:none!important;user-select:none!important;transform:translate(-7%,-50%)!important;transform-origin:7% 52%!important;filter:drop-shadow(0 7px 14px rgba(0,0,0,.24));will-change:transform;}',
      'body.panel-2-pointer-active #trail-canvas{display:none!important;opacity:0!important;}',
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
    var pointerHasMoved = false;
    var releaseStarted = false;
    var releaseDone = false;
    var releaseStart = 0;
    var visibleInPanel = false;
    var lastLayoutKey = '';
    var widthCacheKey = '';
    var widthCache = Object.create(null);
    var flowLetters = [];
    var anchorX = 0;
    var anchorY = 0;
    var tipX = 0;
    var tipY = 0;
    var targetTipX = 0;
    var targetTipY = 0;

    function clamp(value, min, max) {
      return Math.max(min, Math.min(max, value));
    }

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
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

    function getFigRectInPanel() {
      var panelRect = panel.getBoundingClientRect();
      var figRect = stuckFig.getBoundingClientRect();
      var fallbackWidth = clamp((panel.clientWidth || window.innerWidth) * 0.125, 96, 196);
      var width = figRect.width || fallbackWidth;
      var height = figRect.height || width * 0.88;
      var right = figRect.width
        ? (panelRect.right - figRect.right)
        : Math.max(20, (panel.clientWidth || window.innerWidth) * 0.042);
      var bottom = figRect.height
        ? (panelRect.bottom - figRect.bottom)
        : Math.max(22, (panel.clientHeight || window.innerHeight) * 0.05);
      var left = (panel.clientWidth || window.innerWidth) - right - width;
      var top = (panel.clientHeight || window.innerHeight) - bottom - height;
      return { left: left, top: top, width: width, height: height, right: left + width, bottom: top + height };
    }

    function updateAnchor() {
      var figRect = getFigRectInPanel();
      anchorX = figRect.left + figRect.width * 0.42;
      anchorY = figRect.top + figRect.height * 0.43;
      return figRect;
    }

    function defaultTip() {
      var size = panelSize();
      var target = {
        x: anchorX - size.width * (window.innerWidth < 600 ? 0.46 : 0.42),
        y: anchorY - size.height * (window.innerWidth < 600 ? 0.34 : 0.38)
      };
      return clampTip(target.x, target.y);
    }

    function clampTip(x, y) {
      var size = panelSize();
      var margin = window.innerWidth < 600 ? 26 : 44;
      return {
        x: clamp(x, margin, size.width - margin),
        y: clamp(y, margin + 56, size.height - margin)
      };
    }

    function resetSword() {
      updateAnchor();
      var target = defaultTip();
      targetTipX = target.x;
      targetTipY = target.y;
      tipX = anchorX + (target.x - anchorX) * 0.12;
      tipY = anchorY + (target.y - anchorY) * 0.12;
    }

    function beginRelease() {
      if (releaseStarted) return;
      releaseStarted = true;
      releaseDone = false;
      releaseStart = performance.now();
      resetSword();
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
      var point = clampTip(clientX - rect.left, clientY - rect.top);
      pointerHasMoved = true;
      targetTipX = point.x;
      targetTipY = point.y;
      if (!releaseStarted && visibleInPanel) beginRelease();
    }

    document.addEventListener('mousemove', function (event) {
      setTarget(event.clientX, event.clientY);
    });

    document.addEventListener('touchmove', function (event) {
      if (!event.touches.length) return;
      setTarget(event.touches[0].clientX, event.touches[0].clientY);
    }, { passive: true });

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
      var boxWidth = isMobile ? size.width - 34 : Math.min(1000, size.width * 0.78);
      var fontSize = isMobile ? Math.max(10.5, Math.min(12.8, boxWidth * 0.033)) : Math.max(12.5, Math.min(16.8, boxWidth * 0.0158));
      var lineHeight = fontSize * (isMobile ? 1.36 : 1.48);
      var font = 'italic 400 ' + fontSize + 'px Lora, Georgia, serif';
      var lines = buildLines(font, boxWidth);
      var maxHeight = size.height * (isMobile ? 0.78 : 0.72);

      while (fontSize > 10 && lines.length * lineHeight > maxHeight) {
        fontSize -= 0.5;
        lineHeight = fontSize * (isMobile ? 1.34 : 1.46);
        font = 'italic 400 ' + fontSize + 'px Lora, Georgia, serif';
        lines = buildLines(font, boxWidth);
      }

      var attrSize = Math.max(10.5, fontSize * 0.78);
      var attrFont = '400 ' + attrSize + 'px VT323, monospace';
      var textHeight = lines.length * lineHeight + lineHeight * 1.35;
      var startY = Math.max(58, (size.height - textHeight) / 2);
      var boxStart = Math.max(16, (size.width - boxWidth) / 2);
      var layoutKey = [
        Math.round(size.width),
        Math.round(size.height),
        Math.round(boxWidth),
        Math.round(fontSize * 10),
        root.dataset.theme || ''
      ].join(':');

      if (layoutKey === lastLayoutKey) return;
      lastLayoutKey = layoutKey;
      flowLetters = [];

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
          flowLetters.push({ el: span, x: x, y: y, width: w, height: lineHeight });
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

    function shapeTextAroundSword() {
      var dx = tipX - anchorX;
      var dy = tipY - anchorY;
      var len = Math.max(1, Math.sqrt(dx * dx + dy * dy));
      var nx = -dy / len;
      var ny = dx / len;
      var radius = window.innerWidth < 600 ? 17 : 23;
      var core = window.innerWidth < 600 ? 4 : 6;
      var pushMax = window.innerWidth < 600 ? 14 : 24;
      var figRect = getFigRectInPanel();
      var figPad = Math.max(8, figRect.width * 0.04);

      flowLetters.forEach(function (item) {
        var cx = item.x + item.width * 0.5;
        var cy = item.y + item.height * 0.48;
        var t = ((cx - anchorX) * dx + (cy - anchorY) * dy) / (len * len);
        t = clamp(t, 0, 1);
        var px = anchorX + dx * t;
        var py = anchorY + dy * t;
        var signed = (cx - px) * nx + (cy - py) * ny;
        var distance = Math.abs(signed);
        var effect = clamp(1 - distance / radius, 0, 1);
        var side = signed < 0 ? -1 : 1;
        var push = effect * effect * pushMax * side;
        var opacity = distance < core ? 0.16 : clamp(0.38 + (distance / radius) * 0.62, 0.38, 1);

        var figEffect = 0;
        if (cx > figRect.left - figPad && cx < figRect.right + figPad && cy > figRect.top - figPad && cy < figRect.bottom + figPad) {
          figEffect = 1;
        }

        if (effect > 0.01) {
          item.el.style.transform = 'translate(' + (nx * push).toFixed(2) + 'px,' + (ny * push).toFixed(2) + 'px)';
          item.el.style.opacity = opacity.toFixed(3);
        } else if (figEffect) {
          item.el.style.transform = 'translate(-10px,-4px)';
          item.el.style.opacity = '0.24';
        } else {
          item.el.style.transform = 'translate(0px,0px)';
          item.el.style.opacity = '1';
        }
      });
    }

    function checkPanelVisible() {
      var rect = panel.getBoundingClientRect();
      var visibleX = Math.max(0, Math.min(rect.right, window.innerWidth) - Math.max(rect.left, 0));
      var visibleY = Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0));
      var ratio = (visibleX * visibleY) / Math.max(1, rect.width * rect.height);
      visibleInPanel = ratio > 0.14;
      if (visibleInPanel) beginRelease();
    }

    function renderSword() {
      updateAnchor();
      if (!releaseStarted) {
        resetSword();
      } else if (!releaseDone) {
        var target = pointerHasMoved ? { x: targetTipX, y: targetTipY } : defaultTip();
        var elapsed = performance.now() - releaseStart;
        var t = Math.min(1, elapsed / 1100);
        var eased = easeOutCubic(t);
        var wiggle = Math.sin(t * Math.PI * 9) * (1 - t);
        tipX = anchorX + (target.x - anchorX) * (0.1 + eased * 0.9) + wiggle * 8;
        tipY = anchorY + (target.y - anchorY) * (0.1 + eased * 0.9) + Math.cos(t * Math.PI * 8) * (1 - t) * 7;
        if (t >= 1) releaseDone = true;
      } else {
        if (!pointerHasMoved) {
          var fallback = defaultTip();
          targetTipX = fallback.x;
          targetTipY = fallback.y;
        }
        tipX += (targetTipX - tipX) * 0.22;
        tipY += (targetTipY - tipY) * 0.22;
      }

      var dx = tipX - anchorX;
      var dy = tipY - anchorY;
      var distance = Math.max(58, Math.sqrt(dx * dx + dy * dy));
      var angle = Math.atan2(dy, dx) * 180 / Math.PI;
      var size = panelSize();
      var baseWidth = clamp(size.width * (window.innerWidth < 600 ? 0.44 : 0.34), 170, 430);
      var baseHeight = clamp(size.width * (window.innerWidth < 600 ? 0.095 : 0.055), 38, 78);
      var baseReach = baseWidth * 0.86;
      var scaleX = clamp(distance / baseReach, 0.48, 1.62);

      swordWrap.style.width = baseWidth.toFixed(1) + 'px';
      swordWrap.style.height = baseHeight.toFixed(1) + 'px';
      swordWrap.style.left = anchorX.toFixed(1) + 'px';
      swordWrap.style.top = (anchorY - baseHeight * 0.5).toFixed(1) + 'px';
      swordWrap.style.transform = 'rotate(' + angle.toFixed(2) + 'deg) scaleX(' + scaleX.toFixed(3) + ')';
    }

    function animate() {
      renderSword();
      buildTextLayout();
      shapeTextAroundSword();
      requestAnimationFrame(animate);
    }

    stuckFig.addEventListener('load', function () {
      lastLayoutKey = '';
      resetSword();
    });
    sword.addEventListener('load', function () {
      lastLayoutKey = '';
    });

    window.addEventListener('resize', function () {
      lastLayoutKey = '';
      resetSword();
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

    resetSword();
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
