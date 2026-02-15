<div align="center">
  <h1 align="center">🌿 Digital Garden | Bibliotheca Vitae</h1>
  <p align="center">
    <em>"A digital sanctuary to curate the artifacts of your life."</em>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-708090?style=flat-square" alt="Platform" />
    <img src="https://img.shields.io/badge/framework-Next.js%2015-000000?style=flat-square&logo=next.js" alt="Framework" />
    <img src="https://img.shields.io/badge/built%20with-Tailwind%20CSS%20v4-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/animation-Framer%20Motion-E10098?style=flat-square&logo=framer" alt="Framer Motion" />
    <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="License" />
  </p>

  <p align="center">
    <strong>
      <a href="README.md">English</a> | 
      <a href="README_zh-CN.md">简体中文</a> | 
      <a href="README_zh-TW.md">繁体中文</a> | 
      <a href="README_la.md">Latin</a> | 
      <a href="README_ja.md">日本語</a> | 
      <a href="README_ko.md">한국어</a> | 
      <a href="README_es.md">Español</a>
    </strong>
  </p>
</div>
<br/>


**Digital Garden** (Project: **Bibliotheca Vitae**) 并非一个简单的个人博客，它是一个**沉浸式生命档案馆**。它融合了 15 世纪的手抄本美学与 21 世纪的顶级 Web 技术，旨在将平庸的数据录入转化为一场优雅的策展艺术。

## 🏛️ 项目愿景：生命叙事 (Living Narrative)

在信息碎片化的时代，我们相信**脉络（Context）即灵魂**。传统的数据库将历史视为表格中的行，而 **Bibliotheca Vitae** 将每一次记录视为一个 **Moment in Time** —— 一个值得被深度感知的视觉与文字载体。

* **沉浸感 (Immersion)**：基于物理规律的交互动效，赋予数字对象真实的重量感与存在感。
* **极致美学 (Aesthetics)**：古典字体 (`Cinzel`, `EB Garamond`) 与现代极简主义的碰撞，营造博物馆级别的阅读体验。
* **策展人体验 (Curator Experience)**：我们没有“表单”，只有“画布”。

## ✨ 核心特性

### 🖼️ 动态画廊 (The Gallery)
采用 Apple 风格的 **Sticky Horizontal Scroll**，让用户在横向滚动的历史长河中穿梭。每一张档案卡片都带有细腻的视差效果。

### 📖 深度叙事 (The Narrative Experience)
点击任何条目即可开启无缝遮罩层（Overlay）。用户可以深入探索 **Moment in Time**，感知其中的 **Figure** (人物)，并阅读属于那一刻的 **The Narrative**。

### 🖋️ 瞬间追加 (Append Moment Editor)
这是本项目的核心：**“照片优先”的编辑器**。
1.  **视觉锚点**：直接将照片拖入画布作为背景。
2.  **原位编辑**：直接在页面上打字——在最终呈现的位置编辑标题、人物和叙事。
3.  **双模式粒子**：集成 Alet-style 粒子解构效果，支持 **Linear** (线性拉伸) 与 **Random** (随机碎裂) 两种视觉模式。

## 🛠️ 技术底座 (Tech Stack)

本项目采用 **单页应用 (SPA)** 架构开发：

-   **核心**: Next.js 15 (App Router), React 19, TypeScript
-   **动效**: Framer Motion, GSAP, React Lenis (Smooth Scroll)
-   **视觉**: Tailwind CSS v4 (Oklch), Lucide Icons
-   **图形**: React Three Fiber / Drei (WebGL 粒子系统)

## 🚀 快速开始

1.  克隆仓库。
2.  安装依赖：`npm install`
3.  启动开发服务器：`npm run dev`
4.  访问地址：`https://bibliotheca-vitae.vercel.app` (Production) 或 `http://localhost:3000` (Local)。

---
*Est. MMXXVI · Digital Garden | Bibliotheca Vitae · Ars Longa, Vita Brevis.*
