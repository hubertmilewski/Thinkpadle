"use client";

import { motion } from "framer-motion";
import { Skull, RotateCcw, ArrowLeft, Trophy } from "lucide-react";
import Link from "next/link";
import { survivalContent } from "@/lib/content";

interface SurvivalGameOverProps {
  score: number;
  correctAnswer: string;
  onPlayAgain: () => void;
  isWin?: boolean;
  authors?: string[];
}

export function SurvivalGameOver({
  score,
  correctAnswer,
  onPlayAgain,
  isWin = false,
  authors = [],
}: SurvivalGameOverProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className={`w-full max-w-md mx-auto bg-[#111111] border border-[#2a2a2a] border-t-4 ${
        isWin ? "border-t-tp-green" : "border-t-tp-red"
      } p-6 sm:p-10 text-center flex flex-col items-center shadow-2xl`}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", damping: 15 }}
        className={`w-16 h-16 sm:w-20 sm:h-20 ${
          isWin ? "bg-tp-green/10 border-tp-green/30" : "bg-tp-red/10 border-tp-red/30"
        } border-2 flex items-center justify-center mb-6`}
      >
        {isWin ? (
          <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-tp-green" />
        ) : (
          <Skull className="w-8 h-8 sm:w-10 sm:h-10 text-tp-red" />
        )}
      </motion.div>

      <h2 className={`text-xs sm:text-sm font-bold ${isWin ? "text-tp-green" : "text-gray-400"} uppercase tracking-[0.3em] mb-3`}>
        {isWin ? survivalContent.gameWonTitle : survivalContent.gameOverTitle}
      </h2>

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring", damping: 12 }}
        className="text-6xl sm:text-7xl font-black tracking-tighter text-white mb-2"
      >
        {score}
      </motion.div>

      <p className="text-sm sm:text-base font-bold text-gray-500 uppercase tracking-widest mb-8">
        {isWin
          ? survivalContent.allModelsGuessed
          : (score === 1 ? survivalContent.singleModelGuessed : survivalContent.multipleModelsGuessed)}
      </p>

      {isWin ? (
        <p className="text-xs sm:text-sm text-gray-400 mb-8 leading-relaxed">
          {survivalContent.winDescription}
        </p>
      ) : (
        <div className="w-full bg-[#1a1a1a] py-4 px-6 border border-[#222] flex flex-col items-center gap-1 mb-6">
          <span className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest font-bold">
            {survivalContent.correctAnswerLabel}
          </span>
          <span className="text-lg sm:text-xl text-white font-black tracking-tight">
            {correctAnswer}
          </span>
        </div>
      )}

      {authors.length > 0 && (
        <div className="mb-8 flex flex-col items-center w-full">
            <span className="text-[8px] sm:text-[10px] text-gray-600 uppercase tracking-widest font-bold mb-1">
                {survivalContent.photoAuthorsLabel}
            </span>
            <div
              className="text-[9px] sm:text-[11px] text-gray-500 italic max-w-xs leading-tight [&>a]:text-tp-red [&>a]:font-semibold [&>a:hover]:underline [&>bdi>a]:text-tp-red [&>bdi>a]:font-semibold [&>bdi>a:hover]:underline wrap-break-words text-center"
              dangerouslySetInnerHTML={{ __html: authors.join(", ") }}
            />
        </div>
      )}

      <div className="flex flex-col gap-3 w-full">
        <button
          onClick={onPlayAgain}
          className={`w-full ${
            isWin ? "bg-tp-green hover:bg-green-700" : "bg-tp-red hover:bg-red-700"
          } text-white font-black py-4 px-6 uppercase tracking-[0.2em] transition-all active:scale-95 shadow-lg flex items-center justify-center gap-3`}
        >
          <RotateCcw className="w-5 h-5" />
          {survivalContent.playAgainButton}
        </button>

        <Link
          href="/"
          className="w-full bg-[#1a1a1a] hover:bg-[#222] border border-[#333] text-gray-300 hover:text-white font-black py-4 px-6 uppercase tracking-[0.2em] transition-all active:scale-95 flex items-center justify-center gap-3"
        >
          <ArrowLeft className="w-5 h-5" />
          {survivalContent.backToDailyButton}
        </Link>
      </div>
    </motion.div>
  );
}

