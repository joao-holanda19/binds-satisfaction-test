<template>
  <div class="min-h-screen binds-bg p-6">
    <div class="mx-auto w-full max-w-3xl">
      <div class="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 class="text-xl font-bold">Editar resposta</h1>

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
            Voltar para a lista
          </RouterLink>

          <RouterLink
            v-if="record"
            :to="`/responses/${record.id}`"
            class="btn btn-primary"
          >
            Ver detalhe
          </RouterLink>
        </div>
      </div>

      <div v-if="notFound" class="binds-card p-6">
        <p class="text-sm text-gray-700">Não foi possível encontrar essa resposta.</p>
        <div class="mt-4">
          <RouterLink to="/responses" class="link text-sm">
            ← Voltar para as respostas
          </RouterLink>
        </div>
      </div>

      <div v-else>
        <SurveyForm
          v-if="initialAnswers"
          titulo="Editar pesquisa"
          rotulo-enviar="Salvar alterações"
          :initial-answers="initialAnswers"
          :is-submitting="isSubmitting"
          :submitted-message="saved ? 'Alterações salvas com sucesso ✅' : ''"
          @submit="onSubmit"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import SurveyForm from '../components/SurveyForm.vue';
import type { SurveyAnswers } from '../types/survey';
import { obterResposta, atualizarResposta } from '../services/storage';
import type { SurveyRecord } from '../services/storage';

const route = useRoute();
const router = useRouter();

const id = computed(() => String(route.params.id || ''));

const record = ref<SurveyRecord | null>(null);
const initialAnswers = ref<SurveyAnswers | null>(null);

const notFound = ref(false);
const isSubmitting = ref(false);
const saved = ref(false);

function formatarData(iso: string) {
  try {
    return new Date(iso).toLocaleString('pt-BR');
  } catch {
    return iso;
  }
}

onMounted(() => {
  const r = obterResposta(id.value);
  if (!r) {
    notFound.value = true;
    return;
  }
  record.value = r;

  initialAnswers.value = JSON.parse(JSON.stringify(r.answers)) as SurveyAnswers;
});

async function onSubmit(payload: SurveyAnswers) {
  saved.value = false;
  isSubmitting.value = true;

  try {
    const updated = atualizarResposta(id.value, payload);
    if (!updated) {
      notFound.value = true;
      return;
    }

    record.value = updated;
    saved.value = true;

    router.push(`/responses/${id.value}`);
  } finally {
    isSubmitting.value = false;
  }
}
</script>