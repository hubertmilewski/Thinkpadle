"use server";

import { supabase } from "@/lib/supabase";
import { ModelData, GuessResult } from "@/types/index";
import { calculateEffectiveDate } from "@/lib/time";

function getEffectiveChallengeDate(): string {
  return calculateEffectiveDate();
}

async function getDailyModel(): Promise<ModelData | null> {
  const challengeDate = getEffectiveChallengeDate();

  const { data, error } = await supabase
    .from("daily_challenges")
    .select(
      `
      target_model_id,
      models (
        model,
        series,
        generation,
        year,
        screen,
        weight,
        image_url
      )
    `,
    )
    .eq("challenge_date", challengeDate)
    .single();

  if (error || !data || !data.models) {
    console.error("Error fetching daily model:", error);
    return null;
  }

  const target = data.models as unknown as ModelData;
  return target;
}

export async function getDailyChallengeId(): Promise<string | null> {
  const challengeDate = getEffectiveChallengeDate();

  const { data, error } = await supabase
    .from("daily_challenges")
    .select("id")
    .eq("challenge_date", challengeDate)
    .single();

  if (error || !data) {
    console.error("Error fetching daily challenge id:", error);
    return null;
  }

  return data.id.toString();
}

export async function getDailyImage(): Promise<string | null> {
  const targetModel = await getDailyModel();

  if (!targetModel || !targetModel.image_url) return null;

  return targetModel.image_url;
}

export async function getDailyImageCredit(): Promise<string | null> {
  const challengeDate = getEffectiveChallengeDate();

  const { data, error } = await supabase
    .from("daily_challenges")
    .select("image_credit")
    .eq("challenge_date", challengeDate)
    .single();

  if (error || !data) {
    console.error("Error fetching daily image credit:", error);
    return null;
  }

  return data.image_credit;
}

export async function getYesterdaysModel(): Promise<string | null> {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayString = yesterday.toISOString().split('T')[0];

  const { data, error } = await supabase
    .from("daily_challenges")
    .select(`
      models (
        model
      )
    `)
    .eq("challenge_date", yesterdayString)
    .single();

  if (error || !data || !data.models) {
    console.error("I was unable to download yesterday's model:", error);
    return null;
  }

  const target = data.models as unknown as ModelData;
  return target.model;
}

export async function getAllModelNames(): Promise<string[]> {
  const { data, error } = await supabase
    .from("models")
    .select("model")
    .order("model", { ascending: true });

  if (error || !data) return [];
  return data.map((m) => m.model);
}

export async function submitGuess(
  guessModelName: string,
): Promise<GuessResult | { error: string }> {
  const challengeDate = getEffectiveChallengeDate();

  const { data, error } = await supabase.rpc("check_guess_by_name", {
    guessed_name: guessModelName,
    effective_date: challengeDate, 
  });

  if (error || !data) {
    console.error("Błąd weryfikacji RPC:", error);
    return { error: "Failed to verify guess." };
  }

  return data as GuessResult;
}