<template>
  <div class="min-h-screen bg-violet-50 p-6">
    <div class="mx-auto w-full max-w-4xl">
      <div class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 class="text-2xl font-extrabold text-slate-900">Detalhe da resposta</h1>

            <div v-if="record" class="mt-3 space-y-1 text-sm text-slate-600">
              <p>
                ID: <span class="font-mono text-slate-800">{{ record.id }}</span>
              </p>

              <p>
                <span class="font-semibold">Criada em:</span>
                {{ formatarData(record.createdAt) }}
              </p>

              <p v-if="record.updatedAt">
                <span class="font-semibold">Atualizada em:</span>
                {{ formatarData(record.updatedAt) }}
              </p>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <RouterLink
              to="/responses"
              class="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Voltar
            </RouterLink>

            <RouterLink
              v-if="record"
              :to="`/responses/${record.id}/edit`"
              class="rounded-2xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
            >
              Editar
            </RouterLink>

            <button
              v-if="record"
              type="button"
              class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100"
              @click="excluir"
            >
              Excluir
            </button>
          </div>
        </div>
      </div>

      <div
        v-if="!record"
        class="mt-6 rounded-3xl bg-white p-6 text-sm text-slate-700 shadow-sm ring-1 ring-black/5"
      >
        Resposta não encontrada.
      </div>

      <div v-else class="mt-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
        <h2 class="text-sm font-semibold text-slate-700">Respostas</h2>

        <div class="mt-4 grid gap-3 text-sm text-slate-800">
          <div>
            <span class="font-semibold">Humor:</span>
            {{ traduzirHumor(record.answers.mood) }}
          </div>

          <div>
            <span class="font-semibold">Nota (CSAT):</span>
            {{ record.answers.csat ?? '-' }}
          </div>

          <div class="break-words">
            <span class="font-semibold">E-mail:</span>
            {{ record.answers.email ? record.answers.email : 'Não informado' }}
          </div>

          <div>
            <span class="font-semibold">Próximo recurso:</span>
            {{ traduzirRecurso(record.answers.feature) }}
          </div>

          <div class="break-words">
            <span class="font-semibold">Comentário:</span>
            {{ record.answers.comment ? record.answers.comment : 'Sem comentário' }}
          </div>
        </div>

        <div class="mt-6">
          <RouterLink to="/responses" class="text-sm font-semibold text-violet-700 hover:underline">
            ← Voltar para a lista
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { obterResposta, removerResposta } from '../services/storage';
import type { Mood, FeatureChoice } from '../types/survey';

const route = useRoute();
const router = useRouter();

const id = computed(() => String(route.params.id ?? ''));

const record = computed(() => {
  if (!id.value) return null;
  return obterResposta(id.value);
});

function excluir() {
  if (!record.value) return;

  const ok = confirm('Tem certeza que deseja excluir esta resposta?');
  if (!ok) return;

  removerResposta(record.value.id);
  router.push('/responses');
}

function formatarData(iso: string) {
  try {
    return new Date(iso).toLocaleString('pt-BR');
  } catch {
    return iso;
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
</script>