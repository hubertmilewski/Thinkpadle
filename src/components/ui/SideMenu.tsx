"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, BadgeInfo, Trophy, BarChart3, Settings, UserCircle, LogOut, Sword, TimerReset } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { signOut } from "@/lib/auth-helpers";
import { siteContent } from "@/data/content";
import { TRANSITION_SETTINGS, MOBILE_DRAWER_VARIANTS } from "@/lib/animations";

interface SideMenuProps {
  mode: "daily" | "survival";
  isOpen: boolean;
  onClose: () => void;
  onOpenTutorial: () => void;
  onOpenRanking: () => void;
  onOpenStats: () => void;
  onOpenSettings: () => void;
  onOpenAuth: () => void;
}

export function SideMenu({
  mode,
  isOpen,
  onClose,
  onOpenTutorial,
  onOpenRanking,
  onOpenStats,
  onOpenSettings,
  onOpenAuth,
}: SideMenuProps) {
  const { session, user } = useAuth();

  const nickname =
    user?.user_metadata?.nickname ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    null;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const menuItems = [
    {
      label: mode === "daily" ? "Survival Mode" : "Daily Challenge",
      icon: mode === "daily" ? (
        <Sword className="w-6 h-6 text-green-400" />
      ) : (
        <TimerReset className="w-6 h-6 text-blue-300" />
      ),
      iconClass: mode === "daily" ? "group-hover:text-yellow-200" : "group-hover:text-white",
      labelClass: mode === "daily" ? "text-yellow-500 group-hover:text-yellow-200" : "text-blue-300 group-hover:text-white",
      href: mode === "daily" ? "/survival" : "/",
    },
    {
      label: "How to Play",
      icon: <BadgeInfo className="w-6 h-6" />,
      iconClass: "text-gray-500 group-hover:text-white",
      labelClass: "text-gray-300 group-hover:text-white",
      onClick: () => {
        onClose();
        onOpenTutorial();
      },
    },
    {
      label: "Ranking",
      icon: <Trophy className="w-6 h-6" />,
      iconClass: "text-yellow-500 group-hover:text-yellow-200",
      labelClass: "text-yellow-500 group-hover:text-yellow-200",
      onClick: () => {
        onClose();
        onOpenRanking();
      },
    },
    {
      label: "My Stats",
      icon: <BarChart3 className="w-6 h-6" />,
      iconClass: "text-blue-500 group-hover:text-blue-200",
      labelClass: "text-blue-500 group-hover:text-blue-200",
      onClick: () => {
        onClose();
        onOpenStats();
      },
    },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-300 flex sm:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />

          <motion.div
            variants={MOBILE_DRAWER_VARIANTS}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={TRANSITION_SETTINGS}
            className="relative w-full h-full bg-[#111113] flex flex-col"
          >
            <div className="flex justify-between items-center px-6 py-5 border-b border-gray-800/50 shrink-0">
              <div className="flex items-center gap-1.5">
                <h2 className="text-3xl font-bold tracking-tighter">
                  <span>Thinkpa</span>
                  <span className="text-gray-400">dle</span>
                </h2>
                <Image
                  src="/trackpad.png"
                  alt="TrackPoint"
                  width={20}
                  height={20}
                  className="w-4 h-4 mt-1"
                />
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-white transition-colors p-2 -mr-2"
              >
                <X size={28} />
              </button>
            </div>

            <div className="flex-1 flex flex-col justify-center px-6 gap-1">
              {menuItems.map((item, i) => {
                const content = (
                  <>
                    <span className={item.iconClass || "text-gray-500"}>{item.icon}</span>
                    <span className={`text-xl font-black uppercase tracking-tight ${item.labelClass || "text-gray-300"}`}>
                      {item.label}
                    </span>
                  </>
                );

                const itemClass = `flex items-center gap-4 w-full py-5 text-left transition-colors group`;

                if (item.href) {
                  return (
                    <Link key={i} href={item.href} className={itemClass} onClick={onClose}>
                      {content}
                    </Link>
                  );
                }

                return (
                  <button
                    key={i}
                    onClick={item.onClick}
                    className={itemClass}
                  >
                    {content}
                  </button>
                );
              })}

              <div className="border-t border-gray-800/50 my-2" />

              {session ? (
                <>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenSettings();
                    }}
                    className="flex items-center gap-4 w-full py-5 text-left text-gray-300 hover:text-white active:text-white transition-colors"
                  >
                    <span className="text-gray-500"><Settings className="w-6 h-6" /></span>
                    <span className="text-xl font-black uppercase tracking-tight">
                      Settings
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                      signOut();
                    }}
                    className="flex items-center gap-4 w-full py-5 text-left text-red-600 hover:text-red-500 active:text-red-400 transition-colors"
                  >
                    <LogOut className="w-6 h-6" />
                    <span className="text-xl font-black uppercase tracking-tight">
                      Logout
                    </span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    onClose();
                    onOpenAuth();
                  }}
                  className="flex items-center gap-4 w-full py-5 text-left text-red-500 hover:text-red-400 active:text-red-300 transition-colors"
                >
                  <UserCircle className="w-6 h-6" />
                  <span className="text-2xl font-black uppercase tracking-tight">
                    Login
                  </span>
                </button>
              )}
            </div>

            <div className="px-6 pb-8 pt-4 border-t border-gray-800/50 shrink-0 flex flex-col gap-4">
              {session && nickname && (
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Logged in as <span className="text-gray-300">{nickname}</span>
                </p>
              )}

              <div className="flex items-center justify-between">
                <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">
                  © {currentYear} {siteContent.header.title}
                </p>
                <div className="flex items-center gap-3">
                  <a href="https://github.com/hubertmilewski" target="_blank" rel="noopener noreferrer" className="opacity-30 hover:opacity-80 transition-opacity" aria-label="GitHub">
                    <Image src="/github.svg" alt="GitHub" width={14} height={14} className="invert" />
                  </a>
                  <a href="https://reddit.com/r/thinkpad" target="_blank" rel="noopener noreferrer" className="opacity-30 hover:opacity-80 transition-opacity" aria-label="Reddit">
                    <Image src="/reddit.svg" alt="Reddit" width={14} height={14} />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
