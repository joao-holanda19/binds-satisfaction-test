<template>
  <SurveyForm
    titulo="Pesquisa"
    rotulo-enviar="Enviar"
    :initial-answers="answers"
    :is-submitting="isSubmitting"
    :submitted-message="submitted ? 'Obrigado! Resposta salva com sucesso ✅' : ''"
    @submit="onSubmit"
  />

  <!-- MODAL "OBRIGADO" (padrão Binds) -->
  <div
    v-if="showThankYouModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6"
    role="dialog"
    aria-modal="true"
    aria-label="Resposta enviada"
  >
    <div class="w-full max-w-sm binds-card p-6">
      <div class="flex items-start justify-between gap-3">
        <div>
          <h2 class="text-2xl font-bold">Obrigado!</h2>
          <p class="mt-2 text-sm text-gray-600">
            Sua resposta foi enviada com sucesso.
          </p>
        </div>

        <button
          type="button"
          class="rounded-xl p-2 text-gray-500 hover:bg-gray-50"
          aria-label="Fechar"
          @click="closeThankYou"
        >
          ✕
        </button>
      </div>

      <div class="mt-6 grid gap-3">
        <button type="button" class="btn btn-primary w-full" @click="closeThankYou">
          Fechar
        </button>

        <button
          type="button"
          class="btn btn-secondary w-full"
          :disabled="!lastSavedId"
          :class="!lastSavedId ? 'opacity-50' : ''"
          @click="goToMySubmission"
        >
          Ver meu envio
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import SurveyForm from '../components/SurveyForm.vue';
import { defaultSurveyAnswers } from '../types/survey';
import type { SurveyAnswers } from '../types/survey';
import { salvarResposta } from '../services/storage';

const router = useRouter();

const answers = ref<SurveyAnswers>(defaultSurveyAnswers());
const isSubmitting = ref(false);
const submitted = ref(false);

// Modal do "Obrigado"
const showThankYouModal = ref(false);
const lastSavedId = ref<string | null>(null);

function closeThankYou() {
  showThankYouModal.value = false;

  // resetar formulário para próxima pesquisa
  answers.value = defaultSurveyAnswers();

  // voltar para a tela inicial
  router.push('/');
}

function goToMySubmission() {
  if (!lastSavedId.value) return;
  router.push(`/responses/${lastSavedId.value}`);
  showThankYouModal.value = false;
}

async function onSubmit(payload: SurveyAnswers) {
  submitted.value = false;
  isSubmitting.value = true;

  try {
    const record = salvarResposta(payload);
    lastSavedId.value = record.id;

    submitted.value = true;
    showThankYouModal.value = true;
  } finally {
    isSubmitting.value = false;
  }
}
</script>