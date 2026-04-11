import Image from "next/image";
import { siteContent } from "@/data/content";
import { BadgeInfo, Trophy, UserCircle, Menu, Grid2x2, Sword, TimerReset } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { BadgeButton } from "@/components/ui/BadgeButton";
import { UserMenu } from "@/components/ui/UserMenu";

interface HeaderProps {
  mode: "daily" | "survival";
  onOpenTutorial: () => void;
  onOpenRanking: () => void;
  onOpenSettings: () => void;
  onOpenAuth: () => void;
  onOpenStats: () => void;
  onOpenSideMenu: () => void;
}

export function Header({
  mode,
  onOpenTutorial,
  onOpenRanking,
  onOpenSettings,
  onOpenAuth,
  onOpenStats,
  onOpenSideMenu,
}: HeaderProps) {
  const { session, user } = useAuth();

  const nickname =
    user?.user_metadata?.nickname ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    null;
  const avatarUrl = user?.user_metadata?.avatar_url || null;

  return (
    <header className="w-full flex items-center border-b border-gray-800 pb-2 px-2 md:px-6 mb-8 mt-2 h-16 sm:h-20">
      <div className="flex-1 flex justify-start items-center h-full gap-2">
        <div className="sm:hidden">
          <BadgeButton
            onClick={onOpenSideMenu}
            aria-label="Menu"
            icon={<Menu className="w-8 h-8 p-1 text-gray-400 group-hover:text-white transition-colors" />}
            className="h-10 border-0"
            bgClass="bg-transparent"
          />
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <BadgeButton
            onClick={onOpenTutorial}
            aria-label={siteContent.howToPlayDaily.title}
            icon={<BadgeInfo className="w-10 h-10 p-1.5 text-gray-400 group-hover:text-white transition-colors" />}
            label={siteContent.howToPlayDaily.title}
            textClass="text-gray-400 group-hover:text-white"
            className="h-12"
          />
          <BadgeButton
            href={mode === "daily" ? "/survival" : "/"}
            aria-label={mode === "daily" ? "Survival Mode" : "Daily Challange"}
            icon={
              mode === "daily" ? (
                <Sword className="w-10 h-10 p-2 text-green-400 group-hover:text-yellow-200 transition-colors" />
              ) : (
                <TimerReset className="w-10 h-10 p-2 text-blue-300 group-hover:text-white transition-colors" />
              )
            }
            label={mode === "daily" ? "Survival Mode" : "Daily Challange"}
            textClass={mode === "daily" ? "text-yellow-500 group-hover:text-yellow-200" : "text-blue-300 group-hover:text-white"}
            className="h-12"
          />
        </div>
      </div>

      <div className="flex justify-center h-full items-center">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tighter flex items-center justify-center">
          <span>Thinkpa</span>
          <span className="text-gray-400">dle</span>
          <span className="ml-1 sm:ml-2 mt-1 sm:mt-2 flex items-center">
            <Image
              src="/trackpad.png"
              alt="TrackPoint"
              width={24}
              height={24}
              className="w-5 h-5 sm:w-6 sm:h-6"
            />
          </span>
        </h1>
      </div>

      <div className="flex-1 flex justify-end gap-2 sm:gap-4 items-center h-full">
        <div className="hidden sm:flex items-center gap-4">
          <BadgeButton
            onClick={onOpenStats}
            aria-label="Stats"
            icon={<Grid2x2 className="w-10 h-10 p-2 text-blue-500 group-hover:text-blue-200 transition-colors" />}
            label="Stats"
            textClass="text-blue-500 group-hover:text-blue-200"
            className="h-12"
          />

          <BadgeButton
            onClick={onOpenRanking}
            aria-label="Leaderboard"
            icon={<Trophy className="w-10 h-10 p-2 text-yellow-500 group-hover:text-yellow-200 transition-colors" />}
            label={siteContent.ranking.title}
            textClass="text-yellow-500 group-hover:text-yellow-200"
            className="h-12"
          />
        </div>        {session ? (
          <UserMenu
            nickname={nickname}
            avatarUrl={avatarUrl}
            onOpenSettings={onOpenSettings}
          />
        ) : (
          <button
            onClick={onOpenAuth}
            className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white transition-colors px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base font-bold uppercase h-10 sm:h-12"
          >
            <span className="hidden sm:block">Login</span>
            <UserCircle className="w-6 h-6 block sm:hidden" />
          </button>
        )}
      </div>
    </header>
  );
}
