# Projects

Each case study is a Markdown file in this folder. The home gallery and the
case-study page (`project.html?p=<slug>`) are built from these files.

## Two languages per project

Every project has two files with the same slug:

| File | Shown when the site language is |
| --- | --- |
| `<slug>.md` | English |
| `<slug>.pt.md` | Portuguese (Brazil) |

The case-study page and the gallery load the file that matches the language
selected in the header, and switching EN/PT reloads into the other version.
If a `.pt.md` file is missing, the English file is shown instead, so a page
never breaks. Keep both files in sync when you edit a project.

## Add or edit a project

1. Copy `_template.md` to `<slug>.md` and `_template.pt.md` to
   `<slug>.pt.md` (for example `design-system.md` + `design-system.pt.md`).
2. Fill in each header (between the `---` lines) and write the page below it,
   in English and in Portuguese.
3. Add the slug to `window.PROJECT_FILES` in `js/projects.js`. The order of
   that list is the order of the gallery and of the "Next project" links.
4. Put images in `projects/projects-assets/<slug>/` and reference them with a
   path relative to the Markdown file, e.g.
   `![Alt text](./projects-assets/<slug>/screen.png "Caption")`.
   Paths starting with `./` or `../` are relative to the `.md` file; any other
   path is relative to the site root. Both language files can share images.

To remove a project, delete its line from `window.PROJECT_FILES`.

## Header fields

| Field | Used for |
| --- | --- |
| `title` | Page title, gallery card and "Next project" link |
| `cardTitle` | Optional shorter title for the gallery card |
| `categoryLabel` | Small label above the title and on the card |
| `year` | Shown next to the category |
| `cover` | Optional cover image path, used for the card and page header |
| `header` | Optional banner image at the top of the case-study page (falls back to `cover`, then to the placeholder) |
| `headerAlt` | Description of the banner image for screen readers |
| `coverStyle` | Placeholder cover style `v1`–`v6` when there's no `cover` |
| `summary` | One-line description under the page title |
| `meta` | List of `- Label: Value` pairs shown under the summary |

## Page syntax

| Write | You get |
| --- | --- |
| First paragraph before any heading | Large intro text |
| `## Heading {#id}` | Numbered section, listed in "On this page" |
| `### Heading` | Subheading |
| Plain paragraphs | Body text |
| `**bold**`, `*italic*`, `` `code` ``, `[text](url)` | Inline formatting |
| `![Label](path "Caption")` | Image. Use `placeholder` as the path for a placeholder |
| `.gif` path, or `{gif}` after the image | GIF block with badge |
| `{ratio="4/3"}` after a placeholder | Placeholder shape (real images always keep their own proportions) |
| `> quote` + `> — Name` | Quote with attribution |
| `- item` / `1. item` | Bullet / numbered list |
| `- [x] item` | Animated checklist |
| Pipe table | Table (becomes stacked cards on phones) |
| `:::callout` … `:::` | Highlighted red note |
| `:::stats` with `40% \| Label` lines | Animated counters |
| `:::cards` with `### Title` + text | Two-column term cards |
| `:::principles` with `### Title` + text | Numbered principle blocks |
| `:::split` with `### Included` / `### Excluded {out}` + lists | Two-column scope lists |
| `:::accordion` with `### Title {TAG}` + lists | Expandable groups |
| `:::prototype title="…" url="…" embed="…"` + text | Prototype card with preview window |
| `<!-- note -->` | Ignored (notes to yourself) |

`_template.md` (English) and `_template.pt.md` (Portuguese) show every option in context.

## Previewing locally

Browsers only load Markdown files over http, so opening `index.html` by
double-clicking shows a notice instead of the projects. From the portfolio
folder, run one of:

```
npx serve
python3 -m http.server
```

and open the address it prints (for example http://localhost:3000 or
http://localhost:8000). Any static host (GitHub Pages, Netlify, Vercel…)
works without extra setup.
