# Private AI tutor proxy

The learning tracker is hosted on GitHub Pages, which cannot safely hold an OpenAI API key. This small Cloudflare Worker keeps the provider key server-side and requires a separate bearer token from your browser. The repository contains no keys or user credentials.

## Deploy

1. Create a Worker in your Cloudflare dashboard and paste in `worker/index.js` (or use Wrangler to deploy it).
2. In the Worker **Settings → Variables and Secrets**, add these as encrypted secrets:
   - `OPENAI_API_KEY`: a project-scoped OpenAI API key with the least access needed.
   - `TUTOR_ACCESS_TOKEN`: a long random value, for example `openssl rand -hex 32`.
3. Deploy the Worker and copy its `https://…workers.dev` URL.
4. In Learning Studio, open **Settings → AI tutor**, paste the Worker URL and the same access token, then save. The token is kept in this browser session only. The OpenAI key never goes into the website.
5. Open **AI tutor**, choose a topic if useful, and ask a question.

The Worker only accepts browser origins for this GitHub Pages site and local development on port 8000. It limits request size and conversation history, disables response storage, and does not enable tools. The bearer token is still a personal access credential; use a long random value and clear it from Settings when you finish. Since the Pages site is public, do not put personal or confidential data in tutor questions.

## Local development

Start the site with `python3 -m http.server 8000`. Add `http://localhost:8000` to the Worker's allowed origins if you serve it on a different port. The AI tutor requires a deployed Worker and your own OpenAI API key. OpenAI API use has separate billing from a ChatGPT subscription.

## Wrangler (optional)

From this directory, install Wrangler and run:

```sh
npx wrangler deploy index.js --name learning-studio-tutor
npx wrangler secret put OPENAI_API_KEY
npx wrangler secret put TUTOR_ACCESS_TOKEN
```
