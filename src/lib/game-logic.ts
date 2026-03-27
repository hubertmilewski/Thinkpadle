import { ModelData, GuessResult, ComparisonStatus } from '@/types/index';

function compareNumeric(guessValue: number, targetValue: number): ComparisonStatus {
  if (guessValue === targetValue) return 'correct';
  return guessValue < targetValue ? 'higher' : 'lower';
}

export function evaluateGuess(guess: ModelData, target: ModelData): GuessResult {
  return {
    data: guess,
    status: {
      model: guess.model === target.model ? 'correct' : 'incorrect',
      series: guess.series === target.series ? 'correct' : 'incorrect',
      generation: compareNumeric(guess.generation, target.generation),
      year: compareNumeric(guess.year, target.year),
      screen: compareNumeric(guess.screen, target.screen),
      weight: compareNumeric(guess.weight, target.weight),
    },
  };
}