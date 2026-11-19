# The Making of Me

## Folder structure
- `site/`: public website. Upload the **contents** of this folder to the root of your GitHub repository.
- `editor/`: local editor. Keep it on your computer; **do not upload it** to the public repository.

## Publish website
1. Rename/create the repository as `TanmayMutha/the-making-of-me`.
2. Upload everything inside `site/` to the repository root on branch `main`.
3. GitHub → Settings → Pages → Deploy from a branch → `main` → `/(root)` → Save.
4. Site URL: https://tanmaymutha.github.io/the-making-of-me/

## Edit and publish
1. Open `editor/admin.html` in Chrome or Edge.
2. Add profile information, entries and multiple image/document attachments.
3. Save entries to draft. Text is saved in this browser's localStorage. Keep the tab open until publishing: selected file contents are held in memory until uploaded.
4. Create a fine-grained token at https://github.com/settings/personal-access-tokens/new. Choose only repository `the-making-of-me`; grant Contents: Read and write.
5. Paste token into editor and click Publish. It uploads images to `assets/images/`, other files to `assets/documents/`, then updates `data.json`. Token is not stored.
6. Keep the `editor/` folder private. Clear the token field after use.

## Media and privacy
- Images appear in galleries; other files are linked as attachments.
- Keep each file below 20 MB. Large videos should be hosted elsewhere and linked.
- Everything in the public GitHub repository is public. Do not upload confidential or sensitive files.
- Export `data.json` periodically as a backup.
- Existing attachments are retained when editing entries. Deleting an entry does not automatically remove old files from GitHub.
