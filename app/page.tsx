"use client";

import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import dynamic from 'next/dynamic';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { documents } from "@/app/data/mock-documents";

// Dynamically import Canvas3D to avoid SSR issues
const Canvas3D = dynamic(() => import('@/components/visual/Canvas3D').then(mod => mod.default), {
  ssr: false,
  loading: () => <div className="fixed inset-0 -z-30 bg-warm-paper" />,
});

const SmoothScrollWrapper = dynamic(
  () => import('@/components/ui/SmoothScrollWrapper').then(mod => mod.SmoothScrollWrapper),
  { ssr: false }
);

interface AletImageCardProps {
  title: string;
  description?: string;
  year?: string;
  author?: string;
  imageUrl: string;
  floatingTexts?: {
    topLeft?: string;
    centerLeft?: string;
    bottomRight?: string;
  };
  className?: string;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'auto';
  focalPoint?: string;
}

function AletImageCard({
  title,
  description,
  year,
  author,
  imageUrl,
  floatingTexts,
  className,
  aspectRatio = 'video',
  focalPoint,
}: AletImageCardProps) {
  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
    auto: 'aspect-auto',
  };

  return (
    <div
      className={cn(
        'group relative overflow-hidden bg-warm-paper border-elegant flex-none scroll-snap-align-start',
        aspectRatioClasses[aspectRatio],
        className
      )}
    >
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-[1.5s] cubic-bezier(0.2, 0, 0.2, 1) group-hover:scale-110"
          sizes="500px"
          style={{ objectPosition: focalPoint || 'center' }}
        />
        <div className="absolute inset-0 bg-black/5 transition-opacity duration-700 group-hover:opacity-0" />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

      {floatingTexts && (
        <div className="absolute inset-0">
          {floatingTexts.topLeft && (
            <div className="absolute top-8 left-8 flex items-center gap-3 z-20">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="font-sans text-[10px] font-medium tracking-[0.3em] text-white/90 uppercase">
                {floatingTexts.topLeft}
              </span>
            </div>
          )}

          {floatingTexts.centerLeft && (
            <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4 z-20">
              <div className="w-px h-12 bg-white/20" />
              <span className="font-sans text-[9px] uppercase tracking-[0.4em] text-white/40 writing-mode-vertical py-2">
                {floatingTexts.centerLeft}
              </span>
              <div className="w-px h-12 bg-white/20" />
            </div>
          )}

          {floatingTexts.bottomRight && (
            <div className="absolute bottom-8 right-8 z-20 flex flex-col items-end">
              <span className="font-sans text-[9px] tracking-[0.3em] text-white/50 uppercase mb-1">
                Ref.
              </span>
              <span className="font-mono text-[10px] tracking-widest text-white/80 uppercase">
                {floatingTexts.bottomRight}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="absolute inset-0 p-8 flex flex-col justify-end z-30 pointer-events-none">
        <div className="translate-y-4 opacity-0 transition-all duration-700 delay-100 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="font-sans text-[10px] tracking-[0.3em] text-primary uppercase block mb-2">
            Viewing Entry
          </span>
          <h3 className="font-epic-serif text-3xl md:text-4xl text-white font-light leading-tight mb-3">
            {title}
          </h3>
          <div className="h-px w-0 bg-white/30 group-hover:w-full transition-all duration-1000 ease-out mb-4" />
          {description && (
            <p className="font-elegant-sans text-sm text-white/70 leading-relaxed max-w-sm line-clamp-2 italic">
              — {description}
            </p>
          )}
        </div>
      </div>

      <div className="absolute bottom-12 right-1/2 translate-x-1/2 w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-1000 delay-500" />
      <div className="absolute inset-4 border border-white/0 group-hover:border-white/10 transition-all duration-700 pointer-events-none" />
    </div>
  );
}

// Horizontal Scroll Section with Physics Damping
interface HorizontalScrollSectionProps {
  children: React.ReactNode;
  className?: string;
  showScrollIndicator?: boolean;
}

function HorizontalScrollSection({
  children,
  className,
  showScrollIndicator = true,
}: HorizontalScrollSectionProps) {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Phase 1: Entry (0% - 12.5%) - Title fades out
  const headerOpacity = useTransform(scrollYProgress,
    [0, 0.125, 0.625, 0.75],
    [1, 0, 0, 1]
  );

  // Phase 2: Horizontal Scroll (12.5% - 62.5%) - Cards slide in
  // With spring physics for natural damping feel
  const xRaw = useTransform(scrollYProgress, [0.125, 0.625], ['30%', '-60%']);
  const x = useSpring(xRaw, {
    damping: 15,
    stiffness: 200,
    mass: 1,
  });

  // Card scale effect: 0.95 -> 1.0 during horizontal scroll
  const cardScaleRaw = useTransform(scrollYProgress, [0.125, 0.625], [0.95, 1]);
  const cardScale = useSpring(cardScaleRaw, {
    damping: 20,
    stiffness: 300,
  });

  return (
    <section
      ref={targetRef}
      className={cn('relative h-[400vh] bg-warm-paper py-0', className)}
    >
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden">
        {/* Section header */}
        <motion.div
          style={{ opacity: headerOpacity }}
          className="container mx-auto px-4 mb-16 w-full"
        >
          <div className="flex items-end justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-px bg-primary/40" />
                <span className="text-display-xs text-primary font-elegant-sans tracking-[0.3em] uppercase">
                  Archive Collection
                </span>
              </div>
              <h2 className="font-epic-serif text-6xl md:text-8xl text-foreground font-light leading-[1]">
                Selected <br />
                <span className="italic pl-16 md:pl-32">Works</span>
              </h2>
            </div>

            {showScrollIndicator && (
              <div className="hidden md:flex flex-col items-end gap-3 text-xs tracking-widest text-muted-foreground/40">
                <div className="flex items-center gap-4">
                  <span>Scroll to explore</span>
                  <span className="w-24 h-px bg-foreground/10" />
                  <span className="animate-side-to-side text-lg">→</span>
                </div>
                <span className="font-mono text-[10px] uppercase">/ 1687—2026</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Horizontal scroll container with spring damping */}
        <motion.div
          style={{ x, scale: cardScale }}
          className="flex gap-16 md:gap-24 px-[10vw] items-center will-change-transform"
        >
          {children}
          <div className="flex-none w-[20vw]" />
        </motion.div>

        {/* Floating background letter */}
        <div className="absolute left-[5vw] top-1/2 -translate-y-1/2 -z-10 opacity-[0.03] pointer-events-none select-none">
          <span className="font-epic-serif text-[40rem] leading-none">A</span>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <SmoothScrollWrapper>
      <main className="min-h-screen bg-warm-paper selection:bg-primary/20">
        {/* Layer 0: Particle Background */}
        <Canvas3D imageUrl="/archive/euclid.jpg" />

        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center">
          <div className="container mx-auto px-4 pt-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-5 relative">
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="absolute -top-8 left-0 font-sans text-xs tracking-[0.25em] text-muted-foreground/50 uppercase"
                >
                  Est. MMXXVI
                </motion.span>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                >
                  <span className="inline-block rounded-full border border-foreground/20 px-4 py-1.5 text-xs font-sans font-light uppercase tracking-[0.2em] text-muted-foreground/60 mb-8">
                    Digital Renaissance
                  </span>

                  <h1 className="font-epic-serif text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light tracking-tighter text-foreground leading-[0.95] mb-8">
                    Bibliotheca
                    <span className="block text-primary/80 mt-2">Academica</span>
                  </h1>

                  <div className="w-12 h-px bg-foreground/20 mb-8" />

                  <p className="font-elegant-sans text-lg md:text-xl text-muted-foreground/70 leading-relaxed max-w-md mb-10">
                    Curating the intersection of history and technology.
                    A comprehensive digital archive for the modern scholar.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="btn-minimal h-12 px-8"
                    >
                      Explore Collection
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="btn-minimal h-12 px-8 group"
                    >
                      <span>Learn More</span>
                      <ArrowRight className="ml-2 h-4 w-4 opacity-50 group-hover:translate-x-1 transition-all" />
                    </motion.button>
                  </div>
                </motion.div>

                <div className="hidden lg:block absolute -left-8 top-1/2 -translate-y-1/2 -translate-x-full">
                  <span className="writing-mode-vertical font-sans text-xs tracking-[0.3em] text-muted-foreground/30 uppercase rotate-180">
                    scroll to explore
                  </span>
                </div>
              </div>

              <div className="lg:col-span-7 relative">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                  className="absolute -top-4 right-8 z-20"
                >
                  <div className="w-3 h-3 rounded-full bg-primary" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
                  className="relative aspect-[16/10] overflow-hidden"
                >
                  <div className="absolute inset-0">
                    <div
                      className="w-full h-full bg-cover bg-center transition-transform duration-[3s] ease-out"
                      style={{
                        backgroundImage: 'url("/archive/newton.jpg")',
                        backgroundPosition: '50% 10%',
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-foreground/40 via-transparent to-transparent mix-blend-multiply" />
                    <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_2px,3px_100%] opacity-20" />
                  </div>

                  <div className="absolute inset-0">
                    <span className="absolute top-6 right-8 font-sans text-xs tracking-[0.2em] text-white/70 uppercase">
                      1687
                    </span>
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 font-sans text-xs tracking-[0.25em] text-white/50 writing-mode-vertical">
                      Isaac Newton
                    </span>
                  </div>

                  <div className="absolute inset-0 border border-white/10" />
                </motion.div>

                <div className="absolute bottom-0 left-0 w-32 h-px bg-foreground/20" />
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="absolute bottom-8 left-4 right-4 flex items-center justify-between"
            >
              <span className="hidden md:block font-sans text-xs tracking-widest text-muted-foreground/40 uppercase">
                Athens · Rome · Florence
              </span>
              <span className="font-sans text-xs tracking-[0.3em] text-muted-foreground/30 uppercase">
                bibliotheca-academica
              </span>
              <span className="hidden md:block font-sans text-xs tracking-widest text-muted-foreground/40 uppercase">
                Volume I
              </span>
            </motion.div>
          </div>
        </section>

        {/* Horizontal Scroll Section with Particle Effects */}
        <HorizontalScrollSection>
          {documents.map((doc) => (
            <div key={doc.id} className="flex-none w-[550px]">
              <AletImageCard
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
                className="h-[65vh]"
                focalPoint={doc.focalPoint}
              />
            </div>
          ))}
        </HorizontalScrollSection>

        {/* More content to allow full scroll */}
        <section className="container mx-auto px-4 py-20">
          <div className="mb-16">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-decorative text-muted-foreground/60 block mb-3">
                  Complete Collection
                </span>
                <h2 className="font-epic-serif text-4xl md:text-5xl text-foreground font-light">
                  Browse Archive
                </h2>
              </div>
              <button className="hidden md:flex items-center gap-3 px-6 py-3 border border-foreground/20 hover:border-foreground/40 transition-colors duration-300">
                <span className="font-sans text-sm tracking-widest uppercase">
                  View All
                </span>
                <ArrowRight className="w-4 h-4 opacity-60" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-foreground/5 border border-foreground/5">
            {documents.slice(0, 6).map((doc) => (
              <div
                key={doc.id}
                className="group relative aspect-square overflow-hidden bg-card"
              >
                <AletImageCard
                  title={doc.title}
                  description={doc.description}
                  year={doc.year}
                  author={doc.author}
                  imageUrl={doc.imageUrl}
                  floatingTexts={{ topLeft: doc.category }}
                  aspectRatio="square"
                  className="h-full w-full border-none"
                  focalPoint={doc.focalPoint}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-4 py-12 border-t border-foreground/5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <span className="font-serif text-xl text-foreground">
                Bibliotheca Academica
              </span>
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="font-sans text-sm text-muted-foreground/60">
                Since 2026
              </span>
            </div>
          </div>
        </footer>
      </main>
    </SmoothScrollWrapper>
  );
}