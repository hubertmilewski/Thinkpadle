import Image from "next/image";
import { siteContent } from "@/data/content";
import { BadgeInfo, Trophy, Settings } from "lucide-react";

interface HeaderProps {
  onOpenTutorial: () => void;
  onOpenRanking: () => void;
  onOpenSettings: () => void;
}

export function Header({
  onOpenTutorial,
  onOpenRanking,
  onOpenSettings,
}: HeaderProps) {
  return (
    <header className="w-full flex items-center border-b border-gray-800 pt-2 pb-4 px-2 md:px-6 mb-8">
      <div className="flex-1 flex justify-start items-center">
        <button
          onClick={onOpenTutorial}
          className="group flex items-center gap-2 text-gray-500 hover:text-white transition-all duration-300"
          aria-label={siteContent.howToPlay.title}
        >
          <BadgeInfo className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110" />
          <span className="hidden sm:block text-[10px] font-black uppercase tracking-[0.2em] mt-0.5">
            {siteContent.howToPlay.title}
          </span>
        </button>
      </div>

      <div className="flex justify-center">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tighter flex items-center justify-center">
          <span>Thinkpa</span>
          <span className="text-gray-400">dle</span>
          <span className="ml-1 sm:ml-2 mt-1 shadow-[0_0_1px_rgba(226,35,26,0.4)] flex items-center">
            <Image
              src="/trackpad.png"
              alt="TrackPoint"
              width={20}
              height={20}
              className="w-4 h-4 sm:w-5 sm:h-5"
            />
          </span>
        </h1>
      </div>

      <div className="flex-1 flex justify-end gap-1 sm:gap-2">
        <button
          onClick={onOpenRanking}
          className="text-gray-500 hover:text-white transition-colors p-1.5 sm:p-2"
          aria-label="Leaderboard"
        >
          <Trophy className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <button
          onClick={onOpenSettings}
          className="text-gray-500 hover:text-white transition-colors p-1.5 sm:p-2"
          aria-label="Settings"
        >
          <Settings className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>
    </header>
  );
}
