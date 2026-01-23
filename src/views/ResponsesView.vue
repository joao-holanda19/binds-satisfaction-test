<template>
  <div class="min-h-screen binds-bg p-6">
    <div class="mx-auto w-full max-w-3xl binds-card p-6">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 class="text-xl font-bold">Respostas salvas</h1>
          <p class="mt-1 text-sm text-gray-600">
            Total: <span class="font-semibold">{{ respostas.length }}</span>
          </p>
        </div>

        <div class="flex flex-wrap gap-2">
          <button type="button" class="btn btn-secondary" @click="atualizar">
            Atualizar
          </button>

          <button
            type="button"
            class="btn btn-primary"
            :disabled="respostas.length === 0"
            @click="limpar"
          >
            Limpar tudo
          </button>
        </div>
      </div>

      <div
        v-if="respostas.length === 0"
        class="mt-6 rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-700"
      >
        Nenhuma resposta salva ainda.
      </div>

      <div v-else class="mt-6 space-y-3">
        <div
          v-for="r in respostas"
          :key="r.id"
          class="rounded-2xl border border-gray-200 bg-white p-4"
        >
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div class="min-w-[220px]">
              <div class="text-sm text-gray-700">
                <span class="font-semibold">Criada em:</span> {{ formatarData(r.createdAt) }}
              </div>
              <div v-if="r.updatedAt" class="text-sm text-gray-700">
                <span class="font-semibold">Atualizada em:</span> {{ formatarData(r.updatedAt) }}
              </div>

              <div class="mt-2 text-xs text-gray-500">
                ID: <span class="font-mono">{{ r.id }}</span>
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-2">
              <!-- Badges -->
              <span class="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs">
                <span class="font-semibold">Nota:</span> {{ r.answers.csat ?? '-' }}
              </span>

              <span class="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs">
                <span class="font-semibold">Humor:</span> {{ traduzirHumor(r.answers.mood) }}
              </span>

              <!-- Actions -->
              <RouterLink :to="`/responses/${r.id}`" class="btn btn-secondary px-3 py-1">
                Ver
              </RouterLink>

              <RouterLink :to="`/responses/${r.id}/edit`" class="btn btn-secondary px-3 py-1">
                Editar
              </RouterLink>

              <button
                type="button"
                class="btn btn-secondary px-3 py-1 border-red-200 text-red-700 hover:bg-red-50"
                @click="excluir(r.id)"
              >
                Excluir
              </button>
            </div>
          </div>

          <div class="mt-3 grid gap-2 text-sm text-gray-800">
            <div>
              <span class="font-semibold">E-mail:</span>
              {{ r.answers.email ? r.answers.email : 'Não informado' }}
            </div>

            <div>
              <span class="font-semibold">Próximo recurso:</span>
              {{ traduzirRecurso(r.answers.feature) }}
            </div>

            <div>
              <span class="font-semibold">Comentário:</span>
              {{ r.answers.comment ? r.answers.comment : 'Sem comentário' }}
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8">
        <RouterLink to="/" class="link text-sm">← Voltar para o início</RouterLink>
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