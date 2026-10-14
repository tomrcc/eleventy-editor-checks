# Eleventy editor checks

Thirteen checks that only the CloudCannon editor can answer, ordered by how much shipped skill text each one could change. Every value to look for starts with `CHECK-<n>`.

Skill paths below are relative to `agent-skills/skills/` on the `11ty-skills` branch, with line numbers as of 2026-10-14.

## Before you start

- Push this repo to a new GitHub repo, then create a CloudCannon site from it. `.cloudcannon/initial-site-settings.json` sets `ssg: eleventy`, `npm i`, `npx @11ty/eleventy` (no watcher) and output `_site`.
- Wait for the first build to go green before opening anything.
- Every save in CloudCannon makes a commit. For each check that says "check the diff", read that commit's diff on GitHub, and confirm the rebuild that follows it passes (the site's build status).
- **Run check 11 after checks 1, 3, 4, 7 and 10.** It adds `_snippets_imports` to the config, which would change what those checks see.
- The site has three collections: **Pages** (`src`), **Posts** (`src/posts`) and **Data** (`src/_data`).

---

## 1. Snippet templates resolve with no `_snippets_imports`

- **Page:** Pages → `check-01-snippet-no-imports.md`, in the **Content Editor**.
- **Element:** the line `{% badge "CHECK-1 badge text" %}` between two paragraphs. Its snippet entry is labelled **CHECK-1 Badge snippet**.
- **Do:**
  1. Look at how the shortcode line shows in the body.
  2. If it shows as a snippet, click it, change the `label` field to `CHECK-1 edited`, and save.
  3. Check the diff.
- **Outcomes:**
  - It shows as a **CHECK-1 Badge snippet** card, and the diff is `{% badge "CHECK-1 edited" %}` → the skill's default holds. No change to `cloudcannon-snippets/eleventy/overview.md:43-45` (§ No `_snippets_imports`) or `cloudcannon-snippets/built-in-templates.md:3`.
  - It shows as plain paragraph text, or as an "Unknown Shortcode" card → Eleventy templates need an import to resolve. Rewrite `cloudcannon-snippets/eleventy/overview.md:43-45` to require `_snippets_imports: { eleventy_liquid: … }` with an `include` list, update the verification item at `:135` and the raw-tags exception at `:110-121`, and qualify `built-in-templates.md:3`. Checks 3, 4 and 7 then can't be read until the import is added.

## 2. A component bound to `@data[nav]` re-renders live

- **Page:** Pages → `check-02-navbar.md`, in the **Visual Editor**.
- **Elements:** two dashed boxes.
  - **CHECK-2A navbar** — the pattern the skill prescribes: `data-prop="@data[nav]"`, and the include reads `links` (its own fields).
  - **CHECK-2B navbar** — the anti-pattern: same binding, but the include reads `nav.links` by name.
  - Each box starts with a monospace line, e.g. `CHECK-2A link count: 2 | first link shouted: CHECK-2 LINK ONE`. That line only changes when the component re-renders; it isn't a region.
- **Do:**
  1. In CHECK-2A, click the link text `CHECK-2 link one` and type so it reads `CHECK-2 link edited`.
  2. Watch both monospace lines.
  3. In CHECK-2A, use the array item's add control to add a **CHECK-2 Link** item.
  4. Watch both monospace lines again. Don't save (or save and revert; the change goes to `src/_data/nav.json`).
- **Outcomes:**
  - CHECK-2A's line shows `CHECK-2 LINK EDITED`, then `link count: 3`; CHECK-2B's line goes blank (`link count:  | first link shouted:`) → both rules hold. No change to `cloudcannon-visual-editing/eleventy/visual-editing-reference.md:216-235` or `troubleshooting.md:28`.
  - CHECK-2A's line doesn't change (still `CHECK-2 LINK ONE`, count 2) while the link text updates → `@data` props don't reach a component re-render. The MUST at `visual-editing-reference.md:216-217` is wrong: rewrite § Data files and `@data` (`:208-237`) and the matching completeness item `visual-editing.md:105-106`, and record it upstream.
  - CHECK-2A shows an error card → note the error text; same files as above.
  - CHECK-2B keeps its build value instead of going blank → adjust the symptom wording in `troubleshooting.md:28` ("renders empty, or with old values") to what you saw.

## 3. Liquid positional shortcode, two arguments: separators on save

- **Page:** Pages → `check-03-liquid-positional.md`, in the **Content Editor**. The body is Liquid (`markdownTemplateEngine: liquid`).
- **Elements:**
  - Instance A, comma-separated: `{% pill "CHECK-3A label", "CHECK-3A colour" %}`
  - Instance B, space-separated: `{% pill "CHECK-3B label" "CHECK-3B colour" %}`
  - Both forms build in Eleventy's Liquid (checked locally).
  - Two snippet entries share the shortcode name `pill`: **CHECK-3 Pill (Liquid template)** and **CHECK-4 Pill (Nunjucks template)**. Note which label each instance shows.
- **Do:**
  1. For each instance, note whether it shows as a snippet, and which label it has.
  2. On each instance that shows as a snippet, change `colour` to `CHECK-3 edited`.
  3. Save, and check the diff.
- **Outcomes:**
  - Both match the Liquid entry, and each keeps its own separator → no change to `cloudcannon-snippets/eleventy/overview.md:87` beyond dropping "before configuring the rest" if you want it lighter.
  - Saves rewrite B with a comma, or A without one → harmless in Liquid (both build), but write the rule: "Liquid templates write `<separator>`; content in the other form is rewritten on first save." Edit `overview.md:87`.
  - Only one form matches (the other shows as text) → add to `overview.md:83-87`: "The Liquid positional template matches only `<form>`; convert content to it before configuring, or use a raw snippet." Also update the example comment at `:81`.
  - An instance shows the **Nunjucks** label → CloudCannon doesn't pick the entry by engine. Rewrite `overview.md:23` ("needs separate `_snippets` entries for the same shortcode") to say the two can't coexist and a mixed-engine site needs a raw snippet or different names.

## 4. Nunjucks positional shortcode, two arguments: separators on save

- **Page:** Pages → `check-04-nunjucks-positional.md`, in the **Content Editor**. Its front matter sets `templateEngineOverride: njk,md`, so Nunjucks processes the body.
- **Element:** `{% pill "CHECK-4 label", "CHECK-4 colour" %}`. In Nunjucks the comma is required: without it the build fails with `parseSignature: expected comma after expression` (checked locally).
- **Do:**
  1. Note whether it shows as a snippet, and which label: **CHECK-4 Pill (Nunjucks template)** or **CHECK-3 Pill (Liquid template)**.
  2. Change `colour` to `CHECK-4 edited`, save, check the diff and the rebuild.
- **Outcomes:**
  - The Nunjucks label, comma kept, build passes → the Nunjucks positional template is safe. No change to `cloudcannon-snippets/eleventy/overview.md:87`.
  - The comma is dropped on save, and the build fails → add a MUST NOT to `overview.md` § Shortcodes (`:47-87`): don't use `eleventy_nunjucks_shortcode_positional_args` for shortcodes with two or more arguments; use a raw snippet. Add the build error as a symptom.
  - It shows the Liquid label → same finding as check 3's last outcome (`overview.md:23`).
  - It doesn't match at all → note what the template does match. Same file, `:47-87`.

## 5. `"/{permalink|if=permalink}[full_slug|unless=permalink]/"` and double slashes

- **Pages:**
  - Pages → `check-05-permalink.md` (`permalink: /check-05-contact/`). Eleventy builds it at `/check-05-contact/`.
  - Pages → `check-05-default.md` (no permalink). Eleventy builds it at `/check-05-default/`.
  - Pages → `index.md` (the home page). `[full_slug]` is empty here, so the template also yields `//` before any collapse.
- **Element:** the URL CloudCannon gives each file (the Visual Editor's location/path display, or the URL on the file's card), and the `<h1>` the Visual Editor loads.
- **Do:** open each of the three files from the Pages collection, and note the URL CloudCannon shows and the heading that loads.
- **Outcomes:**
  - The URLs read `/check-05-contact/`, `/check-05-default/` and `/`, and the headings are `CHECK-5 Page with its own permalink`, `CHECK-5 Page with no permalink` and `CHECK index — Eleventy editor checks` → CloudCannon collapses the slashes. No change to `cloudcannon-configuration/eleventy/collection-urls.md:34-44` or the index row at `:14`.
  - The permalink page shows `//check-05-contact//`, or opens a 404 or the Content/Data Editor → the one-template approach is wrong. Rewrite `collection-urls.md:34-44` to give files that set `permalink` their own collection (or follow `../collection-urls.md` § Files that don't follow the collection's pattern), and recheck the `{permalink}` row at `:25`.
  - Only the home page is wrong (`//`) → the `/[full_slug]/` rows at `collection-urls.md:13-14` need an index exception.

## 6. Collections without exclude globs: do `_includes` and `*.11tydata.json` show?

- **Where:** the collection browser, not a page.
  - **Pages** (`src`) has only `!posts/**` as its glob. It deliberately lacks the skill's `!_includes/**` and `!**/*.11tydata.*`.
  - **Posts** (`src/posts`) has no glob, so `src/posts/posts.11tydata.json` is in its folder.
- **Elements:** files under `src/_includes/` (`layouts/base.liquid`, `layouts/page.liquid`, `components/hero.liquid`, `blocks/note.njk`, `snippets/notice.liquid` …), and `posts.11tydata.json`.
- **Do:** open the Pages and Posts collections, and note which of those files are listed. Note too whether `src/_data/nav.json` shows in Pages (the root overlap rule says Data only).
- **Outcomes:**
  - `_includes` files and `posts.11tydata.json` are listed → the globs are needed. No change to `cloudcannon-configuration/eleventy/configuration.md:35-53` or the checklist item `:90`.
  - Neither is listed → CloudCannon already hides them. Downgrade `configuration.md:50-51` from "Exclude" to "Optional", and drop the checklist item `:90`.
  - Only one of the two is hidden → keep the rule for the other one only.
  - `nav.json` also shows in Pages → add `!_data/**` to the example at `configuration.md:41-43`, and report the root overlap rule (`cloudcannon-configuration/configuration-gotchas.md:19-21`) as wrong.

## 7. `eleventy_liquid_include` round-trip

- **Page:** Pages → `check-07-liquid-include.md`, in the **Content Editor**.
- **Elements:**
  - Instance A: `{% include "snippets/notice.liquid", message: "CHECK-7A message" %}` (comma after the name)
  - Instance B: `{% include "snippets/notice.liquid" message: "CHECK-7B message" %}` (no comma)
  - The entry is **CHECK-7 Notice include**.
  - Checked locally: Eleventy's Liquid renders both forms correctly. It also builds `message="…"` with no error, but renders the value as `true` (`Notice: true`), so an equals-sign rewrite silently breaks the page.
- **Do:**
  1. Note which instances show as **CHECK-7 Notice include**.
  2. Change `message` on each to `CHECK-7 edited`.
  3. Save, check the diff, and check the built page `/check-07-liquid-include/` for `Notice: CHECK-7 edited` vs `Notice: true`.
- **Outcomes:**
  - Saved as `message: "CHECK-7 edited"`, page shows the text → the template is safe. Optionally correct the syntax column at `cloudcannon-snippets/built-in-templates.md:116` to `key: value`.
  - Saved as `message="CHECK-7 edited"`, page shows `Notice: true` → add a MUST NOT to `cloudcannon-snippets/eleventy/overview.md:89-108`: don't use `eleventy_liquid_include` on Eleventy (it writes `key="value"`, which Eleventy's Liquid reads as `true`); use a raw snippet. Fix `built-in-templates.md:116` and the round-trip line `overview.md:108`.
  - Neither instance matches → note whether the double quotes (the template docs show single quotes) or the `.liquid` extension is the cause, and write that into `overview.md:108`.

## 8. `[slug|strip_leading_date]` on a fixed placeholder

- **Pages:**
  - Posts → `2024-03-01-check-08-dated.md`. Eleventy builds it at `/articles/check-08-dated/`.
  - Posts → `check-08-undated.md`. Eleventy builds it at `/articles/check-08-undated/`.
  - The permalink comes from `src/posts/posts.11tydata.json` (`/articles/{{ page.fileSlug }}/`); the collection `url` is `/articles/[slug|strip_leading_date]/`.
- **Element:** the URL CloudCannon shows for each post, and the `<h1>` the Visual Editor loads (`CHECK-8 Dated post` / `CHECK-8 Undated post`).
- **Do:** open each post from the Posts collection, and note its URL and heading.
- **Outcomes:**
  - `/articles/check-08-dated/` and `/articles/check-08-undated/`, with the right headings → no change to `cloudcannon-configuration/eleventy/collection-urls.md:52` or the table at `:59-66`.
  - The dated post shows `/articles/2024-03-01-check-08-dated/` → the filter doesn't apply to `[slug]`. Replace `[slug|strip_leading_date]` with `{slug|strip_leading_date}` (or whatever does work) at `collection-urls.md:52` and `:59-66`. If nothing works, say dated files need a `permalink`-free collection or renaming.
  - Either post's URL is empty (`/articles//`) → same lines; the filter isn't supported in `url`.

## 9. `.liquid` and `.html` page files with front matter only

- **Pages:**
  - A: Pages → `check-09-liquid-page.liquid`
  - B: Pages → `check-09-html-page.html`
  - Both hold only front matter (`content_blocks`, a hero and a text block), rendered by the Liquid component dispatcher.
- **Elements:** the hero heading `CHECK-9A hero heading` / `CHECK-9B hero heading`, and the text block body.
- **Do:** for each file:
  1. Open it from the Pages collection, and note which editor opens (Visual, Content, Data or Source).
  2. In the Visual Editor, change the hero heading to `CHECK-9 edited`.
  3. Use the add control on the array to add a **CHECK-9 Text** block.
  4. Save, and check the diff (front matter changed, no body added, file name unchanged).
- **Outcomes:**
  - Both open in the Visual Editor, edit, add and save cleanly → no change to `cloudcannon-configuration/eleventy/configuration.md:52`, `migrate-to-cloudcannon/eleventy/content.md:11` and `:36`, or `migrate-to-cloudcannon/eleventy/page-building.md:21`.
  - Either opens only in the Source Editor, or the save corrupts the file → the "keep the extension" advice can't stand for that extension. Change `content.md:11` and `:36` to rename a front-matter-only page to `.md` (same base name, same URL; check with `--to=json`), and narrow `configuration.md:52`.
  - The Visual Editor opens but adding fails (empty Add menu, error card) → note the error. This is a component issue, not the extension: compare with `visual-editing-reference.md:98-118`.

## 10. A shortcode with no `_snippets` entry, with no imports

- **Page:** Pages → `check-10-unconfigured-tag.md`, in the **Content Editor**.
- **Element:** `{% unconfigured "CHECK-10 argument" %}` between `Paragraph before the tag.` and `Paragraph after the tag.` No snippet entry names it.
- **Do:**
  1. Note how the tag shows: plain text, a card, or something else.
  2. Without touching the tag, edit `Paragraph after the tag.` to `CHECK-10 edited paragraph.`
  3. Save, and check the diff: is the tag line byte-identical (quotes, `{%`, spacing, no escaping)?
- **Outcomes:**
  - Plain editable text, and the tag survives the save unchanged → the MUST at `cloudcannon-snippets/eleventy/overview.md:27-28` stands as written ("no way to edit the tag's arguments").
  - The tag is changed on save (smart quotes, escaped `%`, a `\` added, merged into the paragraph) → strengthen the Why at `overview.md:28` to "a save can corrupt the tag and break the build", with the exact corruption.
  - It shows as a protected card even with no imports → soften `overview.md:28`; also revisit `cloudcannon-snippets/gotchas.md` § `_snippets_imports` since unknown-tag handling exists without imports.

## 11. `_snippets_imports` with an `include` list of just the raw snippet

Run this last among the snippet checks (after 1, 3, 4, 7 and 10).

- **Page:** Pages → `check-11-raw.md`, in the **Content Editor**.
- **Element:** `{% raw %}CHECK-11 literal: {{ not_a_variable }}{% endraw %}` between two paragraphs.
- **Do:**
  1. With the committed config, note how the raw tag shows.
  2. Add this to `cloudcannon.config.yml` (Source Editor or a commit), at the top level, and wait for the rebuild:

     ```yaml
     _snippets_imports:
       eleventy_liquid:
         include:
           - eleventy_liquid_raw
     ```

  3. Reopen `check-11-raw.md` and note how the raw tag shows now.
  4. Also reopen `check-10-unconfigured-tag.md`, and note whether `{% unconfigured %}` now shows as "Unknown Shortcode".
  5. Edit the paragraph after the raw tag, save, and check the diff leaves the raw line unchanged.
- **Outcomes:**
  - After the import, the raw tag shows as a raw snippet card, and check 10's tag doesn't change → the exception at `cloudcannon-snippets/eleventy/overview.md:110-121` works as written.
  - No change after the import → `include` lists don't work for this bundle. Change `overview.md:112-121` to `eleventy_liquid: true` with an `exclude` list, or drop the raw snippet advice; update the checklist item at `:135`.
  - Check 10's tag becomes "Unknown Shortcode" too → the `include` list doesn't limit the import. Note it at `overview.md:121`.
  - Before the import, the raw tag already showed as a card → the raw snippet resolves without an import. Remove the exception at `overview.md:110-121`, and fix `built-in-templates.md:138`.

## 12. A URL with a space opens in the Visual Editor

- **Page:** Pages → `check 12 space.md`. Eleventy builds it at `/check 12 space/` (`_site/check 12 space/index.html`).
- **Element:** the `<h1>` `CHECK-12 File name with spaces`.
- **Do:** open the file from the Pages collection. Note the URL CloudCannon shows, and whether the Visual Editor loads that heading.
- **Outcomes:**
  - The Visual Editor loads `CHECK-12 File name with spaces` → no change to `cloudcannon-configuration/eleventy/collection-urls.md:9`.
  - A 404, a fallback to the Content Editor, or the URL shown as `/check-12-space/` → add to `collection-urls.md:9`: files with spaces don't open in the Visual Editor; ask the user to rename them (with `git mv`, and a redirect if published).

## 13. Nunjucks template array with unique ids: what "adding fails" looks like

The behaviour is already known (Tested on both spikes). This check only records the symptom wording for the troubleshooting row.

- **Page:** Pages → `check-13-nunjucks-unique-ids.njk`, in the **Visual Editor**.
- **Elements:**
  - Two note blocks, `CHECK-13 first note` and `CHECK-13 second note`.
  - Items use `data-id="{{ block._id }}"` (`check13-first`, `check13-second`), and the only blueprint is `<template data-id="note">`.
  - New items get a UUID `_id` (`instance_value: UUID`).
- **Do:** use the add control on the array to add a **CHECK-13 Note**. Note exactly what you see (an error card and its text, nothing, a block with no content, a console message), and whether the new item appears in the sidebar's `content_blocks` list.
- **Outcomes:** replace the symptom text "Nunjucks: adding a block fails" at `cloudcannon-visual-editing/eleventy/troubleshooting.md:34` with what you saw, quoting any error text. No rule changes.

---

## Settled without the editor (not checks)

- **`liquid.components` pinning a name.** `nodes/editable-component.ts` looks components up in `window.cc_components` (`helpers/cloudcannon.mjs` `getEditableComponentRenderers`), and `registerLiquidComponent` puts pinned names there (`integrations/liquid/index.mjs:61-71`). A local render through the built bundle returned the pinned include's HTML for the pinned name.
- **Bare-datetime row (fix: render dates in the layout).** The symptom is already Tested on v0.0.21, and layouts are never re-rendered (Source), so a date printed by the layout keeps its build value.
- **Nunjucks page-builder add/reorder through a migrated page.** Already Tested in the editor on both spikes (plan § Nunjucks sites).
- **`.njk` page body → front-matter-only `content_blocks`.** `.njk` page files are already Tested as opening and editing like `.md`. Check 9 covers `.liquid` and `.html`.
