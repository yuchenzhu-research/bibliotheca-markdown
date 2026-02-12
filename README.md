# BIBLIOTHECA

**A high-aesthetic, Renaissance-style digital museum for your Markdown artifacts.**

BIBLIOTHECA transforms your Markdown files into an immersive, curated gallery experience. Inspired by the Italian Renaissance, it uses Chiaroscuro (light/dark contrast), elegant serif typography, and rich textures to elevate simple text into a work of art.

## 🎨 Aesthetic Features

- **The Frame**: Double-gold borders (`border-double`) and custom shadows for a tactile, 3D effect.
- **The Lighting**: Radial gradients simulate a museum spotlight, focusing attention on the curation.
- **Typography**: Authentic scholarly feel using `Cinzel` for headings and `EB Garamond` paired with `Noto Serif SC` for multi-language body text.
- **Micro-interactions**: Smooth transitions and hover effects that simulate approaching an exhibit.

## 🏛️ How it Works

### 1. The Gallery Hall (`/`)
Reads Markdown files from the `./data` directory at root. Each file is treated as an "Exhibit" with its own metadata plaque.

### 2. The Curator's Desk (`/curator`)
A client-side interactive zone. Drag and drop any `.md` file (Chinese, English, etc.) to instantly view it in the museum's signature style without any server-side processing.

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start the gallery (localhost:4321)
npm run dev

# Build the museum for production
npm run build
```

## 📜 Curation Guide

Add your artifacts to the `data/` folder with YAML frontmatter:

```yaml
---
title: "The Nature of Intelligence"
author: "Aristotle"
date: "2023-10-27"
description: "A profound exploration into the origins of thought..."
cover: "https://example.com/cover.jpg" # Optional cover image
---
```

## 🛠️ Tech Stack
- **Framework**: [Astro](https://astro.build)
- **Styling**: [Tailwind CSS](https://tailwindcss.com) (v4)
- **Icons**: [Lucide](https://lucide.dev)

---
*Ars Longa, Vita Brevis.*
