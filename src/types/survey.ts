export type Humor = 'terrible' | 'bad' | 'ok' | 'good' | 'great';

export type EscolhaDeRecurso = 'featureA' | 'featureB' | 'featureC';

export type RespostasDaPesquisa = {
  mood: Humor | null;               // obrigatório
  csat: number | null;              // obrigatório (1-5)
  email: string;                    // opcional
  feature: EscolhaDeRecurso | null; // opcional
  comment: string;                  // opcional
};

export const defaultSurveyAnswers = (): RespostasDaPesquisa => ({
  mood: null,
  csat: null,
  email: '',
  feature: null,
  comment: '',
});