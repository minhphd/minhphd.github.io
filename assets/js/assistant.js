// clip-7b: a paperclip assistant docked in the bottom-right corner. Its eyes follow the cursor,
// it comments on whatever the cursor rests on, and it can give a (mostly) competent tour.
// Lines live in _data/assistant.yml and arrive as window.AGENT_LINES.
(function () {
  var L = window.AGENT_LINES || {};
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Touch-first devices get section roasts instead of hover comments. Laptops with touchscreens
  // can report touch as primary, so a real mouse movement also turns hover comments on.
  var canHover = window.matchMedia && window.matchMedia('(any-hover: hover)').matches;

  function load(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }
  function save(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} }
  function loadPref(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function savePref(k, v) { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) {} }

  var muted = loadPref('a7-muted') === '1';   // remembered across visits; shown as a band-aid over the mouth
  var touring = false;
  var pinned = false;      // bubble opened on purpose; hover chatter waits a moment before replacing it
  var pinnedAt = 0;
  var lastSpoke = 0;
  var hideTimer, typeTimer;
  var used = {};

  function pick(list, key) {
    if (!list || !list.length) return null;
    used[key] = used[key] || [];
    var fresh = list.filter(function (_, i) { return used[key].indexOf(i) < 0; });
    if (!fresh.length) { used[key] = []; fresh = list; }
    var line = fresh[Math.floor(Math.random() * fresh.length)];
    used[key].push(list.indexOf(line));
    return line;
  }

  // ---------- DOM ----------

  var canTour = !!document.querySelector('#publications .pub');
  var root = document.createElement('div');
  root.className = 'a7';
  root.innerHTML =
    '<div class="a7-bubble" hidden>' +
      '<div class="a7-head"><span>clip-7b <em>&middot; trained on this site</em></span><button type="button" class="a7-x" aria-label="Close">&times;</button></div>' +
      '<p class="a7-text" role="status" aria-live="polite"></p>' +
      '<div class="a7-actions">' +
        '<button type="button" data-act="more">[say something]</button>' +
        (canTour ? '<button type="button" data-act="tour">[give me a tour]</button>' : '') +
        '<button type="button" data-act="mute">[mute]</button>' +
      '</div>' +
    '</div>' +
    '<button type="button" class="a7-bot" aria-label="Talk to clip-7b">' +
      '<svg viewBox="0 0 72 104" width="72" height="104" aria-hidden="true">' +
        '<defs><linearGradient id="a7-wire" x1="0" y1="0" x2="1" y2="1">' +
          '<stop offset="0" stop-color="#E9EDF2"/><stop offset=".45" stop-color="#9AA4B1"/><stop offset=".7" stop-color="#D5DBE3"/><stop offset="1" stop-color="#6F7987"/>' +
        '</linearGradient></defs>' +
        '<g transform="rotate(-4 36 86)">' +
          '<rect x="6" y="70" width="60" height="31" rx="2" fill="#FFFFFF" stroke="#CBD0D6"/>' +
          '<path d="M12 79h48M12 86h48M12 93h48" stroke="#E5E7EB" stroke-width="1"/>' +
        '</g>' +
        '<path d="M27 78V26a11 11 0 0 1 22 0v56a15 15 0 0 1-30 0V37a8 8 0 0 1 16 0v35" fill="none" stroke="#5B6573" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" opacity=".35"/>' +
        '<path d="M27 78V26a11 11 0 0 1 22 0v56a15 15 0 0 1-30 0V37a8 8 0 0 1 16 0v35" fill="none" stroke="url(#a7-wire)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<g class="a7-eye" data-cx="25" data-cy="42">' +
          '<ellipse cx="25" cy="42" rx="8" ry="9.5" fill="#fff" stroke="#2E3440" stroke-width="1.6"/>' +
          '<g class="a7-pupil"><circle cx="25" cy="43" r="3.6" fill="#1D2330"/><circle cx="26.3" cy="41.6" r="1.1" fill="#fff"/></g>' +
        '</g>' +
        '<g class="a7-eye" data-cx="43" data-cy="40">' +
          '<ellipse cx="43" cy="40" rx="8" ry="9.5" fill="#fff" stroke="#2E3440" stroke-width="1.6"/>' +
          '<g class="a7-pupil"><circle cx="43" cy="41" r="3.6" fill="#1D2330"/><circle cx="44.3" cy="39.6" r="1.1" fill="#fff"/></g>' +
        '</g>' +
        '<g class="a7-brows" stroke="#2E3440" stroke-width="3" stroke-linecap="round" fill="none">' +
          '<path d="M17 29q7-6 14-2"/><path d="M37 26q7-4 13 1"/>' +
        '</g>' +
        '<path class="a7-mouth" d="M28 57q6 5 12 0" fill="#2E3440" stroke="#2E3440" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<g class="a7-bandage">' +
          '<g transform="rotate(-18 34 57)"><rect x="22" y="53.5" width="24" height="7.5" rx="3.75" fill="#F5CFA6" stroke="#C99262" stroke-width=".9"/>' +
            '<rect x="30.5" y="54.2" width="7" height="6.1" rx="1.2" fill="#E8B27E"/>' +
            '<g fill="#C99262"><circle cx="25.5" cy="56" r=".55"/><circle cx="25.5" cy="58.5" r=".55"/><circle cx="42.5" cy="56" r=".55"/><circle cx="42.5" cy="58.5" r=".55"/></g></g>' +
          '<g transform="rotate(16 34 57)"><rect x="22" y="53.5" width="24" height="7.5" rx="3.75" fill="#F8D7B3" stroke="#C99262" stroke-width=".9"/>' +
            '<rect x="30.5" y="54.2" width="7" height="6.1" rx="1.2" fill="#EDBC8C"/>' +
            '<g fill="#C99262"><circle cx="25.5" cy="56" r=".55"/><circle cx="25.5" cy="58.5" r=".55"/><circle cx="42.5" cy="56" r=".55"/><circle cx="42.5" cy="58.5" r=".55"/></g></g>' +
        '</g>' +
      '</svg>' +
    '</button>';
  document.body.appendChild(root);

  var bubble = root.querySelector('.a7-bubble');
  var textEl = root.querySelector('.a7-text');
  var bot = root.querySelector('.a7-bot');
  var svg = bot.querySelector('svg');
  var eyes = Array.prototype.slice.call(root.querySelectorAll('.a7-eye'));

  // ---------- Eyes follow the cursor ----------

  var look = { x: window.innerWidth / 2, y: window.innerHeight / 2 }, lookQueued = false;
  function aim() {
    lookQueued = false;
    var r = svg.getBoundingClientRect();
    if (!r.width) return;
    var scale = r.width / 72;
    eyes.forEach(function (eye) {
      var ex = r.left + (+eye.dataset.cx) * scale;
      var ey = r.top + (+eye.dataset.cy) * scale;
      var dx = look.x - ex, dy = look.y - ey;
      var d = Math.sqrt(dx * dx + dy * dy) || 1;
      var k = Math.min(d / 60, 1);
      eye.querySelector('.a7-pupil').setAttribute('transform', 'translate(' + (dx / d * 3.6 * k).toFixed(2) + ' ' + (dy / d * 4.6 * k).toFixed(2) + ')');
    });
  }
  function lookAt(x, y) {
    look.x = x; look.y = y;
    if (!lookQueued) { lookQueued = true; requestAnimationFrame(aim); }
  }
  window.addEventListener('pointermove', function (e) { lookAt(e.clientX, e.clientY); }, { passive: true });
  window.addEventListener('resize', aim);

  // ---------- Talking ----------

  function say(line, opts) {
    opts = opts || {};
    if (!line || (muted && !opts.force)) return;
    clearTimeout(hideTimer);
    clearInterval(typeTimer);
    pinned = !!opts.stay;
    if (pinned) pinnedAt = Date.now();
    bubble.hidden = false;
    root.classList.add('is-talking');
    lastSpoke = Date.now();
    if (reduced) {
      textEl.textContent = line;
      root.classList.remove('is-talking');
    } else {
      var n = 0;
      textEl.textContent = '';
      typeTimer = setInterval(function () {
        n += 2;
        textEl.textContent = line.slice(0, n);
        if (n >= line.length) { clearInterval(typeTimer); root.classList.remove('is-talking'); }
      }, 20);
    }
    if (opts.stay) return;
    hideTimer = setTimeout(close, opts.ms || Math.max(5500, line.length * 65));
  }

  function close() {
    clearTimeout(hideTimer);
    clearInterval(typeTimer);
    pinned = false;
    bubble.hidden = true;
    root.classList.remove('is-talking');
  }

  bubble.addEventListener('mouseenter', function () { clearTimeout(hideTimer); });
  bubble.addEventListener('mouseleave', function () { if (!bubble.hidden && !pinned) hideTimer = setTimeout(close, 3000); });
  root.querySelector('.a7-x').addEventListener('click', close);

  function setMuted(on) {
    muted = on;
    savePref('a7-muted', on ? '1' : null);
    root.classList.toggle('is-muted', on);
    bot.setAttribute('aria-label', on ? 'clip-7b is muted. Click to unmute.' : 'Talk to clip-7b');
    bot.title = on ? 'Muted. Click to unmute.' : '';
  }
  setMuted(muted);

  bot.addEventListener('click', function () {
    if (touring) return;
    if (muted) {
      setMuted(false);
      say('Mmmph! ...Thanks. Where was I?', { ms: 3000 });
      return;
    }
    if (!bubble.hidden && pinned) { close(); return; }
    say(pick(L.idle, 'idle'), { stay: true });
  });

  root.querySelector('.a7-actions').addEventListener('click', function (e) {
    var act = e.target.getAttribute('data-act');
    if (act === 'more') {
      var visible = currentSection();
      var lines = ((visible && L.sections && L.sections[visible]) || []).concat(L.idle || []);
      say(pick(lines, 'more'), { stay: true });
    } else if (act === 'tour') {
      close();
      tour();
    } else if (act === 'mute') {
      close();
      setMuted(true);
    }
  });

  // ---------- Hover commentary ----------

  // First matching rule wins, so specific selectors come before general ones.
  var RULES = [
    ['.a7-bot', 'self'],
    ['[data-a7-line]', 'line'],
    ['[data-a7]', null],
    ['.topbar-nav a[href$="/publications/"]', 'nav-publications'],
    ['.topbar-nav a[href$="/services/"]', 'nav-services'],
    ['.topbar-nav a[href$="/cv/"]', 'nav-cv'],
    ['.pub-links a[href*="github"]', 'code'],
    ['.pub-links a[href*="huggingface"]', 'dataset'],
    ['.pub-links a[href*="arxiv"], .pub-links a[href*="aclanthology"], .pub-links a[href$=".pdf"]', 'paper'],
    ['.pub-links a[href*="/spaces/"], .pub-links a[href*="railway"]', 'demo'],
    ['.pub-thumb', 'pub-thumb'],
    ['.pub-title', 'pub-title'],
    ['.photo', 'photo'],
    ['.intro h1', 'name'],
    ['.intro .subtitle', 'subtitle'],
    ['.r2-line', 'r2'],
    ['.marker', 'interests'],
    ['a[href*="scholar.google"]', 'scholar'],
    ['a[href$="/cv/"], a[href*="cv.pdf"]', 'cv'],
    ['a[href*="github.com"]', 'github'],
    ['a[href*="linkedin.com"]', 'linkedin'],
    ['a[href*="x.com"], a[href*="bsky.app"]', 'social']
  ];
  var hoverKey = null, hoverTimer, keySpoke = {};

  // Returns the hover key for an element, or "line:<text>" for elements carrying their own line.
  function keyFor(target) {
    if (!target || !target.closest) return null;
    for (var i = 0; i < RULES.length; i++) {
      var el = target.closest(RULES[i][0]);
      if (!el) continue;
      if (RULES[i][1] === 'line') return 'line:' + el.getAttribute('data-a7-line');
      return RULES[i][1] || el.getAttribute('data-a7');
    }
    return null;
  }
  function linesFor(key) {
    if (!key) return null;
    if (key.indexOf('line:') === 0) return [key.slice(5)];
    return L.hover && L.hover[key];
  }

  document.addEventListener('pointerover', function (e) {
    if (e.pointerType === 'touch') return;
    canHover = true;
    if (e.target.closest && e.target.closest('.a7-bubble')) return;
    var key = keyFor(e.target);
    if (key === hoverKey) return;
    hoverKey = key;
    clearTimeout(hoverTimer);
    var lines = linesFor(key);
    if (!lines || !lines.length) return;
    hoverTimer = setTimeout(function () {
      if (hoverKey !== key || touring || muted) return;
      var now = Date.now();
      if (pinned && now - pinnedAt < 4000) return;
      if (now - lastSpoke < 1500 || now - (keySpoke[key] || 0) < 15000) return;
      keySpoke[key] = now;
      say(pick(lines, 'h-' + key));
    }, key === 'self' ? 400 : 550);
  });

  // ---------- Unprompted lines ----------

  function canInterrupt() { return !muted && !touring && bubble.hidden && Date.now() - lastSpoke > 12000; }

  if (!muted && !load('a7-greeted')) {
    setTimeout(function () {
      if (muted || touring || !bubble.hidden) return;
      save('a7-greeted', '1');
      say(pick(L.greeting, 'greeting'));
    }, 3500);
  }

  var sections = Array.prototype.slice.call(document.querySelectorAll('.section[id]'));
  function currentSection() {
    var mid = window.innerHeight * .45, best = null;
    sections.forEach(function (s) {
      var r = s.getBoundingClientRect();
      if (r.top < mid && r.bottom > mid) best = s.id;
    });
    return best;
  }

  // Touch screens have no hover, so roast each section the first time it scrolls into view instead.
  if (!canHover && 'IntersectionObserver' in window && L.sections) {
    var seen = {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var id = e.target.id;
        if (!e.isIntersecting || seen[id] || !L.sections[id]) return;
        seen[id] = true;
        setTimeout(function () {
          if (!canHover && canInterrupt() && currentSection() === id) say(pick(L.sections[id], id));
        }, 1200);
      });
    }, { threshold: .35 });
    sections.forEach(function (s) { io.observe(s); });
  }

  var idleTimer;
  function resetIdle() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(function () { if (canInterrupt()) say(pick(L.idle, 'idle')); resetIdle(); }, 45000);
  }
  ['scroll', 'pointermove', 'keydown', 'touchstart'].forEach(function (ev) {
    window.addEventListener(ev, resetIdle, { passive: true });
  });
  resetIdle();

  // ---------- The tour ----------

  var MOVE_MS = reduced ? 0 : 900;
  var steps = [
    { target: '.intro h1', say: 'observe() · A personal website. Goal: find Minh\'s newest paper.' },
    { target: '.topbar-nav a[href$="/publications/"]', say: 'think() · "Publications" looks promising. Scrolling is cheaper than clicking, though.' },
    { target: '#publications .pub-title a', say: 'read() · Newest paper first. Skimming the abstract, skipping to Figure 1.' },
    { target: '#publications .pub-links a[href*="github"]', miss: true, say: 'click([Code]) · ...missed by 40px. Drag & gesture remains my weakest skill.' },
    { target: '#publications .pub-links a[href*="github"]', click: true, say: 'retry() · Clicked! Task complete, reward 0.92. Requesting more GPUs.' },
    { target: '#r2-refresh', press: true, scrollTop: true, say: 'wait... Reviewer 2 lives here? Leaving before they review me. done()' }
  ];
  var cursor, tip, cancelled;

  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  function place(x, y) {
    cursor.style.transitionDuration = tip.style.transitionDuration = MOVE_MS + 'ms';
    cursor.style.transform = 'translate(' + x + 'px,' + y + 'px)';
    var bw = Math.min(300, window.innerWidth - 32);
    var bx = x + 26 + bw > window.innerWidth - 12 ? x - bw - 14 : x + 26;
    var by = Math.min(window.innerHeight - 120, Math.max(12, y + 18));
    tip.style.transform = 'translate(' + Math.max(12, bx) + 'px,' + by + 'px)';
    lookAt(x, y);
  }

  function ripple(x, y, ok) {
    var r = document.createElement('span');
    r.className = 'a7-ripple' + (ok ? '' : ' is-miss');
    r.style.left = x + 'px';
    r.style.top = y + 'px';
    document.body.appendChild(r);
    setTimeout(function () { r.remove(); }, 700);
  }

  function endTour(msg) {
    cancelled = true;
    touring = false;
    root.classList.remove('is-touring');
    document.removeEventListener('keydown', onKey);
    document.querySelectorAll('.a7-target').forEach(function (t) { t.classList.remove('a7-target'); });
    if (cursor) { cursor.remove(); tip.remove(); cursor = tip = null; }
    if (msg) say(msg);
  }
  function onKey(e) { if (e.key === 'Escape') endTour('Tour cancelled. Rude, but fair.'); }

  async function tour() {
    if (touring) return;
    touring = true;
    cancelled = false;
    root.classList.add('is-touring');

    cursor = document.createElement('div');
    cursor.className = 'a7-cursor';
    cursor.setAttribute('aria-hidden', 'true');
    cursor.innerHTML = '<svg viewBox="0 0 24 28" width="24" height="28"><path d="M2 2v20l5.5-5 3.6 8.2 3.4-1.5-3.6-8H18L2 2Z" fill="#2E3440" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>';
    tip = document.createElement('div');
    tip.className = 'a7-tip';
    tip.setAttribute('role', 'status');
    tip.innerHTML = '<span class="a7-step"></span><span class="a7-say"></span><button type="button" class="a7-stop">[stop]</button>';
    tip.querySelector('.a7-stop').addEventListener('click', function () { endTour('Tour cancelled. Rude, but fair.'); });
    document.body.appendChild(cursor);
    document.body.appendChild(tip);
    document.addEventListener('keydown', onKey);

    var b = bot.getBoundingClientRect();
    cursor.style.transitionDuration = tip.style.transitionDuration = '0ms';
    cursor.style.transform = 'translate(' + b.left + 'px,' + b.top + 'px)';
    tip.style.transform = 'translate(' + Math.max(12, b.left - 300) + 'px,' + (b.top - 90) + 'px)';
    await sleep(60);

    for (var n = 0; n < steps.length; n++) {
      if (cancelled) return;
      var step = steps[n];
      var el = document.querySelector(step.target);
      if (!el) continue;
      var r = el.getBoundingClientRect();
      if (r.top < 70 || r.bottom > window.innerHeight - 140) {
        if (step.scrollTop) window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
        else el.scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' });
        await sleep(reduced ? 60 : 800);
        if (cancelled) return;
        r = el.getBoundingClientRect();
      }
      var x = r.left + Math.min(r.width * .5, 60);
      var y = r.top + r.height * .55;
      if (step.miss) { x += 40; y += 34; }

      tip.querySelector('.a7-step').textContent = 'Step ' + (n + 1);
      tip.querySelector('.a7-say').textContent = '...';
      place(x, y);
      await sleep(MOVE_MS + 150);
      if (cancelled) return;

      document.querySelectorAll('.a7-target').forEach(function (t) { t.classList.remove('a7-target'); });
      if (!step.miss) el.classList.add('a7-target');
      if (step.miss || step.click || step.press) ripple(x, y, !step.miss);
      if (step.press) el.click();
      tip.querySelector('.a7-say').textContent = step.say;
      await sleep(2600);
    }
    endTour('Tour complete. Reward: 0.92. Not bad for 7B parameters.');
  }

  if (location.hash === '#agent-tour' && canTour) setTimeout(tour, 600);
})();
