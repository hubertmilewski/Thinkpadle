"use client";

import { useEffect, useState, useRef } from "react";
import { siteContent } from "@/data/content";
import { GuessResult } from "@/types";
import { getDailyStats } from "@/app/actions/stats";
import { getTimeUntilNextReset, calculateEffectiveDate } from "@/lib/time";
import { ChartStat } from "@/components/ui/stats/ChartsStat";
import { generateShareText } from "@/lib/share";

interface DailyStats {
  total_players: number;
  total_wins: number;
  total_surrenders: number;
  sum_of_tries: number;
  tries_distribution: Record<string, number>;
}

interface WinCardProps {
  targetModel: string;
  guesses: GuessResult[];
  challengeId: string;
  yesterdayModel: string | null;
  imageCredit?: string;
  isFresh?: boolean;
}

const getNextLaunchTime = () => {
  const diff = getTimeUntilNextReset();
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const m = Math.floor((diff / 1000 / 60) % 60);
  const s = Math.floor((diff / 1000) % 60);

  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
};

export function WinCard({
  targetModel,
  guesses,
  challengeId,
  yesterdayModel,
  imageCredit,
  isFresh = true,
}: WinCardProps) {
  const [timeLeft, setTimeLeft] = useState(getNextLaunchTime());
  const [stats, setStats] = useState<DailyStats | null>(null);
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const userTries = guesses.length;
  const effectiveDate = calculateEffectiveDate();
  const shareText = generateShareText(guesses, effectiveDate);

  useEffect(() => {
    async function fetchStats() {
      if (!challengeId || challengeId === "undefined") return;
      const data = await getDailyStats(challengeId);
      if (data) setStats(data);
    }
    fetchStats();

    if (isFresh) {
      setTimeout(() => {
        cardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    }
  }, [challengeId, isFresh]);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getNextLaunchTime()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleShare = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  let worsePlayers = 0;
  if (stats && stats.tries_distribution) {
    Object.entries(stats.tries_distribution).forEach(([triesStr, count]) => {
      if (parseInt(triesStr) > userTries) {
        worsePlayers += count;
      }
    });
  }

  const betterThanPercent =
    stats && stats.total_wins > 1
      ? Math.round((worsePlayers / stats.total_wins) * 100)
      : 100;

  return (
    <div
      ref={cardRef}
      className="w-full max-w-2xl mx-auto bg-[#111111] border border-[#2a2a2a] border-t-4 border-t-tp-red p-6 sm:p-12 text-center flex flex-col items-center shadow-2xl rounded-sm"
    >
      <div className="mb-8 w-full flex flex-col items-center">
        <h2 className="text-xs sm:text-sm font-bold text-gray-400 uppercase tracking-[0.3em] mb-4">
          {siteContent.winCard.subtitle}
        </h2>
        <div className="text-5xl sm:text-6xl font-black tracking-tighter text-white drop-shadow-md">
          {targetModel}
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full mb-10 text-sm sm:text-base font-medium text-gray-300">
        <div className="bg-[#1a1a1a] py-4 px-6 border border-[#222] rounded-sm flex items-center justify-center shadow-inner w-full">
          <p className="text-center leading-relaxed">
            {siteContent.winCard.stats.guesserNumber1}
            <span className="text-[#2ed1b4] font-black text-lg">
              {stats?.total_wins || "..."}
            </span>
            {siteContent.winCard.stats.guesserNumber2}
          </p>
        </div>

        <div className="bg-[#1a1a1a] py-4 px-6 border border-[#222] rounded-sm flex items-center justify-center shadow-inner w-full">
          <p className="text-center leading-relaxed uppercase tracking-wider text-xs font-bold text-gray-500">
            <span className="text-tp-red font-black text-lg">
              {stats?.total_surrenders || "0"}
            </span>
            {siteContent.winCard.stats.surrendersLabel}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
          <div className="bg-[#1a1a1a] py-4 px-6 border border-[#222] rounded-sm flex items-center justify-center shadow-inner">
            <p className="text-center">
              {siteContent.winCard.tries}
              <span className="text-[#2ed1b4] font-black text-lg">
                {userTries}
              </span>
            </p>
          </div>

          {stats && (
            <div className="bg-[#1a1a1a] py-4 px-6 border border-[#222] rounded-sm flex items-center justify-center shadow-inner">
              <p className="text-center">
                {siteContent.winCard.stats.percentile1}
                <span className="text-[#2ed1b4] font-black text-lg mx-1">
                  {betterThanPercent}
                </span>
                {siteContent.winCard.stats.percentile2}
              </p>
            </div>
          )}
        </div>
      </div>

      {stats && stats.tries_distribution && (
        <div className="w-full mb-10 flex flex-col items-center bg-[#1a1a1a] p-6 sm:p-8 border border-[#222] rounded-sm shadow-inner">
          <h3 className="text-xs text-gray-500 uppercase font-bold tracking-[0.2em] mb-6">
            {siteContent.winCard.stats.charttitle}
          </h3>
          <div className="w-full max-w-md">
            <ChartStat
              distribution={stats.tries_distribution}
              userTries={userTries}
            />
          </div>
        </div>
      )}

      {yesterdayModel && (
        <div className="w-full mb-8 py-3 bg-[#111] border border-[#2a2a2a] rounded-sm flex items-center justify-center gap-2">
          <span className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest font-bold">
            {siteContent.winCard.getYesterdaysModel}
          </span>
          <span className="text-xs sm:text-sm text-gray-300 font-mono font-bold px-2 py-0.5 bg-[#1a1a1a] border border-[#333] rounded-sm">
            {yesterdayModel}
          </span>
        </div>
      )}

      <div className="w-full pt-8 border-t border-[#333] flex flex-col items-center">
        <div className="text-xs text-gray-500 uppercase font-bold tracking-[0.2em] mb-4">
          {siteContent.winCard.nextModel}
        </div>
        <div className="text-4xl sm:text-5xl font-mono font-bold text-white tracking-widest mb-8">
          {timeLeft}
        </div>

        <div className="relative w-full sm:w-3/4 flex flex-col items-center">
          <div
            className={`
            absolute bottom-full mb-4 w-full max-w-sm p-4 bg-[#1a1a1a] border border-[#333] shadow-2xl transition-all duration-300 pointer-events-none rounded-sm z-10
            ${showPreview ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}
          `}
          >
            <pre className="text-xs text-gray-300 font-mono text-left whitespace-pre-wrap leading-relaxed">
              {shareText}
            </pre>

            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-[#333]">
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-px border-[7px] border-transparent border-t-[#1a1a1a]" />
            </div>
          </div>

          <button
            onMouseEnter={() => setShowPreview(true)}
            onMouseLeave={() => setShowPreview(false)}
            onClick={handleShare}
            className="w-full bg-tp-red hover:bg-red-700 text-white font-black py-4 px-6 uppercase tracking-[0.2em] transition-all active:scale-95 shadow-lg rounded-sm"
          >
            {copied ? siteContent.winCard.copied : siteContent.winCard.share}
          </button>
        </div>

        {imageCredit && (
          <div className="text-[10px] sm:text-xs text-gray-500 mt-6 font-medium tracking-widest uppercase">
            {siteContent.winCard.imageCredit} {imageCredit}
          </div>
        )}
      </div>
    </div>
  );
}