"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { GameShell } from "@/components/ui/GameShell";
import { Container } from "@/components/ui/Container";
import { SurvivalGame } from "@/components/survival/SurvivalGame";

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

export default function SurvivalPage() {
  const [isReady, setIsReady] = useState(false);

  return (
    <GameShell mode="survival" isReady={isReady}>
      <Container className="flex flex-col items-center w-full relative pt-2 sm:pt-4">
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate={isReady ? "visible" : "hidden"}
          className="w-full flex flex-col items-center"
        >
          <SurvivalGame onReady={setIsReady} />
        </motion.div>
      </Container>
    </GameShell>
  );
}
