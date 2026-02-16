"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Minus, X, Maximize2 } from 'lucide-react';

interface TitleBarProps {
  title?: string;
}

import { getCurrentWindow } from '@tauri-apps/api/window';

export function TitleBar({ title = "Bibliotheca Vitae" }: TitleBarProps) {
  const isMac = typeof window !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;

  const handleMinimize = () => {
    getCurrentWindow().minimize();
  };

  const handleMaximize = () => {
    getCurrentWindow().toggleMaximize();
  };

  const handleClose = () => {
    getCurrentWindow().close();
  };

  return (
    <div
      data-tauri-drag-region
      className="fixed top-0 left-0 right-0 h-12 flex items-center justify-between px-4 z-[9999] select-none"
      style={{
        // macOS 风格的渐变标题栏背景
        background: 'linear-gradient(180deg, rgba(61, 52, 40, 0.08) 0%, rgba(61, 52, 40, 0.02) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      {/* Window Controls - macOS 风格 */}
      {isMac && (
        <div className="flex items-center gap-2 group">
          <button
            onClick={handleClose}
            className="w-3 h-3 rounded-full bg-[#ff5f57] hover:bg-[#ff3b30] border border-[#e0443e] transition-all hover:scale-110 flex items-center justify-center"
          >
            <X className="w-2 h-2 text-black/30 opacity-0 group-hover:opacity-100" />
          </button>
          <button
            onClick={handleMinimize}
            className="w-3 h-3 rounded-full bg-[#febc2e] hover:[#f5a623] border border-[#d4a106] transition-all hover:scale-110 flex items-center justify-center"
          >
            <Minus className="w-2 h-2 text-black/30 opacity-0 group-hover:opacity-100" />
          </button>
          <button
            onClick={handleMaximize}
            className="w-3 h-3 rounded-full bg-[#28c840] hover:[#1db954] border border-[#14ae46] transition-all hover:scale-110 flex items-center justify-center"
          >
            <Maximize2 className="w-2 h-2 text-black/30 opacity-0 group-hover:opacity-100" />
          </button>
        </div>
      )}

      {/* Title - 居中显示 */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 text-center"
      >
        <span className="font-serif text-sm text-foreground/40 tracking-widest uppercase">
          {title}
        </span>
      </motion.div>

      {/* Spacer for balance on macOS */}
      {isMac && <div className="w-14" />}
    </div>
  );
}