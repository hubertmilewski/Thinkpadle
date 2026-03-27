
# Thinkpadle 🔴

Thinkpadle is a daily puzzle game built specifically for Lenovo ThinkPad enthusiasts. Inspired by the massive success of daily browser games like Wordle or Loldle, it challenges players to guess a specific ThinkPad model based on its hardware specifications. 

Every day, players worldwide are presented with a image of a ThinkPad and must use their hardware knowledge to narrow down the exact model, series, generation, release year, screen size, and weight.

<img width="1080" height="555" alt="image" src="https://github.com/user-attachments/assets/31c22e46-5e0d-45fa-b306-1e41d896e7e4" />

### The Gameplay Experience

The core loop is designed to be intuitive but challenging. When a player submits a guess, the game provides immediate visual feedback using a distinct color-coded UI. If a specification perfectly matches the daily target, the tile turns a satisfying ThinkPad green. Incorrect traits turn grey, while numerical values (like release year or weight) use directional arrows combined with a red color to indicate whether the target value is higher or lower. This specific color scheme guides the player closer to the correct answer with every attempt.

<img width="1080" height="555" alt="image" src="https://github.com/user-attachments/assets/6e591d7b-fedb-4a6a-acc0-be0fbe1eccc8" />
<br>
At the end of the game-whether the player emerges victorious or decides to give up-a summary card is displayed. It reveals the mystery model and provides deep community statistics, such as how many people guessed it today, the distribution of tries, and even how many players surrendered to the challenge.
<br>
<img width="1920" height="993" alt="image" src="https://github.com/user-attachments/assets/790067b7-f1f5-4773-a1d4-a70ad5bf0780" />
<img width="1920" height="986" alt="image" src="https://github.com/user-attachments/assets/7742ec2a-318d-4c5b-9d47-750a6358a478" />

---

## The Tech Stack

This project is built using my absolute favorite and go-to technology stack: **Next.js** and **Supabase**. This combination allows for a seamless, full-stack development experience, perfectly blending a lightning-fast React frontend with a robust, scalable PostgreSQL backend.

### Project Structure

The repository follows the modern **Next.js App Router** paradigm, placing all source code inside the `src` directory. Server-side logic is strictly separated from client-side UI components to ensure security and maximum performance.

```text
thinkpadle/
├── public/                 # Static assets (icons, placeholder images, Open Graph cards)
└── src/
    ├── app/                # Next.js App Router (layouts, main pages, SEO routing)
    │   └── actions/        # Secure Server Actions (Supabase DB queries for game & stats)
    ├── components/         # Modular React UI components (SearchInput, WinCard, LoseCard)
    │   ├── modals/         # Overlay components (HowToPlay, Settings, Ranking)
    │   └── ui/             # Reusable base elements (Containers, stat charts)
    ├── data/               # Centralized text content dictionary (content.ts)
    ├── lib/                # Core logic (Supabase client, local storage, timezone sync, sharing)
    └── types/              # Global TypeScript interfaces and type definitions
```
    
### System Architecture & Data Flow

Performance and security were the top priorities when designing the data flow for Thinkpadle. To minimize database load and ensure a snappy user experience, we aggressively reduce client-side database queries. 

When a user visits the site, the Next.js server pre-fetches only the absolutely necessary, non-sensitive data-such as the encrypted daily image and the pool of available model names for the autocomplete search. The actual identity of the daily ThinkPad is strictly kept on the server. It is only fetched and revealed when a player either officially wins or clicks the surrender flag, making it impossible to cheat using browser developer tools.

### Smart Database Mechanics

Instead of relying on the Node.js server to fetch all player records and calculate daily statistics on the fly, Thinkpadle leverages the raw power of PostgreSQL. We implemented custom SQL Triggers in Supabase. Whenever a game result is submitted, the database automatically processes the data in the background-incrementing total wins, tracking surrenders, and building a JSONB object for the tries distribution. This means the frontend receives pre-calculated, ready-to-display community stats instantly.

All the high-quality laptop images are securely stored and served via **Supabase Storage Buckets**, ensuring fast delivery and clean separation of assets from the raw database records.

### Game Logic: Time & Memory

Thinkpadle is a global game, which means everyone needs to be playing the same "day." To prevent timezone exploits, the daily reset logic is hardcoded to the `America/New_York` timezone. No matter where you are in the world, the new ThinkPad unlocks at the exact same moment.

To maintain the game state and prevent players from simply refreshing their browser to get their tries back, the app utilizes local storage. A unique, anonymous player ID and the current game state (including the exact guesses and surrender status) are saved locally. This ensures a persistent and fair daily experience without forcing users to create accounts.

---

## Deployment, SEO & Analytics

A great game is nothing if people cannot find it or share it. That is why Thinkpadle is deployed on **Vercel**, providing lightning-fast edge delivery and seamless CI/CD integration directly from the repository. To monitor the game's growth, traffic sources, and player retention without invading user privacy, the project utilizes **Vercel Analytics**.

Search visibility is proactively managed through **Google Search Console**, ensuring the daily puzzle is properly indexed and discoverable by tech enthusiasts. Furthermore, to maximize organic reach through word-of-mouth, the application implements robust **Open Graph (OG)** tags. When players share their daily results or the game link on platforms like Discord, Twitter, or iMessage, the OG configuration renders a premium, custom preview card rather than a plain text link.

---

## Database Schema

The backend architecture is clean and highly relational, designed to support both the core game loop and detailed analytics.

<img width="1179" height="743" alt="image" src="https://github.com/user-attachments/assets/d939821b-ec5b-4fb0-bc92-61b2fc1b5f31" />

* **`models`**: The master dictionary containing all ThinkPad specifications and image URLs.
* **`daily_challenges`**: Links a specific calendar date to a target model from the dictionary.
* **`game_results`**: Stores raw, individual logs of every completed game (player ID, number of tries, win/loss status).
* **`daily_summary`**: The aggregated analytics table, updated in real-time by SQL triggers, providing instant data for the community charts.
