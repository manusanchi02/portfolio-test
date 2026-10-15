# Portfolio

A static portfolio site built with Vue 3, Vite and Bootstrap 5, published on GitHub Pages.
All content lives in JSON files under `src/content/` and is edited from a visual admin (Sveltia CMS) or by hand.

## Commands

| Command | What it does |
| --- | --- |
| `npm ci` | Install dependencies from the lock file |
| `npm run dev` | Development server with hot reload |
| `npm run validate` | Check every file in `src/content/` against `schemas/` and list missing URLs |
| `npm run build` | Validate, then build the static site into `dist/` (one real HTML page per project) |
| `npm run preview` | Serve the production build locally |

Requires Node 22.18 or newer (or 24.11 or newer). The deploy workflow uses Node 24.

To test the site under a sub-path, as it will be served from `https://<user>.github.io/<repo>/`:

```powershell
$env:VITE_BASE = '/<repo>/'
npm run build
npm run preview
```

`VITE_BASE` defaults to `/`. `VITE_SITE_URL` (for example `https://<user>.github.io/<repo>`) is optional locally and is used for absolute `og:image` URLs. The deploy workflow sets both automatically.

## How it is organised

```
src/content/    all texts, images and links (JSON)
schemas/        JSON Schema for each content file
public/admin/   Sveltia CMS (index.html and config.yml)
public/uploads/ uploaded images
src/registry/   maps section and block types to components
src/components/ sections/, blocks/, layout/, common/
src/styles/     Bootstrap overrides and CSS variables (colors, fonts)
```

Components never contain portfolio text. They receive data as props.

## How to add content

Every operation below can be done in the admin (see "Admin") or by editing the files in `src/content/`.
After any change run `npm run validate`. The build fails with the file and field name if something is wrong.

### 1. Add a project

Add an object to the array in `src/content/projects.json`:

```json
{
  "slug": "my-new-project",
  "title": "My new project",
  "summary": "Short text used for search engines and social previews",
  "visible": true,
  "banner": { "src": "uploads/my-new-project/banner.webp", "alt": "What the photo shows" },
  "blocks": [
    { "type": "text", "text": "Some text with <em>emphasis</em>." },
    { "type": "image", "image": { "src": "uploads/my-new-project/01.webp", "alt": "..." } }
  ]
}
```

- Put the image files in `public/uploads/` (the path in the JSON has no leading `public/`).
- `slug` is used in the URL (`/projects/my-new-project`): lowercase letters, digits and hyphens. Do not change it after publishing.
- `width` and `height` are optional, they are read from the image at build time.

### 2. Reorder or hide a project

- Order: the order of the array in `projects.json` is the order in the grid. Move the object up or down (in the admin, drag the item).
- Hide: set `"visible": false`. The project disappears from the grid and its page is not generated.

### 3. Add or change a block in a project

Edit the `blocks` array of the project. Blocks are shown in the order they appear.

```json
{ "type": "text", "text": "Paragraph. Only <a>, <em> and <strong> are allowed as HTML." }
{ "type": "image", "image": { "src": "uploads/x.webp", "alt": "..." } }
{ "type": "image-grid", "images": [ { "src": "uploads/a.webp", "alt": "..." }, { "src": "uploads/b.webp", "alt": "..." } ] }
```

`alt` is required on every image. Use `""` only for purely decorative images.

### 4. Update the Instagram posts

Edit `src/content/instagram.json`:

```json
{
  "posts": [
    {
      "image": { "src": "uploads/instagram/2026-10-01.webp", "alt": "..." },
      "caption": "Caption text",
      "url": "https://www.instagram.com/p/XXXXXXXX/",
      "date": "2026-10-01"
    }
  ]
}
```

- Save the image locally in `public/uploads/instagram/`. Never link to Instagram image URLs, they expire.
- The site shows the most recent N posts by `date`. N is `instagramPostsShown` in `site.json` (default 3, currently 4). The grid is laid out for 4 posts: 2 columns on phones, 4 from tablet up.
- The format is meant to be rewritable by a scheduled job in the future without changing the frontend.

### 5. Edit About and the menu

- About: `src/content/about.json` (`photo`, `text`, `links`). The email is a link with `"url": "mailto:name@example.com"`.
- Menu: built from `src/content/home.json`. Every section with `"showInMenu": true` appears in the menu with its `title`. Extra menu entries go in `extraMenuLinks` in `site.json`.
- Section order on the homepage is the order of `sections` in `home.json`. To hide a section, remove it from the list.
- Social links and site name: `src/content/site.json`.

Link format everywhere: `{ "label": "...", "url": "...", "external": true }`. External links open in a new tab with `rel="noopener noreferrer"`. If the URL is not known yet use `"#TODO-url"`: `npm run validate` lists every one left.

### 6. Add a new type of section or block (code)

New section type:

1. Create `src/components/sections/MySection.vue` with props `section` and your data.
2. Register it in `src/registry/sections.js`: component plus `getProps(section)`.
3. Add the type name to the `type` enum in `schemas/home.schema.json` and to `select` options in `public/admin/config.yml`.
4. Add a data file and its schema if it needs one, and add it to `contentFiles` in `scripts/validate-content.js`.

New block type:

1. Create `src/components/blocks/MyBlock.vue`.
2. Register it in `src/registry/blocks.js`.
3. Add its variant in `schemas/projects.schema.json` and a `types` entry in `public/admin/config.yml`.

## Images

When you upload or paste a PNG or JPEG in the admin it is converted to WebP in the browser (quality 80, at most 2000 px wide, EXIF removed). WebP files are uploaded as they are: they are not resized or recompressed, so prepare them with the sizes below. Other formats (GIF, AVIF, HEIC, SVG) are rejected by the build.

| Use | Format | Maximum width | Notes |
| --- | --- | --- | --- |
| Project banner | WebP, quality about 80 | 2000 px | Shown at 4:3 and cropped to fit, so frame the photo for 4:3 |
| Other images | WebP, quality about 80 | 1600 px | Keep their own aspect ratio |
| Instagram posts | WebP, quality about 80 | 1080 px | |

Export without EXIF metadata (GPS coordinates in particular). Everything in `public/` is public.

## Admin

The admin is at `<site address>/admin/`. It is not linked from the public site and is marked `noindex`.
Sveltia CMS is loaded from a pinned version (see `public/admin/index.html`). To upgrade, change the version number there and in the `$schema` comment of `config.yml`, then log in and check that saving still works.

### Create the access token

The admin logs in with a GitHub fine-grained personal access token. It is only used for the admin login: it is not needed to push code and not used by the deploy.

1. GitHub, Settings, Developer settings, Personal access tokens, Fine-grained tokens, Generate new token.
2. Resource owner: your account. Repository access: Only select repositories, and pick this repository.
3. Repository permissions: Contents, Read and write (Metadata read is added automatically). Nothing else.
4. Choose an expiration date and generate the token. Copy it now, GitHub shows it only once.
5. Open `/admin/`, click "Sign In with Token" and paste it. The token is stored in that browser only.

When the token expires the admin shows a login error: generate a new token with the same steps and sign in again.
Never put the token in the code or in the repository.

### How saving works

- Every save is a direct commit on `main`, drafts included.
- Each commit starts the deploy workflow, so a change appears on the site a few minutes after saving.
- Because the admin commits on `main`, run `git pull` before working on the code locally.

## Publishing on GitHub Pages

1. Push the repository to GitHub.
2. Settings, Pages, Source: GitHub Actions.
3. Set `owner/repo` in the `backend.repo` option of `public/admin/config.yml` (currently `manusanchi02/portfolio-test`).
4. Push to `main`. The workflow `.github/workflows/deploy.yml` validates the content, builds and deploys. If the content is not valid, nothing is published.

The repository does not need to be called `<user>.github.io`: the base path is taken from the Pages settings.

## Repository is public

Everything committed is visible to anyone, history included. `source/` (working originals), `node_modules/`, `dist/`, `.env` files and credentials are in `.gitignore`. Do not commit private data: everything in `src/content/` and `public/` is published.
