# A11y-GPT Remediation Engine

AI-assisted accessibility tooling: paste a React component and get WCAG 2.1 fixes with a diff and explanations, generate alt-text for images, and check color contrast.

**Live demo:** https://a11y-gpt-remediation-engine-fccx.vercel.app/


## Features

| Tool | What it does |
| --- | --- |
| **Component Doctor** | Analyzes pasted React code for WCAG violations and returns fixed code, a diff view, and an explanation of each change. |
| **Alt-Text Generator** | Generates descriptive, context-aware alt-text from uploaded images. |
| **Contrast Fixer** | Checks foreground/background pairs against WCAG ratios and suggests compliant adjustments. |

## Tech stack

- Next.js 15 (App Router), React 19, TypeScript
- Tailwind CSS, Radix UI, Motion
- Google Gemini API (`@google/genai`)
- Deployed on Vercel, linted and built with GitHub Actions

## Run locally

```bash
git clone https://github.com/MartinRenteria/a11y-gpt-remediation-engine.git
cd a11y-gpt-remediation-engine
cp .env.example .env.local   # add your GEMINI_API_KEY
npm install
npm run dev                  # http://localhost:3000
```

The Gemini API key is read from `GEMINI_API_KEY` and must only be used server-side.

## CI

GitHub Actions (`.github/workflows/ci.yml`) lints and builds the project on every push and pull request.

## Roadmap

- [ ] Unit tests for the contrast calculation logic
- [ ] Rate limiting on API routes
- [ ] Containerization (Docker) and Kubernetes deployment
