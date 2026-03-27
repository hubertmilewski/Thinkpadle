"use client";

import { useState, useEffect } from "react";
import { Variants, motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

import { Container } from "@/components/ui/Container";

import { Header } from "@/components/Header";
import { SearchInput } from "@/components/SearchInput";
import { ResultGrid } from "@/components/ResultGrid";
import { ThinkPadImage } from "@/components/ThinkPadImage";
import { WinCard } from "@/components/WinCard";
import { LoseCard } from "@/components/LoseCard";
import { Footer } from "@/components/Footer";

import { HowToPlay } from "@/components/modals/HowToPlay";
import { RankingModal } from "@/components/modals/RankingModal";
import { SettingsModal } from "@/components/modals/SettingsModal";

import { GuessResult } from "@/types";
import {
  getDailyImage,
  getDailyImageCredit,
  submitGuess,
  getAllModelNames,
  getDailyChallengeId,
  getYesterdaysModel,
} from "@/app/actions/game";

import {
  getOrCreatePlayerId,
  saveGameState,
  loadGameState,
} from "@/lib/storage";
import { submitGameResult } from "@/app/actions/stats";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function Thinkpadle() {
  const [guesses, setGuesses] = useState<GuessResult[]>([]);
  const [showWinCard, setShowWinCard] = useState(false);
  const [hasGivenUp, setHasGivenUp] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [dailyImage, setDailyImage] = useState<string>("");
  const [dailyImageCredit, setDailyImageCredit] = useState<string | null>(null);
  const [allModelNames, setAllModelNames] = useState<string[]>([]);

  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isRankingOpen, setIsRankingOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const isWon = guesses.some((g) => g.status.model === "correct");
  const isGameOver = isWon || hasGivenUp;
  const guessedModelNames = guesses.map((g) => g.data.model);
  const [yesterdayModel, setYesterdayModel] = useState<string | null>(null);

  const [currentChallengeId, setCurrentChallengeId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    async function initGame() {
      const [img, credit, names, challengeId, yesterday] = await Promise.all([
        getDailyImage(),
        getDailyImageCredit(),
        getAllModelNames(),
        getDailyChallengeId(),
        getYesterdaysModel(),
      ]);

      if (img) setDailyImage(img);
      if (credit) setDailyImageCredit(credit);
      if (names) setAllModelNames(names);
      if (yesterday) setYesterdayModel(yesterday);

      if (challengeId) {
        setCurrentChallengeId(challengeId);

        const { guesses: savedGuesses, hasGivenUp: savedHasGivenUp } =
          loadGameState(challengeId);

        if (savedGuesses.length > 0) {
          setGuesses(savedGuesses);
          if (savedGuesses.some((g) => g.status.model === "correct")) {
            setShowWinCard(true);
          }
        }

        if (savedHasGivenUp) {
          setHasGivenUp(true);
        }
      }

      const hasVisited = localStorage.getItem("thinkpadle_visited");
      if (!hasVisited) {
        setIsTutorialOpen(true);
      }
      setIsReady(true);
    }

    initGame();
  }, []);

  useEffect(() => {
    if (isReady && currentChallengeId) {
      saveGameState(currentChallengeId, guesses, hasGivenUp);
    }
  }, [guesses, hasGivenUp, isReady, currentChallengeId]);

  const closeTutorial = () => {
    localStorage.setItem("thinkpadle_visited", "true");
    setIsTutorialOpen(false);
  };

  const handleGuess = async (selectedModelName: string) => {
    if (
      isGameOver ||
      guessedModelNames.includes(selectedModelName) ||
      !currentChallengeId
    )
      return;

    const result = await submitGuess(selectedModelName);

    if ("error" in result) {
      console.error(result.error);
      return;
    }

    const newGuesses = [result, ...guesses];
    setGuesses(newGuesses);

    if (result.status.model === "correct") {
      const playerId = getOrCreatePlayerId();

      submitGameResult({
        playerId,
        challengeId: currentChallengeId,
        tries: newGuesses.length,
        won: true,
      });

      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#E2231A", "#538D4E", "#F4F4F4", "#262626"],
          disableForReducedMotion: true,
        });
      }, 500);

      setTimeout(() => {
        setShowWinCard(true);
      }, 2000);
    }
  };

  const handleGiveUp = async () => {
    if (isGameOver || !currentChallengeId) return;

    if (guesses.length < 5) return;

    setHasGivenUp(true);

    const playerId = getOrCreatePlayerId();
    await submitGameResult({
      playerId,
      challengeId: currentChallengeId,
      tries: 0,
      won: false,
    });
  };

  return (
    <motion.main
      className="flex flex-col items-center min-h-screen bg-background relative pt-2"
      initial="hidden"
      animate={isReady ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <HowToPlay isOpen={isTutorialOpen} onClose={closeTutorial} />
      <RankingModal
        isOpen={isRankingOpen}
        onClose={() => setIsRankingOpen(false)}
      />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <Header
        onOpenTutorial={() => setIsTutorialOpen(true)}
        onOpenRanking={() => setIsRankingOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <Container className="flex flex-col items-center w-full relative">
        <div className="w-full max-w-md flex flex-col items-center gap-6 sm:gap-8">
          <motion.div
            variants={itemVariants}
            className="w-full flex justify-center"
          >
            <ThinkPadImage
              src={dailyImage || "/placeholder.png"}
              alt="Mystery ThinkPad"
            />
          </motion.div>

          <motion.div
            variants={itemVariants}
            className={`w-full flex justify-center transition-all duration-700 ${
              isGameOver
                ? "max-h-0 opacity-0 overflow-hidden"
                : "max-h-30 opacity-100 z-50"
            }`}
          >
            <SearchInput
              onGuess={handleGuess}
              disabled={isGameOver || !isReady}
              guessedModels={guessedModelNames}
              allModels={allModelNames}
              onGiveUp={handleGiveUp}
              canGiveUp={guesses.length >= 5}
            />
          </motion.div>

          {guesses.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full flex flex-col items-center"
            >
              <ResultGrid guesses={guesses} />
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {currentChallengeId && (showWinCard || hasGivenUp) && (
              <motion.div
                key={showWinCard ? "win" : "lose"}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full flex justify-center mt-4"
              >
                {showWinCard ? (
                  <WinCard
                    targetModel={guesses[0].data.model}
                    guesses={guesses}
                    challengeId={currentChallengeId}
                    yesterdayModel={yesterdayModel}
                    imageCredit={dailyImageCredit || undefined}
                  />
                ) : (
                  <LoseCard
                    guesses={guesses}
                    challengeId={currentChallengeId}
                    yesterdayModel={yesterdayModel}
                    imageCredit={dailyImageCredit || undefined}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Container>
      <Footer />
    </motion.main>
  );
}
