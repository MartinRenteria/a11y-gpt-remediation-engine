# A11y-GPT Remediation Engine

AI-powered accessibility dashboard for scanning WCAG violations, fixing React components, and generating alt-text.

## Overview

The A11y-GPT Remediation Engine is a comprehensive tool designed to help developers and designers ensure their web applications are accessible and compliant with WCAG 2.1 standards. By leveraging AI, it provides intelligent suggestions and automated fixes for common accessibility issues.

## Features

### 🩺 Component Doctor
Paste your React components to identify accessibility violations. The engine provides a diff view of the fixed code along with detailed explanations of the changes made.

### 🖼️ Alt-Text Generator
Upload images to generate descriptive, context-aware alt-text. This ensures that visual content is accessible to users relying on screen readers.

### 🎨 Contrast Fixer
Check foreground and background color combinations for WCAG compliance. The tool suggests color adjustments that maintain your brand identity while meeting accessibility requirements.

### 🚀 DevOps Panel
Access production-ready Dockerfiles and Kubernetes manifests (including Horizontal Pod Autoscalers) to deploy the engine at scale.

## Tech Stack

- **Framework:** Next.js 15+ (App Router)
- **Styling:** Tailwind CSS
- **Animations:** Motion (framer-motion)
- **AI Integration:** Google Gemini API (@google/genai)
- **UI Components:** Radix UI, Lucide React
- **Utilities:** react-diff-viewer-continued, react-dropzone

## Getting Started

1. Clone the repository.
2. Install dependencies: `npm install`
3. Set up your environment variables (see `.env.example`).
4. Run the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## License

© 2026 A11y-GPT Remediation Engine. Built for WCAG 2.1 Compliance.
