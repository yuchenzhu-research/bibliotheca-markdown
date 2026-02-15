"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from 'framer-motion';
import { cn } from '@/lib/utils';

interface HorizontalScrollSectionProps {
    children: React.ReactNode;
    className?: string;
    showScrollIndicator?: boolean;
    onScrollProgress?: (progress: number) => void;
}

export function HorizontalScrollSection({
    children,
    className,
    showScrollIndicator = true,
    onScrollProgress,
}: HorizontalScrollSectionProps) {
    const targetRef = useRef<HTMLDivElement>(null);
    // 垂直视觉中心触发逻辑 (v4)：
    // offset: ["start center", "end center"]
    // 意味着当 Section 顶部到达屏幕中心时开始计数 (0)，底部离开中心时结束 (1)
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start center", "end center"]
    });

    // Notify parent of scroll progress for particle effects
    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        if (onScrollProgress) {
            onScrollProgress(latest);
        }
    });

    // 空间感布局 (v4)：
    // 30% 留白对称布局：
    // 起始 X = 30vw (左侧留白 30%)
    // 结束 X = 100vw - 30vw - (3张卡片总宽 + 2个间距)
    // 卡片宽 45vw, 间距 6vw (approx. for 6rem)
    // 总宽 = 45*3 + 6*2 = 135 + 12 = 147vw
    // 结束 X = 70vw - 147vw = -77vw

    // Header Opacity: 只在定格入场和离场时显示，位移期间消失
    const headerOpacity = useTransform(scrollYProgress,
        [0, 0.1, 0.2, 0.8, 0.9, 1],
        [1, 1, 0, 0, 1, 1]
    );

    // X 轴物理位移
    // 0 -> 0.2: 垂直居中入场，卡片静止在左侧 30vw
    // 0.2 -> 0.8: 横向平滑移动
    // 0.8 -> 1.0: 卡片静止在右侧 30vw，等待垂直离场
    const xRaw = useTransform(
        scrollYProgress,
        [0, 0.2, 0.8, 1], // 对称锁定区间
        ['30vw', '30vw', '-77vw', '-77vw']
    );

    // 稍微调高 stiffness 以响应更快的"中位触发"节奏
    const x = useSpring(xRaw, {
        damping: 40,
        stiffness: 90,
        mass: 1,
    });

    // 缩放：在中心时最大，进入和退出锁定区时微调
    const cardScaleRaw = useTransform(scrollYProgress, [0, 0.2, 0.5, 0.8, 1], [0.95, 0.95, 1, 0.95, 0.95]);
    const cardScale = useSpring(cardScaleRaw, {
        damping: 25,
        stiffness: 150,
    });

    return (
        <section
            ref={targetRef}
            className={cn('relative h-[700vh] py-0', className)} // 增加到 700vh 以获得更长的定格时间
        >
            <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden">
                {/* Section header - RESTORED: Dark text colors */}
                <motion.div
                    style={{ opacity: headerOpacity }}
                    className="container mx-auto px-4 mb-8 md:mb-16 w-full"
                >
                    <div className="flex items-end justify-between">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-px bg-primary/40" />
                                <span className="text-display-xs text-primary font-elegant-sans tracking-[0.3em] uppercase">
                                    Archive Collection
                                </span>
                            </div>
                            {/* RESTORED: Foreground color (dark) */}
                            <h2 className="font-epic-serif text-5xl md:text-8xl text-foreground font-light leading-[1]">
                                Selected <br />
                                <span className="italic pl-12 md:pl-32">Works</span>
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

                {/* Horizontal scroll container - RESTORED Layout */}
                <motion.div
                    style={{ x, scale: cardScale }}
                    className="flex gap-12 md:gap-24 px-[5vw] items-center will-change-transform"
                >
                    {children}
                    {/* Spacer for scroll completion */}
                    <div className="flex-none w-[10vw]" />
                </motion.div>

                {/* Floating background letter - RESTORED: Extremely subtle opacity to avoid text collision */}
                <div className="absolute left-[5vw] top-1/2 -translate-y-1/2 -z-10 opacity-[0.015] pointer-events-none select-none text-foreground">
                    <span className="font-epic-serif text-[20rem] md:text-[40rem] leading-none">A</span>
                </div>
            </div>
        </section>
    );
}
