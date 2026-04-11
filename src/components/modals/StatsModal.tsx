"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { ActivityGraph } from "@/components/ui/ActivityGraph";
import { getUserActivityStats } from "@/app/actions/stats";
import { toBlob } from "html-to-image";
import {
  TRANSITION_SETTINGS,
  MOBILE_DRAWER_VARIANTS,
  DESKTOP_MODAL_VARIANTS,
} from "@/lib/animations";

const isMobile = () => typeof window !== "undefined" && window.innerWidth < 640;

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StatsModal({ isOpen, onClose }: StatsModalProps) {
  const { user } = useAuth();
  const contentRef = useRef<HTMLDivElement>(null);

  const [activity, setActivity] = useState<
    import("@/components/ui/ActivityGraph").ActivityEntry[]
  >([]);
  const [totalGames, setTotalGames] = useState(0);
  const [totalWins, setTotalWins] = useState(0);
  const [totalTries, setTotalTries] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const nickname =
    user?.user_metadata?.nickname ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    "Player";

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";

      if (user) {
        requestAnimationFrame(() => setIsLoading(true));
        getUserActivityStats(user.id).then((stats) => {
          setActivity(stats.activity);
          setTotalGames(stats.totalGames);
          setTotalWins(stats.totalWins);
          setTotalTries(stats.totalTries);
          setIsLoading(false);
        });
      }
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, user]);

  const winRate =
    totalGames > 0 ? Math.round((totalWins / totalGames) * 100) : 0;

  const handleCopy = async () => {
    if (!contentRef.current) return;
    try {
      const blob = await toBlob(contentRef.current, {
        backgroundColor: "#141416",
        pixelRatio: 2,
      });
      if (blob) {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy image", err);
    }
  };

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
            variants={
              isMobile() ? MOBILE_DRAWER_VARIANTS : DESKTOP_MODAL_VARIANTS
            }
            initial="initial"
            animate="animate"
            exit="exit"
            transition={TRANSITION_SETTINGS}
            className="relative w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-3xl bg-[#141416] border-0 sm:border-2 border-gray-800 shadow-2xl rounded-none flex flex-col overflow-hidden"
          >
            <div className="flex w-full justify-between items-center  p-6 sm:p-8 pb-4 sm:pb-4 relative border-b border-gray-800">
              <div className="flex items-center gap-3">
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tighter">
                  MY STATS
                </h2>
              </div>
              <div className="flex items-center gap-4">
                {user && !isLoading && (
                  <button
                    onClick={handleCopy}
                    className="flex items-center justify-center gap-1.5 text-[10px] sm:text-xs font-bold transition-colors px-2 py-1.5 sm:px-3 uppercase tracking-widest border focus:outline-none"
                    style={{
                      backgroundColor: isCopied
                        ? "rgba(34, 197, 94, 0.2)"
                        : "rgba(255, 255, 255, 0.1)",
                      borderColor: isCopied
                        ? "rgba(34, 197, 94, 0.4)"
                        : "rgba(255, 255, 255, 0.2)",
                      color: isCopied ? "#4ade80" : "white",
                    }}
                  >
                    {isCopied ? (
                      <CheckCircle2 size={14} />
                    ) : (
                      <Camera size={14} />
                    )}
                    <span className="hidden sm:inline">
                      {isCopied ? "COPIED" : "SHARE"}
                    </span>
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="px-6 pb-6 sm:px-8 sm:pb-8 w-full flex-1 flex flex-col items-start text-left overflow-y-auto no-scrollbar">
              {!user ? (
                <div className="flex flex-col items-center justify-center p-8 bg-tp-bg/50 border border-gray-800 w-full mb-6 text-center">
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-sm mb-4">
                    LOG IN TO SEE YOUR STATS
                  </p>
                  <button
                    onClick={onClose}
                    className="bg-red-600 hover:bg-red-700 text-white py-3 px-6 font-black uppercase tracking-widest transition-all active:scale-95 text-sm"
                  >
                    CLOSE
                  </button>
                </div>
              ) : (
                <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent pb-4">
                  <div
                    ref={contentRef}
                    className="w-fit min-w-full bg-[#141416] p-4 sm:p-6"
                  >
                    <div className="mb-6 flex flex-row justify-between items-end gap-16">
                      <div className="whitespace-nowrap">
                        <h3 className="text-sm sm:text-base font-bold text-gray-200 mb-1 flex items-center gap-2">
                          {nickname}&apos;s Journey
                        </h3>
                        <p className="text-[10px] sm:text-xs text-gray-400">
                          {isLoading ? (
                            "Loading details..."
                          ) : (
                            <>
                              <span className="font-semibold text-white">
                                {totalGames}
                              </span>{" "}
                              games played{" "}
                              <span className="text-gray-600 font-bold px-1">
                                &bull;
                              </span>{" "}
                              <span className="font-semibold text-white">
                                {totalTries}
                              </span>{" "}
                              total tries{" "}
                              <span className="text-gray-600 font-bold px-1">
                                &bull;
                              </span>{" "}
                              <span className="font-semibold text-white">
                                {totalWins}
                              </span>{" "}
                              models guessed{" "}
                              <span className="text-gray-600 font-bold px-1">
                                &bull;
                              </span>{" "}
                              <span className="font-semibold text-[#8CC665]">
                                {winRate}%
                              </span>{" "}
                              win-rate
                            </>
                          )}
                        </p>
                      </div>
                      <div className="text-right pb-0.5">
                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest whitespace-nowrap">
                          thinkpadle
                        </span>
                      </div>
                    </div>

                    <div className="w-full">
                      {isLoading ? (
                        <div className="w-full h-32 bg-tp-bg/50 border border-gray-800 animate-pulse flex items-center justify-center">
                          <span className="text-xs text-gray-500 font-bold tracking-widest uppercase">
                            Loading map...
                          </span>
                        </div>
                      ) : (
                        <div className="w-full">
                          <ActivityGraph
                            activity={activity}
                            daysToGenerate={180}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
