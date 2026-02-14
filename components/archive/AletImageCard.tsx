"use client";

import Image from "next/image";
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
        "group relative overflow-hidden bg-warm-paper border-elegant",
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
          className="object-cover image-hover-zoom"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Subtle overlay */}
        <div className="absolute inset-0 bg-black/10 transition-opacity duration-500 group-hover:opacity-0" />
      </div>

      {/* Minimal gradient overlay at bottom */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

      {/* ===== Floating Text Elements - Alet Style ===== */}
      {floatingTexts && (
        <>
          {/* Top Left - e.g., "08/25" */}
          {floatingTexts.topLeft && (
            <span className="absolute top-6 left-6 font-sans text-xs font-light tracking-[0.2em] text-white/80 uppercase z-20">
              {floatingTexts.topLeft}
            </span>
          )}

          {/* Top Right - page number or date */}
          {floatingTexts.topRight && (
            <span className="absolute top-6 right-6 font-sans text-4xl font-light tracking-tighter text-white/60 z-20">
              {floatingTexts.topRight}
            </span>
          )}

          {/* Center Left - vertical decorative text */}
          {floatingTexts.centerLeft && (
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-sans text-xs uppercase tracking-[0.25em] text-white/50 writing-mode-vertical z-20">
              {floatingTexts.centerLeft}
            </span>
          )}

          {/* Bottom Left - signature/accent mark (red circle like in Alet) */}
          {floatingTexts.bottomLeft && (
            <div className="absolute bottom-6 left-6 z-20">
              <span className="text-white/90 font-serif italic text-sm">
                {floatingTexts.bottomLeft}
              </span>
            </div>
          )}

          {/* Bottom Right - year or additional info */}
          {floatingTexts.bottomRight && (
            <span className="absolute bottom-6 right-6 font-sans text-xs tracking-widest text-white/70 uppercase z-20">
              {floatingTexts.bottomRight}
            </span>
          )}
        </>
      )}

      {/* Category tag - minimal */}
      {category && (
        <span className="absolute top-6 left-1/2 -translate-x-1/2 px-4 py-1 bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-xs uppercase tracking-[0.2em] z-20">
          {category}
        </span>
      )}

      {/* Content overlay at bottom - reveal on hover */}
      <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
        {/* Red accent line */}
        <div className="w-8 h-px bg-[oklch(0.55_0.18_20)] mb-4" />

        <h3 className="font-epic-serif text-2xl md:text-3xl text-white font-light leading-tight mb-2">
          {title}
        </h3>

        {description && (
          <p className="font-elegant-sans text-sm text-white/80 leading-relaxed max-w-md">
            {description}
          </p>
        )}

        {(year || author) && (
          <div className="flex items-center gap-3 mt-4 text-xs tracking-widest text-white/60 uppercase">
            {year && <span>{year}</span>}
            {year && author && <span>·</span>}
            {author && <span>{author}</span>}
          </div>
        )}
      </div>

      {/* Subtle border on hover */}
      <div className="absolute inset-0 border border-white/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />
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

export function HorizontalScrollSection({
  children,
  className,
  showScrollIndicator = true,
}: HorizontalScrollSectionProps) {
  return (
    <section className={cn("relative py-20", className)}>
      {/* Section header with floating decorative text */}
      <div className="container mx-auto px-4 mb-12">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-decorative text-muted-foreground/60 block mb-4">
              Archive Collection
            </span>
            <h2 className="font-epic-serif text-4xl md:text-5xl text-foreground font-light">
              Selected Works
            </h2>
          </div>

          {showScrollIndicator && (
            <div className="hidden md:flex items-center gap-4 text-xs tracking-widest text-muted-foreground/40">
              <span>Scroll</span>
              <span className="w-16 h-px bg-foreground/20" />
              <span className="animate-pulse">→</span>
            </div>
          )}
        </div>
      </div>

      {/* Horizontal scroll container */}
      <div className="scroll-snap-x overflow-x-auto scrollbar-hide pb-8 px-4 md:px-0">
        <div className="flex gap-6 md:gap-8 px-4 md:px-[calc(50vw-300px)]">
          {children}
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