# BIBLIOTHECA ACADEMICA

A high-aesthetic, static archive for monumental Computer Science and Machine Learning papers.

BIBLIOTHECA transforms classic academic papers into an immersive, timeline-driven reading experience. It pairs the original PDF manuscripts with dark-mode optimized architectural blueprints and elegant typography.

## 🏛️ Architecture & Workflow

We use Astro's **Content Collections** for extreme type-safety and performance. Adding a new historical milestone takes two steps:

1. **The Artifact**: Drop the original `.pdf` into `public/papers/`.
2. **The Metadata**: Create a `.md` file in `src/content/gallery/` to define the schema and link the PDF.

### Frontmatter Schema Example:
```yaml
---
title: "Learning Representations by Back-propagating Errors"
author: "David E. Rumelhart, Geoffrey E. Hinton, Ronald J. Williams"
date: "1986-10-09"
milestone: "The Foundation"
abstract: "Proved that multi-layer neural networks could be trained via gradient descent..."
pdf_link: "/papers/1986-backpropagation.pdf"
cover: "../../assets/gallery/1986-backpropagation.png"
---
```

## 🚀 Experience it Locally

```bash
# Prepare the archive
npm install

# Open the gallery (http://localhost:4321)
npm run dev
```

## 🛠️ Tech Stack
* **Core**: [Astro](https://astro.build) (Content Collections & SSG)
* **Styling**: Tailwind CSS v3
* **Typography**: Cinzel (Headings) & EB Garamond (Body)
