"use client";

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useExplosionControl } from '@/hooks/useExplosionControl';

interface AppleScrollSectionProps {
    children: React.ReactNode;
    className?: string;
    onScrollProgress?: (progress: number) => void;
}

export function AppleScrollSection({
    children,
    className,
    onScrollProgress,
}: AppleScrollSectionProps) {
    const targetRef = useRef<HTMLDivElement>(null);

    // Create relative scroll progress (0 to 1) for this section
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start end", "end start"], // Capture full viewport passage
    });

    // Physics-based smoothing (Damping)
    // Mass=0.5 makes it lighter/faster to respond
    // Damping=20 avoids oscillation
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        mass: 0.5,
    });

    // Map vertical scroll (0-1) to horizontal movement
    // Move from 100% (right) to -100% (left)
    const x = useTransform(smoothProgress, [0.1, 0.9], ["100%", "-100%"]);

    // Opacity fade in/out
    const opacity = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    // Notify parent component (Canvas3D) of scroll activity
    // This allows the particle effects to sync with this scroll
    useMotionValueEvent(smoothProgress, "change", (latest) => {
        if (onScrollProgress) {
            onScrollProgress(latest);
        }
    });

    return (
        <section ref={targetRef} className={cn("relative h-[400vh]", className)}>
            <div className="sticky top-0 h-screen overflow-hidden flex items-center">
                {/* Horizontal Container */}
                <motion.div
                    style={{ x, opacity }}
                    className="flex gap-16 px-20 will-change-transform"
                >
                    {children}
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    style={{ opacity }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 text-muted-foreground/50 text-xs tracking-widest uppercase"
                >
                    Scroll to Explore
                </motion.div>
            </div>
        </section>
    );
}
