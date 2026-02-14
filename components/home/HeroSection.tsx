"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
    return (
        <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center md:px-12 lg:px-16">
            {/* Radial Gradient Background */}
            <div
                className="fixed inset-0 -z-50 pointer-events-none"
                style={{
                    background: `
                        radial-gradient(ellipse 80% 120% at 50% 0%, rgba(79, 70, 229, 0.15) 0%, transparent 50%),
                        radial-gradient(ellipse 60% 80% at 80% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 40%),
                        radial-gradient(ellipse 40% 60% at 20% 40%, rgba(168, 85, 247, 0.05) 0%, transparent 30%)
                    `
                }}
            />

            <div className="container mx-auto flex max-w-5xl flex-col items-center gap-10 lg:gap-14">
                {/* Badge with glassmorphism */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                    <span className="inline-block rounded-full border border-white/12 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground/80 backdrop-blur-md">
                        Digital Renaissance Archive
                    </span>
                </motion.div>

                {/* Main Title - text-7xl as requested */}
                <motion.h1
                    className="font-serif text-5xl font-light tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl"
                    initial={{ opacity: 0, y: 32 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 1,
                        ease: [0.22, 1, 0.36, 1],
                        delay: 0.15
                    }}
                >
                    Bibliotheca
                    <span className="block mt-4 text-white/70">Academica</span>
                </motion.h1>

                {/* Description with elegant serif */}
                <motion.p
                    className="max-w-2xl font-serif text-lg leading-relaxed text-muted-foreground/90 md:text-xl lg:text-xl"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.8,
                        ease: [0.22, 1, 0.36, 1],
                        delay: 0.3
                    }}
                >
                    Curating the intersection of history and technology.
                    A comprehensive digital archive designed for the modern scholar.
                </motion.p>

                {/* CTA Buttons with enhanced hover transitions */}
                <motion.div
                    className="flex flex-col gap-5 mt-4 sm:flex-row"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.8,
                        ease: [0.22, 1, 0.36, 1],
                        delay: 0.45
                    }}
                >
                    <Button
                        size="lg"
                        className="h-14 px-10 text-base font-medium tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/15"
                    >
                        Explore Archive
                    </Button>
                    <Button
                        variant="ghost"
                        size="lg"
                        className="h-14 px-10 text-base font-medium tracking-wide text-muted-foreground transition-all duration-300 hover:scale-105 hover:bg-white/8 hover:text-foreground"
                    >
                        Learn More
                        <ArrowRight className="ml-2.5 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                    </Button>
                </motion.div>

                {/* Decorative line with fade-in */}
                <motion.div
                    className="mt-8 h-px w-24 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
                />
            </div>
        </section>
    );
}