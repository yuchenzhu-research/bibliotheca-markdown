<div align="center">

# 🏛️ BIBLIOTHECA ACADEMICA

**A high-aesthetic, chronological archive for monumental Computer Science and Machine Learning papers.**

[![Astro](https://img.shields.io/badge/Framework-Astro_8.0-ff5a03?style=for-the-badge&logo=astro&logoColor=white)](https://astro.build)
[![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind_CSS_4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![GitHub Stars](https://img.shields.io/github/stars/yuchenzhu-research/Bibliotheca-Academica?style=for-the-badge&color=success&logo=github)](https://github.com/yuchenzhu-research/Bibliotheca-Academica/stargazers)

</div>

<br />

## 📖 The Vision

*Bibliotheca Academica* transforms classic academic manuscripts into an immersive, timeline-driven reading experience. Moving away from the sterile, cluttered interfaces of traditional PDF viewers, this archive pairs the original PDF documents with dark-mode optimized architectural blueprints and elegant Renaissance-inspired typography (Cinzel & EB Garamond).

## ✨ Key Features

- 🕰️ **Chronological Timeline**: Traverse the history of Machine Learning, from the 1958 Perceptron to the 2017 Transformer and beyond.
- 📄 **Native PDF Embedding**: Read original research papers directly in the browser via responsive, beautifully framed iframes.
- 🌑 **Chiaroscuro Dark Mode**: Academic white-background diagrams are dynamically inverted and blended using CSS filters to maintain a sleek, dark aesthetic.
- 🔒 **Type-Safe Architecture**: Built with Astro Content Collections and Zod schemas to ensure zero broken links and strict metadata formatting.

---

## 🚀 Quick Start

Launch the museum locally in seconds.

```bash
# Clone the repository
git clone https://github.com/yuchenzhu-research/Bibliotheca-Academica.git

# Navigate to the directory
cd Bibliotheca-Academica

# Install dependencies
npm install

# Start the dev server
npm run dev
```
*Visit `http://localhost:4321` to explore the archive.*

---

## 🏛️ How to Curate (Add a Paper)

This archive uses static site generation for extreme performance. Adding a new historical milestone takes exactly two steps:

**1. The Artifact (PDF & Cover):**
Drop the original `.pdf` paper into `public/papers/`.
*(Optional)* Drop an architecture screenshot into `public/images/`.

**2. The Metadata:**
Create a `.md` file in `src/content/papers/` following this strict schema:

```yaml
---
title: "Attention Is All You Need"
authors: "Ashish Vaswani, Noam Shazeer, et al."
date: "2017-06-12"
abstract: "Discarded recurrence and convolutions entirely in favor of self-attention mechanisms, laying the groundwork for the generative AI revolution."
pdf_link: "/papers/2017-transformer.pdf"
cover: "/images/transformer-arch.png"
---
```
*The build system will automatically parse this, type-check it, sort it by date, and inject it into the global timeline.*

---

## 📜 License

Distributed under the MIT License. *Ars Longa, Vita Brevis.*
