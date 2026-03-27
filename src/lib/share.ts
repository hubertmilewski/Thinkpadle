import { GuessResult } from "@/types";

export function generateShareText(guesses: GuessResult[], dayIdentifier: string) {
  const emojiGrid = guesses
    .map((guess) => {
      const s = guess.status;
      return [
        s.model === "correct" ? "🟩" : "⬛",
        s.series === "correct" ? "🟩" : "⬛",
        s.generation === "correct" ? "🟩" : s.generation === "higher" ? "🔼" : "🔽",
        s.year === "correct" ? "🟩" : s.year === "higher" ? "🔼" : "🔽",
        s.screen === "correct" ? "🟩" : s.screen === "higher" ? "🔼" : "🔽",
        s.weight === "correct" ? "🟩" : s.weight === "higher" ? "🔼" : "🔽",
      ].join("");
    })
    .join("\n");

  return `Thinkpadle ${dayIdentifier}\n\n${emojiGrid}\n\nTries: ${guesses.length}\nhttps://thinkpadle.com`;
}