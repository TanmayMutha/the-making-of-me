# Life Portfolio — GitHub Pages + local editor

A static public portfolio with a separate admin/editor page. The editor saves drafts in your browser first and can commit `data.json` to GitHub through the GitHub Contents API.

## Files
- `index.html` — public portfolio
- `admin.html` — editor (use locally; do not link it publicly if you prefer)
- `data.json` — portfolio content
- `styles.css`, `app.js`, `admin.js` — site and editor code

## Set up GitHub Pages
1. Create a GitHub repository (for example `life-portfolio`).
2. Upload all files in this folder to the repository's root, including `data.json`.
3. In the repository, open **Settings → Pages**.
4. Set the source to **Deploy from a branch**, choose `main` and `/ (root)`, then Save.
5. Your public site will appear at `https://YOUR-USERNAME.github.io/life-portfolio/` (allow a few minutes for the first deployment).

## Set up save-to-GitHub
1. On GitHub, open **Settings → Developer settings → Personal access tokens → Fine-grained tokens**.
2. Create a token restricted to this one repository.
3. Grant **Contents: Read and write**. No other permissions are needed for this editor.
4. Open `admin.html` locally on your computer (double-click it). Enter the GitHub owner, repository, branch (`main`), path (`data.json`) and token.
5. Add or edit entries. Click **Push to GitHub**. The editor fetches the current file SHA and updates the JSON file through GitHub's API.
6. Refresh the public site after GitHub Pages finishes updating.

## Offline behaviour
The editor can be opened from your computer and saves edits to browser localStorage without internet. You need an internet connection only to push to GitHub. If you clear browser data or change computers, export a JSON backup first. Use **Export JSON backup** regularly.

## Security notes
- The token is entered at runtime and is not written into project files or localStorage.
- Use a fine-grained token limited to this repository, with only Contents read/write.
- Revoke the token in GitHub settings if it is exposed.
- GitHub Pages is public. Anything in `data.json` is public. Do not put private phone numbers, home address, personal documents, or sensitive information in the public data.
- `admin.html` is included in the repository for convenience, but it is not a secure login system. Anyone can view its source. The token is not embedded in it; GitHub still enforces the token permissions.
- The editor uses browser storage for drafts and configuration. Do not use a shared/public computer for administration.

## Editing and adding sections
The editor includes all major categories from the master-resume checklist. Choose a section, add an entry, and fill in the fields that apply. The public page only displays sections that contain entries.
