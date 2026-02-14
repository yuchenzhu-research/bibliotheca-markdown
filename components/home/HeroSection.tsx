"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
    return (
        <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 text-center md:px-8">
            {/* Background Glows */}
            <div className="absolute top-1/2 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[120px] opacity-50" />
            <div className="absolute top-0 right-0 -z-10 h-[300px] w-[300px] bg-blue-500/10 blur-[100px] opacity-30" />
            <div className="absolute bottom-0 left-0 -z-10 h-[300px] w-[300px] bg-purple-500/10 blur-[100px] opacity-30" />

            <div className="container mx-auto flex max-w-4xl flex-col items-center gap-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <span className="inline-block rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-widest text-muted-foreground backdrop-blur-sm">
                        Digital Renaissance Archive
                    </span>
                </motion.div>

                <motion.h1
                    className="font-serif text-5xl font-medium tracking-tight text-foreground sm:text-7xl md:text-8xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.8,
                        ease: "easeOut",
                        delay: 0.2, // Stagger effect
                    }}
                >
                    Bibliotheca <br className="hidden md:block" />
                    <span className="text-white/80">Academica</span>
                </motion.h1>

                <motion.p
                    className="max-w-2xl text-lg text-muted-foreground md:text-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.8,
                        ease: "easeOut",
                        delay: 0.4,
                    }}
                >
                    Curating the intersection of history and technology. A comprehensive
                    digital archive designed for the modern scholar.
                </motion.p>

                <motion.div
                    className="flex flex-col gap-4 sm:flex-row"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.8,
                        ease: "easeOut",
                        delay: 0.6,
                    }}
                >
                    <Button size="lg" className="h-12 px-8 text-base">
                        Explore Archive
                    </Button>
                    <Button
                        variant="ghost"
                        size="lg"
                        className="group h-12 px-8 text-base hover:bg-white/5"
                    >
                        Learn More
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                </motion.div>
            </div>
        </section>
    );
}
