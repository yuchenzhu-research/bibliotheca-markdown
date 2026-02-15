"use client";

import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ImageCardProps {
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

export function ImageCard({
    title,
    description,
    year,
    author,
    imageUrl,
    floatingTexts,
    className,
    aspectRatio = 'video',
    focalPoint,
}: ImageCardProps) {
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
            <div className="absolute inset-0 overflow-hidden z-0">
                <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-[1.5s] cubic-bezier(0.2, 0, 0.2, 1) group-hover:scale-110"
                    sizes="800px" // 适当增加 sizes 以确保清晰度
                    style={{ objectPosition: focalPoint || 'center' }}
                />
                <div className="absolute inset-0 bg-black/5 transition-opacity duration-700 group-hover:opacity-0" />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500 z-10" />

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

            <div className="absolute inset-0 p-12 md:p-16 flex flex-col justify-end z-30 pointer-events-none">
                <div className="translate-y-4 opacity-0 transition-all duration-700 delay-100 group-hover:translate-y-0 group-hover:opacity-100 h-full flex flex-col justify-end">
                    <div className="mb-10">
                        <span className="font-sans text-[11px] tracking-[0.4em] text-primary/90 font-medium uppercase block mb-4 border-l-2 border-primary pl-4">
                            Archive Entry
                        </span>
                        <h3 className="font-epic-serif text-4xl md:text-6xl text-white font-light leading-[1.05] mb-8 max-w-2xl drop-shadow-sm">
                            {title}
                        </h3>
                        <div className="h-px w-0 bg-white/10 group-hover:w-full transition-all duration-1000 ease-out" />
                    </div>

                    {description && (
                        <div className="relative">
                            <p className="font-elegant-sans text-sm md:text-lg text-white/50 leading-relaxed max-w-xl line-clamp-3 italic font-light">
                                — {description}
                            </p>
                            <div className="absolute -left-8 top-0 bottom-0 w-px bg-white/5" />
                        </div>
                    )}
                </div>
            </div>

            <div className="absolute bottom-12 right-1/2 translate-x-1/2 w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-1000 delay-500" />
            <div className="absolute inset-4 border border-white/0 group-hover:border-white/10 transition-all duration-700 pointer-events-none" />
        </div>
    );
}
