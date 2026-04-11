import { GuessResult, ComparisonStatus } from "@/types/index";
import { siteContent } from "@/data/content";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown } from "lucide-react";

interface ResultGridProps {
  guesses: GuessResult[];
}

function getOrdinalSuffix(n: number) {
  if (n > 3 && n < 21) return "th";
  switch (n % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
}

export function ResultGrid({ guesses }: ResultGridProps) {
  return (
    <div className="w-full px-2 sm:px-0">
      <div className="grid grid-cols-6 gap-1.5 sm:gap-2 text-center text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 sm:mb-3 pt-2">
        {siteContent.table.headers.map((header) => (
          <div key={header}>{header}</div>
        ))}
      </div>

      <div className="flex flex-col gap-1.5 sm:gap-2 max-h-75 sm:max-h-95 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {guesses.map((result) => (
          <GuessRow key={result.data.model} result={result} />
        ))}
      </div>
    </div>
  );
}

function GuessRow({ result }: { result: GuessResult }) {
  const { data, status } = result;

  const getBoxClass = (stat: ComparisonStatus) => {
    return cn(
      "flex items-center justify-center h-14 sm:h-16 text-[10px] sm:text-xs font-black transition-all duration-500 px-1 text-center leading-[1.15] shadow-sm relative overflow-hidden",
      stat === "correct" && "bg-tp-green text-white",
      (stat === "higher" || stat === "lower") && "bg-tp-wrong text-white",
      stat !== "correct" && stat !== "higher" && stat !== "lower" && "bg-tp-card border border-gray-800 text-gray-300"
    );
  };

  const renderCell = (label: string | number, stat: ComparisonStatus, delayIndex: number, unit: string = "") => (
    <div
      className={cn(getBoxClass(stat), "animate-fade-in")}
      style={{ animationDelay: `${delayIndex * 150}ms` }}
    >
      <span className="relative z-10">{label}{unit}</span>
      {stat === "higher" && (
        <ChevronUp className="absolute top-0.5 sm:top-1 left-1/2 -translate-x-1/2 w-4 h-4 sm:w-5 sm:h-5 text-white/80" strokeWidth={3} />
      )}
      {stat === "lower" && (
        <ChevronDown className="absolute bottom-0.5 sm:bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 sm:w-5 sm:h-5 text-white/80" strokeWidth={3} />
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
      <div className={cn(getBoxClass(status.model), "animate-fade-in")} style={{ animationDelay: "0ms" }}>
        <span className="relative z-10">{data.model}</span>
      </div>
      <div className={cn(getBoxClass(status.series), "animate-fade-in")} style={{ animationDelay: "150ms" }}>
        <span className="relative z-10">{data.series}</span>
      </div>
      {renderCell(data.generation, status.generation, 2, getOrdinalSuffix(data.generation))}
      {renderCell(data.year, status.year, 3)}
      {renderCell(data.screen, status.screen, 4, '"')}
      {renderCell(data.weight, status.weight, 5, "kg")}
    </div>
  );
}