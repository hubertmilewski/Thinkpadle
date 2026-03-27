"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronUp, ChevronDown } from "lucide-react";

import { siteContent } from "@/data/content";

const isMobile = () => typeof window !== "undefined" && window.innerWidth < 640;

interface HowToPlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HowToPlay({ isOpen, onClose }: HowToPlayProps) {
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
            className="relative w-full h-full sm:h-auto sm:max-w-lg bg-tp-card border-0 sm:border-2 border-gray-800 p-6 sm:p-8 shadow-2xl rounded-none flex flex-col"
          >
            <button
              onClick={onClose}
              className="absolute right-3 sm:right-4 top-3 sm:top-4 text-gray-500 hover:text-white transition-colors z-210"
            >
              <X size={isMobile() ? 28 : 24} />
            </button>

            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter mb-1 sm:mb-2">
              {siteContent.howToPlay.title}
            </h2>
            <p className="text-lg font-bold text-gray-300 mb-6 sm:mb-8 uppercase tracking-tight">
              {siteContent.howToPlay.subtitle}
            </p>

            <ul className="space-y-3 mb-8 sm:mb-10 text-gray-400 font-medium list-disc pl-5">
              {siteContent.howToPlay.rules.map((rule, i) => (
                <li key={i}>{rule}</li>
              ))}
            </ul>

            <div className="border-t border-gray-800 pt-6 sm:pt-8 grow">
              <h3 className="text-sm font-black uppercase text-gray-500 mb-4 sm:mb-6 tracking-widest">
                {siteContent.howToPlay.examples.title}
              </h3>

              <div className="space-y-6 sm:space-y-8">
                <ExampleRow
                  label="T440"
                  status="correct"
                  desc={siteContent.howToPlay.examples.correct}
                />
                <ExampleRow
                  label="2011"
                  status="higher"
                  desc={siteContent.howToPlay.examples.higher}
                />
                <ExampleRow
                  label='12.5"'
                  status="lower"
                  desc={siteContent.howToPlay.examples.lower}
                />
              </div>
            </div>

            <div className="mt-auto sm:mt-12 w-full pt-6">
              <button
                onClick={onClose}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-4 font-black uppercase tracking-widest transition-all active:scale-95 text-base sm:text-lg"
              >
                {siteContent.howToPlay.button}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function ExampleRow({
  label,
  status,
  desc,
}: {
  label: string;
  status: "correct" | "higher" | "lower";
  desc: string;
}) {
  return (
    <div className="flex items-center gap-4 sm:gap-6">
      <div
        className={`w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center relative font-black text-xs sm:text-sm overflow-hidden leading-[1.15] shadow-sm ${
          status === "correct"
            ? "bg-tp-green text-white"
            : "bg-tp-wrong text-white"
        }`}
      >
        <span className="relative z-10">{label}</span>
        {status === "higher" && (
          <ChevronUp
            className="absolute top-0.5 sm:top-1 left-1/2 -translate-x-1/2 w-4 h-4 sm:w-5 sm:h-5 text-white/80"
            strokeWidth={3}
          />
        )}
        {status === "lower" && (
          <ChevronDown
            className="absolute bottom-0.5 sm:bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 sm:w-5 sm:h-5 text-white/80"
            strokeWidth={3}
          />
        )}
      </div>
      <p className="text-sm sm:text-base text-gray-400 font-bold uppercase tracking-tight leading-tight flex-1">
        <span className="text-white">{label}</span> {desc}
      </p>
    </div>
  );
}