// ==========================================================================
// Sujit Kumar — Portfolio interactions (vanilla JS, no dependencies)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  setYear();
  initMobileMenu();
  initTypedHero(reduceMotion);
  initScrollReveal(reduceMotion);
  initActiveTabs();
  initSmoothTabClicks();
});

/* -------------------------------------------------------------------- */
/* Footer year                                                          */
/* -------------------------------------------------------------------- */
function setYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

/* -------------------------------------------------------------------- */
/* Mobile hamburger menu                                                */
/* -------------------------------------------------------------------- */
function initMobileMenu() {
  const btn = document.getElementById('menuBtn');
  const panel = document.getElementById('mobileTabs');
  if (!btn || !panel) return;

  btn.addEventListener('click', () => {
    const isOpen = panel.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(isOpen));
  });

  panel.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      panel.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* -------------------------------------------------------------------- */
/* Hero "typing" code animation                                         */
/* Tokens are typed in order; each token carries a syntax-highlight     */
/* class so the colors stay correct even mid-type.                     */
/* -------------------------------------------------------------------- */
function initTypedHero(reduceMotion) {
  const target = document.getElementById('typedCode');
  const gutter = document.getElementById('gutter');
  const caret = document.getElementById('caret');
  if (!target) return;

  const lines = [
    [
      { t: 'const ', c: 'tok-kw' },
      { t: 'sujit ', c: '' },
      { t: '= ', c: 'tok-punc' },
      { t: '{', c: 'tok-punc' },
    ],
    [
      { t: '  role', c: 'tok-prop' },
      { t: ': ', c: 'tok-punc' },
      { t: '"B.Tech IT \'29 @ HIT Durgapur"', c: 'tok-str' },
      { t: ',', c: 'tok-punc' },
    ],
    [
      { t: '  stack', c: 'tok-prop' },
      { t: ': ', c: 'tok-punc' },
      { t: '["React", "Node", "Express", "Supabase"]', c: 'tok-str' },
      { t: ',', c: 'tok-punc' },
    ],
    [
      { t: '  grinding', c: 'tok-prop' },
      { t: ': ', c: 'tok-punc' },
      { t: '["DSA in Java", "GATE \'27"]', c: 'tok-str' },
      { t: ',', c: 'tok-punc' },
    ],
    [
      { t: '  motto', c: 'tok-prop' },
      { t: ': ', c: 'tok-punc' },
      { t: '"no zero days"', c: 'tok-str' },
      { t: ',', c: 'tok-punc' },
    ],
    [
      { t: '  status', c: 'tok-prop' },
      { t: ': ', c: 'tok-punc' },
      { t: '"shipping"', c: 'tok-str' },
    ],
    [
      { t: '};', c: 'tok-punc' },
    ],
    [
      { t: '// building, one commit at a time', c: 'tok-com' },
    ],
  ];

  // Build gutter line numbers to match line count
  if (gutter) {
    gutter.innerHTML = lines.map((_, i) => `<span>${i + 1}</span>`).join('');
  }

  if (reduceMotion) {
    target.innerHTML = lines.map(renderLine).join('\n');
    if (caret) caret.style.display = 'none';
    return;
  }

  let lineIndex = 0;
  let tokenIndex = 0;
  let charIndex = 0;
  let html = '';

  function renderLineStatic(tokens) {
    return tokens.map(tok => tok.c ? `<span class="${tok.c}">${escapeHtml(tok.t)}</span>` : escapeHtml(tok.t)).join('');
  }

  function step() {
    const currentLine = lines[lineIndex];
    if (!currentLine) {
      return; // done
    }
    const currentToken = currentLine[tokenIndex];

    // finished all tokens on this line -> move to next line
    if (!currentToken) {
      html += '\n';
      lineIndex++;
      tokenIndex = 0;
      charIndex = 0;
      target.innerHTML = html + renderPartial();
      requestAnimationFrame(() => setTimeout(step, 90));
      return;
    }

    charIndex++;
    if (charIndex > currentToken.t.length) {
      tokenIndex++;
      charIndex = 0;
      target.innerHTML = html + renderPartial();
      requestAnimationFrame(() => setTimeout(step, 8));
      return;
    }

    target.innerHTML = html + renderPartial();

    const isSpace = currentToken.t[charIndex - 1] === ' ';
    const delay = isSpace ? 4 : 12 + Math.random() * 18;
    setTimeout(step, delay);
  }

  function renderPartial() {
    const currentLine = lines[lineIndex];
    if (!currentLine) return '';
    let out = '';
    for (let i = 0; i < tokenIndex; i++) {
      out += wrap(currentLine[i], currentLine[i].t);
    }
    const tok = currentLine[tokenIndex];
    if (tok) {
      out += wrap(tok, tok.t.slice(0, charIndex));
    }
    return out;
  }

  function wrap(tok, text) {
    if (!text) return '';
    return tok.c ? `<span class="${tok.c}">${escapeHtml(text)}</span>` : escapeHtml(text);
  }

  step();
}

function renderLine(tokens) {
  return tokens.map(tok => tok.c ? `<span class="${tok.c}">${escapeHtml(tok.t)}</span>` : escapeHtml(tok.t)).join('');
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/* -------------------------------------------------------------------- */
/* Scroll reveal for sections / cards                                   */
/* -------------------------------------------------------------------- */
function initScrollReveal(reduceMotion) {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  if (reduceMotion || !('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('in-view'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  items.forEach(el => observer.observe(el));
}

/* -------------------------------------------------------------------- */
/* Highlight the active tab as sections scroll into view                */
/* -------------------------------------------------------------------- */
function initActiveTabs() {
  const sections = document.querySelectorAll('main .section[id]');
  const desktopTabs = document.querySelectorAll('.tab[data-tab]');
  const mobileTabs = document.querySelectorAll('.mobile-tabs a[data-tab]');
  if (!sections.length) return;

  const setActive = (id) => {
    desktopTabs.forEach(t => t.classList.toggle('active', t.getAttribute('href') === `#${id}`));
    mobileTabs.forEach(t => t.classList.toggle('active', t.getAttribute('href') === `#${id}`));
  };

  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setActive(entry.target.id);
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

  sections.forEach(sec => observer.observe(sec));
}

/* -------------------------------------------------------------------- */
/* Smooth-scroll helper (native CSS scroll-behavior handles most of it, */
/* this just closes the mobile panel and keeps things tidy)             */
/* -------------------------------------------------------------------- */
function initSmoothTabClicks() {
  document.querySelectorAll('a[data-tab]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', href);
    });
  });
}
