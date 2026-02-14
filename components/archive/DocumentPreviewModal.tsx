"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Document } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface DocumentPreviewModalProps {
    document: Document | null;
    isOpen: boolean;
    onClose: () => void;
}

export function DocumentPreviewModal({
    document,
    isOpen,
    onClose,
}: DocumentPreviewModalProps) {
    if (!document) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl overflow-hidden p-0 bg-background border-white/10 sm:max-w-5xl md:h-[600px] flex flex-col md:flex-row gap-0">

                {/* Left Side: Image */}
                <div className="relative h-64 w-full md:h-full md:w-1/2">
                    <Image
                        src={document.imageUrl}
                        alt={document.title}
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent md:bg-gradient-to-r" />
                </div>

                {/* Right Side: Content */}
                <div className="flex h-full w-full flex-col md:w-1/2 bg-background/95 backdrop-blur-xl">
                    <DialogHeader className="px-6 pt-6 pb-2">
                        <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline" className="border-white/20 text-muted-foreground uppercase tracking-widest text-[10px]">
                                {document.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground font-mono">
                                {document.year}
                            </span>
                        </div>
                        <DialogTitle className="font-serif text-3xl md:text-4xl text-foreground mb-1">
                            {document.title}
                        </DialogTitle>
                        <DialogDescription className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                            {document.author}
                        </DialogDescription>
                    </DialogHeader>

                    <ScrollArea className="flex-1 p-6 pt-2">
                        <div className="space-y-6 text-muted-foreground leading-relaxed">
                            <p className="text-lg text-foreground/90 font-serif italic border-l-2 border-primary/50 pl-4 py-1">
                                "{document.description}"
                            </p>

                            <div className="space-y-4">
                                <h4 className="text-sm font-medium text-foreground uppercase tracking-widest border-b border-white/10 pb-2">
                                    Curator's Insight
                                </h4>
                                <div className="text-sm space-y-4">
                                    {document.academicContext ? (
                                        <p>{document.academicContext}</p>
                                    ) : (
                                        <>
                                            <p>
                                                This document represents a pivotal moment in {document.category.toLowerCase()}.
                                                Its preservation is crucial for understanding the intellectual development of the era.
                                            </p>
                                            <p>
                                                The digital restoration process has revealed details previously obscured by time,
                                                allowing for a deeper analysis of the original manuscript's intent and craftsmanship.
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4">
                                <div className="bg-muted/30 p-3 rounded-lg border border-white/5">
                                    <span className="block text-xs uppercase text-muted-foreground mb-1">Origin</span>
                                    <span className="text-sm text-foreground">Digital Archive</span>
                                </div>
                                <div className="bg-muted/30 p-3 rounded-lg border border-white/5">
                                    <span className="block text-xs uppercase text-muted-foreground mb-1">Status</span>
                                    <span className="text-sm text-green-400">Restored</span>
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    );
}
