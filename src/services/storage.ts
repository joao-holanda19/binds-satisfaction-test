import type { SurveyAnswers } from '../types/survey';

export type SurveyRecord = {
  id: string;
  createdAt: string; // ISO
  updatedAt?: string; // ISO (opcional)
  answers: SurveyAnswers;
};

const STORAGE_KEY = 'binds_satisfaction_responses_v1';

// ---------- helpers ----------
function safeParseJSON<T>(raw: string): T | null {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

function ensureISO(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const t = Date.parse(value);
  return Number.isFinite(t) ? new Date(t).toISOString() : null;
}

function safeUUID(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  // fallback simples 
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function normalizeRecord(raw: unknown): SurveyRecord | null {
  if (!isObject(raw)) return null;

  const id = typeof raw.id === 'string' ? raw.id : null;
  const createdAt = ensureISO(raw.createdAt);
  const updatedAt = raw.updatedAt === undefined ? undefined : ensureISO(raw.updatedAt) ?? undefined;

  const answers = isObject(raw.answers) ? (raw.answers as SurveyAnswers) : null;

  if (!id || !createdAt || !answers) return null;

  return { id, createdAt, updatedAt, answers };
}

function readAll(): SurveyRecord[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  const parsed = safeParseJSON<unknown>(raw);
  if (!Array.isArray(parsed)) return [];

  const normalized = parsed
    .map(normalizeRecord)
    .filter((r): r is SurveyRecord => Boolean(r));

  return normalized;
}

function writeAll(list: SurveyRecord[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function sortByMostRecent(list: SurveyRecord[]) {
  return [...list].sort((a, b) => {
    const da = Date.parse(a.updatedAt ?? a.createdAt);
    const db = Date.parse(b.updatedAt ?? b.createdAt);
    return db - da; // mais recente primeiro
  });
}

// ---------- API ----------
export function listarRespostas(): SurveyRecord[] {
  return sortByMostRecent(readAll());
}

export function obterResposta(id: string): SurveyRecord | null {
  return readAll().find((r) => r.id === id) ?? null;
}

export function salvarResposta(answers: SurveyAnswers): SurveyRecord {
  const now = new Date().toISOString();

  const record: SurveyRecord = {
    id: safeUUID(),
    createdAt: now,
    updatedAt: now, // ok manter: facilita “Data” refletir criação imediatamente
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

  const existing = list[idx]!;
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