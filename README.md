# Learning Studio · Cybersecurity × AI

A responsive, local-first learning tracker built as a dependency-free static website. The curriculum and initial resource catalog live in `curriculum.js`; the application logic is in `app.js` and visual system in `styles.css`.

## Run locally

This project does not require Node.js, a package manager, a database, an API key, or a build step. With Python 3 installed, open a terminal in the project folder and run:

```sh
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000) in Chrome. You can also open `index.html` directly, though a local HTTP server behaves more like GitHub Pages.

## Data and backups

Progress, notes, planner sessions, preferences, bookmarks and custom resources are saved in this browser's `localStorage` under `learning-studio:v1`. They remain on this device and browser profile; they do not sync across devices. Use **Settings → Export full backup** regularly. Restoring a backup replaces the data in the current browser after an explicit confirmation. The static curriculum is kept separate from user data so curriculum edits do not erase saved progress.

## GitHub Pages

This repository and its Pages site are public. GitHub Pages is configured to deploy from the `main` branch root. GitHub's first deployment may take a few minutes; check **Settings → Pages** for the live site link and deployment status. Learning progress and notes stay in each visitor's browser and are not stored in this repository or synchronized between devices.

## Curriculum source

The linked ChatGPT roadmap was opened and reviewed in Google Chrome. This initial catalog includes its 30-day starter plan, 12-month sequence, principal projects and source-linked resources. It expands the original 29-area checklist into topic-level learning units while keeping progress initialized to Not Started. Resource entries without a URL in the conversation (the suggested books) remain intentionally unlinked. Provider availability, course pricing and online references can change.

## Progress rules

Each topic is counted once. A module's completion is its completed child topics divided by its child topic count, and track completion is its completed topic count divided by its total topic count. Project milestones are topic units inside the project track. Parent modules never auto-complete their children.
