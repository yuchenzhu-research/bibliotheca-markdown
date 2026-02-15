"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Hero } from '@/components/features/Hero';
import { ArchiveGrid } from '@/components/features/ArchiveGrid';
import { AppleScrollSection } from '@/components/ui/AppleScrollSection';
import { ImageCard } from '@/components/ui/ImageCard';
import { documents } from '@/lib/data';

// Dynamically import Canvas3D with loading state
// We need to pass props so we don't just import the default
const Canvas3D = dynamic(() => import('@/components/visual/Canvas3D'), {
  ssr: false,
  loading: () => <div className="fixed inset-0 -z-30 bg-black" />,
});

const SmoothScrollWrapper = dynamic(
  () => import('@/components/ui/SmoothScrollWrapper').then(mod => mod.SmoothScrollWrapper),
  { ssr: false }
);

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);

  return (
    <SmoothScrollWrapper>
      <main className="min-h-screen bg-transparent selection:bg-primary/20">
        {/* Layer 0: Reactive 3D Background */}
        <Canvas3D
          imageUrl="/archive/newton.jpg"
          scrollProgress={scrollProgress}
        />

        {/* Hero Section */}
        <Hero />

        {/* Cinematic Scroll Section */}
        {/* 
            This section drives the scrollProgress state which in turn drives 
            the Canvas3D explosion effect.
        */}
        <div className="relative z-10">
          <AppleScrollSection onScrollProgress={setScrollProgress}>
            {documents.slice(0, 5).map((doc) => (
              <div key={doc.id} className="flex-none w-[80vw] md:w-[60vw] lg:w-[40vw] max-w-3xl">
                <ImageCard
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
                  aspectRatio="video"
                  className="h-[60vh] md:h-[70vh] shadow-2xl"
                  focalPoint={doc.focalPoint}
                />
              </div>
            ))}
          </AppleScrollSection>
        </div>

        {/* Browse Archive Grid */}
        <ArchiveGrid />

        {/* Footer */}
        <footer className="container mx-auto px-4 py-12 border-t border-white/10 text-white/50 relative z-10 bg-black">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <span className="font-serif text-xl text-white">
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