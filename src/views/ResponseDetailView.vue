<template>
  <div class="min-h-screen binds-bg p-6">
    <div class="mx-auto w-full max-w-3xl binds-card p-6">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 class="text-xl font-bold">Detalhe da resposta</h1>

          <div v-if="record" class="mt-2 space-y-1 text-sm text-gray-600">
            <p>
              <span class="font-semibold">ID:</span>
              <span class="font-mono">{{ record.id }}</span>
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
          <RouterLink to="/responses" class="btn btn-secondary">
            Voltar
          </RouterLink>

          <RouterLink
            v-if="record"
            :to="`/responses/${record.id}/edit`"
            class="btn btn-primary"
          >
            Editar
          </RouterLink>

          <button
            v-if="record"
            type="button"
            class="btn btn-danger"
            @click="excluir"
          >
            Excluir
          </button>
        </div>
      </div>

      <div
        v-if="!record"
        class="mt-6 rounded-xl bg-white p-4 text-sm text-gray-700 border border-gray-200"
      >
        Resposta não encontrada.
      </div>

      <div v-else class="mt-6 space-y-4">
        <div class="rounded-2xl border border-gray-200 bg-white p-4">
          <h2 class="text-sm font-semibold text-gray-700">Respostas</h2>

          <div class="mt-3 grid gap-3 text-sm">
            <div>
              <span class="font-semibold">Humor:</span>
              {{ traduzirHumor(record.answers.mood) }}
            </div>

            <div>
              <span class="font-semibold">Nota (CSAT):</span>
              {{ record.answers.csat ?? '-' }}
            </div>

            <div>
              <span class="font-semibold">E-mail:</span>
              {{ record.answers.email ? record.answers.email : 'Não informado' }}
            </div>

            <div>
              <span class="font-semibold">Próximo recurso:</span>
              {{ traduzirRecurso(record.answers.feature) }}
            </div>

            <div>
              <span class="font-semibold">Comentário:</span>
              {{ record.answers.comment ? record.answers.comment : 'Sem comentário' }}
            </div>
          </div>
        </div>

        <div class="text-sm">
          <RouterLink to="/responses" class="link">
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
</script>