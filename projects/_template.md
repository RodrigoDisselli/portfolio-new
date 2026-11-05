---
# ─────────────────────────────────────────────────────────────────────────────
# PROJECT TEMPLATE (English version): copy this file to projects/<your-slug>.md
# and _template.pt.md to projects/<your-slug>.pt.md (same slug for both), then
# add { slug: '<your-slug>' } to window.PROJECT_FILES in js/projects.js.
# Lines starting with # inside this header are comments.
# ─────────────────────────────────────────────────────────────────────────────
title: Project title
# cardTitle: Shorter title for the gallery card (optional)
categoryLabel: Enterprise · Web app
year: 2026
# Cover image for the gallery card and the page header (optional).
# Without it, a placeholder cover in style v1–v6 is used.
# cover: assets/projects/your-slug/cover.jpg
coverStyle: v1
# Banner image at the top of the case-study page (optional, wide images work best):
# header: projects/projects-assets/your-slug/your-slug-header.png
# headerAlt: Short description of the image
summary: One-line description shown under the page title.
meta:
  - Role: Lead UX/UI Designer
  - Client: Client name
  - Timeline: 12 weeks
  - Platform: Web
---

The first paragraph before any heading becomes the large intro text. Inline formatting works everywhere: **bold**, *italic*, `code` and [links](https://example.com).

<!-- HTML comments are ignored. Use them for notes to yourself. -->

## Section heading {#context}

Every `##` heading becomes a numbered section and appears in the "On this page" menu. The optional `{#id}` sets the anchor.

Regular paragraphs are written as plain text, separated by a blank line.

### Subheading

A `###` heading is a smaller title inside a section.

## Images and GIFs {#media}

![Label shown on the placeholder](placeholder "Caption under the image (optional)")

![Screenshot of the dashboard](assets/projects/your-slug/dashboard.png "Real image: put the file path inside the parentheses.")

![Interaction GIF](assets/projects/your-slug/flow.gif "Files ending in .gif get the GIF badge automatically.")

![GIF placeholder](placeholder "Use {gif} to mark a placeholder as a GIF, and ratio to set its shape. Real images always keep their own proportions."){gif ratio="16/10"}

## Quotes and lists {#lists}

> A quote from a user or stakeholder.
> — Name, role

- Bullet item
- Another item

1. Numbered item
2. Another numbered item

- [x] Checklist item (renders with animated check marks)
- [x] Another checked item

## Table {#table}

| Column A | Column B | Column C |
| --- | --- | --- |
| Cell | Cell | Cell |
| Cell | Cell | Cell |

## Special blocks {#blocks}

:::callout
A highlighted red note, good for key takeaways or results.
:::

:::stats
40% | Faster task completion
3x | More weekly active users
12 | Usability sessions
:::

:::cards
### Term or concept
Short explanation shown in a card.
### Another term
Cards appear in a two-column grid.
:::

:::principles
### First principle
Numbered dark blocks for design principles or key decisions.
### Second principle
Each `###` starts a new item.
:::

:::split
### Included
- In scope item
- Another in scope item
### Excluded {out}
- Out of scope item
:::

:::accordion
### Expandable group {REQ-001}
Optional paragraph inside the group.
- Detail one
- Detail two
### Another group {REQ-002}
- Detail
:::

## Prototype {#prototype}

:::prototype title="Try the prototype" url="https://www.figma.com/proto/…" embed="https://www.figma.com/embed?embed_host=share&url=…"
Short description of what the prototype shows. `url` opens in a new tab; `embed` is shown inside the preview window.
:::
