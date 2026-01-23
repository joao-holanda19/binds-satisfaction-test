<template>
  <div class="min-h-screen binds-bg p-6">
    <div class="mx-auto w-full max-w-3xl">
      <!-- Header -->
      <div class="binds-card p-6">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 class="text-2xl font-bold">Respostas salvas</h1>
            <p class="mt-1 text-sm text-gray-600">
              Consulte, edite ou exclua respostas da pesquisa.
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
              :class="respostas.length === 0 ? 'opacity-50' : ''"
              @click="limpar"
            >
              Limpar tudo
            </button>
          </div>
        </div>

        <div class="mt-4 text-sm text-gray-600">
          Total: <span class="font-semibold">{{ respostas.length }}</span>
        </div>
      </div>

      <!-- Empty -->
      <div
        v-if="respostas.length === 0"
        class="mt-4 binds-card p-6 text-sm text-gray-700"
      >
        Nenhuma resposta salva ainda.
        <div class="mt-4">
          <RouterLink to="/p/default" class="btn btn-primary">
            Iniciar pesquisa
          </RouterLink>
        </div>
      </div>

      <!-- List -->
      <div v-else class="mt-4 space-y-3">
        <div
          v-for="r in respostas"
          :key="r.id"
          class="binds-card p-5"
        >
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div class="text-sm text-gray-600">
                <span class="font-semibold">Data:</span> {{ formatarData(r.createdAt) }}
              </div>

              <div class="mt-1 text-sm text-gray-600">
                <span class="font-semibold">Nota:</span> {{ r.answers.csat ?? '-' }}
                <span class="mx-2 text-gray-300">•</span>
                <span class="font-semibold">Humor:</span> {{ traduzirHumor(r.answers.mood) }}
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-2">
              <RouterLink
  :to="`/responses/${r.id}`"
  class="btn btn-secondary"
>
  Ver
</RouterLink>

<RouterLink
  :to="`/responses/${r.id}/edit`"
  class="btn btn-primary"
>
  Editar
</RouterLink>

<button
  type="button"
  class="btn btn-secondary border-red-300 text-red-700 hover:bg-red-50"
  @click="excluir(r.id)"
>
  Excluir
</button>
            </div>
          </div>

          <div class="mt-4 grid gap-2 text-sm text-gray-700">
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

      <!-- Footer -->
      <div class="mt-6 flex flex-wrap items-center justify-between gap-3">
        <RouterLink to="/" class="link text-sm">
          ← Voltar para o início
        </RouterLink>

        <RouterLink to="/p/default" class="btn btn-primary">
          Nova pesquisa
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
    const d = new Date(iso);
    return d.toLocaleString('pt-BR');
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