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

  function initPanel2Manuscript() {
    var panel = document.getElementById('panel-2');
    var inner = document.getElementById('panel-2-inner');
    var fig = document.getElementById('panel-2-fig');
    if (!panel || !inner || !fig) return;

    var manifestoText = [
      'Design is not decoration after the fact. Design is the way a question becomes visible, the way a system reveals its pressure points, and the way an idea learns how to meet another person without demanding translation first.',
      'I believe that design begins with attention. It begins before the interface, before the object, before the poster, before the pitch. It begins in the patient work of noticing what people already carry: habits, constraints, fears, rituals, language, memory, dignity, and the quiet workarounds that make daily life possible.',
      'A good designer does not arrive as a hero. A good designer arrives as a listener. The task is not to impose clarity from above but to build conditions where clarity can surface from within the mess. The task is to make complexity navigable without flattening it into something false.',
      'I want my work to be useful and strange at the same time. Useful enough to hold weight, strange enough to make someone pause. I want interfaces that feel humane, research that becomes legible, systems that admit where they fail, and visual language that remembers the people standing inside the structure.',
      'Design should widen access. Design should make bureaucracy less violent. Design should turn information into agency. Design should give people routes through institutions that were not built with them in mind. Design should not confuse elegance with emptiness, nor polish with truth.',
      'The best work is made in relation: between designer and community, between image and infrastructure, between emotion and evidence, between what is beautiful and what is materially consequential. A manifesto is not a promise of certainty. It is a record of commitments, revised each time the work meets the world.',
      'I design to make systems more accountable, stories more reachable, and futures more imaginable. I design because form changes how people move. I design because the smallest interaction can disclose a larger politics. I design because every fig on the branch asks for a life, and choosing with care is also a kind of making.'
    ].join(' ');

    var style = document.createElement('style');
    style.textContent = [
      '#panel-2-inner{display:block!important;padding:0!important;overflow:hidden!important;}',
      '#panel-2-manifesto{display:none!important;}',
      '#panel-2-manuscript{position:absolute;z-index:1;display:block;pointer-events:none;opacity:0!important;}',
      '#panel-2-flow{position:absolute;z-index:2;pointer-events:none;}',
      '#panel-2-flow span{position:absolute;white-space:pre;font-family:Lora,Georgia,serif;font-style:italic;font-weight:400;line-height:1;color:rgba(240,240,240,.86);}',
      'html[data-theme="light"] #panel-2-flow span{color:rgba(10,10,10,.9);}',
      '#panel-2-flow .p2-flow-attr{font-family:VT323,monospace;font-style:normal;letter-spacing:.08em;color:rgba(240,240,240,.5);}',
      'html[data-theme="light"] #panel-2-flow .p2-flow-attr{color:rgba(10,10,10,.56);}',
      '#panel-2 .p2-quote-wrap{display:none!important;}',
      '#panel-2-fig{left:50%!important;top:50%!important;right:auto!important;bottom:auto!important;width:clamp(88px,11vw,170px)!important;z-index:4!important;transform:translate(-50%,-50%)!important;filter:drop-shadow(0 12px 22px rgba(0,0,0,.28));will-change:left,top;}',
      'body.panel-2-pointer-active #trail-canvas{display:none!important;opacity:0!important;}',
      '@media(max-width:600px){#panel-2-fig{width:clamp(70px,24vw,105px)!important;}}'
    ].join('\n');
    document.head.appendChild(style);

    var canvas = document.getElementById('panel-2-manuscript');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'panel-2-manuscript';
      canvas.setAttribute('aria-hidden', 'true');
      inner.insertBefore(canvas, inner.firstChild);
    }
    var ctx = canvas.getContext('2d');
    var flow = document.getElementById('panel-2-flow');
    if (!flow) {
      flow = document.createElement('div');
      flow.id = 'panel-2-flow';
      flow.setAttribute('aria-hidden', 'true');
      inner.insertBefore(flow, canvas.nextSibling);
    }

    var words = manifestoText.split(/\s+/);
    var attribution = 'Design Manifesto';
    var isMobile = window.innerWidth < 600;
    var figX = panel.clientWidth * 0.5;
    var figY = -Math.max(180, panel.clientHeight * 0.22);
    var targetX = figX;
    var targetY = panel.clientHeight * 0.5;
    var dropStarted = false;
    var dropActive = false;
    var dropVelocity = 0;
    var pointerHasMoved = false;
    var lastLayoutKey = '';

    function textWidth(value, font) {
      ctx.font = font;
      return ctx.measureText(value).width;
    }

    function getFigArtRect(figRect) {
      return {
        left: figRect.left + figRect.width * 0.15,
        top: figRect.top + figRect.height * 0.25,
        width: figRect.width * 0.7,
        height: figRect.height * 0.48
      };
    }

    function setTarget(clientX, clientY) {
      var rect = panel.getBoundingClientRect();
      var figRect = fig.getBoundingClientRect();
      var artRect = getFigArtRect(figRect);
      var marginX = artRect.width * 0.5;
      var marginY = artRect.height * 0.5;
      pointerHasMoved = true;
      dropStarted = true;
      dropActive = false;
      targetX = Math.max(marginX, Math.min(rect.width - marginX, clientX - rect.left));
      targetY = Math.max(marginY + 70, Math.min(rect.height - marginY, clientY - rect.top));
    }

    function resetDropStart() {
      figX = panel.clientWidth * 0.5;
      figY = -Math.max(180, panel.clientHeight * 0.22);
      targetX = figX;
      targetY = panel.clientHeight * 0.5;
      dropVelocity = 0;
      lastLayoutKey = '';
    }

    function beginDrop() {
      if (dropStarted || pointerHasMoved) return;
      dropStarted = true;
      dropActive = true;
      resetDropStart();
    }

    function checkPanelVisible() {
      if (dropStarted || pointerHasMoved) return;
      var rect = panel.getBoundingClientRect();
      var visibleX = Math.max(0, Math.min(rect.right, window.innerWidth) - Math.max(rect.left, 0));
      var visibleY = Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0));
      var area = Math.max(1, rect.width * rect.height);
      if ((visibleX * visibleY) / area > 0.14) beginDrop();
    }

    function setPanelPointerState(clientX, clientY) {
      var rect = panel.getBoundingClientRect();
      var active = clientX >= rect.left && clientX <= rect.right &&
        clientY >= rect.top && clientY <= rect.bottom;
      document.body.classList.toggle('panel-2-pointer-active', active);
      if (active) {
        var trail = document.getElementById('trail-canvas');
        if (trail && trail.getContext) {
          trail.getContext('2d').clearRect(0, 0, trail.width, trail.height);
        }
      }
    }

    document.addEventListener('mousemove', function (event) {
      var rect = panel.getBoundingClientRect();
      setPanelPointerState(event.clientX, event.clientY);
      if (event.clientX >= rect.left && event.clientX <= rect.right &&
          event.clientY >= rect.top && event.clientY <= rect.bottom) {
        setTarget(event.clientX, event.clientY);
      }
    });

    document.addEventListener('touchmove', function (event) {
      if (!event.touches.length) return;
      var touch = event.touches[0];
      var rect = panel.getBoundingClientRect();
      if (touch.clientX >= rect.left && touch.clientX <= rect.right &&
          touch.clientY >= rect.top && touch.clientY <= rect.bottom) {
        setTarget(touch.clientX, touch.clientY);
      }
    }, { passive: true });

    function layoutCanvas() {
      var panelWidth = Math.max(1, panel.clientWidth || window.innerWidth);
      var panelHeight = Math.max(1, panel.clientHeight || window.innerHeight);
      var maxWidth = window.innerWidth < 600 ? panelWidth - 44 : Math.min(1040, panelWidth * 0.82);
      var boxWidth = Math.max(1, Math.min(panelWidth - 44, maxWidth));
      var side = (panelWidth - boxWidth) / 2;
      var top = window.innerWidth < 600 ? Math.max(112, panelHeight * 0.22) : Math.max(138, panelHeight * 0.18);
      var bottom = window.innerWidth < 600 ? 34 : Math.max(42, panelHeight * 0.06);
      canvas.style.left = side + 'px';
      canvas.style.top = top + 'px';
      canvas.style.width = boxWidth + 'px';
      canvas.style.height = Math.max(1, panelHeight - top - bottom) + 'px';
    }

    function resizeCanvas() {
      layoutCanvas();
      var rect = canvas.getBoundingClientRect();
      var dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      var width = Math.max(1, Math.round(rect.width * dpr));
      var height = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return rect;
    }

    function rangesForLine(lineY, lineHeight, obstacle) {
      var overlaps = lineY + lineHeight > obstacle.top && lineY < obstacle.bottom;
      if (!overlaps) return [{ start: 0, end: obstacle.width }];
      var ranges = [];
      if (obstacle.left > 72) ranges.push({ start: 0, end: obstacle.left });
      if (obstacle.width - obstacle.right > 72) ranges.push({ start: obstacle.right, end: obstacle.width });
      return ranges.length ? ranges : [{ start: 0, end: obstacle.width }];
    }

    function draw() {
      var rect = resizeCanvas();
      if (dropActive && !pointerHasMoved) {
        figX += (targetX - figX) * 0.12;
        dropVelocity += (targetY - figY) * 0.035;
        dropVelocity *= 0.72;
        figY += dropVelocity;
        if (Math.abs(targetY - figY) < 0.5 && Math.abs(dropVelocity) < 0.5) {
          figY = targetY;
          dropActive = false;
        }
      } else {
        figX += (targetX - figX) * 0.14;
        figY += (targetY - figY) * 0.14;
      }
      fig.style.setProperty('left', figX.toFixed(1) + 'px', 'important');
      fig.style.setProperty('top', figY.toFixed(1) + 'px', 'important');

      var figRect = fig.getBoundingClientRect();
      var figArtRect = getFigArtRect(figRect);
      var figCenterX = figArtRect.left - rect.left + figArtRect.width / 2;
      var figCenterY = figArtRect.top - rect.top + figArtRect.height / 2;
      var padding = Math.max(1, Math.min(3, figArtRect.width * 0.018));
      var obstacle = {
        left: figArtRect.left - rect.left - padding,
        right: figArtRect.left - rect.left + figArtRect.width + padding,
        top: figArtRect.top - rect.top - padding,
        bottom: figArtRect.top - rect.top + figArtRect.height + padding,
        width: rect.width
      };

      var fontSize = Math.max(12, Math.min(17, rect.width * (isMobile ? 0.035 : 0.0145)));
      var lineHeight = fontSize * 1.55;
      var font = 'italic 400 ' + fontSize + 'px Lora, Georgia, serif';
      var wordIndex = 0;
      var lineY = 0;
      var layoutKey = [
        Math.round(figCenterX / 8),
        Math.round(figCenterY / 8),
        Math.round(rect.width),
        Math.round(rect.height),
        Math.round(fontSize)
      ].join(':');

      ctx.clearRect(0, 0, rect.width, rect.height);
      if (layoutKey !== lastLayoutKey) {
        var frag = document.createDocumentFragment();
        flow.replaceChildren();
        flow.style.left = canvas.style.left;
        flow.style.top = canvas.style.top;
        flow.style.width = canvas.style.width;
        flow.style.height = canvas.style.height;

        function appendCenteredRange(range) {
          var maxWidth = Math.max(0, range.end - range.start);
          var lineWords = [];
          var lineWidth = 0;
          while (wordIndex < words.length) {
            var word = words[wordIndex] + (wordIndex === words.length - 1 ? '' : ' ');
            var wordWidth = textWidth(word, font);
            if (lineWords.length && lineWidth + wordWidth > maxWidth) break;
            if (!lineWords.length && wordWidth > maxWidth) break;
            lineWords.push({ text: word, width: wordWidth });
            lineWidth += wordWidth;
            wordIndex++;
          }
          if (!lineWords.length) return;
          var x = range.start + Math.max(0, (maxWidth - lineWidth) / 2);
          lineWords.forEach(function (item) {
            var span = document.createElement('span');
            span.textContent = item.text;
            span.style.left = x.toFixed(1) + 'px';
            span.style.top = lineY.toFixed(1) + 'px';
            span.style.fontSize = fontSize.toFixed(1) + 'px';
            frag.appendChild(span);
            x += item.width;
          });
        }

        while (wordIndex < words.length && lineY < rect.height - lineHeight * 2) {
          rangesForLine(lineY, lineHeight, obstacle).forEach(function (range) {
            appendCenteredRange(range);
          });
          lineY += lineHeight;
        }

        if (attribution) {
          var attrSpan = document.createElement('span');
          attrSpan.className = 'p2-flow-attr';
          attrSpan.textContent = attribution;
          var attrFont = '400 ' + Math.max(11, fontSize * 0.78) + 'px VT323, monospace';
          attrSpan.style.left = Math.max(0, (rect.width - textWidth(attribution, attrFont)) / 2).toFixed(1) + 'px';
          attrSpan.style.top = Math.min(rect.height - lineHeight, lineY + lineHeight * 0.5).toFixed(1) + 'px';
          attrSpan.style.fontSize = Math.max(11, fontSize * 0.78).toFixed(1) + 'px';
          frag.appendChild(attrSpan);
        }

        flow.appendChild(frag);
        lastLayoutKey = layoutKey;
      }

      requestAnimationFrame(draw);
    }

    window.addEventListener('resize', function () {
      if (pointerHasMoved) {
        figX = panel.clientWidth * 0.5;
        figY = panel.clientHeight * 0.5;
        targetX = figX;
        targetY = figY;
      } else if (!dropStarted) {
        resetDropStart();
      } else {
        targetX = panel.clientWidth * 0.5;
        targetY = panel.clientHeight * 0.5;
      }
      dropVelocity = 0;
      dropActive = dropStarted && !pointerHasMoved;
      isMobile = window.innerWidth < 600;
    });

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.14) beginDrop();
        });
      }, { threshold: [0, 0.14, 0.28] });
      observer.observe(panel);
    }
    window.addEventListener('scroll', checkPanelVisible, { passive: true });
    window.addEventListener('resize', checkPanelVisible);
    checkPanelVisible();

    requestAnimationFrame(draw);
  }

  function initAll() {
    initThemeToggle();
    initPanel2Manuscript();
  }

  if (document.body) initAll();
  else document.addEventListener('DOMContentLoaded', initAll);
})();
