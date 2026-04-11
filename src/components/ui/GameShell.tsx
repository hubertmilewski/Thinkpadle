"use client";

import { useState, ReactNode } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SideMenu } from "@/components/ui/SideMenu";
import { HowToPlay } from "@/components/modals/HowToPlay";
import { RankingModal } from "@/components/modals/RankingModal";
import { SettingsModal } from "@/components/modals/SettingsModal";
import { AuthModal } from "@/components/modals/AuthModal";
import { StatsModal } from "@/components/modals/StatsModal";
import { useEffect } from "react";

interface GameShellProps {
  children: ReactNode;
  mode: "daily" | "survival";
  isReady: boolean;
}

const containerVariants: Variants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1 },
};

export function GameShell({ children, mode, isReady }: GameShellProps) {
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isRankingOpen, setIsRankingOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {

    requestAnimationFrame(() => setShowSplash(true));


    const timeout = setTimeout(() => {
      requestAnimationFrame(() => setShowSplash(false));
    }, 8000);

    return () => clearTimeout(timeout);
  }, [mode]);

  useEffect(() => {
    if (isReady) {
      requestAnimationFrame(() => setShowSplash(false));
    }
  }, [isReady]);

  useEffect(() => {
    if (typeof window === "undefined" || showSplash) return;

    const key = `thinkpadle_tutorial_seen_${mode}`;
    const seen = localStorage.getItem(key);

    if (!seen) {
      requestAnimationFrame(() => setIsTutorialOpen(true));
      localStorage.setItem(key, "true");
    }
  }, [mode, showSplash]);

  return (
    <div className="flex flex-col min-h-screen">
      <AnimatePresence>
        {showSplash && <LoadingScreen key="splash" />}
      </AnimatePresence>

      <HowToPlay
        mode={mode}
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
      />
      <RankingModal
        isOpen={isRankingOpen}
        onClose={() => setIsRankingOpen(false)}
      />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
      <StatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
      />
      <SideMenu
        mode={mode}
        isOpen={isSideMenuOpen}
        onClose={() => setIsSideMenuOpen(false)}
        onOpenTutorial={() => setIsTutorialOpen(true)}
        onOpenRanking={() => setIsRankingOpen(true)}
        onOpenStats={() => setIsStatsOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      <Header
        mode={mode}
        onOpenTutorial={() => setIsTutorialOpen(true)}
        onOpenRanking={() => setIsRankingOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenStats={() => setIsStatsOpen(true)}
        onOpenSideMenu={() => setIsSideMenuOpen(true)}
      />

      <motion.main
        initial={false}
        animate={showSplash ? "hidden" : "visible"}
        variants={containerVariants}
        className="grow flex flex-col"
      >
        {children}
      </motion.main>

      <Footer />
    </div>
  );
}
