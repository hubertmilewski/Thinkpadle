"use server";

import { createClient } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

interface SurvivalModel {
  modelId: string;
  imageUrl: string;
}

export async function getRandomSurvivalModel(
  excludeIds: string[],
): Promise<SurvivalModel | null> {
  let query = supabase
    .from("models")
    .select("id, image_urls")
    .not("image_urls", "is", null);

  if (excludeIds.length > 0) {
    query = query.not("id", "in", `(${excludeIds.join(",")})`);
  }

  const { data, error } = await query;
  if (error || !data) return null;


  const validModels = data.filter((m) => {
    if (!Array.isArray(m.image_urls) || m.image_urls.length === 0) return false;
    return m.image_urls.some((e: any) => {
      if (typeof e !== "string") return false;
      const lower = e.toLowerCase();
      return !lower.includes(".pdf") && !lower.includes(".djvu") && !lower.includes(".ogv") && !lower.includes(".webm") && !lower.includes(".mp4");
    });
  });

  if (validModels.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * validModels.length);
  const model = validModels[randomIndex];

  const urls = (model.image_urls as string[]).filter((e: string) => {
    if (typeof e !== "string") return false;
    const lower = e.toLowerCase();
    return !lower.includes(".pdf") && !lower.includes(".djvu") && !lower.includes(".ogv") && !lower.includes(".webm") && !lower.includes(".mp4");
  });

  const randomUrlIndex = Math.floor(Math.random() * urls.length);
  const selectedEntry = urls[randomUrlIndex];
  const imageUrl = selectedEntry.split("|||")[0];

  return {
    modelId: model.id,
    imageUrl,
  };
}

export async function checkSurvivalGuess(
  modelId: string,
  guessedName: string,
): Promise<{ correct: boolean; correctName: string; authors: string[] }> {
  const { data, error } = await supabase
    .from("models")
    .select("model, image_urls")
    .eq("id", modelId)
    .single();

  if (error || !data) {
    return { correct: false, correctName: "Nieznany", authors: [] };
  }

  const correct = data.model.toLowerCase() === guessedName.toLowerCase();


  const authors = (data.image_urls || []).map((entry: string) => {
    const parts = entry.split("|||");
    return parts.length > 1 ? parts[1] : "Nieznany";
  });

  return {
    correct,
    correctName: data.model,
    authors: Array.from(new Set(authors)),
  };
}


export async function getSurvivalLeaderboard(): Promise<
  { score: number; nickname: string; avatarUrl: string; createdAt: string }[]
> {
  const { data, error } = await supabase
    .from("survival_scores")
    .select(`
      score,
      created_at,
      nickname,
      profiles (
        nickname,
        avatar_url
      )
    `)
    .order("score", { ascending: false })
    .limit(10);

  if (error || !data) {
    console.error("Leaderboard fetch error:", error);
    return [];
  }

  return data.map((row: any) => ({
    score: row.score,
    nickname: row.profiles?.nickname || row.nickname || "Anonymous",
    avatarUrl: row.profiles?.avatar_url || "",
    createdAt: row.created_at,
  }));
}

export async function getPersonalBest(
  userId: string,
): Promise<number> {
  const { data, error } = await supabase
    .from("survival_scores")
    .select("score")
    .eq("player_id", userId)
    .order("score", { ascending: false })
    .limit(1);

  if (error || !data || data.length === 0) return 0;
  return data[0].score;
}

export async function getAllModelNamesForSurvival(): Promise<string[]> {
  const { data, error } = await supabase
    .from("models")
    .select("model, image_urls")
    .not("image_urls", "is", null)
    .order("model", { ascending: true });

  if (error || !data) return [];


  return data
    .filter((m) => {
      if (!Array.isArray(m.image_urls) || m.image_urls.length === 0) return false;
      return m.image_urls.some((e: any) => {
        if (typeof e !== "string") return false;
        const lower = e.toLowerCase();
        return !lower.includes(".pdf") && !lower.includes(".djvu") && !lower.includes(".ogv") && !lower.includes(".webm") && !lower.includes(".mp4");
      });
    })
    .map((m) => m.model);
}

export async function saveSurvivalScore(
  score: number,
  usedModelIds: string[],
  accessToken?: string,
  guestNickname?: string,
): Promise<{ success: boolean; error?: string }> {
  let userId: string | null = null;
  let finalNickname: string | null = null;
  let client = supabase;

  if (accessToken) {
    const serverClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      },
    );

    const { data: userData, error: authError } =
      await serverClient.auth.getUser(accessToken);

    if (authError || !userData?.user) {
      return { success: false, error: "Unauthorized" };
    }

    userId = userData.user.id;
    client = serverClient;
  } else if (guestNickname) {
    finalNickname = guestNickname.trim().substring(0, 20);
    if (!finalNickname) return { success: false, error: "Nickname is required" };
  } else {
    return { success: false, error: "No identity provided" };
  }

  if (score < 0 || score > usedModelIds.length) {
    return { success: false, error: "Invalid score" };
  }

  const MAX_REASONABLE_SCORE = 500;
  if (score > MAX_REASONABLE_SCORE) {
    return { success: false, error: "Score exceeds maximum allowed value" };
  }

  if (score === 0) {
    return { success: true };
  }

  const { error } = await client.from("survival_scores").insert({
    player_id: userId,
    score,
    nickname: finalNickname,
  });

  if (error) {
    console.error("Error saving survival score:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}
