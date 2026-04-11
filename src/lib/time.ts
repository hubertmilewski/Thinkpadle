export const RESET_HOUR_NY = 12;

export function getNYTime() {
  const now = new Date();
  return new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
}

export function calculateEffectiveDate(): string {
  const nyTime = getNYTime();
  const offsetTime = new Date(nyTime.getTime() - 12 * 60 * 60 * 1000);

  return offsetTime.toISOString().split('T')[0];
}

export function getTimeUntilNextReset() {
  const nyTime = getNYTime();
  const target = new Date(nyTime);

  target.setHours(RESET_HOUR_NY, 0, 0, 0);

  if (nyTime.getHours() >= RESET_HOUR_NY) {
    target.setDate(target.getDate() + 1);
  }

  return target.getTime() - nyTime.getTime();
}