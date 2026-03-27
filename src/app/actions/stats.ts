"use server";

import { supabase } from "@/lib/supabase";

interface GameResultPayload {
  playerId: string;
  challengeId: string;
  tries: number;
  won: boolean;
}

export async function submitGameResult(payload: GameResultPayload) {
  const { playerId, challengeId, tries, won } = payload;

  const { error } = await supabase
    .from("game_results")
    .insert([{
      player_id: playerId,
      challenge_id: challengeId,
      tries: tries,
      won: won,
    }]);

  if (error) {
    if (error.code === '23505') return { success: true, message: "Already submitted" };
    console.error("Error saving result:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
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