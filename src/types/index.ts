export type ComparisonStatus = 'correct' | 'incorrect' | 'higher' | 'lower';

export interface ModelData {
  model: string;
  series: string;
  generation: number;
  year: number;
  screen: number;
  weight: number;
  image_url: string;
}

export interface GuessResult {
  data: ModelData;
  status: {
    model: ComparisonStatus;
    series: ComparisonStatus;
    generation: ComparisonStatus;
    year: ComparisonStatus;
    screen: ComparisonStatus;
    weight: ComparisonStatus;
  };
}