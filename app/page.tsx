"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence, motion } from 'framer-motion';
import { Hero } from '@/components/features/Hero';
import { ArchiveGrid } from '@/components/features/ArchiveGrid';
import { HorizontalScrollSection } from '@/components/ui/HorizontalScrollSection';
import { ImageCard } from '@/components/ui/ImageCard';
import { ArchiveDetailView } from '@/components/features/ArchiveDetailView';
import { EntryEditor } from '@/components/features/EntryEditor';
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
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const selectedDoc = documents.find(doc => doc.id === selectedDocId);

  // Sync scroll lock with edit mode as well
  useEffect(() => {
    if (selectedDocId || isEditing) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedDocId, isEditing]);

  return (
    <main className="relative min-h-screen">
      <SmoothScrollWrapper>
        <Canvas3D
          imageUrl="/archive/newton.jpg"
          scrollProgress={scrollProgress}
        />

        {/* Hero Section */}
        <Hero onAppendClick={() => setIsEditing(true)} />

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
                onClick={() => setSelectedDocId(doc.id)}
              />
            </div>
          ))}
        </HorizontalScrollSection>

        {/* Browse Archive Grid */}
        <ArchiveGrid onCardClick={(id) => setSelectedDocId(id)} />

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
      </SmoothScrollWrapper>

      {/* Archive Detail View Overlay */}
      <AnimatePresence>
        {selectedDoc && (
          <ArchiveDetailView
            document={selectedDoc}
            onClose={() => setSelectedDocId(null)}
          />
        )}
      </AnimatePresence>

      {/* Entry Editor Overlay */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background overflow-y-auto"
            data-lenis-prevent
          >
            <EntryEditor onClose={() => setIsEditing(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}