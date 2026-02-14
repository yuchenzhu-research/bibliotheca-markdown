"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Document } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface DocumentCardProps {
    document: Document;
    className?: string;
    onClick?: () => void;
}

export function DocumentCard({ document, className, onClick }: DocumentCardProps) {
    const [focalY, setFocalY] = useState(document.focalY || 50); // Default to 50% (Center)
    const [imageScale, setImageScale] = useState(document.imageScale || 1.0); // Default to 1.0 (No Zoom)
    const isDev = process.env.NODE_ENV === "development";

    const handleCopyConfig = (e: React.MouseEvent) => {
        e.stopPropagation();
        const config = `focalY: ${focalY}, imageScale: ${imageScale},`;
        navigator.clipboard.writeText(config);
        alert(`Copied: ${config}`);
    };

    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                // Apple Design Card: Large radius, subtle border, glassmorphism
                "group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800/50 bg-[rgba(1,1,1,0.7)] backdrop-blur-md transition-all duration-500 hover:border-slate-700/70 hover:shadow-2xl hover:shadow-primary/5",
                className
            )}
            onClick={onClick}
        >
            {/* Inner glow effect */}
            <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            {/* Image Section (Top Half) */}
            <div className="relative h-64 w-full overflow-hidden">
                <Image
                    src={document.imageUrl}
                    alt={document.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    style={{
                        objectPosition: `50% ${focalY}%`,
                        transform: `scale(${imageScale})`
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(1,1,1,0.9)] via-transparent to-transparent pointer-events-none" />

                {/* Curator's Toolkit v2 (Dev Only) */}
                {isDev && (
                    <div
                        className="absolute inset-0 z-50 flex flex-col justify-between p-2 opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Pan Control (Right) */}
                        <div className="absolute right-2 top-2 bottom-8 flex flex-col items-center justify-center gap-2 rounded-full bg-black/40 backdrop-blur-md p-1">
                            <span className="text-[8px] font-mono font-bold text-white writing-vertical-rl">PAN {focalY}%</span>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                className="h-full w-1 appearance-none bg-white/20 accent-primary outline-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                                style={{ writingMode: "vertical-lr", direction: "rtl" }}
                                value={focalY}
                                onChange={(e) => setFocalY(Number(e.target.value))}
                            />
                        </div>

                        {/* Scale Control (Bottom) */}
                        <div className="absolute bottom-2 left-10 right-10 flex items-center gap-2 rounded-full bg-black/40 backdrop-blur-md px-3 py-1">
                            <span className="text-[8px] font-mono font-bold text-white whitespace-nowrap">ZOOM {imageScale}x</span>
                            <input
                                type="range"
                                min="1.0"
                                max="2.0"
                                step="0.05"
                                className="w-full h-1 appearance-none bg-white/20 accent-primary outline-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                                value={imageScale}
                                onChange={(e) => setImageScale(Number(e.target.value))}
                            />
                            <button
                                onClick={handleCopyConfig}
                                className="rounded-full bg-primary/20 border border-primary/50 px-2 py-0.5 text-[8px] uppercase text-primary hover:bg-primary/40 whitespace-nowrap"
                                title="Copy Config"
                            >
                                SAVE
                            </button>
                        </div>
                    </div>
                )}

                <div className="absolute top-4 left-4 pointer-events-none z-10">
                    <Badge
                        variant="outline"
                        className="bg-black/40 backdrop-blur-md border-white/10 text-xs font-medium uppercase tracking-wider text-white/90"
                    >
                        {document.category}
                    </Badge>
                </div>
            </div>

            {/* Content Section - Enhanced spacing (8px grid aligned) */}
            <div className="flex flex-col gap-4 p-7">
                {/* Metadata row */}
                <div className="flex items-center justify-between">
                    <span className="text-xs font-sans font-medium text-muted-foreground/80 uppercase tracking-wider">
                        {document.year}
                    </span>
                    <div className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                    <span className="text-xs font-sans font-medium text-muted-foreground/80 uppercase tracking-wider">
                        {document.author}
                    </span>
                </div>

                {/* Title - Cinzel font for academic feel */}
                <h3 className="font-serif text-2xl font-normal text-foreground transition-colors duration-300 group-hover:text-white/95">
                    {document.title}
                </h3>

                {/* Description - Elegant serif */}
                <p className="font-serif text-sm leading-relaxed text-muted-foreground/80 line-clamp-2">
                    {document.description}
                </p>
            </div>

            {/* Hover Line */}
            <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full" />
        </motion.div>
    );
}
