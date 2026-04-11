import { GuessResult } from "@/types";

const STATE_KEY = "thinkpadle_game_state";

export function getOrCreatePlayerId(): string {
  if (typeof window === "undefined") return "";

  let playerId = localStorage.getItem("thinkpadle_player_id");

  if (!playerId) {
    playerId = crypto.randomUUID();
    localStorage.setItem("thinkpadle_player_id", playerId);
  }

  return playerId;
}

interface GameState {
  challengeId: string;
  guesses: GuessResult[];
  hasGivenUp: boolean;
}

export function saveGameState(challengeId: string, guesses: GuessResult[], hasGivenUp: boolean) {
  if (typeof window === "undefined") return;

  const state: GameState = {
    challengeId,
    guesses,
    hasGivenUp,
  };

  localStorage.setItem(STATE_KEY, JSON.stringify(state));
}

export function loadGameState(currentChallengeId: string): { guesses: GuessResult[], hasGivenUp: boolean } {
  const defaultState = { guesses: [], hasGivenUp: false };
  if (typeof window === "undefined") return defaultState;

  const stored = localStorage.getItem(STATE_KEY);
  if (!stored) return defaultState;

  try {
    const parsed = JSON.parse(stored);

    if (parsed.challengeId === currentChallengeId) {
      return {
        guesses: parsed.guesses || [],
        hasGivenUp: !!parsed.hasGivenUp,
      };
    }

    localStorage.removeItem(STATE_KEY);
    return defaultState;
  } catch (e) {
    console.error("Błąd odczytu stanu gry:", e);
    return defaultState;
  }
}

export function clearGameState() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STATE_KEY);
}