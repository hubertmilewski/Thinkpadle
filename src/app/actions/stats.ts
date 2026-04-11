"use server";

import { supabase } from "@/lib/supabase";
import { GuessResult } from "@/types";

interface GameResultPayload {
  playerId: string;
  challengeId: string;
  guesses: GuessResult[];
  tries: number;
  won?: boolean;
  completed?: boolean;
}

export async function saveGameResultToDB(payload: GameResultPayload) {
  const { playerId, challengeId, guesses, tries, won, completed } = payload;

  const { error } = await supabase
    .from("game_results")
    .upsert(
      {
        player_id: playerId,
        challenge_id: challengeId,
        guesses: guesses,
        tries: tries,
        won: won ?? null,
        completed_at: completed ? new Date().toISOString() : null,
      },
      { onConflict: "player_id,challenge_id" }
    );

  if (error) {
    if (error.code === '23505') return { success: true, message: "Already submitted" };
    console.error("Error saving result:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function loadGameResultFromDB(
  userId: string,
  challengeId: string
): Promise<{ guesses: GuessResult[]; hasGivenUp: boolean; won: boolean } | null> {
  const { data, error } = await supabase
    .from("game_results")
    .select("guesses, won, completed_at")
    .eq("player_id", userId)
    .eq("challenge_id", challengeId)
    .maybeSingle();

  if (error) {
    console.error("Error loading result:", error);
    return null;
  }

  if (!data) return null;

  const isCompleted = !!data.completed_at;
  const won = data.won === true;
  const hasGivenUp = isCompleted && !won;

  return {
    guesses: (data.guesses as GuessResult[]) || [],
    hasGivenUp,
    won,
  };
}

export async function getUserActivityStats(userId: string): Promise<{
  activity: import("@/components/ui/ActivityGraph").ActivityEntry[];
  totalGames: number;
  totalWins: number;
  totalTries: number;
}> {
  const { data, error } = await supabase
    .from("game_results")
    .select(`
      created_at,
      tries,
      won,
      daily_challenges(
        models(
          model
        )
      )
    `)
    .eq("player_id", userId)
    .not("completed_at", "is", null);

  if (error || !data) {
    return { activity: [], totalGames: 0, totalWins: 0, totalTries: 0 };
  }

  let totalTries = 0;

  const activity = (data as unknown as {
    created_at: string;
    won: boolean;
    tries: number;
    daily_challenges: {
      models: {
        model: string;
      } | { model: string }[];
    } | null;
  }[]).map((row) => {
    let targetModel = "Unknown";
    try {
      if (row.daily_challenges?.models) {
        if (Array.isArray(row.daily_challenges.models)) {
          targetModel = row.daily_challenges.models[0]?.model || "Unknown";
        } else {
          targetModel = row.daily_challenges.models.model || "Unknown";
        }
      }
    } catch {
      // Ignore
    }

    const tries = row.tries || 0;
    totalTries += tries;

    return {
      date: new Date(row.created_at).toISOString().split("T")[0],
      tries,
      won: !!row.won,
      targetModel,
    };
  });

  const totalGames = data.length;
  const totalWins = data.filter((row) => row.won).length;

  return {
    activity,
    totalGames,
    totalWins,
    totalTries,
  };
}

export async function getDailyStats(challengeId: string) {
  const { data, error } = await supabase
    .from("daily_summary")
    .select("*")
    .eq("challenge_id", challengeId)
    .single();

  if (error) {
    console.error("Error fetching stats:", error);
    return null;
  }

  return data;
}