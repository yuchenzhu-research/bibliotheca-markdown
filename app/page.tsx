"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Hero } from '@/components/features/Hero';
import { ArchiveGrid } from '@/components/features/ArchiveGrid';
import { HorizontalScrollSection } from '@/components/ui/HorizontalScrollSection'; // RESTORED
import { ImageCard } from '@/components/ui/ImageCard';
import { documents } from '@/lib/data';

// Dynamically import Canvas3D with loading state
const Canvas3D = dynamic(() => import('@/components/visual/Canvas3D'), {
  ssr: false,
  loading: () => <div className="fixed inset-0 -z-30 bg-warm-paper" />, // RESTORED: Warm paper loading bg
});

const SmoothScrollWrapper = dynamic(
  () => import('@/components/ui/SmoothScrollWrapper').then(mod => mod.SmoothScrollWrapper),
  { ssr: false }
);

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);

  return (
    <SmoothScrollWrapper>
      {/* RESTORED: Main background is warm papier */}
      <main className="min-h-screen bg-warm-paper selection:bg-primary/20">

        {/* Layer 0: Reactive 3D Background - Transparent on top of paper */}
        <Canvas3D
          imageUrl="/archive/newton.jpg"
          scrollProgress={scrollProgress}
        />

        {/* Hero Section */}
        <Hero />

        {/* Horizontal Scroll Section - RESTORED: 3 Cards */}
        {/* 
            Using HorizontalScrollSection instead of AppleScrollSection.
            Mapping exactly 3 documents for that tight, curated feel.
        */}
        <HorizontalScrollSection onScrollProgress={setScrollProgress}>
          {documents.slice(0, 3).map((doc) => (
            <div key={doc.id} className="flex-none w-[80vw] md:w-[60vw] lg:w-[45vw] max-w-4xl h-[65vh]">
              <ImageCard
                id={doc.id}
                title={doc.title}
                description={doc.description}
                year={doc.year}
                author={doc.author}
                imageUrl={doc.imageUrl}
                floatingTexts={{
                  topLeft: doc.category,
                  centerLeft: doc.author.split(' ')[0],
                  bottomRight: doc.year,
                }}
                aspectRatio="portrait" // 统一肖像比例
                className="h-full w-full shadow-2xl border-elegant rounded-sm"
                focalPoint={doc.focalPoint}
              />
            </div>
          ))}
        </HorizontalScrollSection>

        {/* Browse Archive Grid */}
        <ArchiveGrid />

        {/* Footer - RESTORED: Light theme footer */}
        <footer className="container mx-auto px-4 py-12 border-t border-foreground/5 text-muted-foreground/60">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <span className="font-serif text-xl text-foreground">
                Bibliotheca Academica
              </span>
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="font-sans text-sm">
                Since 2026
              </span>
            </div>
          </div>
        </footer>
      </main>
    </SmoothScrollWrapper>
  );
}