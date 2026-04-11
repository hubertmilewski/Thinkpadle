export const TRANSITION_SETTINGS = {
  type: "tween",
  ease: [0.32, 0.72, 0, 1],
  duration: 0.4,
} as const;

export const MOBILE_DRAWER_VARIANTS = {
  initial: { y: "100%", opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: "100%", opacity: 0 },
};

export const DESKTOP_MODAL_VARIANTS = {
  initial: { scale: 0.95, y: 10, opacity: 0 },
  animate: { scale: 1, y: 0, opacity: 1 },
  exit: { scale: 0.95, y: 10, opacity: 0 },
};
