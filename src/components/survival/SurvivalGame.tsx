"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";

import { SearchInput } from "@/components/SearchInput";
import { ThinkPadImage } from "@/components/ThinkPadImage";
import { SurvivalGameOver } from "@/components/survival/SurvivalGameOver";
import { NicknameModal } from "@/components/modals/NicknameModal";
import { useAuth } from "@/components/AuthProvider";
import { survivalContent } from "@/lib/content";

import {
  getRandomSurvivalModel,
  checkSurvivalGuess,
  getAllModelNamesForSurvival,
  getPersonalBest,
  saveSurvivalScore,
} from "@/app/actions/survival";
import { supabase } from "@/lib/supabase";

type GameState = "loading" | "playing" | "gameover" | "won";

interface CurrentModel {
  modelId: string;
  imageUrl: string;
}

interface SurvivalGameProps {
  onReady?: (ready: boolean) => void;
}

const containerVariants: Variants = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export function SurvivalGame({ onReady }: SurvivalGameProps) {
  const { user } = useAuth();

  const [gameState, setGameState] = useState<GameState>("loading");
  const [score, setScore] = useState(0);
  const [currentModel, setCurrentModel] = useState<CurrentModel | null>(null);
  const [usedModelIds, setUsedModelIds] = useState<string[]>([]);
  const [allModelNames, setAllModelNames] = useState<string[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [currentAuthors, setCurrentAuthors] = useState<string[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [roundKey, setRoundKey] = useState(0);
  const [showCorrect, setShowCorrect] = useState(false);
  const [personalBest, setPersonalBest] = useState<number>(0);
  const [isLoadedFromStorage, setIsLoadedFromStorage] = useState(false);
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);
  const [hasSubmittedScore, setHasSubmittedScore] = useState(false);


  useEffect(() => {
    if (gameState === "playing" && isLoadedFromStorage) {
      const state = {
        score,
        usedModelIds,
        currentModel,
        roundKey
      };
      localStorage.setItem("thinkpadle_survival_state", JSON.stringify(state));
    }
  }, [score, usedModelIds, currentModel, roundKey, gameState, isLoadedFromStorage]);


  useEffect(() => {
    const fetchNames = async () => {
      const names = await getAllModelNamesForSurvival();
      if (names) setAllModelNames(names);
    };
    fetchNames();
  }, []);


  useEffect(() => {
    if (user) {
      getPersonalBest(user.id).then(setPersonalBest);
    }
  }, [user]);


  useEffect(() => {
    const savedState = localStorage.getItem("thinkpadle_survival_state");
    if (savedState) {
      try {
        const { score: s, usedModelIds: ids, currentModel: m, roundKey: r } = JSON.parse(savedState);
        setScore(s);
        setUsedModelIds(ids);
        setCurrentModel(m);
        setRoundKey(r);
        setGameState("playing");
        onReady?.(true);
      } catch (e) {
        console.error("Failed to parse saved survival state", e);
      }
    }
    setIsLoadedFromStorage(true);
  }, []);

  const saveScoreToDB = async (finalScore: number, submittedUsedIds: string[], guestName?: string) => {
    if (finalScore === 0 || hasSubmittedScore) return;

    if (user) {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token;
      if (!accessToken) {
        console.error("No access token — cannot save score");
        return;
      }
      const result = await saveSurvivalScore(finalScore, submittedUsedIds, accessToken);
      if (result.success) {
        setHasSubmittedScore(true);
      } else {
        console.error("Error saving survival score:", result.error);
      }
    } else if (guestName) {
      const result = await saveSurvivalScore(finalScore, submittedUsedIds, undefined, guestName);
      if (result.success) {
        setHasSubmittedScore(true);
      } else {
        console.error("Error saving guest survival score:", result.error);
      }
    }
  };

  const handleGuestSubmit = async (name: string) => {
    await saveScoreToDB(score, usedModelIds, name);
    setIsNicknameModalOpen(false);
  };

  const loadNextModel = useCallback(async (excludeIds: string[]) => {
    const model = await getRandomSurvivalModel(excludeIds);
    if (!model) return null;
    return model;
  }, []);

  const startGame = useCallback(async () => {
    setGameState("loading");
    setScore(0);
    setUsedModelIds([]);
    setCorrectAnswer("");
    setCurrentAuthors([]);
    setShowCorrect(false);
    setHasSubmittedScore(false);
    localStorage.removeItem("thinkpadle_survival_state");

    const model = await loadNextModel([]);

    if (model) {
      setCurrentModel(model);
      setUsedModelIds([model.modelId]);
    }

    setRoundKey((k) => k + 1);
    setGameState("playing");
    onReady?.(true);
  }, [loadNextModel, onReady]);

  useEffect(() => {

    const savedState = localStorage.getItem("thinkpadle_survival_state");
    if (!savedState) {
      requestAnimationFrame(() => startGame());
    }
  }, [startGame]);

  const handleGuess = async (guessedName: string) => {
    if (!currentModel || isChecking || gameState !== "playing") return;

    setIsChecking(true);

    const result = await checkSurvivalGuess(currentModel.modelId, guessedName);

    if (result.correct) {
      const newScore = score + 1;
      setScore(newScore);

      if (newScore > personalBest) {
        setPersonalBest(newScore);
      }

      setShowCorrect(true);
      setTimeout(async () => {
        setShowCorrect(false);

        const newExcluded = [...usedModelIds, currentModel.modelId];
        const nextModel = await loadNextModel(newExcluded);

        if (nextModel) {
          setCurrentModel(nextModel);
          setUsedModelIds((prev) => [...prev, nextModel.modelId]);
          setRoundKey((k) => k + 1);
          setIsChecking(false);
        } else {

          setCurrentAuthors(result.authors);
          setGameState("won");
          setIsChecking(false);
          localStorage.removeItem("thinkpadle_survival_state");
          if (user) {
            const finalUsedIds = [...usedModelIds, currentModel.modelId];
            saveScoreToDB(newScore, finalUsedIds);
          }
        }
      }, 800);
    } else {
      setCorrectAnswer(result.correctName);
      setCurrentAuthors(result.authors);
      setGameState("gameover");
      setIsChecking(false);
      localStorage.removeItem("thinkpadle_survival_state");

      if (user) {
        saveScoreToDB(score, usedModelIds);
      } else if (score > 0) {
        setIsNicknameModalOpen(true);
      }
    }
  };

  if (gameState === "loading") {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-gray-700 border-t-tp-red"
        />
        <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">
          {survivalContent.loadingCaption}
        </span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md flex flex-col items-center gap-4 sm:gap-6">
      <div className="w-full flex justify-between items-end px-2 mb-2">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{survivalContent.scoreLabel}</span>
          <span className="text-4xl font-black text-white leading-none">{score}</span>
        </div>
        {user && (
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{survivalContent.personalBestLabel}</span>
            <span className="text-2xl font-black text-tp-red leading-none">{personalBest}</span>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {gameState === "playing" && currentModel && (
          <motion.div
            key={`round-${roundKey}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -20 }}
            className="w-full flex flex-col items-center gap-6 sm:gap-8"
          >
            <motion.div variants={itemVariants} className="w-full flex justify-center">
              <ThinkPadImage
                src={currentModel.imageUrl}
                alt={survivalContent.imageAlt}
                onImageError={() => {
                  console.warn("Image failed to load, skipping model...");
                  const handleSkipFail = async () => {
                    const newExcluded = [...usedModelIds, currentModel.modelId];
                    const nextModel = await loadNextModel(newExcluded);
                    if (nextModel) {
                      setCurrentModel(nextModel);
                      setUsedModelIds((prev) => [...prev, nextModel.modelId]);
                      setRoundKey((k) => k + 1);
                    } else {
                      setGameState("won");
                    }
                  };
                  handleSkipFail();
                }}
              />
            </motion.div>

            <motion.div variants={itemVariants} className="w-full flex justify-center z-50">
              <SearchInput
                onGuess={handleGuess}
                disabled={isChecking}
                guessedModels={[]}
                allModels={allModelNames}
              />
            </motion.div>
          </motion.div>
        )}

        {(gameState === "gameover" || gameState === "won") && (
          <motion.div
            key="gameover"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="w-full flex justify-center"
          >
            <SurvivalGameOver
              score={score}
              correctAnswer={correctAnswer}
              onPlayAgain={startGame}
              isWin={gameState === "won"}
              authors={currentAuthors}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCorrect && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-200 flex items-center justify-center pointer-events-none"
          >
            <div className="bg-tp-green/90 text-white px-8 py-4 font-black text-xl sm:text-2xl uppercase tracking-widest shadow-2xl">
              {survivalContent.feedbackCorrect}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <NicknameModal
        isOpen={isNicknameModalOpen}
        onClose={() => setIsNicknameModalOpen(false)}
        onSubmit={handleGuestSubmit}
        score={score}
      />
    </div>
  );
}
