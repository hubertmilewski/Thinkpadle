"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy, Timer } from "lucide-react";
import { siteContent } from "@/data/content";

const isMobile = () => typeof window !== "undefined" && window.innerWidth < 640;

interface RankingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RankingModal({ isOpen, onClose }: RankingModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-200 flex items-start justify-start sm:items-center sm:justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-transparent sm:bg-black/80 sm:backdrop-blur-sm"
          />

          <motion.div
            initial={
              isMobile() ? { y: "100%" } : { opacity: 0, scale: 0.9, y: 20 }
            }
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={
              isMobile() ? { y: "100%" } : { opacity: 0, scale: 0.9, y: 20 }
            }
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative w-full h-full sm:h-auto sm:max-w-md bg-tp-card border-0 sm:border-2 border-gray-800 p-6 sm:p-8 shadow-2xl rounded-none flex flex-col items-center justify-center text-center"
          >
            <button
              onClick={onClose}
              className="absolute right-3 sm:right-4 top-3 sm:top-4 text-gray-500 hover:text-white transition-colors z-210"
            >
              <X size={isMobile() ? 28 : 24} />
            </button>

            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-800/50 rounded-full flex items-center justify-center mb-6 text-gray-400">
              <Trophy size={32} className="sm:w-10 sm:h-10" />
            </div>

            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter mb-2">
              {siteContent.modals.ranking.title}
            </h2>
            <p className="text-base sm:text-lg font-bold text-gray-400 mb-8 uppercase tracking-tight">
              {siteContent.modals.ranking.subtitle}
            </p>

            <div className="flex items-center gap-2 text-gray-500 text-xs sm:text-sm font-medium bg-tp-bg/50 px-4 py-3 border border-gray-800 w-full justify-center">
              <Timer size={16} />
              <span className="uppercase tracking-widest">{siteContent.modals.ranking.info}</span>
            </div>

            <div className="mt-12 sm:mt-12 w-full">
              <button
                onClick={onClose}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-4 font-black uppercase tracking-widest transition-all active:scale-95 text-base sm:text-lg"
              >
                {siteContent.modals.ranking.button}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}