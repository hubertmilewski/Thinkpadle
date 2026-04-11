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
  howToPlayDaily: {
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
  howToPlaySurvival: {
    title: "Survival Mode",
    subtitle: "How many ThinkPads can you identify in a row?",
    rules: [
      "Identify the ThinkPad model shown in the photo.",
      "The models are selected randomly from our entire database.",
      "One wrong guess ends your streak instantly.",
      "No hints or arrows are provided in this mode.",
    ],
    examples: {
      title: "Goal",
      desc: "Build the longest identification streak to climb the leaderboard!",
    },
    button: "Let's Go!",
  },
  ranking: {
    title: "Ranking",
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
      button: "Back to game",
    },
    settings: {
      title: "Settings",
      subtitle: "Customize your profile",
      nicknameLabel: "Nickname",
      avatarLabel: "Avatar (URL/File)",
      updateButton: "Save Changes",
      logoutButton: "Log Out",
    },
  },
  auth: {
    tabs: {
      login: "Login",
      register: "Register",
    },
    githubButton: "Continue with GitHub",
    orDivider: "or",
    emailLabel: "Email address",
    emailPlaceholder: "you@example.com",
    passwordLabel: "Password",
    passwordPlaceholder: "••••••••",
    nicknameLabel: "Nickname",
    nicknamePlaceholder: "CoolThinkpadUser",
    avatarLabel: "Avatar Image",
    loginSubmit: "Sign In",
    registerSubmit: "Create Account",
    errors: {
      general: "An error occurred. Please try again.",
      invalidEmail: "Invalid email address.",
      weakPassword: "Password should be at least 6 characters.",
      missingNickname: "Nickname is required.",
    },
  },
} as const;
