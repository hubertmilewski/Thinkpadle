export const siteContent = {
  metadata: {
    description:
      "A daily puzzle game for Lenovo laptop fans. Guess today's ThinkPad model based on its specifications.",
    keywords: [
      "ThinkPad",
      "Lenovo",
      "Thinkpadle",
      "Wordle",
      "laptop game",
      "tech puzzle",
    ],
    author: "Hubert Milewski",
  },
  header: {
    title: "Thinkpadle",
    subtitle: "Guess today's model",
  },
  search: {
    placeholder: "Enter model (e.g., T420)...",
    button: "GUESS",
  },
  table: {
    headers: ["Model", "Series", "Gen", "Year", "Screen", "Weight"],
  },
  messages: {
    notFound: "Model not found in database!",
    alreadyGuessed: "You already guessed this model!",
    win: "You guessed it! It is",
  },
  winCard: {
    title: "Congratulations!",
    subtitle: "You guessed",
    tries: "Number of tries: ",
    nextModel: "Next ThinkPad in",
    share: "Share Result",
    copied: "Copied to clipboard!",
    getYesterdaysModel: "Yesterdays answer:",
    stats: {
      guesserNumber1: "You are the ",
      guesserNumber2: " person to guess today's ThinkPad",
      surrendersLabel: " players gave up today",
      percentile2: "% of players",
      charttitle: "Number of samples",
      percentile1: "You were faster than ",
    },
    shareTemplate: {
      gameName: "Thinkpadle",
      url: "https://thinkpadle.com",
    },
    imageCredit: "Image credit: ",
  },
  loseCard: {
    subtitle: "You failed to guess today's model",
    comeBackText: "COME BACK ",
    comeBackHighlight: "TOMORROW",
    findOut: "To find out the answer",
    stats: {
      playersGuessed: " players guessed it today",
      gaveUp1: "You gave up after ",
      gaveUp2: " tries",
      surrendersLabel: " players gave up today",
    },
    imageCredit: "Image credit: ",
  },
  howToPlay: {
    title: "How To Play",
    subtitle: "Guess the ThinkPad in as few tries as possible.",
    rules: [
      "Each guess must be a valid model from the list.",
      "The color of the tiles and arrows will change to show how close your guess was to the target model.",
    ],
    examples: {
      title: "Examples",
      correct: "is in the correct spot.",
      wrong: "is incorrect.",
      higher: "The target value is higher.",
      lower: "The target value is lower.",
    },
    button: "Start Playing",
  },
  footer: {
    copyrightHighlight: "NOT AFFILIATED",
    copyright: "WITH LENOVO.",
    contact: "contact@thinkpadle.com",
    privacyPolicy: {
      label: "Privacy Policy",
      text1: "We use ",
      highlight: "LocalStorage",
      text2:
        " only to save your game progress and statistics. No data ever leaves your device. No cookies, no tracking.",
    },
  },
  modals: {
    ranking: {
      title: "Leaderboard",
      subtitle: "Coming Soon",
      info: "Feature in development",
      button: "Back to game",
    },
    settings: {
      title: "Settings",
      subtitle: "Coming Soon",
      info: "Feature in development",
      button: "Back to game",
    },
  },
} as const;