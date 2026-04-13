
# Thinkpadle 🔴 [![Version](https://img.shields.io/badge/version-1.1-red.svg)](https://github.com/hubertmilewski/Thinkpadle)

Thinkpadle is a daily puzzle game built specifically for Lenovo ThinkPad enthusiasts. Inspired by the massive success of daily browser games like Wordle or Loldle, it challenges players to guess a specific ThinkPad model based on its hardware specifications. 

Every day, players worldwide are presented with an image of a ThinkPad and must use their hardware knowledge to narrow down the exact model, series, generation, release year, screen size, and weight.

<img width="1080" height="555" alt="image" src="https://github.com/user-attachments/assets/31c22e46-5e0d-45fa-b306-1e41d896e7e4" />

---

## 🆕 What's New in v1.1

The v1.1 update brings the most requested features to Thinkpadle, transforming it from a simple daily puzzle into a complete gaming platform for enthusiasts.

*   **🔥 Survival Mode**: Can't wait for the next day? Survival Mode lets you play continuously. Guess as many ThinkPads as you can in a row without losing your lives.
*   **🔑 Authentication**: Securely sign in using your Github account or register account with your email. No more losing your progress after clearing browser cache.
*   **📊 Personal Activity Graph**: Track your consistency with a GitHub-style contribution heatmap. Watch your ThinkPad knowledge grow day by day.
*   **⚡ Performance Optimizations**: Refactored image loading and server-side logic for a lightning-fast experience even on slower connections.

---

### The Gameplay Experience

The core loop is designed to be intuitive but challenging. When a player submits a guess, the game provides immediate visual feedback using a distinct color-coded UI. 

*   **Green Tile**: Perfect match! You've nailed that specification.
*   **Grey Tile**: Incorrect. Try a different series or generation.
*   **Red Tile with Arrows**: For numerical values (year, weight, screen size), these indicate whether the target is higher or lower than your guess.

<img width="1080" height="555" alt="image" src="https://github.com/user-attachments/assets/6e591d7b-fedb-4a6a-acc0-be0fbe1eccc8" />

At the end of the game—whether you emerge victorious or decide to give up—a summary card is displayed. It reveals the mystery model and provides deep community statistics, such as how many people guessed it today, the distribution of tries, and the surrender rate.

<img width="1920" height="993" alt="image" src="https://github.com/user-attachments/assets/790067b7-f1f5-4773-a1d4-a70ad5bf0780" />
<img width="1920" height="986" alt="image" src="https://github.com/user-attachments/assets/7742ec2a-318d-4c5b-9d47-750a6358a478" />

---

## The Tech Stack

This project is built using a modern, high-performance stack centered around **Next.js** and **Supabase**.

*   **Frontend**: Next.js 14 (App Router), Tailwind CSS (for layout), and Framer Motion (for premium animations).
*   **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions).
*   **Auth**: Reddit OAuth integration for seamless user onboarding.
*   **Analytics**: Vercel Analytics for privacy-preserving traffic monitoring.

### Project Structure

```text
thinkpadle/
├── public/                 # Static assets (icons, placeholder images)
└── src/
    ├── app/                # Next.js App Router
    │   ├── actions/        # Secure Server Actions (DB queries & Auth logic)
    │   └── survival/       # Survival Mode routes
    ├── components/         # Modular React components
    │   ├── modals/         # Overlay components (HowToPlay, Activity, etc.)
    │   ├── survival/       # Survival-specific logic components
    │   └── ui/             # Reusable base elements & charts
    ├── data/               # Centralized content dictionary
    ├── lib/                # Core logic & Supabase client
    └── types/              # Global TypeScript interfaces
```
    
### Advanced Database Mechanics

Thinkpadle leverages the full power of **PostgreSQL Triggers**. Whenever a game result is submitted, the database automatically:
1.  Increments global stats.
2.  Updates the daily distribution of tries.
3.  Calculates real-time surrender rates.

This ensures the frontend receives pre-calculated, ready-to-display community stats instantly, without expensive server-side processing.

---

## Deployment & SEO

Thinkpadle is deployed on **Vercel**, utilizing edge delivery for maximum speed. 

*   **SEO**: Proactively managed through **Google Search Console** and optimized **Open Graph (OG)** tags for a premium experience when sharing results on Discord, Reddit, or Twitter.
*   **Security**: Sensitive data (like the daily model identity) never leaves the server until the game is completed, preventing "inspect element" cheats.

---

## Database Schema

<img width="1078" height="837" alt="image" src="https://github.com/user-attachments/assets/aefd06c5-1493-448c-bfd1-521a0403c8ea" />

*   **`models`**: Master dictionary containing all ThinkPad specifications, primary image URLs, and secondary image collections (`image_urls`).
*   **`daily_challenges`**: Links specific calendar dates to target models, including `image_credit` for community-contributed photos.
*   **`profiles`**: User metadata (nicknames, avatars) linked to **Supabase Auth** (`auth.users.id`).
*   **`survival_scores`**: Tracks high scores and player associations for the new Survival Mode.
*   **`game_results`**: Stores detailed logs of every game, including the full JSONB sequence of `guesses` and precise `completed_at` timestamps.
*   **`daily_summary`**: Aggregated daily stats (distribution, wins, surrenders) updated in real-time by PostgreSQL triggers.


