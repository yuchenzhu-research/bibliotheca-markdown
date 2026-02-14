"use client";

import { useState } from "react";
import { Document } from "@/lib/types";
import { BentoGrid } from "@/components/ui/bento-grid";
import { DocumentCard } from "@/components/archive/DocumentCard";
import { DocumentPreviewModal } from "@/components/archive/DocumentPreviewModal";
import { documents } from "@/app/data/mock-documents";

export function ArchiveGallery() {
    const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

    return (
        <>
            <BentoGrid>
                {documents.map((doc) => (
                    <DocumentCard
                        key={doc.id}
                        document={doc}
                        onClick={() => setSelectedDoc(doc)}
                        className="cursor-pointer"
                    />
                ))}
            </BentoGrid>

            <DocumentPreviewModal
                document={selectedDoc}
                isOpen={!!selectedDoc}
                onClose={() => setSelectedDoc(null)}
            />
        </>
    );
}
