/* ==========================================================================
   CASE STUDY RENDERER
   Loads projects/<slug>.md (see js/projects.js) for project.html?p=<slug>,
   renders it, then hands the new content to the shared interactions
   (window.Portfolio.enhance) for translation, split text and reveals.
   Text fields arrive as HTML already escaped by the Markdown parser.
   ========================================================================== */
(() => {
  const root = document.getElementById('article');
  const files = window.PROJECT_FILES || [];
  if (!root || !files.length) return;

  const t = window.I18N ? window.I18N.t : (x => x);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const strip = html => String(html ?? '').replace(/<[^>]+>/g, '');
  const enhance = el => window.Portfolio?.enhance(el);

  const slug = new URLSearchParams(location.search).get('p');
  const idx = Math.max(0, files.findIndex(f => f.slug === slug));
  const nextEntry = files[(idx + 1) % files.length];

  const notice = (title, html) => {
    root.innerHTML = `
      <section class="p-hero p-notice">
        <a href="index.html#work" class="p-back link">← All work</a>
        <h1 class="p-title">${title}</h1>
        <div class="p-sub">${html}</div>
      </section>`;
    enhance(root);
  };

  /* ---------- Block renderers ---------- */
  let h2Count = 0;
  const toc = [];

  // Real images are shown at their own proportions (no crop). Placeholders have
  // no image to measure, so they use the ratio set in Markdown (default 16:9).
  const media = (b, kind) => {
    const badge = kind === 'gif' ? '<span class="badge">GIF</span>' : '';
    const frame = b.src
      ? `<div class="blk-media__frame has-image">${badge}<img src="${esc(b.src)}" alt="${b.alt || strip(b.caption)}" loading="lazy"></div>`
      : `<div class="blk-media__frame" style="aspect-ratio:${esc(b.ratio || '16/9')}">${badge}
           <div class="ph">
             <span class="ph__icon" aria-hidden="true">${kind === 'gif' ? '▶' : '▣'}</span>
             <span class="ph__label">${b.label || (kind === 'gif' ? 'GIF placeholder' : 'Image placeholder')}</span>
           </div>
         </div>`;
    return `<figure class="blk blk-media">${frame}${b.caption ? `<figcaption>${b.caption}</figcaption>` : ''}</figure>`;
  };

  const R = {
    lead: b => `<p class="blk blk-lead reveal">${b.text}</p>`,
    heading: b => {
      h2Count++;
      const id = b.id || `section-${h2Count}`;
      const n = String(h2Count).padStart(2, '0');
      toc.push({ id, n, text: b.text });
      return `<h2 class="blk blk-h2" id="${esc(id)}"><span class="blk-h2__n mono">${n}</span><span data-split="words">${b.text}</span></h2>`;
    },
    subheading: b => `<h3 class="blk blk-h3 reveal">${b.text}</h3>`,
    text: b => `<div class="blk blk-text reveal">${b.html}</div>`,
    quote: b => `<blockquote class="blk blk-quote reveal"><p>“${b.text}”</p>${b.cite ? `<cite class="mono">${b.cite}</cite>` : ''}</blockquote>`,
    list: b => {
      const tag = b.ordered ? 'ol' : 'ul';
      return `<${tag} class="blk blk-list${b.ordered ? ' is-ordered' : ''}">${b.items.map((it, i) => `<li class="reveal" style="--d:${i * 60}ms">${it}</li>`).join('')}</${tag}>`;
    },
    image: b => media(b, 'image'),
    gif: b => media(b, 'gif'),
    cards: b => `<div class="blk blk-cards">${b.items.map((c, i) => `
      <article class="term reveal" style="--d:${(i % 2) * 80}ms" tabindex="0">
        <h3>${c.title}</h3><p>${c.text}</p>
      </article>`).join('')}</div>`,
    principles: b => `<div class="blk blk-principles">${b.items.map((c, i) => `
      <article class="principle reveal">
        <span class="principle__n">${String(i + 1).padStart(2, '0')}</span>
        <div><h3>${c.title}</h3><p>${c.text}</p></div>
      </article>`).join('')}</div>`,
    split: b => `<div class="blk blk-split">${b.columns.map(c => `
      <div class="split split--${c.tone} reveal">
        <h3 class="mono">${c.title} <span>${c.items.length}</span></h3>
        <ul>${c.items.map(it => `<li>${it}</li>`).join('')}</ul>
      </div>`).join('')}</div>`,
    accordion: b => `<div class="blk blk-acc">${b.items.map((it, i) => `
      <div class="acc reveal">
        <button class="acc__head" aria-expanded="false" aria-controls="acc-${h2Count}-${i}" data-ripple>
          <span class="acc__title">${it.title}</span>
          <span class="acc__tag mono">${it.tag || ''}</span>
          <span class="acc__icon" aria-hidden="true"></span>
        </button>
        <div class="acc__body" id="acc-${h2Count}-${i}"><div>
          ${it.text ? `<p class="acc__text">${it.text}</p>` : ''}
          ${it.items.length ? `<ul>${it.items.map(x => `<li>${x}</li>`).join('')}</ul>` : ''}
        </div></div>
      </div>`).join('')}</div>`,
    table: b => `<div class="blk blk-table reveal"><table>
      <thead><tr>${b.head.map(x => `<th>${x}</th>`).join('')}</tr></thead>
      <tbody>${b.rows.map(r => `<tr>${r.map((x, j) => `<td data-label="${esc(strip(b.head[j]))}">${x}</td>`).join('')}</tr>`).join('')}</tbody>
    </table></div>`,
    stats: b => `<div class="blk blk-stats">${b.items.map((s, i) => `
      <div class="stat reveal" style="--d:${i * 90}ms"><strong>${s.raw != null ? s.raw : `<span data-count="${Number(s.value) || 0}">0</span>${esc(s.suffix || '')}`}</strong><span>${s.label}</span></div>`).join('')}</div>`,
    checklist: b => `<ul class="blk blk-check">${b.items.map((it, i) => `
      <li class="reveal" style="--d:${i * 70}ms"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="1.5" y="1.5" width="21" height="21"/><path d="M6 12.5l4 4 8-9"/></svg><span>${it}</span></li>`).join('')}</ul>`,
    callout: b => `<div class="blk blk-callout reveal"><span aria-hidden="true">✺</span><p>${b.text}</p></div>`,
    prototype: b => `<div class="blk blk-proto reveal">
      <div class="blk-proto__copy">
        <span class="eyebrow eyebrow--light">Interactive prototype</span>
        <h3>${b.title}</h3>
        <p>${b.text}</p>
        <div class="blk-proto__actions">
          <button class="btn btn--accent" data-proto-open data-embed="${esc(b.embed)}" data-url="${esc(b.url)}" data-ripple data-magnetic=".2">Preview prototype <span aria-hidden="true">↗</span></button>
          ${b.url ? `<a class="btn btn--ghost" href="${esc(b.url)}" target="_blank" rel="noopener" data-ripple>Open in Figma</a>` : ''}
        </div>
      </div>
      <button class="blk-proto__device" data-proto-open data-embed="${esc(b.embed)}" data-url="${esc(b.url)}" data-cursor="Play" aria-label="Preview prototype">
        <span class="device"><span class="device__screen"><span></span><span></span><span></span><span></span></span></span>
        <span class="play" aria-hidden="true">▶</span>
      </button>
    </div>`
  };

  const render = (p, next) => {
    document.title = `${t(p.title || 'Case study')} · Rodrigo Disselli`;
    const body = (p.blocks || []).map(b => (R[b.type] ? R[b.type](b) : '')).join('');
    root.innerHTML = `
      <header class="p-hero">
        <a href="index.html#work" class="p-back link">← All work</a>
        <div class="p-hero__top"><span class="eyebrow">${esc(p.categoryLabel)}</span><span class="mono">${esc(p.year)}</span></div>
        <h1 class="p-title" data-split="words">${esc(p.title)}</h1>
        ${p.summary ? `<p class="p-sub reveal">${esc(p.summary)}</p>` : ''}
        ${p.meta.length ? `<dl class="p-meta">${p.meta.map((m, i) => `<div class="reveal" style="--d:${i * 80}ms"><dt class="mono">${esc(m.label)}</dt><dd>${esc(m.value)}</dd></div>`).join('')}</dl>` : ''}
      </header>
      ${p.header
        ? `<figure class="p-cover p-cover--image"><img src="${esc(p.header)}" alt="${esc(p.headerAlt || p.title)}" fetchpriority="high"></figure>`
        : `<div class="p-cover"><div class="p-cover__inner">${window.coverHTML(p, idx)}</div></div>`}
      <div class="p-body">
        <aside class="toc" aria-label="On this page">
          <p class="mono toc__h">On this page</p>
          <ol>${toc.map(x => `<li><a href="#${esc(x.id)}"><span class="mono">${x.n}</span>${x.text}</a></li>`).join('')}</ol>
        </aside>
        <article class="p-content">${body}</article>
      </div>
      ${next && !next.error ? `
      <a class="next" href="project.html?p=${encodeURIComponent(next.slug)}" data-cursor="Next">
        <span class="mono">Next project</span>
        <span class="next__title">${esc(next.title)} <span class="next__arrow" aria-hidden="true">→</span></span>
      </a>` : ''}`;
    enhance(root);

    /* Table of contents: highlight the section in view */
    const links = [...root.querySelectorAll('.toc a')];
    const spy = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) links.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === `#${e.target.id}`));
    }), { rootMargin: '-25% 0px -65% 0px' });
    root.querySelectorAll('.blk-h2').forEach(h => spy.observe(h));

    /* Jump to a #section once the content exists */
    if (location.hash) document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView();
  };

  Promise.all([window.loadProject(files[idx]), window.loadProject(nextEntry).catch(error => ({ error }))])
    .then(([p, next]) => render(p, next))
    .catch(err => {
      console.error(err);
      if (location.protocol === 'file:') {
        notice('Preview needs a local server',
          '<p>Projects are loaded from Markdown files, and browsers only allow that over http. Open a terminal in the portfolio folder and run <code>npx serve</code> or <code>python3 -m http.server</code>, then visit the address it prints.</p>');
      } else {
        notice('Project not found',
          `<p>The file <code>projects/${esc(files[idx].slug)}.md</code> could not be loaded.</p>`);
      }
    });

  /* ---------- Accordion ---------- */
  root.addEventListener('click', e => {
    const head = e.target.closest('.acc__head');
    if (!head) return;
    const open = head.getAttribute('aria-expanded') !== 'true';
    head.setAttribute('aria-expanded', open);
    head.parentElement.classList.toggle('is-open', open);
  });

  /* ---------- Prototype modal ---------- */
  const modal = document.getElementById('protoModal');
  const stage = modal.querySelector('.modal__stage');
  const ext = modal.querySelector('.modal__ext');

  const open = (embed, url) => {
    stage.innerHTML = embed
      ? `<iframe src="${esc(embed)}" title="Prototype preview" allowfullscreen loading="lazy"></iframe>`
      : `<div class="modal__empty">
           <span class="modal__spinner" aria-hidden="true"></span>
           <p class="display">Prototype coming soon</p>
           <p>Add an <code>embed="…"</code> URL to the <code>:::prototype</code> block in this project's Markdown file to show it here.</p>
         </div>`;
    window.I18N?.apply(stage);
    ext.hidden = !url;
    if (url) ext.href = url;
    modal.classList.remove('is-closing');
    modal.showModal();
    document.body.classList.add('modal-open');
  };
  const close = () => {
    modal.classList.add('is-closing');
    setTimeout(() => { modal.close(); stage.innerHTML = ''; document.body.classList.remove('modal-open'); }, 320);
  };

  root.addEventListener('click', e => {
    const btn = e.target.closest('[data-proto-open]');
    if (btn) open(btn.dataset.embed, btn.dataset.url);
  });
  modal.querySelector('.modal__close').addEventListener('click', close);
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
  modal.addEventListener('cancel', e => { e.preventDefault(); close(); });
})();
