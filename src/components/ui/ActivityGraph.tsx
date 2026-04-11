import { useMemo } from "react";
import { format, subDays, startOfWeek, addDays } from "date-fns";

export interface ActivityEntry {
  date: string;
  tries: number;
  won: boolean;
  targetModel: string | null;
}

interface ActivityGraphProps {
  activity: ActivityEntry[];
  daysToGenerate?: number;
}

export function ActivityGraph({
  activity,
  daysToGenerate = 365,
}: ActivityGraphProps) {
  const activityMap = useMemo(() => {
    const map = new Map<string, ActivityEntry>();
    activity.forEach((entry) => map.set(entry.date, entry));
    return map;
  }, [activity]);

  const gridData = useMemo(() => {
    const today = new Date();
    const startDate = subDays(today, daysToGenerate - 1);
    const startOfFirstWeek = startOfWeek(startDate);

    const data: {
      date: Date;
      dateStr: string;
      inFuture: boolean;
      entry?: ActivityEntry;
    }[] = [];
    let currentDate = startOfFirstWeek;
    const endDate = addDays(startOfWeek(today), 6);

    while (currentDate <= endDate) {
      const dateStr = format(currentDate, "yyyy-MM-dd");
      const isFuture = currentDate > today;

      data.push({
        date: currentDate,
        dateStr,
        inFuture: isFuture,
        entry: activityMap.get(dateStr),
      });

      currentDate = addDays(currentDate, 1);
    }

    return data;
  }, [activityMap, daysToGenerate]);

  const weeks: (typeof gridData)[] = [];
  for (let i = 0; i < gridData.length; i += 7) {
    weeks.push(gridData.slice(i, i + 7));
  }

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getColorClass = (entry?: ActivityEntry) => {
    if (!entry) return "bg-gray-800/60";
    if (!entry.won) return "bg-red-600";

    if (entry.tries === 1) return "bg-[#1E6823]";
    if (entry.tries <= 3) return "bg-[#44A340]";
    if (entry.tries <= 5) return "bg-[#8CC665]";
    return "bg-[#D6E685]";
  };

  const getTooltip = (entry?: ActivityEntry, dateStr?: string) => {
    if (!entry) return dateStr || "";
    const status = entry.won ? `Won in ${entry.tries} tries` : "Lost";
    return `${dateStr}\nModel: ${entry.targetModel || "Unknown"}\n${status}`;
  };

  return (
    <div className="min-w-max bg-transparent text-xs">
      <div className="flex gap-2">
        <div className="flex flex-col gap-1 justify-between pt-5 pb-1 text-gray-500 font-bold uppercase tracking-tighter w-6 sm:w-8 shrink-0">
          {weekDays.map((day, i) => (
            <div
              key={day}
              className="h-3 sm:h-4 flex items-center text-[8px] sm:text-[10px]"
            >
              {i % 2 === 1 ? day : ""}
            </div>
          ))}
        </div>

        <div className="flex gap-1 flex-1">
          {weeks.map((week, wIndex) => (
            <div key={wIndex} className="flex flex-col gap-1">
              <div className="h-4 text-[8px] sm:text-[10px] text-gray-500 font-bold mb-1">
                {week[0].date.getDate() <= 7 ? format(week[0].date, "MMM") : ""}
              </div>

              {week.map((day, dIndex) => (
                <div
                  key={dIndex}
                  title={
                    day.inFuture
                      ? undefined
                      : getTooltip(day.entry, day.dateStr)
                  }
                  className={`
                      w-3 h-3 sm:w-4 sm:h-4 rounded-[1px] sm:rounded-sm transition-colors cursor-crosshair
                      ${day.inFuture ? "bg-transparent" : getColorClass(day.entry)}
                    `}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-[10px] text-gray-500 uppercase tracking-widest font-bold">
        <span>Lost</span>
        <div className="w-3 h-3 rounded-[1px] bg-red-600 mr-auto ml-2" />

        <div className="flex items-center gap-2">
          <span>More Tries</span>
          <div className="flex gap-1">
            <div
              className="w-3 h-3 rounded-[1px] bg-[#D6E685]"
              title="6+ Tries"
            />
            <div
              className="w-3 h-3 rounded-[1px] bg-[#8CC665]"
              title="4-5 Tries"
            />
            <div
              className="w-3 h-3 rounded-[1px] bg-[#44A340]"
              title="2-3 Tries"
            />
            <div className="w-3 h-3 rounded-[1px] bg-[#1E6823]" title="1 Try" />
          </div>
          <span>Less Tries</span>
        </div>
      </div>
    </div>
  );
}
