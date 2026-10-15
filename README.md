# Adem Portfolio

Static portfolio (HTML, CSS, vanilla JS). No backend, free on GitHub Pages. English default, plus French and Arabic (RTL), light/dark mode.

## Structure
- `index.html`, `css/style.css`, `js/main.js` — the site
- `js/i18n.js` — button/menu translations (EN, FR, AR)
- `data/site-data.json` — **all your content**
- `admin/index.html` — optional browser editor
- `assets/images/projects/` — project thumbnails and screenshots
- `assets/images/profile/` — profile photo
- `assets/cv.pdf` — put your CV here (create the file; the button hides itself only if the path is empty)

## Edit content
Open `data/site-data.json`. Text fields are `{"en": "...", "fr": "...", "ar": "..."}` (a plain string also works). Edit `person`, `intro`, `bio`, `skills`, `services`, `social`.
Replace `your-email@example.com` and the `USERNAME` links.

## Projects
- Add: copy a block in `projects`, give it a unique `id`. Delete: remove the block. Reorder: move blocks (featured ones are shown first).
- Image: put `my-app.png` in `assets/images/projects/` and set `"image": "assets/images/projects/my-app.png"`. Empty or missing images show a placeholder.
- Remove `"example": true` once a project is real.

## Visual editor
Open `admin/index.html` (locally or at `/admin/` on your site). Edit, then **Preview draft**, then **Export JSON**. Replace `data/site-data.json` with the exported file, add new images to the folder, commit and push.
Limits: no login, no publishing. Drafts live in your browser's local storage only; visitors never see them. Picking an image only sets its path, you must copy the file yourself. Skills, services and social links are edited as JSON.
Anyone can open `/admin/`, but it cannot change your site. Delete the folder if you don't want it online.

## Test locally
Browsers block `fetch` on `file://`, so run `python -m http.server 8000` in this folder and open http://localhost:8000.

## Publish on GitHub Pages
1. Create a repository, upload all files (keep the structure), commit to `main`.
2. Repository **Settings → Pages**.
3. Source: **Deploy from a branch**, branch `main`, folder `/ (root)`, Save.
4. Wait a minute: the site is at `https://USERNAME.github.io/REPOSITORY/`. All paths are relative, so it works under that sub-path.

## Needs manual setup
Email and social URLs, CV PDF, project images, real projects. There is no contact form on purpose: a form needs an external service. Email uses `mailto:`.
