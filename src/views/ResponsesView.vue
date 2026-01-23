<template>
  <div class="min-h-screen bg-violet-50 p-6">
    <div class="mx-auto w-full max-w-4xl">
      <!-- Header -->
      <div class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 class="text-2xl font-extrabold text-slate-900">Respostas salvas</h1>
            <p class="mt-1 text-sm text-slate-600">
              Total: <span class="font-semibold">{{ respostas.length }}</span>
            </p>
          </div>

          <div class="flex flex-wrap gap-2">
            <button
              type="button"
              class="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              @click="atualizar"
            >
              Atualizar
            </button>

            <button
              type="button"
              class="rounded-2xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
              :disabled="respostas.length === 0"
              @click="limpar"
            >
              Limpar tudo
            </button>

            <RouterLink
              to="/"
              class="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Início
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- Empty -->
      <div
        v-if="respostas.length === 0"
        class="mt-6 rounded-3xl bg-white p-6 text-sm text-slate-700 shadow-sm ring-1 ring-black/5"
      >
        Nenhuma resposta salva ainda.
      </div>

      <!-- List -->
      <div v-else class="mt-6 space-y-4">
        <div
          v-for="r in respostas"
          :key="r.id"
          class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5"
        >
          <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div class="min-w-0">
              <div class="text-sm text-slate-600">
                <span class="font-semibold">Criada em:</span>
                {{ formatarData(r.createdAt) }}
              </div>

              <div class="mt-1 text-sm text-slate-600" v-if="r.updatedAt">
                <span class="font-semibold">Última atualização:</span>
                {{ timeAgo(r.updatedAt) }}
              </div>

              <div class="mt-3 text-sm text-slate-700">
                <span class="font-semibold">Nota:</span> {{ r.answers.csat ?? '-' }}
                <span class="mx-2 text-slate-300">•</span>
                <span class="font-semibold">Humor:</span> {{ traduzirHumor(r.answers.mood) }}
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-2">
              <RouterLink
                :to="`/responses/${r.id}`"
                class="rounded-2xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
              >
                Ver
              </RouterLink>

              <RouterLink
                :to="`/responses/${r.id}/edit`"
                class="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Editar
              </RouterLink>

              <button
                type="button"
                class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100"
                @click="excluir(r.id)"
              >
                Excluir
              </button>
            </div>
          </div>

          <div class="mt-4 grid gap-2 text-sm text-slate-700">
            <div class="truncate">
              <span class="font-semibold">E-mail:</span>
              {{ r.answers.email ? r.answers.email : 'Não informado' }}
            </div>

            <div>
              <span class="font-semibold">Próximo recurso:</span>
              {{ traduzirRecurso(r.answers.feature) }}
            </div>

            <div class="break-words">
              <span class="font-semibold">Comentário:</span>
              {{ r.answers.comment ? r.answers.comment : 'Sem comentário' }}
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8">
        <RouterLink to="/" class="text-sm font-semibold text-violet-700 hover:underline">
          ← Voltar para o início
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { listarRespostas, limparRespostas, removerResposta } from '../services/storage';
import type { SurveyRecord } from '../services/storage';
import type { Mood, FeatureChoice } from '../types/survey';

const respostas = ref<SurveyRecord[]>([]);

function atualizar() {
  respostas.value = listarRespostas();
}

function limpar() {
  const ok = confirm('Tem certeza que deseja apagar todas as respostas salvas?');
  if (!ok) return;
  limparRespostas();
  atualizar();
}

function excluir(id: string) {
  const ok = confirm('Tem certeza que deseja excluir esta resposta?');
  if (!ok) return;
  removerResposta(id);
  atualizar();
}

function formatarData(iso: string) {
  try {
    return new Date(iso).toLocaleString('pt-BR');
  } catch {
    return iso;
  }
}

function timeAgo(iso: string) {
  try {
    const now = Date.now();
    const t = new Date(iso).getTime();
    const diff = Math.max(0, now - t);

    const s = Math.floor(diff / 1000);
    if (s < 60) return `há ${s} segundo${s === 1 ? '' : 's'}`;

    const m = Math.floor(s / 60);
    if (m < 60) return `há ${m} minuto${m === 1 ? '' : 's'}`;

    const h = Math.floor(m / 60);
    if (h < 24) return `há ${h} hora${h === 1 ? '' : 's'}`;

    const d = Math.floor(h / 24);
    return `há ${d} dia${d === 1 ? '' : 's'}`;
  } catch {
    return formatarData(iso);
  }
}

function traduzirHumor(mood: Mood | null) {
  if (!mood) return '-';
  const mapa: Record<Mood, string> = {
    terrible: 'Muito insatisfeito',
    bad: 'Insatisfeito',
    ok: 'Indiferente',
    good: 'Satisfeito',
    great: 'Muito satisfeito',
  };
  return mapa[mood];
}

function traduzirRecurso(f: FeatureChoice | null) {
  if (!f) return 'Não selecionado';
  const mapa: Record<FeatureChoice, string> = {
    featureA: 'Recurso A',
    featureB: 'Recurso B',
    featureC: 'Recurso C',
  };
  return mapa[f];
}

onMounted(() => {
  atualizar();
});
</script>