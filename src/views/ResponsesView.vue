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
            :disabled="respostas.length === 0"
            :class="respostas.length === 0 ? 'opacity-50' : ''"
            @click="limpar"
          >
            Limpar tudo
          </button>
        </div>
      </div>

      <p class="mt-2 text-sm text-gray-600">
        Total: <span class="font-semibold">{{ respostas.length }}</span>
      </p>

      <div
        v-if="respostas.length === 0"
        class="mt-6 rounded-xl bg-gray-50 p-4 text-sm text-gray-700"
      >
        Nenhuma resposta salva ainda.
      </div>

      <div v-else class="mt-6 space-y-3">
        <div
          v-for="r in respostas"
          :key="r.id"
          class="rounded-2xl border border-gray-200 p-4"
        >
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="text-sm text-gray-600">
              <div>
                <span class="font-semibold">Criada em:</span>
                {{ formatarData(r.createdAt) }}
              </div>

              <div class="mt-1 text-xs text-gray-500">
                <span v-if="r.updatedAt">
                  <span class="font-semibold">Última atualização:</span>
                  {{ tempoRelativo(r.updatedAt) }}
                </span>
                <span v-else>
                  <span class="font-semibold">Criada:</span>
                  {{ tempoRelativo(r.createdAt) }}
                </span>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <RouterLink
                :to="`/responses/${r.id}`"
                class="rounded-lg border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50"
              >
                Ver
              </RouterLink>

              <RouterLink
                :to="`/responses/${r.id}/edit`"
                class="rounded-lg border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50"
              >
                Editar
              </RouterLink>

              <button
                type="button"
                class="rounded-lg border border-red-200 px-3 py-1 text-sm text-red-700 hover:bg-red-50"
                @click="excluir(r.id)"
              >
                Excluir
              </button>
            </div>
          </div>

          <div class="mt-2 text-sm text-gray-600">
            <span class="font-semibold">Nota:</span> {{ r.answers.csat ?? '-' }}
            • <span class="font-semibold">Humor:</span>
            {{ traduzirHumor(r.answers.mood) }}
          </div>

          <div class="mt-3 grid gap-2 text-sm">
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
        <RouterLink to="/" class="text-sm text-blue-600 hover:underline">
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
    const d = new Date(iso);
    return d.toLocaleString('pt-BR');
  } catch {
    return iso;
  }
}

// "há X" em português (simples e suficiente pro projeto)
function tempoRelativo(iso: string) {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return '-';

  const diffMs = Date.now() - t;
  const sec = Math.floor(diffMs / 1000);
  const min = Math.floor(sec / 60);
  const hr = Math.floor(min / 60);
  const day = Math.floor(hr / 24);

  if (sec < 10) return 'agora';
  if (sec < 60) return `há ${sec} segundos`;
  if (min < 60) return `há ${min} minuto${min === 1 ? '' : 's'}`;
  if (hr < 24) return `há ${hr} hora${hr === 1 ? '' : 's'}`;
  return `há ${day} dia${day === 1 ? '' : 's'}`;
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