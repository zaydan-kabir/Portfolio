// Shared behaviour for the project case-study pages:
// page-transition wipe, custom cursor + trail, and embed helpers.
(function () {
  const overlay = document.getElementById('page-out');
  overlay.classList.add('revealing');
  setTimeout(() => overlay.classList.remove('revealing'), 850);

  // Internal links fade out with the same wipe used across the site.
  document.querySelectorAll('a[data-page]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      overlay.classList.add('covering');
      setTimeout(() => { window.location.href = link.getAttribute('href'); }, 460);
    });
  });

  // Coming back with the browser Back button: remove the wipe.
  window.addEventListener('pageshow', e => {
    if (e.persisted) overlay.classList.remove('covering');
  });

  // ── Custom cursor + fading trail ──
  const cursor = document.getElementById('cursor');
  const trailCanvas = document.getElementById('trail-canvas');
  const trailCtx = trailCanvas.getContext('2d');
  const points = [];
  let trailFrame = 0;

  function resizeTrail() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    trailCanvas.width = Math.floor(window.innerWidth * dpr);
    trailCanvas.height = Math.floor(window.innerHeight * dpr);
    trailCanvas.style.width = window.innerWidth + 'px';
    trailCanvas.style.height = window.innerHeight + 'px';
    trailCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function drawTrail() {
    trailFrame = 0;
    trailCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
    const now = Date.now();
    const rgb = document.documentElement.dataset.theme === 'light' ? '10,10,10' : '240,240,240';
    trailCtx.lineCap = 'round';
    trailCtx.lineJoin = 'round';
    for (let i = 1; i < points.length; i++) {
      const alpha = Math.max(0, 1 - (now - points[i].t) / 300);
      trailCtx.beginPath();
      trailCtx.moveTo(points[i - 1].x, points[i - 1].y);
      trailCtx.lineTo(points[i].x, points[i].y);
      trailCtx.strokeStyle = `rgba(${rgb},${(alpha * 0.42).toFixed(3)})`;
      trailCtx.lineWidth = (i / points.length) * 2.5;
      trailCtx.stroke();
    }
    while (points.length && now - points[0].t > 300) points.shift();
    if (points.length) trailFrame = requestAnimationFrame(drawTrail);
  }

  resizeTrail();
  window.addEventListener('resize', resizeTrail);
  document.addEventListener('mousemove', event => {
    cursor.style.transform = `translate3d(${event.clientX}px,${event.clientY}px,0) translate(-50%,-50%)`;
    points.push({ x: event.clientX, y: event.clientY, t: Date.now() });
    if (points.length > 32) points.shift();
    if (!trailFrame) trailFrame = requestAnimationFrame(drawTrail);
  }, { passive: true });

  // Embedded work (Figma, YouTube, etc.) uses its own cursor, so hide the
  // site's dot while the mouse is over an embed.
  document.querySelectorAll('.cs-embed').forEach(embed => {
    embed.addEventListener('mouseenter', () => cursor.classList.add('hidden'));
    embed.addEventListener('mouseleave', () => cursor.classList.remove('hidden'));
  });

  // For embeds of our own pages (e.g. the Design Manifesto), hide that
  // page's header so it doesn't show a second navigation bar.
  document.querySelectorAll('iframe[data-hide-header]').forEach(frame => {
    frame.addEventListener('load', () => {
      try {
        const doc = frame.contentDocument;
        const style = doc.createElement('style');
        style.textContent = '#header{display:none!important}';
        doc.head.appendChild(style);
      } catch (err) { /* different site — nothing to do */ }
    });
  });
})();
