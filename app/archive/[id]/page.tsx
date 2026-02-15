"use client";

import React, { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, BookOpen, Clock, Tag } from 'lucide-react';
import { documents } from '@/lib/data';
import { cn } from '@/lib/utils';

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

            {/* Content Section */}
            <div className="container mx-auto px-6 py-12 md:px-12 md:py-20 lg:grid lg:grid-cols-12 lg:gap-20">

                {/* Sidebar / Metadata */}
                <motion.aside
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="lg:col-span-4 space-y-12 mb-16 lg:mb-0"
                >
                    <div>
                        <h3 className="font-sans text-xs tracking-widest text-muted-foreground uppercase mb-4 border-l-2 border-primary pl-4">
                            Author
                        </h3>
                        <p className="font-epic-serif text-2xl text-foreground">
                            {document.author}
                        </p>
                    </div>

                    <div>
                        <h3 className="font-sans text-xs tracking-widest text-muted-foreground uppercase mb-4 border-l-2 border-primary pl-4">
                            Key Concepts
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {document.tags?.map((tag) => (
                                <span key={tag} className="px-3 py-1 bg-secondary text-secondary-foreground text-xs font-sans rounded-sm">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {document.resources && (
                        <div>
                            <h3 className="font-sans text-xs tracking-widest text-muted-foreground uppercase mb-4 border-l-2 border-primary pl-4">
                                Archive Resources
                            </h3>
                            <ul className="space-y-4">
                                {document.resources.map((resource, idx) => (
                                    <li key={idx} className="group cursor-pointer">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                                                    {resource.title}
                                                </p>
                                                <span className="text-xs text-muted-foreground block mt-1">
                                                    {resource.type}
                                                </span>
                                            </div>
                                            <ArrowUpRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </motion.aside>

                {/* Main Body */}
                <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                    className="lg:col-span-8 space-y-16"
                >
                    {/* Academic Context */}
                    <section>
                        <h2 className="flex items-center gap-3 font-epic-serif text-3xl md:text-4xl text-foreground mb-8">
                            <Clock className="w-6 h-6 text-primary/60" />
                            Historical Context
                        </h2>
                        <div className="prose prose-lg prose-invert text-muted-foreground font-elegant-sans font-light leading-relaxed">
                            <p>{document.academicContext}</p>
                        </div>
                    </section>

                    {/* Detailed Analysis (Using longDescription if available, otherwise fallback) */}
                    <section>
                        <h2 className="flex items-center gap-3 font-epic-serif text-3xl md:text-4xl text-foreground mb-8">
                            <BookOpen className="w-6 h-6 text-primary/60" />
                            Artifact Analysis
                        </h2>
                        <div className="prose prose-lg prose-invert text-muted-foreground font-elegant-sans font-light leading-relaxed space-y-6">
                            <p>{document.longDescription || document.description}</p>

                            {/* Concepts Expansion */}
                            {document.concepts && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 not-prose">
                                    {document.concepts.map((concept, idx) => (
                                        <div key={idx} className="bg-foreground/5 p-6 rounded-sm border border-foreground/10">
                                            <h4 className="font-epic-serif text-xl text-foreground mb-3">
                                                {concept.title}
                                            </h4>
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                {concept.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>
                </motion.article>
            </div>
        </main>
    );
}
