"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy, User } from "lucide-react";
import { survivalContent } from "@/lib/content";
import { TRANSITION_SETTINGS, MOBILE_DRAWER_VARIANTS, DESKTOP_MODAL_VARIANTS } from "@/lib/animations";

const isMobile = () => typeof window !== "undefined" && window.innerWidth < 640;

interface NicknameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (nickname: string) => void;
  score: number;
}

export function NicknameModal({ isOpen, onClose, onSubmit, score }: NicknameModalProps) {
  const [nickname, setNickname] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem("thinkpadle_guest_nickname");
      if (saved) setNickname(saved);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim() || isSubmitting) return;

    setIsSubmitting(true);
    localStorage.setItem("thinkpadle_guest_nickname", nickname.trim());
    onSubmit(nickname.trim());
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-250 flex items-start justify-start sm:items-center sm:justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-transparent sm:bg-black/60"
          />

          <motion.div
            variants={isMobile() ? MOBILE_DRAWER_VARIANTS : DESKTOP_MODAL_VARIANTS}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={TRANSITION_SETTINGS}
            className="relative w-full h-auto sm:max-w-md bg-tp-card border-0 sm:border-2 border-gray-800 p-6 sm:p-10 shadow-3xl rounded-none flex flex-col"
          >
            <div className="relative flex flex-col items-center justify-center w-full mb-8">
              <button
                onClick={onClose}
                className="absolute -top-2 right-0 text-gray-500 hover:text-tp-red transition-colors"
                disabled={isSubmitting}
              >
                <X size={24} />
              </button>

              <div className="w-16 h-16 bg-tp-red/10 border border-tp-red/30 flex items-center justify-center mb-6">
                <Trophy className="w-8 h-8 text-tp-red" />
              </div>

              <h2 className="text-3xl font-black uppercase tracking-tighter text-white mb-2">
                {survivalContent.guestModalTitle}
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-4xl font-black text-tp-red">{score}</span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Points Gained</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                  <User size={12} className="text-tp-red" />
                  {survivalContent.guestNicknameLabel}
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder={survivalContent.guestNicknamePlaceholder}
                  maxLength={20}
                  autoFocus
                  required
                  disabled={isSubmitting}
                  className="w-full bg-[#161618] border border-gray-800 p-4 text-white font-bold outline-none focus:border-tp-red transition-colors uppercase tracking-widest"
                />
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={!nickname.trim() || isSubmitting}
                  className="w-full bg-tp-red hover:bg-red-700 text-white py-4 font-black uppercase tracking-[0.2em] transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isSubmitting ? survivalContent.guestSubmittedMessage : survivalContent.guestSubmitButton}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="w-full bg-transparent text-gray-500 hover:text-white font-bold py-2 uppercase text-[10px] tracking-widest transition-colors"
                >
                  {survivalContent.guestCancelButton}
                </button>
              </div>
            </form>

            <div className="mt-8 text-center">
                <p className="text-[9px] text-gray-600 uppercase tracking-widest font-black leading-relaxed">
                    By submitting your score, you agree to show your nickname in the global hall of fame.
                </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
