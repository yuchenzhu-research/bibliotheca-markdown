"use client";

import { motion } from "framer-motion";
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
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                "group relative flex flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-zinc-900/50 backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:shadow-2xl hover:shadow-primary/10",
                className
            )}
            onClick={onClick}
        >
            {/* Background Glow Overlay */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            {/* Image Section (Top Half) */}
            <div className="relative h-64 w-full overflow-hidden">
                <Image
                    src={document.imageUrl}
                    alt={document.title}
                    fill
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />

                <div className="absolute top-4 left-4">
                    <Badge variant="outline" className="bg-zinc-950/50 backdrop-blur-sm border-white/10 text-xs font-medium uppercase tracking-widest text-white/80">
                        {document.category}
                    </Badge>
                </div>
            </div>

            {/* Content Section */}
            <div className="flex flex-col gap-3 p-6">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                        {document.year}
                    </span>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                        {document.author}
                    </span>
                </div>

                <h3 className="font-serif text-2xl font-medium text-foreground group-hover:text-primary transition-colors">
                    {document.title}
                </h3>

                <p className="text-sm text-muted-foreground line-clamp-2">
                    {document.description}
                </p>
            </div>

            {/* Hover Line */}
            <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full" />
        </motion.div>
    );
}
