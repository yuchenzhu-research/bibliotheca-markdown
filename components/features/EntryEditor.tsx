"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, ArrowRight, Save, X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Toast } from '@/components/ui/Toast';
import { useAutosave } from '@/hooks/useAutosave';
import { useSaveShortcut } from '@/hooks/useKeyboardShortcut';

// Simple Auto-Resizing Textarea Component
const AutoResizeTextarea = ({
    value,
    onChange,
    placeholder,
    className,
    minRows = 1
}: {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    className?: string;
    minRows?: number;
}) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, [value]);

    return (
        <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={minRows}
            className={cn(
                "w-full resize-none overflow-hidden bg-transparent border-none outline-none focus:ring-0 p-0",
                className
            )}
        />
    );
};

interface EntryData {
    image: string | null;
    title: string;
    figure: string;
    moment: string;
    narrative: string;
    keywords: string[];
    dateCreated: string;
}

export function EntryEditor({ onClose }: { onClose?: () => void }) {
    // --- State ---
    const [image, setImage] = useState<string | null>(null);
    const [title, setTitle] = useState('');
    const [figure, setFigure] = useState('');
    const [moment, setMoment] = useState('');
    const [narrative, setNarrative] = useState('');
    const [keywords, setKeywords] = useState<string[]>([]);
    const [currentKeyword, setCurrentKeyword] = useState('');
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [isPublishing, setIsPublishing] = useState(false);
    const [imageBase64, setImageBase64] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- Autosave for Narrative ---
    const { setValue: setNarrativeAuto, lastSaved, saveEntry, loadEntry } = useAutosave(narrative, {
        storageKey: 'editor_narrative',
        delay: 1500,
        onSave: (data) => {
            console.log('Narrative autosaved at', new Date().toISOString());
        },
    });

    // Full Entry Autosave Effect
    useEffect(() => {
        const currentEntry = {
            image,
            title,
            figure,
            moment,
            narrative,
            keywords,
            dateCreated: new Date().toISOString(),
        };

        const timer = setTimeout(() => {
            if (title || narrative) {
                saveEntry(currentEntry);
            }
        }, 1000);
        return () => clearTimeout(timer);
    }, [image, title, figure, moment, narrative, keywords, saveEntry]);

    useEffect(() => {
        // Try to load full entry draft first
        const savedEntry = loadEntry() as any;
        if (savedEntry) {
            if (savedEntry.title) setTitle(savedEntry.title);
            if (savedEntry.figure) setFigure(savedEntry.figure);
            if (savedEntry.moment) setMoment(savedEntry.moment);
            if (savedEntry.narrative) {
                setNarrative(savedEntry.narrative);
                setNarrativeAuto(savedEntry.narrative);
            }
            if (savedEntry.keywords) setKeywords(savedEntry.keywords);
            if (savedEntry.image) setImage(savedEntry.image);
        } else {
            // Fallback to legacy narrative only
            if (typeof window !== 'undefined') {
                const saved = localStorage.getItem('bibliotheca_editor_narrative');
                if (saved) {
                    setNarrativeAuto(saved);
                }
            }
        }
    }, [loadEntry, setNarrativeAuto]);

    // --- Toast Helper ---
    const showToast = useCallback((message: string) => {
        setToastMessage(message);
        setToastVisible(true);
    }, []);

    // --- Image to Base64 for backup ---
    const imageToBase64 = useCallback(async (imageUrl: string): Promise<string | null> => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } catch {
            console.warn('Failed to convert image to base64');
            return null;
        }
    }, []);

    // --- Save Shortcut ---
    useSaveShortcut(() => {
        handlePublish();
    }, true);

    // --- File Handlers ---
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setImage(url);

            // Convert to base64 for local backup
            const response = await fetch(url);
            const blob = await response.blob();
            const base64 = await new Promise<string | null>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.onerror = () => resolve(null);
                reader.readAsDataURL(blob);
            });
            setImageBase64(base64);
        }
    };

    const handleKeywordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && currentKeyword.trim()) {
            e.preventDefault();
            if (!keywords.includes(currentKeyword.trim())) {
                setKeywords([...keywords, currentKeyword.trim()]);
            }
            setCurrentKeyword('');
        }
    };

    const removeKeyword = (tag: string) => {
        setKeywords(keywords.filter(t => t !== tag));
    };

    // --- Publish Handler ---
    const handlePublish = async () => {
        if (isPublishing) return;
        setIsPublishing(true);

        const entryData: EntryData = {
            image: imageBase64,
            title,
            figure,
            moment,
            narrative,
            keywords,
            dateCreated: new Date().toISOString(),
        };

        try {
            // Check if running in Tauri (simple check or usage of isTauri helper)
            // Ideally we check if window.__TAURI_INTERNALS__ exists or try-catch the import/invoke
            // But standard way:
            const isTauri = typeof window !== 'undefined' && !!(window as any).__TAURI_INTERNALS__;

            if (isTauri) {
                const { invoke } = await import('@tauri-apps/api/core');

                // Call Rust command to backup to Documents
                const backupPath = await invoke<string | null>('backup_to_documents', {
                    payload: entryData,
                });

                if (backupPath) {
                    console.log('Backup saved to:', backupPath);
                    showToast('Moment Preserved in Archive');
                } else {
                    // Fallback should not happen if command returns path or error, but handling null just in case
                    localStorage.setItem('bibliotheca_last_backup', JSON.stringify(entryData));
                    showToast('Moment Saved Locally');
                }
            } else {
                // Web fallback
                localStorage.setItem('bibliotheca_last_backup', JSON.stringify(entryData));
                showToast('Draft Saved to Browser Storage');
            }

            // Clear autosaved draft after successful publish
            localStorage.removeItem('bibliotheca_editor_narrative');

        } catch (error) {
            console.error('Publish failed:', error);
            showToast('Failed to save. Please try again.');
        } finally {
            setIsPublishing(false);
        }
    };

    // --- Restore Draft on Mount ---
    useEffect(() => {
        const savedEntry = localStorage.getItem('bibliotheca_last_backup');
        if (savedEntry) {
            try {
                const data: Partial<EntryData> = JSON.parse(savedEntry);
                if (data.title) setTitle(data.title);
                if (data.figure) setFigure(data.figure);
                if (data.moment) setMoment(data.moment);
                if (data.narrative) setNarrative(data.narrative);
                if (data.keywords) setKeywords(data.keywords);
            } catch (e) {
                console.warn('Failed to restore draft:', e);
            }
        }
    }, []);

    // --- Phase 1: Image Uploader (Visual Anchor) ---
    if (!image) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-warm-paper p-6 relative">
                {/* Close Button */}
                {onClose && (
                    <button
                        onClick={onClose}
                        className="absolute top-8 left-8 p-3 bg-foreground/5 hover:bg-foreground/10 rounded-full transition-colors z-50 group"
                        title="Close Editor"
                    >
                        <X className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </button>
                )}

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-2xl aspect-video border-2 border-dashed border-primary/20 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-primary/5 transition-colors group relative overflow-hidden"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                    />

                    <div className="z-10 flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                            <Upload className="w-6 h-6 text-primary" />
                        </div>
                        <div className="text-center">
                            <h2 className="font-epic-serif text-2xl text-foreground mb-2">Upload Artifact Image</h2>
                            <p className="font-sans text-sm text-muted-foreground tracking-widest uppercase">
                                Drag & drop or click to browse
                            </p>
                        </div>
                    </div>

                    {/* Decorative Corners */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/40 -translate-x-1 -translate-y-1" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary/40 translate-x-1 -translate-y-1" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary/40 -translate-x-1 translate-y-1" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary/40 translate-x-1 translate-y-1" />
                </motion.div>

                {/* Toast */}
                <Toast
                    message={toastMessage}
                    visible={toastVisible}
                    onClose={() => setToastVisible(false)}
                />
            </div>
        );
    }

    // --- Phase 2: Edit in Place (Template Editor) ---
    return (
        <div className="relative min-h-screen bg-background selection:bg-primary/20">
            {/* Global Close Button for Overlay */}
            {onClose && (
                <button
                    onClick={onClose}
                    className="fixed top-8 left-8 p-3 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md z-[60] transition-all hover:scale-110"
                    title="Close Editor"
                >
                    <X className="w-5 h-5" />
                </button>
            )}

            {/* Hero Section (Editable Title) */}
            <header className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden group">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <Image
                        src={image}
                        alt="Hero background"
                        fill
                        className="object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

                    {/* Re-upload button overlaid */}
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute top-6 right-6 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Change Image"
                    >
                        <Upload className="w-4 h-4" />
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                    />
                </div>

                <div className="absolute bottom-0 left-0 w-full px-6 pb-12 md:px-12 md:pb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl"
                    >
                        {/* Title Input */}
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter Title..."
                            className="w-full bg-transparent font-epic-serif text-5xl md:text-7xl lg:text-8xl text-white font-light leading-[0.95] mb-6 drop-shadow-lg placeholder:text-white/20 outline-none border-none p-0 focus:ring-0"
                        />

                        {/* Short Description placeholder / Subtitle */}
                        <p className="font-elegant-sans text-lg md:text-xl text-white/60 italic font-light max-w-2xl">
                            — Visual Anchor Established. Scroll to edit details.
                        </p>
                    </motion.div>
                </div>
            </header>

            {/* Content Section - Edit Fields */}
            <div className="container mx-auto px-6 py-12 md:px-12 md:py-20 lg:grid lg:grid-cols-12 lg:gap-20">
                {/* Sidebar / Metadata */}
                <aside className="lg:col-span-4 space-y-12 mb-16 lg:mb-0">
                    {/* Figure Input */}
                    <div>
                        <h3 className="font-sans text-xs tracking-widest text-muted-foreground uppercase mb-4 border-l-2 border-primary pl-4">
                            Figure
                        </h3>
                        <input
                            type="text"
                            value={figure}
                            onChange={(e) => setFigure(e.target.value)}
                            placeholder="Name of Figure..."
                            className="w-full bg-transparent font-epic-serif text-2xl text-foreground placeholder:text-muted-foreground/30 outline-none border-none p-0 focus:ring-0"
                        />
                    </div>

                    {/* Keywords Input */}
                    <div>
                        <h3 className="font-sans text-xs tracking-widest text-muted-foreground uppercase mb-4 border-l-2 border-primary pl-4">
                            Keywords
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-3">
                            <AnimatePresence>
                                {keywords.map((tag) => (
                                    <motion.span
                                        key={tag}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        className="inline-flex items-center gap-1 px-3 py-1 bg-secondary text-secondary-foreground text-xs font-sans rounded-sm group cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                                        onClick={() => removeKeyword(tag)}
                                    >
                                        {tag}
                                        <X className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </motion.span>
                                ))}
                            </AnimatePresence>
                        </div>
                        <div className="relative">
                            <input
                                type="text"
                                value={currentKeyword}
                                onChange={(e) => setCurrentKeyword(e.target.value)}
                                onKeyDown={handleKeywordKeyDown}
                                placeholder="Add keyword + Enter..."
                                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/40 outline-none border-b border-muted focus:border-primary transition-colors py-1"
                            />
                            <Plus className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 pointer-events-none" />
                        </div>
                    </div>

                    {/* Autosave Status */}
                    {lastSaved && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-xs text-muted-foreground/50"
                        >
                            Draft autosaved {lastSaved.toLocaleTimeString()}
                        </motion.div>
                    )}
                </aside>

                {/* Main Body */}
                <article className="lg:col-span-8 space-y-16">
                    {/* Moment in Time Input */}
                    <section>
                        <h2 className="flex items-center gap-3 font-epic-serif text-3xl md:text-4xl text-foreground mb-8 text-black/20">
                            Moment in Time
                        </h2>
                        <div className="w-full">
                            <AutoResizeTextarea
                                value={moment}
                                onChange={setMoment}
                                placeholder="Describe the historical context or the specific moment captured by this artifact..."
                                className="font-elegant-sans text-xl text-foreground/80 font-light leading-relaxed placeholder:text-muted-foreground/20 italic"
                            />
                        </div>
                    </section>

                    {/* The Narrative Input */}
                    <section>
                        <h2 className="flex items-center gap-3 font-epic-serif text-3xl md:text-4xl text-foreground mb-8 text-black/20">
                            The Narrative
                        </h2>
                        <div className="w-full">
                            <AutoResizeTextarea
                                value={narrative}
                                onChange={(val) => {
                                    setNarrative(val);
                                    setNarrativeAuto(val);
                                }}
                                placeholder="Tell the story of this artifact. Why does it matter? What is the deeper narrative here?..."
                                className="font-elegant-sans text-lg text-foreground/80 font-light leading-relaxed placeholder:text-muted-foreground/20 min-h-[200px]"
                            />
                        </div>
                    </section>
                </article>
            </div>

            {/* Floating Publish Button with Shortcut Hint */}
            <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                className="fixed bottom-8 right-8 z-50"
            >
                <button
                    onClick={handlePublish}
                    disabled={isPublishing}
                    className="flex items-center gap-3 px-6 py-4 bg-primary text-primary-foreground rounded-full shadow-2xl hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 group font-sans tracking-widest uppercase text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Save className="w-4 h-4" />
                    {isPublishing ? 'Preserving...' : 'Publish to Archive'}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Keyboard shortcut hint */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="absolute -bottom-8 right-0 text-[10px] text-muted-foreground/40 font-sans tracking-widest"
                >
                    Cmd+S or Ctrl+S to save
                </motion.div>
            </motion.div>

            {/* Toast */}
            <Toast
                message={toastMessage}
                visible={toastVisible}
                onClose={() => setToastVisible(false)}
            />
        </div>
    );
}