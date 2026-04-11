import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Survival Mode",
  description:
    "How many ThinkPad models can you guess in a row? Test your knowledge in Survival Mode — one wrong answer and it's game over.",
  openGraph: {
    title: "Thinkpadle — Survival Mode",
    description:
      "How many ThinkPad models can you guess in a row? One wrong answer = game over.",
  },
};

export default function SurvivalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
