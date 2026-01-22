<!-- src/views/ResponseEditView.vue -->
<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="mx-auto w-full max-w-3xl">
      <div class="mb-4 flex items-center justify-between gap-3">
        <div>
          <h1 class="text-xl font-bold">Editar resposta</h1>
          <p class="mt-1 text-sm text-gray-600" v-if="record">
            ID: <span class="font-mono">{{ record.id }}</span>
            • Criada em: {{ formatarData(record.createdAt) }}
          </p>
        </div>

        <RouterLink
          to="/responses"
          class="rounded-xl border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
        >
          Voltar para a lista
        </RouterLink>
      </div>

      <div v-if="notFound" class="rounded-2xl bg-white p-6 shadow">
        <p class="text-sm text-gray-700">
          Não foi possível encontrar essa resposta.
        </p>
        <div class="mt-4">
          <RouterLink to="/responses" class="text-sm text-blue-600 hover:underline">
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

  // clona para evitar mutar o objeto original enquanto edita
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

    saved.value = true;

    // após salvar, manda para o detalhe
    router.push(`/responses/${id.value}`);
  } finally {
    isSubmitting.value = false;
  }
}
</script>