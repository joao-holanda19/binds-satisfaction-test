import type { SurveyAnswers } from '../types/Survey';

const CHAVE_STORAGE = 'pesquisa_satisfacao_respostas';

export type SurveyRecord = SurveyAnswers & {
  id: string;
  criadoEm: string; // ISO
};

export function listarRespostas(): SurveyRecord[] {
  const raw = localStorage.getItem(CHAVE_STORAGE);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as SurveyRecord[];
  } catch {
    return [];
  }
}

export function salvarResposta(answers: SurveyAnswers): SurveyRecord {
  const record: SurveyRecord = {
    ...answers,
    id: crypto.randomUUID(),
    criadoEm: new Date().toISOString(),
  };

  const lista = listarRespostas();
  lista.unshift(record); // mais recente primeiro
  localStorage.setItem(CHAVE_STORAGE, JSON.stringify(lista));

  return record;
}

export function limparRespostas(): void {
  localStorage.removeItem(CHAVE_STORAGE);
}