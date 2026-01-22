<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="mx-auto w-full max-w-3xl rounded-2xl bg-white p-6 shadow">
      <div class="flex items-center justify-between gap-3">
        <h1 class="text-xl font-bold">Respostas salvas</h1>

        <div class="flex gap-2">
          <button
            type="button"
            class="rounded-xl border border-gray-300 px-4 py-2"
            @click="atualizar"
          >
            Atualizar
          </button>

          <button
            type="button"
            class="rounded-xl bg-black px-4 py-2 text-white"
            @click="limpar"
          >
            Limpar tudo
          </button>
        </div>
      </div>

      <p class="mt-2 text-sm text-gray-600">
        Total: <span class="font-semibold">{{ respostas.length }}</span>
      </p>

      <div v-if="respostas.length === 0" class="mt-6 rounded-xl bg-gray-50 p-4 text-sm text-gray-700">
        Nenhuma resposta salva ainda.
      </div>

      <div v-else class="mt-6 space-y-3">
        <div
          v-for="r in respostas"
          :key="r.id"
          class="rounded-2xl border border-gray-200 p-4"
        >
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div class="text-sm text-gray-600">
              <span class="font-semibold">Data:</span>
              {{ formatarData(r.criadoEm) }}
            </div>
            <div class="text-sm text-gray-600">
              <span class="font-semibold">Nota:</span> {{ r.csat ?? '-' }}
              • <span class="font-semibold">Humor:</span> {{ traduzirHumor(r.mood) }}
            </div>
          </div>

          <div class="mt-3 grid gap-2 text-sm">
            <div>
              <span class="font-semibold">E-mail:</span>
              {{ r.email ? r.email : 'Não informado' }}
            </div>

            <div>
              <span class="font-semibold">Próximo recurso:</span>
              {{ traduzirRecurso(r.feature) }}
            </div>

            <div>
              <span class="font-semibold">Comentário:</span>
              {{ r.comment ? r.comment : 'Sem comentário' }}
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8">
        <RouterLink to="/" class="text-sm text-blue-600 hover:underline">
          ← Voltar para o início
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { listarRespostas, limparRespostas } from '../services/storage';
import type { SurveyRecord } from '../services/storage';

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

function formatarData(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleString('pt-BR');
  } catch {
    return iso;
  }
}

function traduzirHumor(mood: SurveyRecord['mood']) {
  if (!mood) return '-';
  const mapa: Record<string, string> = {
    terrible: 'Muito insatisfeito',
    bad: 'Insatisfeito',
    ok: 'Indiferente',
    good: 'Satisfeito',
    great: 'Muito satisfeito',
  };
  return mapa[mood] ?? mood;
}

function traduzirRecurso(f: SurveyRecord['feature']) {
  if (!f) return 'Não selecionado';
  const mapa: Record<string, string> = {
    featureA: 'Recurso A',
    featureB: 'Recurso B',
    featureC: 'Recurso C',
  };
  return mapa[f] ?? f;
}

onMounted(() => {
  atualizar();
});
</script>