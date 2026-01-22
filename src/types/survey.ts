// src/types/Survey.ts
export type Mood = 'terrible' | 'bad' | 'ok' | 'good' | 'great';

export type FeatureChoice = 'featureA' | 'featureB' | 'featureC';

export type SurveyAnswers = {
  mood: Mood | null; // obrigatório
  csat: number | null; // obrigatório (1-5)
  email: string; // opcional
  feature: FeatureChoice | null; // opcional
  comment: string; // opcional
};

export const defaultSurveyAnswers = (): SurveyAnswers => ({
  mood: null,
  csat: null,
  email: '',
  feature: null,
  comment: '',
});