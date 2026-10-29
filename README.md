# Learning Studio · Cybersecurity × AI

A responsive, local-first learning tracker for cybersecurity, artificial intelligence, and AI security. It is a dependency-free static website. Curriculum data lives in `curriculum.js`; application behavior lives in `app.js`; `styles.css` contains the design system.

## Run locally

With Python 3 installed, run this in the project folder:

```sh
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000) in Chrome. You can open `index.html` directly, though a local HTTP server behaves more like GitHub Pages.

## Data and backups

Progress, notes, tutor conversation, planner sessions, preferences, bookmarks, and custom learning content are saved in this browser's `localStorage` under `learning-studio:v1`. The tutor access token is kept separately in `sessionStorage` and is cleared when the browser session ends. Data does not sync across devices. Use **Settings → Export full backup** regularly. Restoring a backup replaces the data in this browser after confirmation.

## AI tutor setup

The tutor is available from the app navigation and from each topic detail. Since the app is a public static GitHub Pages site, it cannot safely contain an AI provider key. Deploy the included Cloudflare Worker proxy in [`worker/README.md`](worker/README.md), set the API key and a long random access token as encrypted Worker secrets, then enter the Worker URL and access token in **Settings → AI tutor**. The API key remains on the Worker. OpenAI API usage is billed separately from a ChatGPT subscription. Tutor prompts and conversation are sent to OpenAI when you submit them, so don't enter credentials or other sensitive material.

## GitHub Pages

This repository is public and its Pages site is available at [https://ldutta.github.io/cyber-ai-learning-studio/](https://ldutta.github.io/cyber-ai-learning-studio/). Pages deploys from `main` using the repository's Pages workflow. All app assets use relative paths so the project also runs from a repository subpath.

## Curriculum source

The linked ChatGPT roadmap was opened and reviewed in Google Chrome. The initial catalog includes its 30-day starter plan, 12-month sequence, principal projects, and source-linked resources. It expands the original checklist into topic-level learning units while keeping progress initialized to Not Started. Resource entries without a URL in the conversation (the suggested books) remain intentionally unlinked. Provider availability, course pricing, and online references can change.

## Progress rules

Each leaf topic is counted once. A module's completion is calculated from its child topics, and track completion is calculated from its topic count. Project milestones are topic units inside the project track. Parent modules never auto-complete their children.
