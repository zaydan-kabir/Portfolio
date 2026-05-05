(function () {
  var storageKey = 'zaydan-theme';
  var root = document.documentElement;
  var panelTwoVersion = '20260505-panel-text-sync';

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
    panel.dataset.panelTwoVersion = panelTwoVersion;

    var manifestoText = [
      'During my years at Stanford, I often returned to Sylvia Plath\u2019s The Bell Jar. I imagined my life much like that fig tree in the novel, each fig hanging before me as a different future. There was the life spent in service of others, trying in some small way to lessen injustice. There was the life of stability, success, and family. There was the fantasy of retreat, of distance from ambition and noise. And there was, too, the far less visible danger of drifting into a life that was comfortable enough to remain in, but not alive enough to feel proud of. For a long time, I found myself suspended between these possibilities, unable to commit to any one of them without feeling I was betraying the others. In moments like that, I often thought of Marguerite Duras\u2019s line: \u201cthat very early in my life it was too late.\u201d',
      'My semester at the University of Oxford, followed by another in Washington, altered something fundamental in me. Distance has a way of clarifying what familiarity obscures. Removed from the habits and rhythms of Stanford, I began to understand that politics, philosophy, and art were not simply subjects I loved, but different vocabularies through which I had always tried to make sense of the world. Design, however, emerged as something more than an interest. It felt like a mode of attention, a way of looking closely enough at people, systems, and objects to imagine how they might be made better. For the first time, I had found not just what compelled me, but the form through which that compulsion could become real.',
      'Since then, design has come to represent for me a search for meaning in the everyday: the possibility of creating rather than merely consuming, of shaping experiences rather than simply moving through them, and of returning something thoughtful, useful, and beautiful to a world that has given me so much.'
    ].join(' ');

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
      '#panel-2-uncut-fig{display:block!important;position:absolute!important;right:clamp(18px,4vw,64px)!important;bottom:clamp(104px,9vw,150px)!important;left:auto!important;width:clamp(54px,7vw,96px)!important;height:auto!important;z-index:4!important;pointer-events:none!important;user-select:none!important;filter:drop-shadow(0 12px 24px rgba(0,0,0,.3));}',
      '#panel-2-flow{position:absolute;inset:0;z-index:5;pointer-events:none;}',
      '#panel-2-flow span{position:absolute;white-space:pre;font-family:Lora,Georgia,serif;font-style:italic;font-weight:400;line-height:1;color:rgba(240,240,240,.92);will-change:transform;}',
      'html[data-theme="light"] #panel-2-flow span{color:rgba(10,10,10,.94);}',
      '#panel-2-flow .p2-flow-attr{font-family:VT323,monospace;font-style:normal;letter-spacing:.08em;color:rgba(240,240,240,.5);}',
      'html[data-theme="light"] #panel-2-flow .p2-flow-attr{color:rgba(10,10,10,.58);}',
      '@media(max-width:600px){#panel-2-uncut-fig{right:14px!important;bottom:96px!important;width:min(18vw,64px)!important;}#panel-2-flow span{white-space:pre;}}'
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
      var cacheKey = font + '|canvas';
      if (cacheKey !== widthCacheKey) {
        widthCacheKey = cacheKey;
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
      words.forEach(function (word, index) {
        var token = index === words.length - 1 ? word : word + ' ';
        var proposed = line + token;
        if (line && textWidth(proposed, font) > boxWidth) {
          lines.push(line.trimEnd());
          line = token;
        } else {
          line = proposed;
        }
      });
      if (line) lines.push(line.trimEnd());
      return lines;
    }

    function buildTextLayout() {
      var size = panelSize();
      var isMobile = window.innerWidth < 600;
      var boxWidth = isMobile ? size.width - 32 : Math.min(1040, size.width * 0.8);
      var fontSize = isMobile ? Math.max(10, Math.min(12.4, boxWidth * 0.032)) : Math.max(12, Math.min(16.4, boxWidth * 0.0156));
      var lineHeight = fontSize * (isMobile ? 1.34 : 1.46);
      var font = 'italic 400 ' + fontSize + 'px Lora, Georgia, serif';
      var lines = buildLines(font, boxWidth);
      var maxHeight = size.height * (isMobile ? 0.76 : 0.68);

      while (fontSize > 9.5 && lines.length * lineHeight > maxHeight) {
        fontSize -= 0.45;
        lineHeight = fontSize * (isMobile ? 1.32 : 1.44);
        font = 'italic 400 ' + fontSize + 'px Lora, Georgia, serif';
        lines = buildLines(font, boxWidth);
      }

      var attrSize = Math.max(10, fontSize * 0.78);
      var attrFont = '400 ' + attrSize + 'px VT323, monospace';
      var textHeight = lines.length * lineHeight + lineHeight * 1.35;
      var startY = (size.height - textHeight) / 2;
      var boxStart = Math.max(16, (size.width - boxWidth) / 2);
      var layoutKey = [
        Math.round(size.width),
        Math.round(size.height),
        Math.round(boxWidth),
        Math.round(fontSize * 10),
        'canvas',
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
          var width = charWidth(ch, font);
          var span = document.createElement('span');
          span.textContent = ch;
          span.style.left = x.toFixed(1) + 'px';
          span.style.top = y.toFixed(1) + 'px';
          span.style.fontSize = fontSize.toFixed(1) + 'px';
          span.style.opacity = '1';
          frag.appendChild(span);
          letters.push({ el: span, x: x, y: y, width: width, height: lineHeight, ox: 0, oy: 0 });
          x += width;
        }
      });

      var attrSpan = document.createElement('span');
      var attrWidth = textWidth(attribution, attrFont);
      attrSpan.className = 'p2-flow-attr';
      attrSpan.textContent = attribution;
      attrSpan.style.left = Math.max(0, (size.width - attrWidth) / 2).toFixed(1) + 'px';
      attrSpan.style.top = (startY + lines.length * lineHeight + lineHeight * 0.52).toFixed(1) + 'px';
      attrSpan.style.fontSize = attrSize.toFixed(1) + 'px';
      frag.appendChild(attrSpan);

      flow.appendChild(frag);
    }

    function moveLettersAwayFromPointer() {
      var radius = window.innerWidth < 600 ? 58 : 86;
      var pushMax = window.innerWidth < 600 ? 34 : 52;
      if (pointerActive) {
        fieldX += (targetX - fieldX) * 0.34;
        fieldY += (targetY - fieldY) * 0.34;
      }

      letters.forEach(function (item) {
        var nextX = 0;
        var nextY = 0;
        if (pointerActive) {
          var cx = item.x + item.width * 0.5;
          var cy = item.y + item.height * 0.48;
          var dx = cx - fieldX;
          var dy = cy - fieldY;
          var distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < radius) {
            var strength = 1 - distance / radius;
            var angle = distance > 0.001 ? Math.atan2(dy, dx) : -Math.PI / 2;
            var push = strength * strength * pushMax;
            nextX = Math.cos(angle) * push;
            nextY = Math.sin(angle) * push;
          }
        }

        item.ox += (nextX - item.ox) * 0.32;
        item.oy += (nextY - item.oy) * 0.32;
        item.el.style.transform = 'translate3d(' + item.ox.toFixed(2) + 'px,' + item.oy.toFixed(2) + 'px,0)';
        item.el.style.opacity = '1';
      });
    }

    function animate() {
      buildTextLayout();
      moveLettersAwayFromPointer();
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
