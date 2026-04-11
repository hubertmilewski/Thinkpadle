"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy, Medal } from "lucide-react";
import { siteContent } from "@/data/content";
import { TRANSITION_SETTINGS, MOBILE_DRAWER_VARIANTS, DESKTOP_MODAL_VARIANTS } from "@/lib/animations";
import { getSurvivalLeaderboard } from "@/app/actions/survival";
import Image from "next/image";

const isMobile = () => typeof window !== "undefined" && window.innerWidth < 640;

interface LeaderboardEntry {
  score: number;
  nickname: string;
  avatarUrl: string;
  createdAt: string;
}

interface RankingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function formatRelativeDate(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return date.toLocaleDateString();
}

export function RankingModal({ isOpen, onClose }: RankingModalProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setIsLoading(true);
      getSurvivalLeaderboard().then(data => {
        setLeaderboard(data);
        setIsLoading(false);
      });
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
            className="absolute inset-0 bg-transparent sm:bg-black/80"
          />

          <motion.div
            variants={isMobile() ? MOBILE_DRAWER_VARIANTS : DESKTOP_MODAL_VARIANTS}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={TRANSITION_SETTINGS}
            className="relative w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-md bg-tp-card border-0 sm:border-2 border-gray-800 p-6 sm:p-8 shadow-2xl rounded-none flex flex-col overflow-y-auto no-scrollbar"
          >
            <div className="relative flex items-center justify-center w-full mb-2">
              <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter">
                {siteContent.modals.ranking.title}
              </h2>
              <button
                onClick={onClose}
                className="absolute right-0 text-gray-500 hover:text-white transition-colors shrink-0"
              >
                <X size={isMobile() ? 28 : 24} />
              </button>
            </div>

            <div className="flex items-center gap-2 text-tp-red text-[10px] sm:text-xs font-black bg-tp-red/10 px-4 py-2 border border-tp-red/20 w-fit mx-auto mb-6">
              <Trophy size={14} />
              <span className="uppercase tracking-[0.2em]">All-Time Survival Hall of Fame</span>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-2">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3 opacity-50">
                   <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-6 h-6 border-2 border-gray-800 border-t-tp-red"
                   />
                   <span className="text-[10px] font-black uppercase tracking-widest">Fetching Legends...</span>
                </div>
              ) : leaderboard.length === 0 ? (
                <div className="text-center py-12 text-gray-600 font-bold uppercase text-xs tracking-widest">
                  No scores yet. Be the first!
                </div>
              ) : (
                leaderboard.map((entry: LeaderboardEntry, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-4 bg-[#1a1a1c] border border-gray-800/50 p-3 sm:p-4 group hover:border-tp-red/30 transition-colors"
                  >
                    <div className="w-8 flex justify-center shrink-0">
                      {index < 3 ? (
                        <Medal className={`w-6 h-6 ${
                          index === 0 ? "text-yellow-500" :
                          index === 1 ? "text-gray-400" :
                          "text-amber-700"
                        }`} />
                      ) : (
                        <span className="text-gray-600 font-black text-lg">#{index + 1}</span>
                      )}
                    </div>

                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 shrink-0 bg-gray-900 border border-gray-800 overflow-hidden">
                      {entry.avatarUrl ? (
                         <Image
                          src={entry.avatarUrl}
                          alt={entry.nickname}
                          fill
                          className="object-cover"
                         />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-700">
                          <Trophy size={20} />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:text-base font-black text-white truncate uppercase tracking-tight">
                        {entry.nickname}
                      </h3>
                      <p className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest">
                        {formatRelativeDate(entry.createdAt)}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-xl sm:text-2xl font-black text-white leading-none">
                        {entry.score}
                      </div>
                      <span className="text-[10px] sm:text-xs font-black text-tp-red uppercase tracking-widest">
                        Pts
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
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