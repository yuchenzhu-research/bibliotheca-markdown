# Claude Code Project Configuration
Project: Digital Garden | Bibliotheca Vitae
Type: Next.js + Tauri (Desktop App)

## 🧠 Loaded Agent Skills (Local Context)
I have installed specific agent skills in the `.claude/skills` directory. Please refer to them for all coding tasks:

1.  **Vercel Best Practices**: 
    - Reference: `./.claude/skills/vercel-agent-skills`
    - Use this for all Next.js App Router, Server Actions, and caching logic.

2.  **Tauri Desktop Integration**:
    - Reference: `./.claude/skills/tauri-action/README.md`
    - Use this when writing GitHub Actions workflows or modifying `src-tauri`.
    - Local CLI command: Use `npx tauri` (do not use global tauri).

3.  **Frontend Design System**:
    - Focus on "Renaissance Aesthetics" combined with "Apple-style Motion".
    - Library: Tailwind CSS v4 + Framer Motion.

## 🛠️ Common Commands
- **Dev (Web)**: `npm run dev`
- **Dev (App)**: `npx tauri dev` (Opens the native Mac app window)
- **Build (App)**: `npx tauri build`
- **Release**: `git tag v0.1.0 && git push origin v0.1.0` (Triggers GitHub Action)

## 🚨 Guidelines
- **Local-First**: Prioritize saving data to local storage/fs.
- **System Integration**: Use Tauri APIs to access the file system.
