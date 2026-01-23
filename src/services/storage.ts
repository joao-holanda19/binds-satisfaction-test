import type { SurveyAnswers } from '../types/survey';

export type SurveyRecord = {
  id: string;
  createdAt: string; // ISO
  updatedAt?: string; // ISO (quando editar)
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
  // mais recente primeiro (usa updatedAt se existir, senão createdAt)
  return readAll().sort((a, b) => {
    const da = a.updatedAt ?? a.createdAt;
    const db = b.updatedAt ?? b.createdAt;
    return da < db ? 1 : -1;
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
    ...existing,
    answers,
    updatedAt: new Date().toISOString(),
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