import type { SurveyAnswers } from '../types/survey';

export type SurveyRecord = {
  id: string;
  createdAt: string; // ISO
  updatedAt?: string; // ISO (opcional)
  answers: SurveyAnswers;
};

const STORAGE_KEY = 'binds_satisfaction_responses_v1';

function readAll(): SurveyRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SurveyRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(list: SurveyRecord[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function listarRespostas(): SurveyRecord[] {
  // mais recente primeiro (prioriza updatedAt, senão createdAt)
  return readAll().sort((a, b) => {
    const aDate = a.updatedAt ?? a.createdAt;
    const bDate = b.updatedAt ?? b.createdAt;
    return aDate < bDate ? 1 : -1;
  });
}

export function obterResposta(id: string): SurveyRecord | null {
  const list = readAll();
  return list.find((r) => r.id === id) ?? null;
}

export function salvarResposta(answers: SurveyAnswers): SurveyRecord {
  const record: SurveyRecord = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    answers,
  };

  const list = readAll();
  list.unshift(record);
  writeAll(list);

  return record;
}

export function atualizarResposta(id: string, answers: SurveyAnswers): SurveyRecord | null {
  const list = readAll();
  const idx = list.findIndex((r) => r.id === id);
  if (idx === -1) return null;

  const existing = list[idx];
  if (!existing) return null;

  const updated: SurveyRecord = {
    ...existing,              // mantém id, createdAt e qualquer campo futuro
    answers,                  // atualiza respostas
    updatedAt: new Date().toISOString(), // marca atualização
  };

  list[idx] = updated;
  writeAll(list);
  return updated;
}

export function removerResposta(id: string): boolean {
  const list = readAll();
  const next = list.filter((r) => r.id !== id);
  if (next.length === list.length) return false;
  writeAll(next);
  return true;
}

export function limparRespostas() {
  localStorage.removeItem(STORAGE_KEY);
}