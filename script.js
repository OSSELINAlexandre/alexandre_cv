(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- themes ---------- */
  var THEMES = [
    ['tokyo-night', 'Tokyo Night'], ['matte-black', 'Matte Black'], ['catppuccin', 'Catppuccin'],
    ['catppuccin-latte', 'Catppuccin Latte'], ['gruvbox', 'Gruvbox'], ['nord', 'Nord'],
    ['everforest', 'Everforest'], ['kanagawa', 'Kanagawa'], ['rose-pine', 'Rosé Pine'],
    ['osaka-jade', 'Osaka Jade'], ['ristretto', 'Ristretto'], ['flexoki-light', 'Flexoki Light'], ['white', 'White']
  ];
  var ids = THEMES.map(function (t) { return t[0]; });
  var nameEl = document.getElementById('theme-name');
  var list = document.getElementById('theme-list');
  var metaTheme = document.querySelector('meta[name="theme-color"]');

  THEMES.forEach(function (t) {
    var li = document.createElement('li');
    var b = document.createElement('button');
    b.type = 'button'; b.dataset.theme = t[0];
    b.innerHTML = '<i data-theme="' + t[0] + '" aria-hidden="true"><b style="background:var(--bg);outline:1px solid var(--border-strong)"></b><b style="background:var(--c1)"></b><b style="background:var(--c2)"></b><b style="background:var(--c3)"></b></i>' + t[1];
    b.addEventListener('click', function () { setTheme(t[0]); });
    li.appendChild(b); list.appendChild(li);
  });

  function setTheme(id) {
    if (ids.indexOf(id) < 0) id = 'tokyo-night';
    root.dataset.theme = id;
    nameEl.textContent = THEMES[ids.indexOf(id)][1];
    list.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.theme === id ? 'true' : 'false'); });
    if (metaTheme) metaTheme.setAttribute('content', getComputedStyle(root).getPropertyValue('--bg').trim());
    try { localStorage.setItem('theme', id); } catch (e) {}
  }
  function cycle(dir) { var i = ids.indexOf(root.dataset.theme); setTheme(ids[(i + (dir || 1) + ids.length) % ids.length]); }
  setTheme(root.dataset.theme);
  document.getElementById('theme-btn').addEventListener('click', function () { cycle(1); });
  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable) return;
    if (e.key === 't') cycle(1); else if (e.key === 'T') cycle(-1);
  });

  /* ---------- hero: type command, then stagger name ---------- */
  var cmdEl = document.getElementById('typed-cmd');
  var nameH = document.getElementById('hero-name');
  var later = document.querySelectorAll('#hero-role, #hero-links');
  var NAME = ['Alexandre', 'Osselin'];
  function buildName(animated) {
    var html = '', d = 0;
    NAME.forEach(function (word, wi) {
      html += '<span class="ln-break" aria-hidden="true">';
      for (var i = 0; i < word.length; i++) {
        html += '<span class="hero__letter' + (wi === 1 ? ' is-glow' : '') + '" style="--d:' + d + '">' + word[i] + '</span>';
        d += 45;
      }
      html += '</span>';
    });
    nameH.insertAdjacentHTML('beforeend', html);
    return d;
  }
  if (reduce) {
    cmdEl.textContent = 'whoami'; buildName(false);
  } else {
    later.forEach(function (el) { el.classList.add('pre-show'); });
    var cmd = 'whoami', k = 0;
    (function type() {
      cmdEl.textContent = cmd.slice(0, k);
      if (k++ < cmd.length) return setTimeout(type, 70 + Math.random() * 40);
      setTimeout(function () {
        var total = buildName(true);
        setTimeout(function () { later.forEach(function (el) { el.classList.remove('pre-show'); }); }, total + 250);
      }, 180);
    })();
  }

  /* ---------- pointer glow + card spotlight ---------- */
  var glow = document.querySelector('.cursor-glow');
  if (!reduce && window.matchMedia('(pointer: fine)').matches) {
    var raf = null, gx = 0, gy = 0;
    window.addEventListener('pointermove', function (e) {
      gx = e.clientX; gy = e.clientY;
      document.body.classList.add('is-pointer');
      if (!raf) raf = requestAnimationFrame(function () { glow.style.transform = 'translate(' + (gx - 160) + 'px,' + (gy - 160) + 'px)'; raf = null; });
    }, { passive: true });
    document.addEventListener('pointerleave', function () { document.body.classList.remove('is-pointer'); });
    document.querySelectorAll('.spot').forEach(function (c) {
      c.addEventListener('pointermove', function (e) {
        var r = c.getBoundingClientRect();
        c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        c.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }
  glow.style.left = '0'; glow.style.top = '0';

  /* ---------- tiled windows: rotate focus ---------- */
  var wins = document.querySelectorAll('.tile-win');
  if (!reduce && wins.length) {
    var w = 0;
    setInterval(function () { wins.forEach(function (x) { x.classList.remove('focus'); }); wins[w++ % wins.length].classList.add('focus'); }, 2200);
  }

  /* ---------- pane log lines ---------- */
  document.querySelectorAll('.pane-log').forEach(function (pre) {
    pre.innerHTML = pre.innerHTML.split('\n').map(function (l, i) { return '<span class="ok-line" style="--i:' + i + '">' + l + '</span>'; }).join('\n');
  });

  /* ---------- character bars (illustrative) ---------- */
  document.querySelectorAll('.cbar').forEach(function (el) {
    var n = 18, v = Math.round((+el.dataset.v || 0) / 10 * n);
    el.dataset.full = '█'.repeat(v); el.dataset.empty = '░'.repeat(n - v);
    el.innerHTML = reduce ? el.dataset.full + '<span class="off">' + el.dataset.empty + '</span>' : '<span class="off">' + '░'.repeat(n) + '</span>';
  });
  function fillBars(card) {
    card.querySelectorAll('.cbar').forEach(function (el, j) {
      var full = el.dataset.full, empty = el.dataset.empty, i = 0;
      setTimeout(function step() {
        el.innerHTML = full.slice(0, i) + '<span class="off">' + '░'.repeat(full.length - i) + empty + '</span>';
        if (i++ < full.length) setTimeout(step, 22);
      }, j * 70);
    });
  }

  /* ---------- gantt + sparkline from CV dates ---------- */
  var Y0 = 2013, Y1 = 2026;
  var ROWS = [
    ['ESSEC — BBA', 2013, 2018, 'g2'],
    ['Paris Dauphine — IREN', 2018, 2020, 'g2'],
    ['CentraleSupélec — TP Java', 2020, 2020, 'g3'],
    ['OpenClassrooms — Java', 2021, 2022, 'g2'],
    ['Thales IAS — SAMP/T NG', 2022, Y1, 'g1'],
    ['Projet Assembleur', 2023, 2023, 'g3'],
    ['CNAM — titre d\'ingénieur', 2024, Y1, 'g2'],
    ['Linux Primitives', 2024, 2024, 'g3']
  ];
  function pad(s, n) { while (s.length < n) s += ' '; return s; }
  var W = 27, out = pad('', W) + ' ';
  for (var y = Y0; y <= Y1; y++) out += (y % 2 === 1 ? String(y).slice(2) : '  ') + ' ';
  out += '\n';
  var counts = [];
  ROWS.forEach(function (r) {
    var line = pad(r[0], W) + ' ';
    for (var y = Y0; y <= Y1; y++) {
      var on = y >= r[1] && y <= r[2];
      if (on) counts[y - Y0] = (counts[y - Y0] || 0) + 1;
      line += on ? '<span class="' + r[3] + '">██</span> ' : '<span class="gd">··</span> ';
    }
    out += line + '\n';
  });
  out += '\n<span class="g1">██</span> poste  <span class="g2">██</span> formation  <span class="g3">██</span> projet';
  document.getElementById('gantt').innerHTML = out;
  var blocks = '▁▂▃▄▅▆▇█', max = Math.max.apply(null, counts.map(function (c) { return c || 0; }));
  var spark = '';
  for (var i = 0; i <= Y1 - Y0; i++) spark += blocks[Math.round(((counts[i] || 0) / max) * 7)];
  document.getElementById('spark').textContent = Y0 + ' ' + spark + ' ' + Y1;

  /* ---------- reveal on scroll ---------- */
  var els = document.querySelectorAll('.reveal, .feature, .btop');
  function show(el) {
    if (el.classList.contains('reveal')) el.classList.add('visible');
    if (el.classList.contains('feature')) el.classList.add('on');
    if (el.classList.contains('btop') && !reduce) fillBars(el);
  }
  if (reduce || !('IntersectionObserver' in window)) {
    els.forEach(show);
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { show(en.target); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- active workspace ---------- */
  var links = document.querySelectorAll('.ws a'), map = {};
  links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
  if ('IntersectionObserver' in window) {
    var nio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && map[en.target.id]) {
          links.forEach(function (a) { a.classList.remove('active'); });
          map[en.target.id].classList.add('active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main section[id]').forEach(function (s) { nio.observe(s); });
  }
  if (links[0]) links[0].classList.add('active');

  /* ---------- clock + year ---------- */
  var clock = document.getElementById('clock');
  function tick() { var d = new Date(); clock.textContent = d.toLocaleDateString('fr-FR', { weekday: 'short', day: '2-digit', month: 'short' }) + ' ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }); }
  tick(); setInterval(tick, 30000);
  document.getElementById('year').textContent = new Date().getFullYear();
})();
