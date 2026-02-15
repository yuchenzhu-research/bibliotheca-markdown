"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";


interface AletImageCardProps {
  title: string;
  description?: string;
  year?: string;
  author?: string;
  imageUrl: string;
  category?: string;
  floatingTexts?: {
    topLeft?: string;
    topRight?: string;
    bottomLeft?: string;
    bottomRight?: string;
    centerLeft?: string;
  };
  className?: string;
  aspectRatio?: "square" | "video" | "portrait" | "auto";
  focalPoint?: string; // e.g., "50% 20%" for centering faces
}

export function AletImageCard({
  title,
  description,
  year,
  author,
  imageUrl,
  category,
  floatingTexts,
  className,
  aspectRatio = "video",
  focalPoint,
}: AletImageCardProps) {
  const aspectRatioClasses = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
    auto: "aspect-auto",
  };

  return (
    <div
      className={cn(
        "group relative overflow-hidden bg-warm-paper border-elegant flex-none scroll-snap-align-start",
        aspectRatioClasses[aspectRatio],
        className
      )}
    >
      {/* Background Image with subtle zoom effect */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-[1.5s] cubic-bezier(0.2, 0, 0.2, 1) group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ objectPosition: focalPoint || "center" }}
        />
        {/* Subtle overlay */}
        <div className="absolute inset-0 bg-black/5 transition-opacity duration-700 group-hover:opacity-0" />
      </div>

      {/* Minimal gradient overlay at bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

      {/* ===== Floating Text Elements - Alet Style ===== */}
      {floatingTexts && (
        <>
          {/* Top Left - e.g., "08/25" */}
          {floatingTexts.topLeft && (
            <div className="absolute top-8 left-8 flex items-center gap-3 z-20">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="font-sans text-[10px] font-medium tracking-[0.3em] text-white/90 uppercase">
                {floatingTexts.topLeft}
              </span>
            </div>
          )}

          {/* Top Right - page number or date */}
          {floatingTexts.topRight && (
            <span className="absolute top-4 right-8 font-serif italic text-6xl font-light tracking-tighter text-white/20 z-20 transition-all duration-700 group-hover:text-white/40 group-hover:-translate-y-2">
              {floatingTexts.topRight}
            </span>
          )}

          {/* Center Left - vertical decorative text */}
          {floatingTexts.centerLeft && (
            <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4 z-20">
              <div className="w-px h-12 bg-white/20" />
              <span className="font-sans text-[9px] uppercase tracking-[0.4em] text-white/40 writing-mode-vertical py-2">
                {floatingTexts.centerLeft}
              </span>
              <div className="w-px h-12 bg-white/20" />
            </div>
          )}

          {/* Bottom Left - signature/accent mark */}
          {floatingTexts.bottomLeft && (
            <div className="absolute bottom-8 left-8 z-20 transition-transform duration-500 group-hover:-translate-x-1">
              <span className="text-white/90 font-serif italic text-sm tracking-wide">
                {floatingTexts.bottomLeft}
              </span>
            </div>
          )}

          {/* Bottom Right - year or additional info */}
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
        </>
      )}

      {/* Content overlay at bottom - Reveal logic refined */}
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

      {/* Signature Red Dot (Alet hallmark) */}
      <div className="absolute bottom-12 right-1/2 translate-x-1/2 w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-1000 delay-500" />

      {/* Outer focus border */}
      <div className="absolute inset-4 border border-white/0 group-hover:border-white/10 transition-all duration-700 pointer-events-none" />
    </div>
  );
}


/* Featured Document Card - Large, editorial style */
interface FeaturedDocumentProps {
  title: string;
  description: string;
  year: string;
  author: string;
  imageUrl: string;
  category?: string;
  pageNumber?: string;
  className?: string;
  focalPoint?: string;
}

export function FeaturedDocument({
  title,
  description,
  year,
  author,
  imageUrl,
  category,
  pageNumber,
  className,
  focalPoint,
}: FeaturedDocumentProps) {
  return (
    <div
      className={cn(
        "relative min-h-[600px] overflow-hidden bg-warm-paper border-elegant",
        className
      )}
    >
      {/* Full image background */}
      <div className="absolute inset-0">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover image-hover-zoom"
          priority
          style={{ objectPosition: focalPoint || "center" }}
        />
      </div>

      {/* Gradient overlay - editorial style */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-black/40" />

      {/* ===== Floating Elements (Alet Style) ===== */}
      {/* Left: Date/issue number */}
      <span className="absolute top-8 left-8 font-sans text-xs tracking-[0.25em] text-white/70 uppercase z-10">
        {category || "Featured"}
      </span>

      {/* Right: Large page number */}
      {pageNumber && (
        <span className="absolute top-8 right-8 text-page-number text-white/20 z-10">
          {pageNumber}
        </span>
      )}

      {/* Center: Minimal decorative element aligned with center of image */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 z-10">
        <span className="w-12 h-px bg-white/40 block mb-3" />
        <span className="w-2 h-2 rounded-full bg-[oklch(0.55_0.18_20)] block" />
      </div>

      {/* Content - Left aligned with image center */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 max-w-xl z-10">
        <h2 className="font-epic-serif text-5xl md:text-6xl lg:text-7xl text-white font-light leading-tight mb-6">
          {title}
        </h2>

        <p className="font-elegant-sans text-lg text-white/80 leading-relaxed mb-8 max-w-lg">
          {description}
        </p>

        <div className="flex items-center gap-4">
          <span className="font-sans text-xs tracking-[0.2em] text-white/60 uppercase">
            {year} · {author}
          </span>
        </div>

        {/* Decorative red accent circle */}
        <div className="absolute -left-12 top-0 w-4 h-4 rounded-full bg-[oklch(0.55_0.18_20)] opacity-80" />
      </div>

      {/* Bottom decoration */}
      <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between z-10">
        <span className="font-sans text-xs tracking-[0.2em] text-white/50 uppercase">
          Bibliotheca Academica
        </span>
        <span className="font-sans text-xs tracking-widest text-white/40">
          / {year}
        </span>
      </div>
    </div>
  );
}

/* Horizontal Scroll Section Container */
interface HorizontalScrollSectionProps {
  children: React.ReactNode;
  className?: string;
  showScrollIndicator?: boolean;
}
/* Horizontal Scroll Section Container */
interface HorizontalScrollSectionProps {
  children: React.ReactNode;
  className?: string;
  showScrollIndicator?: boolean;
}

export function HorizontalScrollSection({
  children,
  className,
  showScrollIndicator = true,
}: HorizontalScrollSectionProps) {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // ========== Phase 1: Entry (0% - 12.5%) - Title fades out ==========
  const entryOpacity = useTransform(scrollYProgress, [0, 0.125], [1, 0]);

  // ========== Phase 2: Horizontal Scroll (12.5% - 62.5%) - Cards slide in ==========
  // Cards start from right (30%) and move to final position (-60%)
  const x = useTransform(scrollYProgress, [0.125, 0.625], ["30%", "-60%"]);

  // Card scale effect: 0.95 -> 1.0 during horizontal scroll
  const cardScale = useTransform(scrollYProgress, [0.125, 0.625], [0.95, 1]);

  // ========== Phase 3: Exit (62.5% - 75%) - Title fades in ==========
  const exitOpacity = useTransform(scrollYProgress, [0.625, 0.75], [0, 1]);

  // Combined header opacity (entry + exit phases)
  const headerOpacity = useTransform(scrollYProgress,
    [0, 0.125, 0.625, 0.75],
    [1, 0, 0, 1]
  );

  return (
    <section
      ref={targetRef}
      className={cn("relative h-[400vh] bg-warm-paper py-0", className)}
    >
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden">
        {/* Section header - fades in/out based on scroll phase */}
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

        {/* Horizontal scroll container with scale effect */}
        <motion.div
          style={{ x: x as any, scale: cardScale as any }}
          className="flex gap-16 md:gap-24 px-[10vw] items-center will-change-transform"
        >
          {children}
          {/* Spacer at the end for consistent scrolling */}
          <div className="flex-none w-[20vw]" />
        </motion.div>

        {/* Floating background decorative letter - Alet style */}
        <div className="absolute left-[5vw] top-1/2 -translate-y-1/2 -z-10 opacity-[0.03] pointer-events-none select-none">
          <span className="font-epic-serif text-[40rem] leading-none">A</span>
        </div>
      </div>
    </section>
  );
}



/* Navigation dot indicator for scroll position */
interface ScrollIndicatorProps {
  total: number;
  current: number;
  onSelect: (index: number) => void;
  className?: string;
}

export function ScrollIndicator({
  total,
  current,
  onSelect,
  className,
}: ScrollIndicatorProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          className={cn(
            "transition-all duration-300",
            i === current
              ? "w-8 h-0.5 bg-foreground"
              : "w-2 h-0.5 bg-foreground/20 hover:bg-foreground/40"
          )}
          aria-label={`Go to slide ${i + 1}`}
        />
      ))}
    </div>
  );
}