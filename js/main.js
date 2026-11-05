/* ==========================================================================
   SHARED INTERACTIONS
   Gallery, page transitions, cursor, reveals, split text, counters,
   magnetic buttons, parallax, menus. Used by index.html and project.html.
   ========================================================================== */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const body = document.body;
  const t = window.I18N ? window.I18N.t : (x => x);

  /* ---------- Contact settings: edit here ---------- */
  const CONTACT = {
    email: 'disselli.rodrigoalmeida@gmail.com',
    // Paste your profile URL here. Until then, LinkedIn buttons open a people search for your name.
    linkedin: ''
  };
  const linkedinURL = CONTACT.linkedin || 'https://www.linkedin.com/search/results/people/?keywords=Rodrigo%20Disselli';

  /* ---------- Language ---------- */
  window.I18N?.applyDocument();
  $$('[data-lang]').forEach(btn => btn.addEventListener('click', () => window.I18N?.setLang(btn.dataset.lang)));

  /* ---------- Split text ---------- */
  const splitText = root => $$('[data-split]', root).forEach(el => {
    if (el.dataset.splitDone) return;
    el.dataset.splitDone = '1';
    const mode = el.dataset.split;
    let i = 0;
    // Single letters read badly in screen readers, so char-split text gets a label instead
    if (mode === 'chars' && !el.closest('[aria-hidden="true"]')) el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
    const walk = node => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 1) { if (n.tagName !== 'BR') walk(n); return; }
        if (n.nodeType !== 3) return;
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(word => {
          if (!word) return;
          if (/^\s+$/.test(word)) { frag.append(' '); return; }
          const w = document.createElement('span');
          w.className = 'w';
          if (mode === 'chars') {
            w.setAttribute('aria-hidden', 'true');
            [...word].forEach(ch => {
              const c = document.createElement('span');
              c.className = 'char';
              c.textContent = ch;
              c.style.setProperty('--i', i++);
              w.append(c);
            });
          } else {
            const inner = document.createElement('span');
            inner.textContent = word;
            inner.style.setProperty('--i', i++);
            w.append(inner);
          }
          frag.append(w);
        });
        n.replaceWith(frag);
      });
    };
    walk(el);
  });

  /* ---------- Reveal on scroll + counters ---------- */
  const countUp = el => {
    const end = Number(el.dataset.count) || 0;
    if (reduce || !end) { el.textContent = end.toLocaleString(); return; }
    const t0 = performance.now(), dur = 1600;
    const step = t => {
      const k = Math.min(1, (t - t0) / dur);
      el.textContent = Math.round(end * (1 - Math.pow(2, -10 * k))).toLocaleString();
      if (k < 1) requestAnimationFrame(step); else el.textContent = end.toLocaleString();
    };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('is-in');
    if (e.target.dataset.count !== undefined) countUp(e.target);
    io.unobserve(e.target);
  }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

  /* ---------- Magnetic buttons ---------- */
  const magnetize = root => {
    if (!fine || reduce) return;
    $$('[data-magnetic]', root).forEach(el => {
      if (el.dataset.magnetized) return;
      el.dataset.magnetized = '1';
      const s = Number(el.dataset.magnetic) || 0.3;
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * s}px, ${(e.clientY - r.top - r.height / 2) * s}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  };

  /* ---------- Enhance: translate, split, reveal. Also used for content rendered later. ---------- */
  const enhance = root => {
    window.I18N?.apply(root);
    splitText(root);
    $$('.reveal, [data-split], [data-count], .card', root).forEach(el => io.observe(el));
    magnetize(root);
  };
  window.Portfolio = { enhance };
  enhance(body);

  /* ---------- Gallery (home): one card per projects/<slug>.md ---------- */
  const grid = $('#workGrid');
  if (grid && window.loadProjects) {
    const escH = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    window.loadProjects().then(list => {
      const ok = list.filter(p => !p.error);
      if (!ok.length) {
        const local = location.protocol === 'file:';
        grid.innerHTML = `<div class="work__notice reveal">
          <p class="eyebrow">${local ? 'Preview needs a local server' : 'Projects unavailable'}</p>
          <p>${local
            ? 'Projects are loaded from Markdown files, and browsers only allow that over http. Open a terminal in the portfolio folder and run <code>npx serve</code> or <code>python3 -m http.server</code>, then visit the address it prints.'
            : 'The project files could not be loaded. Please try again later.'}</p>
        </div>`;
        enhance(grid);
        return;
      }
      grid.innerHTML = ok.map((p, n) => {
        const i = list.indexOf(p);
        return `
        <a class="card" href="project.html?p=${encodeURIComponent(p.slug)}" data-cursor="View" style="--d:${(n % 2) * 120}ms">
          <span class="card__num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
          <div class="card__media">
            ${window.coverHTML(p, i)}
            <span class="card__cta">View case study <span aria-hidden="true">↗</span></span>
          </div>
          <div class="card__info">
            <h3 class="card__title">${escH(p.cardTitle || p.title)}</h3>
            <p class="card__meta mono">${escH(t(p.categoryLabel || ''))}${p.year ? ` · ${escH(p.year)}` : ''}</p>
          </div>
        </a>`;
      }).join('');

      const cards = $$('.card', grid);
      cards.forEach((c, i) => c.classList.toggle('is-offset', i % 2 === 1));

      /* 3D tilt */
      if (fine && !reduce) cards.forEach(card => {
        const m = $('.card__media', card);
        card.addEventListener('pointermove', e => {
          const r = m.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          m.style.setProperty('--ry', `${x * 8}deg`);
          m.style.setProperty('--rx', `${y * -8}deg`);
        });
        card.addEventListener('pointerleave', () => { m.style.setProperty('--rx', '0deg'); m.style.setProperty('--ry', '0deg'); });
      });

      enhance(grid);
    });
  }

  /* ---------- Fit text to container width ---------- */
  const fit = () => $$('[data-fit]').forEach(el => {
    const inner = $('.fit-inner', el);
    if (!inner) return;
    inner.style.fontSize = '100px';
    const w = inner.offsetWidth;
    if (w) inner.style.fontSize = `${(100 * el.clientWidth * Number(el.dataset.fit)) / w}px`;
  });
  fit();
  if (document.fonts) document.fonts.ready.then(fit);
  let rT;
  addEventListener('resize', () => { clearTimeout(rT); rT = setTimeout(fit, 120); });

  /* ---------- Page load + transitions ---------- */
  requestAnimationFrame(() => requestAnimationFrame(() => body.classList.add('is-loaded')));
  addEventListener('pageshow', e => { if (e.persisted) body.classList.remove('is-leaving'); });
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.target === '_blank' || a.hasAttribute('download')) return;
    const url = new URL(a.href, location.href);
    if (!/^(https?|file):$/.test(url.protocol) || url.origin !== location.origin) return;
    if (url.pathname === location.pathname && url.search === location.search) {
      // In-page anchor: close the menu, let smooth scrolling do the rest
      closeMenu();
      return;
    }
    if (reduce) return;
    e.preventDefault();
    closeMenu();
    body.classList.add('is-leaving');
    setTimeout(() => { location.href = url.href; }, 650);
  });

  /* ---------- Nav + mobile menu ---------- */
  const nav = $('.nav');
  const burger = $('.nav__burger');
  function closeMenu() {
    if (!body.classList.contains('menu-open')) return;
    body.classList.remove('menu-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', t('Open menu'));
  }
  burger?.addEventListener('click', () => {
    const open = !body.classList.contains('menu-open');
    body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', t(open ? 'Close menu' : 'Open menu'));
  });
  addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  /* ---------- Process accordion ---------- */
  $$('.svc__row').forEach(btn => btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') !== 'true';
    btn.setAttribute('aria-expanded', open);
    btn.parentElement.classList.toggle('is-open', open);
  }));

  /* ---------- Ripple ---------- */
  document.addEventListener('pointerdown', e => {
    const el = e.target.closest('[data-ripple], .svc__row, .btn-circle');
    if (!el || reduce) return;
    const r = el.getBoundingClientRect();
    const size = Math.max(r.width, r.height) * 2.2;
    const dot = document.createElement('span');
    dot.className = 'ripple';
    dot.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - r.left - size / 2}px;top:${e.clientY - r.top - size / 2}px`;
    el.append(dot);
    dot.addEventListener('animationend', () => dot.remove());
  });

  /* ---------- Hero title jump (hover on desktop, tap on touch) ---------- */
  const heroTitle = $('.hero__title');
  if (heroTitle && !reduce) {
    const jump = () => {
      if (heroTitle.classList.contains('is-jumping') || !heroTitle.classList.contains('is-in')) return;
      heroTitle.classList.add('is-jumping');
      const chars = $$('.char', heroTitle);
      chars[chars.length - 1].addEventListener('animationend', () => heroTitle.classList.remove('is-jumping'), { once: true });
    };
    heroTitle.addEventListener('pointerenter', jump);
    heroTitle.addEventListener('click', jump);
  }

  /* ---------- Course filter ---------- */
  const courses = $$('.course');
  const courseCols = () => courses.filter(c => !c.hidden).forEach((c, i) => { c.classList.toggle('is-left', i % 2 === 0); c.classList.toggle('is-right', i % 2 === 1); });
  courseCols();
  let courseTimer;
  $$('[data-course-filter]').forEach(chip => chip.addEventListener('click', () => {
    if (chip.classList.contains('is-active')) return;
    $$('[data-course-filter]').forEach(c => { c.classList.toggle('is-active', c === chip); c.setAttribute('aria-pressed', c === chip); });
    const f = chip.dataset.courseFilter;
    courses.forEach(c => c.classList.add('is-out'));
    clearTimeout(courseTimer);
    courseTimer = setTimeout(() => {
      courses.forEach(c => { c.hidden = !(f === 'all' || c.dataset.provider === f); });
      courseCols();
      void document.body.offsetWidth;
      courses.filter(c => !c.hidden).forEach((c, i) => {
        c.style.transitionDelay = `${i * 50}ms`;
        c.classList.add('is-in');
        c.classList.remove('is-out');
        setTimeout(() => { c.style.transitionDelay = ''; }, 400 + i * 50);
      });
    }, reduce ? 0 : 280);
  }));

  /* ---------- Contact actions ---------- */
  $$('[data-linkedin]').forEach(a => { a.href = linkedinURL; });
  $$('[data-email-link]').forEach(a => { a.href = `mailto:${CONTACT.email}`; });

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  body.append(toast);
  let toastTimer;
  const showToast = msg => {
    toast.textContent = msg;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2200);
  };

  const copyText = async text => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback for browsers/contexts without the async clipboard API
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;opacity:0;left:-9999px';
      body.append(ta);
      ta.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch { ok = false; }
      ta.remove();
      return ok;
    }
  };

  $$('[data-copy-email]').forEach(btn => btn.addEventListener('click', async () => {
    const ok = await copyText(CONTACT.email);
    const label = $('[data-copy-label]', btn);
    if (!ok) { showToast(`${t('Copy failed. Email:')} ${CONTACT.email}`); return; }
    showToast(`${CONTACT.email} ${t('copied to clipboard')}`);
    btn.classList.add('is-copied');
    if (label) {
      label.dataset.original ??= label.textContent;
      label.textContent = label.dataset.done;
    }
    clearTimeout(btn._t);
    btn._t = setTimeout(() => {
      btn.classList.remove('is-copied');
      if (label) label.textContent = label.dataset.original;
    }, 2000);
  }));

  /* header "Let's talk" pop-over */
  const talk = $('.nav__talk');
  const pop = $('#contactPop');
  const setPop = open => {
    if (!talk) return;
    body.classList.toggle('pop-open', open);
    talk.setAttribute('aria-expanded', open);
    if (open) nav.classList.remove('is-hidden');
  };
  talk?.addEventListener('click', e => { e.stopPropagation(); setPop(!body.classList.contains('pop-open')); });
  document.addEventListener('click', e => {
    if (!body.classList.contains('pop-open') || pop.contains(e.target)) return;
    setPop(false);
  });
  pop?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setPop(false)));
  addEventListener('keydown', e => {
    if (e.key === 'Escape' && body.classList.contains('pop-open')) { setPop(false); talk.focus(); }
  });

  /* ---------- Contact modal ("Get in touch") ---------- */
  const cmodal = $('#contactModal');
  if (cmodal) {
    let opener = null;
    const closeModal = () => {
      if (!cmodal.open || cmodal.classList.contains('is-closing')) return;
      cmodal.classList.add('is-closing');
      setTimeout(() => {
        cmodal.close();
        cmodal.classList.remove('is-closing');
        body.classList.remove('modal-open');
        opener?.focus();
      }, reduce ? 0 : 320);
    };
    $$('[data-contact-open]').forEach(btn => btn.addEventListener('click', () => {
      opener = btn;
      setPop(false);
      cmodal.showModal();
      body.classList.add('modal-open');
    }));
    $$('[data-contact-close]', cmodal).forEach(b => b.addEventListener('click', closeModal));
    $$('.copt', cmodal).forEach(a => a.addEventListener('click', closeModal));
    cmodal.addEventListener('click', e => { if (e.target === cmodal) closeModal(); });
    cmodal.addEventListener('cancel', e => { e.preventDefault(); closeModal(); });
  }

  /* ---------- Misc ---------- */
  $$('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
  $$('[data-top]').forEach(b => b.addEventListener('click', () => scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })));

  /* ---------- Cursor ---------- */
  const cur = $('.cursor');
  const label = $('.cursor__label');
  let mx = -100, my = -100, cx = -100, cy = -100;
  if (fine && cur) {
    addEventListener('pointermove', e => { mx = e.clientX; my = e.clientY; cur.classList.add('is-visible'); }, { passive: true });
    document.documentElement.addEventListener('pointerleave', () => cur.classList.remove('is-visible'));
    addEventListener('pointerdown', () => cur.classList.add('is-down'));
    addEventListener('pointerup', () => cur.classList.remove('is-down'));
    document.addEventListener('pointerover', e => {
      const t = e.target.closest('[data-cursor]');
      const l = e.target.closest('a, button, [tabindex]');
      if (t) { label.textContent = t.dataset.cursor; cur.classList.add('is-hover'); cur.classList.remove('is-link'); }
      else { cur.classList.remove('is-hover'); cur.classList.toggle('is-link', !!l); }
    });

    // Modal <dialog>s render in the browser's top layer, above any z-index.
    // Keep the cursor in the top layer too (as a manual popover) and re-raise it
    // whenever a dialog opens, so it always draws above the modal.
    const canPopover = typeof cur.showPopover === 'function';
    const raiseCursor = () => {
      if (!canPopover) return;
      if (cur.matches(':popover-open')) cur.hidePopover();
      cur.showPopover();
    };
    if (canPopover) {
      cur.setAttribute('popover', 'manual');
      raiseCursor();
    }
    new MutationObserver(() => {
      const anyOpen = $$('dialog[open]').length > 0;
      // Without popover support, fall back to the system cursor while a modal is open
      document.documentElement.classList.toggle('native-cursor', anyOpen && !canPopover);
      if (anyOpen) raiseCursor();
    }).observe(body, { subtree: true, attributes: true, attributeFilter: ['open'] });
  } else cur?.remove();

  /* ---------- Scroll + animation loop ---------- */
  const progress = $('.progress');
  const hero = $('.hero');
  const marquee = $('.marquee__track');
  let hx = 0, hy = 0, tx = 0, ty = 0, lastY = scrollY, skew = 0;

  if (hero && fine && !reduce) {
    hero.addEventListener('pointermove', e => {
      const r = hero.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width - 0.5;
      ty = (e.clientY - r.top) / r.height - 0.5;
    });
    hero.addEventListener('pointerleave', () => { tx = 0; ty = 0; });
  }

  const onScroll = () => {
    const y = scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    nav.classList.toggle('is-scrolled', y > 20);
    if (!body.classList.contains('menu-open') && !body.classList.contains('pop-open')) nav.classList.toggle('is-hidden', y > lastY && y > 160);
    if (!reduce) {
      skew += Math.max(-10, Math.min(10, (y - lastY) * 0.35));
      if (hero && y < innerHeight * 1.2) hero.style.setProperty('--sy', y.toFixed(1));
    }
    lastY = y;
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const tick = () => {
    if (cur && fine) {
      cx += (mx - cx) * 0.2; cy += (my - cy) * 0.2;
      cur.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
    }
    if (hero && !reduce) {
      hx += (tx - hx) * 0.08; hy += (ty - hy) * 0.08;
      hero.style.setProperty('--mx', hx.toFixed(4));
      hero.style.setProperty('--my', hy.toFixed(4));
    }
    if (marquee && !reduce) {
      skew *= 0.9;
      skew = Math.max(-14, Math.min(14, skew));
      marquee.style.setProperty('--skew', `${skew.toFixed(2)}deg`);
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
})();
