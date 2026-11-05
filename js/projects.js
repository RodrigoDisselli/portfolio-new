/* ==========================================================================
   PROJECTS: one Markdown file per project
   --------------------------------------------------------------------------
   Each project has two files, one per site language:
     projects/<slug>.md      English
     projects/<slug>.pt.md   Portuguese (Brazil)
   The file matching the language selected on the site is loaded. If the
   Portuguese file is missing, the English one is shown instead.
   The order below is the order of the home gallery and "Next project" links.
   To add a project: create both files (copy projects/_template.md and
   projects/_template.pt.md) and add the slug here. Pages: project.html?p=<slug>.

   Markdown syntax supported: see projects/README.md.
   Note: browsers only load .md files over http(s), so preview the site with
   a local server (e.g. `npx serve` or `python3 -m http.server`) or a host.
   ========================================================================== */

window.PROJECT_FILES = [
  { slug: 'project-01' },
  { slug: 'project-02' },
  { slug: 'project-03' },
  { slug: 'project-04' },
  { slug: 'project-05' },
  { slug: 'project-06' }
];

(() => {
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const safeUrl = u => (/^(https?:|mailto:|#|\/|\.\/|\.\.\/)/i.test(u) || !/^[a-z][a-z0-9+.-]*:/i.test(u) ? u : '#');

  /* ---------- Inline Markdown: **bold**, *italic*, `code`, [link](url) ---------- */
  const inline = s => esc(s)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*\w])\*([^*\s][^*]*?)\*(?!\w)/g, '$1<em>$2</em>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, text, url) => {
      const href = safeUrl(url.replace(/&amp;/g, '&'));
      const ext = /^https?:/i.test(href) ? ' target="_blank" rel="noopener"' : '';
      return `<a class="link" href="${esc(href)}"${ext}>${text}</a>`;
    });

  /* ---------- Front matter (simple YAML: key: value, and "- Label: Value" lists) ---------- */
  const unquote = s => s.trim().replace(/^(['"])(.*)\1$/, '$2');
  const frontMatter = src => {
    const m = src.match(/^﻿?---[ \t]*\n([\s\S]*?)\n---[ \t]*(\n|$)/);
    if (!m) return { data: {}, body: src };
    const data = {};
    let listKey = null;
    m[1].split('\n').forEach(line => {
      if (!line.trim() || line.trim().startsWith('#')) return;
      const item = line.match(/^\s+-\s+(.*)$/);
      if (item && listKey) {
        const kv = item[1].match(/^([^:]+):\s*(.*)$/);
        data[listKey].push(kv ? { label: unquote(kv[1]), value: unquote(kv[2]) } : unquote(item[1]));
        return;
      }
      const kv = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
      if (!kv) return;
      if (kv[2].trim() === '') { listKey = kv[1]; data[listKey] = []; }
      else { listKey = null; data[kv[1]] = unquote(kv[2]); }
    });
    return { data, body: src.slice(m[0].length) };
  };

  /* {attr} suffixes:  "Title {tag}"  →  ["Title", "tag"] */
  const splitBraces = s => {
    const m = s.match(/^(.*?)\s*\{([^}]*)\}\s*$/);
    return m ? [m[1], m[2].trim()] : [s, ''];
  };
  const attrs = s => {
    const out = {};
    (s || '').replace(/(\w+)(?:="([^"]*)")?/g, (m, k, v) => { out[k] = v ?? true; });
    return out;
  };

  /* "### Title {extra}" sections inside a ::: block */
  const sections = lines => {
    const out = [];
    lines.forEach(l => {
      const h = l.match(/^#{2,4}\s+(.*)$/);
      if (h) { const [title, extra] = splitBraces(h[1]); out.push({ title, extra, lines: [] }); return; }
      if (out.length && l.trim()) out[out.length - 1].lines.push(l.trim());
    });
    return out;
  };
  const listItems = lines => lines.filter(l => /^([-*]|\d+\.)\s+/.test(l)).map(l => inline(l.replace(/^([-*]|\d+\.)\s+/, '')));
  const paraText = lines => inline(lines.filter(l => !/^([-*]|\d+\.)\s+/.test(l)).join(' '));

  /* ---------- Custom blocks:  :::name attrs  …  ::: ---------- */
  const directive = (name, attrStr, lines) => {
    const a = attrs(attrStr);
    switch (name) {
      case 'callout':
        return { type: 'callout', text: inline(lines.join(' ').trim()) };
      case 'prototype':
        return { type: 'prototype', title: inline(a.title || 'Prototype'), text: inline(lines.join(' ').trim()), url: a.url ? safeUrl(a.url) : '', embed: a.embed ? safeUrl(a.embed) : '' };
      case 'stats':
        return {
          type: 'stats',
          items: lines.filter(l => l.includes('|')).map(l => {
            const [v, ...rest] = l.split('|');
            const m = v.trim().match(/^([\d.,]+)(.*)$/);
            return m
              ? { value: Number(m[1].replace(/,/g, '')), suffix: m[2].trim(), label: inline(rest.join('|').trim()) }
              : { raw: inline(v.trim()), label: inline(rest.join('|').trim()) };
          })
        };
      case 'cards':
      case 'principles':
        return { type: name, items: sections(lines).map(s => ({ title: inline(s.title), text: paraText(s.lines) })) };
      case 'split':
        return { type: 'split', columns: sections(lines).map((s, i) => ({ title: inline(s.title), tone: s.extra === 'out' || (!s.extra && i > 0) ? 'out' : 'in', items: listItems(s.lines) })) };
      case 'accordion':
        return { type: 'accordion', items: sections(lines).map(s => ({ title: inline(s.title), tag: esc(s.extra), items: listItems(s.lines), text: paraText(s.lines) })) };
      default:
        return { type: 'text', html: `<p>${inline(lines.join(' '))}</p>` };
    }
  };

  /* ---------- Block-level Markdown → portfolio blocks ---------- */
  const parseBody = (md, resolve = u => u) => {
    const lines = md.replace(/\r\n?/g, '\n').split('\n');
    const blocks = [];
    let para = [];
    let headingSeen = false;

    const pushText = html => {
      const last = blocks[blocks.length - 1];
      if (last && last.type === 'text') last.html += html;
      else blocks.push({ type: 'text', html });
    };
    const flush = () => {
      if (!para.length) return;
      const text = inline(para.join(' '));
      // The first paragraph before any heading becomes the intro ("lead")
      if (!headingSeen && !blocks.length) blocks.push({ type: 'lead', text });
      else pushText(`<p>${text}</p>`);
      para = [];
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trim = line.trim();

      if (!trim) { flush(); continue; }
      if (trim.startsWith('<!--')) { // HTML comments are ignored (use them for notes)
        flush();
        while (i < lines.length && !lines[i].includes('-->')) i++;
        continue;
      }

      const dir = trim.match(/^:::\s*([\w-]+)\s*(.*)$/);
      if (dir) {
        flush();
        const inner = [];
        i++;
        while (i < lines.length && lines[i].trim() !== ':::') inner.push(lines[i++]);
        blocks.push(directive(dir[1].toLowerCase(), dir[2], inner.map(l => l.trimEnd())));
        continue;
      }

      const h = trim.match(/^(#{1,3})\s+(.*)$/);
      if (h) {
        flush();
        headingSeen = true;
        const [text, extra] = splitBraces(h[2]);
        const id = (extra.match(/^#([\w-]+)$/) || [])[1];
        if (h[1].length === 3) blocks.push({ type: 'subheading', text: inline(text) });
        else blocks.push({ type: 'heading', text: inline(text), plain: text, id });
        continue;
      }

      const img = trim.match(/^!\[([^\]]*)\]\(([^)\s]*)(?:\s+"([^"]*)")?\)\s*(?:\{([^}]*)\})?$/);
      if (img) {
        flush();
        const a = attrs(img[4]);
        const src = img[2] && img[2] !== 'placeholder' ? safeUrl(resolve(img[2])) : '';
        const isGif = a.gif === true || /\.gif(\?|$)/i.test(src);
        blocks.push({ type: isGif ? 'gif' : 'image', src, label: inline(img[1]), alt: esc(img[1]), caption: img[3] ? inline(img[3]) : '', ratio: a.ratio || '' });
        continue;
      }

      if (trim.startsWith('>')) {
        flush();
        const q = [];
        while (i < lines.length && lines[i].trim().startsWith('>')) q.push(lines[i++].trim().replace(/^>\s?/, ''));
        i--;
        let cite = '';
        if (q.length > 1 && /^(—|--)\s*/.test(q[q.length - 1])) cite = q.pop().replace(/^(—|--)\s*/, '');
        blocks.push({ type: 'quote', text: inline(q.join(' ').replace(/^[“"]|[”"]$/g, '')), cite: inline(cite) });
        continue;
      }

      if (trim.startsWith('|')) {
        flush();
        const rows = [];
        while (i < lines.length && lines[i].trim().startsWith('|')) rows.push(lines[i++].trim());
        i--;
        const cells = r => r.replace(/^\||\|$/g, '').split('|').map(c => c.trim());
        const body = rows.slice(1).filter(r => !/^\|?\s*:?-{2,}/.test(r));
        blocks.push({ type: 'table', head: cells(rows[0]).map(inline), rows: body.map(r => cells(r).map(inline)) });
        continue;
      }

      if (/^([-*]|\d+\.)\s+/.test(trim)) {
        flush();
        const ordered = /^\d+\./.test(trim);
        const items = [];
        let checklist = true;
        while (i < lines.length && (/^([-*]|\d+\.)\s+/.test(lines[i].trim()) || (/^\s{2,}\S/.test(lines[i]) && items.length))) {
          const l = lines[i++];
          if (/^\s{2,}\S/.test(l) && !/^\s*([-*]|\d+\.)\s+/.test(l)) { items[items.length - 1] += ' ' + l.trim(); continue; }
          const text = l.trim().replace(/^([-*]|\d+\.)\s+/, '');
          if (!/^\[[ xX]\]\s+/.test(text)) checklist = false;
          items.push(text);
        }
        i--;
        if (checklist) blocks.push({ type: 'checklist', items: items.map(x => inline(x.replace(/^\[[ xX]\]\s+/, ''))) });
        else blocks.push({ type: 'list', ordered, items: items.map(inline) });
        continue;
      }

      para.push(trim);
    }
    flush();
    return blocks;
  };

  /* ---------- Loading ---------- */
  const cache = new Map();
  const fetchText = async path => {
    const res = await fetch(path, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`${path}: ${res.status}`);
    return res.text();
  };

  window.loadProject = entry => {
    const slug = typeof entry === 'string' ? entry : entry.slug;
    const lang = window.I18N ? window.I18N.lang : 'en';
    const key = `${slug}:${lang}`;
    if (!cache.has(key)) {
      cache.set(key, (async () => {
        let src = null;
        if (lang === 'pt') src = await fetchText(`projects/${slug}.pt.md`).catch(() => null);
        if (src == null) src = await fetchText(`projects/${slug}.md`);
        const { data, body } = frontMatter(src);
        // "./img.png" or "../img.png" → relative to the .md file; anything else → relative to the site root
        const resolve = u => {
          if (!/^\.\.?\//.test(u || '')) return u;
          try { return new URL(u, new URL('projects/', location.href)).href; } catch { return u; }
        };
        ['header', 'cover'].forEach(k => { if (data[k]) data[k] = resolve(data[k]); });
        return { slug, ...data, meta: Array.isArray(data.meta) ? data.meta : [], blocks: parseBody(body, resolve) };
      })());
    }
    return cache.get(key);
  };

  /* All projects in gallery order; failed files come back as { slug, error } */
  window.loadProjects = () => Promise.all(window.PROJECT_FILES.map(entry =>
    window.loadProject(entry).catch(error => ({ slug: entry.slug, error }))));

  window.ProjectMarkdown = { parseBody, frontMatter, inline };
})();

/* Cover art: uses `cover` (an image path) when set, otherwise a placeholder. */
window.coverHTML = function (p, i) {
  const num = String(i + 1).padStart(2, '0');
  if (p.cover) return `<div class="cover"><img src="${String(p.cover).replace(/"/g, '&quot;')}" alt="" loading="lazy"></div>`;
  return `<div class="cover cover--ph cover--${p.coverStyle || 'v1'}" aria-hidden="true">
    <span class="cover__shape"></span>
    <span class="cover__big">${num}</span>
    <span class="cover__label">Cover placeholder</span>
  </div>`;
};
