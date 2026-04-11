"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { TRANSITION_SETTINGS } from "@/lib/animations";

export function LoadingScreen() {
  return (
    <motion.div
      initial={{ y: 0 }}
      exit={{ y: "-100%" }}
      transition={{ ...TRANSITION_SETTINGS, duration: 0.6 }}
      className="fixed inset-0 z-1000 bg-[#141416] flex items-center justify-center overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.1, y: -20 }}
        transition={{ duration: 0.4 }}
        className="flex items-center"
      >
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tighter">
          Thinkpa<span className="text-gray-400">dle</span>
        </h1>
        <span className="ml-1 sm:ml-2 mt-1 sm:mt-2 flex items-center">
          <Image
            src="/trackpad.png"
            alt="TrackPoint"
            width={24}
            height={24}
            className="w-5 h-5 sm:w-6 sm:h-6"
          />
        </span>
      </motion.div>
    </motion.div>
  );
}
