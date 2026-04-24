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
        image_url,
        image_urls
      )
    `,
    )
    .eq("challenge_date", challengeDate)
    .maybeSingle();

  if (error || !data || !data.models) {
    return null;
  }

  const m: any = data.models;

  let finalImageUrl = m.image_url;

  if (!finalImageUrl && Array.isArray(m.image_urls) && m.image_urls.length > 0) {
    const urls = m.image_urls.filter((e: string) => {
      if (typeof e !== "string") return false;
      const lower = e.toLowerCase();
      return !lower.includes(".pdf") && !lower.includes(".djvu") && !lower.includes(".ogv") && !lower.includes(".webm") && !lower.includes(".mp4");
    });
    if (urls.length > 0) {
      finalImageUrl = urls[0].split("|||")[0];
    }
  }

  const target: ModelData = {
    model: m.model,
    series: m.series,
    generation: m.generation,
    year: m.year,
    screen: m.screen,
    weight: m.weight,
    image_url: finalImageUrl,
  };

  return target;
}

export async function getDailyChallengeId(): Promise<string | null> {
  const challengeDate = getEffectiveChallengeDate();

  const { data, error } = await supabase
    .from("daily_challenges")
    .select("id")
    .eq("challenge_date", challengeDate)
    .maybeSingle();

  if (error || !data) {
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
    .maybeSingle();

  if (error || !data) {
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
    .maybeSingle();

  if (error || !data || !data.models) {
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