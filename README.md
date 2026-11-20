# Neel's portfolio

React 18 + TypeScript + Vite 8 + React Router 7, deployed at https://n33levo.github.io/. The separate FastAPI service in `../chatbot-backend` supplies Chai and the recruiter assistant.

Use Node 22.18+ (Node 24 is used for verification).

```sh
npm ci
npm run dev          # http://localhost:8080
npm run typecheck
npm test
npm run build
```

Use `../start_chatbot.sh` to start both services. Development chat targets localhost:8000. A production build targets the existing Railway service unless `VITE_API_BASE_URL` is supplied. Never put provider secrets in a `VITE_*` variable: Vite exposes those values publicly.

- `/`: terminal interface on desktop, readable portfolio on mobile.
- `/mobile`: readable portfolio at any screen size.
- `/chai`: general conversation companion.
- `/ai`: professional representative, research and project questions, optional confirmed meeting proposals.

`src/data/portfolio.json` is the canonical professional content. `src/data/profile.ts` adds typed exports and the personal introduction. The original animated terminal and original mobile cards render those exports. After editing professional facts, run `python3 ../sync_profile.py` to update the backend snapshot; `--check` detects drift. `public/resume.pdf` is the downloadable resume.

`ChatWindow.tsx` renders streamed answers, sources, errors, and meeting proposals. `src/lib/sse.ts` parses streaming events across arbitrary transport chunks. Conversations and random session IDs are preserved in browser session storage; New chat starts a fresh session. The Stop action aborts the active request. Only a separate Confirm meeting click calls the calendar write endpoint.

The webring widget and external script are removed. Existing terminal personality, archived projects, theme support, and dog photos remain. `love/neo-command-pet-main` in the parent folder is an archived prototype and should not be deployed as this application.

Builds are local until the existing `npm run deploy` workflow is explicitly run. Publish the backend first when introducing the new chat protocol. Both logo assets (`lyft_logo.jpeg`, `shopify_logo.jpeg`) must be included when committing this update.

Compatible security updates plus patched Vite/router releases removed all high-severity findings from the npm audit. Eleven moderate development-dependency findings remain in CSS/lint tooling and their transitive packages; no forced transitive major overrides were applied.

## Original experience restoration

Restored the pre-update design from commit `de2070e`: staged terminal output, image reveal, hover/scale/pulse skill chips, the full wget animation, traffic-light controls, chat bubbles/timestamps, auto-growing input, and 15/20ms streaming cadence. Chai and AI Rep route shells and greetings match the original, with configurable API URLs. Current facts, resume, research, and preprints are retained inside the original layouts. The webring stays removed as requested.

The new design regression tests run the original reveal timers and window actions, verify the animation helpers and CSS against the pre-update source, and check persona routing/greetings/pacing. Browser visual inspection remains unavailable because Chrome computer access was not approved in this session.
