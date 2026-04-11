"use client";

import { useState, useEffect, useRef } from "react";
import { Variants, motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

import { Container } from "@/components/ui/Container";
import { GameShell } from "@/components/ui/GameShell";
import { SearchInput } from "@/components/SearchInput";
import { ResultGrid } from "@/components/ResultGrid";
import { ThinkPadImage } from "@/components/ThinkPadImage";
import { WinCard } from "@/components/WinCard";
import { LoseCard } from "@/components/LoseCard";

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
import {
  saveGameResultToDB,
  loadGameResultFromDB,
} from "@/app/actions/stats";
import { useAuth } from "@/components/AuthProvider";

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  },
};

export default function Thinkpadle() {
  const { user, isLoading: isAuthLoading } = useAuth();

  const [guesses, setGuesses] = useState<GuessResult[]>([]);
  const [showWinCard, setShowWinCard] = useState(false);
  const [hasGivenUp, setHasGivenUp] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [dailyImage, setDailyImage] = useState<string>("");
  const [dailyImageCredit, setDailyImageCredit] = useState<string | null>(null);
  const [allModelNames, setAllModelNames] = useState<string[]>([]);

  const isWon = guesses.some((g) => g.status.model === "correct");
  const isGameOver = isWon || hasGivenUp;
  const guessedModelNames = guesses.map((g) => g.data.model);
  const [yesterdayModel, setYesterdayModel] = useState<string | null>(null);

  const [currentChallengeId, setCurrentChallengeId] = useState<string | null>(
    null,
  );
  const [isRestored, setIsRestored] = useState(false);

  const wasLoggedIn = useRef(!!user);
  const lastIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (user) {
      wasLoggedIn.current = true;
    }
  }, [user]);

  useEffect(() => {
    if (isAuthLoading) return;

    const currentId = user?.id || null;
    if (currentId === lastIdRef.current && isReady) {
      return;
    }
    lastIdRef.current = currentId;

    setGuesses([]);
    setHasGivenUp(false);
    setShowWinCard(false);
    setIsReady(false);
    setIsRestored(false);

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

        if (user) {
          const dbSession = await loadGameResultFromDB(user.id, challengeId);
          if (dbSession) {
            setGuesses(dbSession.guesses);
            setHasGivenUp(dbSession.hasGivenUp);
            if (dbSession.won) {
              setIsRestored(true);
              setShowWinCard(true);
            } else if (dbSession.hasGivenUp) {
              setIsRestored(true);
            }
          }
        } else {
          const { guesses: savedGuesses, hasGivenUp: savedHasGivenUp } = loadGameState(challengeId);
          if (savedGuesses.length > 0) {
            setGuesses(savedGuesses);
            if (savedGuesses.some((g) => g.status.model === "correct")) {
              setIsRestored(true);
              setShowWinCard(true);
            }
          }
          if (savedHasGivenUp) {
            setIsRestored(true);
            setHasGivenUp(true);
          }
        }
      }

      setIsReady(true);
    }

    initGame();
  }, [isAuthLoading, user?.id, isReady]);

  useEffect(() => {
    if (!isReady || !currentChallengeId || user || wasLoggedIn.current) return;
    saveGameState(currentChallengeId, guesses, hasGivenUp);
  }, [guesses, hasGivenUp, isReady, currentChallengeId, user]);

  const handleGuess = async (selectedModelName: string) => {
    if (isGameOver || guessedModelNames.includes(selectedModelName) || !currentChallengeId || !isImageLoaded) return;
    const result = await submitGuess(selectedModelName);
    if ("error" in result) return;

    const newGuesses = [result, ...guesses];
    setGuesses(newGuesses);

    if (user) {
      const isWin = result.status.model === "correct";
      await saveGameResultToDB({
        playerId: user.id,
        challengeId: currentChallengeId,
        guesses: newGuesses,
        tries: newGuesses.length,
        won: isWin ? true : undefined,
        completed: isWin,
      });
    } else {
      if (result.status.model === "correct") {
        await saveGameResultToDB({
          playerId: getOrCreatePlayerId(),
          challengeId: currentChallengeId,
          guesses: newGuesses,
          tries: newGuesses.length,
          won: true,
          completed: true,
        });
      }
    }

    if (result.status.model === "correct") {
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#E2231A", "#538D4E", "#F4F4F4", "#262626"],
          disableForReducedMotion: true,
        });
      }, 500);
      setTimeout(() => setShowWinCard(true), 2000);
    }
  };

  const handleGiveUp = async () => {
    if (isGameOver || !currentChallengeId || !isImageLoaded || guesses.length < 5) return;
    setHasGivenUp(true);
    if (user) {
      await saveGameResultToDB({
        playerId: user.id,
        challengeId: currentChallengeId,
        guesses,
        tries: guesses.length,
        won: false,
        completed: true,
      });
    } else {
      await saveGameResultToDB({
        playerId: getOrCreatePlayerId(),
        challengeId: currentChallengeId,
        guesses,
        tries: guesses.length,
        won: false,
        completed: true,
      });
    }
  };

  return (
    <GameShell mode="daily" isReady={isReady}>
      <Container className="flex flex-col items-center w-full relative pt-2 sm:pt-4">
        <div className="w-full max-w-md flex flex-col items-center gap-6 sm:gap-8">
          <motion.div variants={itemVariants} className="w-full flex justify-center">
            <ThinkPadImage
              src={dailyImage || "/placeholder.png"}
              alt="Mystery ThinkPad"
              onImageLoad={() => setIsImageLoaded(true)}
            />
          </motion.div>

          <motion.div
            variants={itemVariants}
            className={`w-full flex justify-center transition-all duration-700 ${isGameOver ? "max-h-0 opacity-0 overflow-hidden" : "max-h-30 opacity-100 z-50"}`}
          >
            <SearchInput
              onGuess={handleGuess}
              disabled={isGameOver || !isReady || !isImageLoaded}
              guessedModels={guessedModelNames}
              allModels={allModelNames}
              onGiveUp={handleGiveUp}
              canGiveUp={guesses.length >= 5}
            />
          </motion.div>

          {guesses.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full flex flex-col items-center">
              <ResultGrid guesses={guesses} />
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {currentChallengeId && (showWinCard || hasGivenUp) && (
              <motion.div
                key={showWinCard ? "win" : "lose"}
                initial={isRestored ? false : { opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={isRestored ? { duration: 0 } : undefined}
                className="w-full flex justify-center my-4"
              >
                {showWinCard ? (
                  <WinCard targetModel={guesses[0].data.model} guesses={guesses} challengeId={currentChallengeId} yesterdayModel={yesterdayModel} imageCredit={dailyImageCredit || undefined} isFresh={!isRestored} />
                ) : (
                  <LoseCard guesses={guesses} challengeId={currentChallengeId} yesterdayModel={yesterdayModel} imageCredit={dailyImageCredit || undefined} isFresh={!isRestored} />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Container>
    </GameShell>
  );
}
