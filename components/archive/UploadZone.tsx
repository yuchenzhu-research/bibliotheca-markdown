"use client";

import { useState } from "react";
import { Upload, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
  onFileSelect?: (files: File[]) => void;
  className?: string;
}

export function UploadZone({ onFileSelect, className }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    setUploadedFiles((prev) => [...prev, ...files]);
    onFileSelect?.(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles((prev) => [...prev, ...files]);
    onFileSelect?.(files);
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div
      className={cn(
        // Light theme: white/slate-100 background
        "relative overflow-hidden rounded-3xl border-2 border-dashed border-slate-200/60 bg-white/50 backdrop-blur-sm transition-all duration-300",
        isDragging && "border-primary/50 bg-primary/5",
        className
      )}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        type="file"
        multiple
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        onChange={handleFileSelect}
        className="absolute inset-0 cursor-pointer opacity-0 z-10"
      />

      {uploadedFiles.length > 0 ? (
        <div className="p-6 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <span className="font-sans text-sm text-muted-foreground/70">
              {uploadedFiles.length} file{uploadedFiles.length > 1 ? "s" : ""} ready to upload
            </span>
          </div>

          {uploadedFiles.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/80 border border-slate-200/50 shadow-sm"
            >
              <FileText className="h-5 w-5 text-muted-foreground/60 flex-shrink-0" />
              <span className="font-sans text-sm text-foreground/80 flex-1 truncate">
                {file.name}
              </span>
              <span className="font-sans text-xs text-muted-foreground/50">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
                className="p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="h-4 w-4 text-muted-foreground/60" />
              </button>
            </div>
          ))}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onFileSelect?.(uploadedFiles);
              setUploadedFiles([]);
            }}
            className="w-full mt-4 py-3 rounded-xl bg-primary/20 border border-primary/30 text-primary font-sans text-sm font-medium hover:bg-primary/30 transition-colors"
          >
            Upload to Archive
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center px-6">
          <div
            className={cn(
              "h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4 transition-all duration-300",
              isDragging && "bg-primary/10 scale-110"
            )}
          >
            <Upload
              className={cn(
                "h-8 w-8 transition-colors duration-300",
                isDragging ? "text-primary" : "text-muted-foreground/50"
              )}
            />
          </div>

          <p className="font-sans text-sm text-muted-foreground/80 mb-2">
            Drop documents here or click to upload
          </p>

          <p className="font-sans text-xs text-muted-foreground/50">
            PDF, DOCX, JPG up to 25MB
          </p>
        </div>
      )}
    </div>
  );
}