"use client";

import React, { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { documents } from '@/lib/data';
import { MarkdownView } from '@/components/features/MarkdownView';
import { ImageView } from '@/components/features/ImageView';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function ArchiveDetailPage({ params }: PageProps) {
    const { id } = use(params);
    const document = documents.find((doc) => doc.id === id);

    if (!document) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-background text-foreground selection:bg-primary/20">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6 md:px-12 md:py-8 flex justify-between items-center pointer-events-none">
                <Link
                    href="/"
                    className="pointer-events-auto flex items-center gap-2 group text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    <span className="font-sans text-xs tracking-widest uppercase">Back to Archive</span>
                </Link>
                <div className="hidden md:block font-sans text-xs tracking-[0.2em] text-muted-foreground/30 uppercase">
                    Bibliotheca Academica / Item {document.id.padStart(3, '0')}
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src={document.imageUrl}
                        alt={document.title}
                        fill
                        className="object-cover"
                        priority
                        style={{ objectPosition: document.focalPoint || 'center' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                </div>

                <div className="absolute bottom-0 left-0 w-full px-6 pb-12 md:px-12 md:pb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="max-w-4xl"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <span className="px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-[10px] uppercase tracking-widest text-primary font-medium">
                                {document.category}
                            </span>
                            <span className="font-mono text-xs text-muted-foreground">
                                {document.year}
                            </span>
                        </div>
                        <h1 className="font-epic-serif text-5xl md:text-7xl lg:text-8xl text-foreground font-light leading-[0.95] mb-6">
                            {document.title}
                        </h1>
                        <p className="font-elegant-sans text-lg md:text-xl text-muted-foreground/80 italic font-light max-w-2xl">
                            — {document.description}
                        </p>
                    </motion.div>
                </div>
            </header>

            {/* Content Section - Dual Mode */}
            {document.type === 'markdown' ? (
                <MarkdownView document={document} />
            ) : (
                <ImageView document={document} />
            )}
        </main>
    );
}
