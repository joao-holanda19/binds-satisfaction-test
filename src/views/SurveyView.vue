<!-- src/views/SurveyView.vue -->
<template>
  <SurveyForm
    titulo="Pesquisa"
    rotulo-enviar="Enviar"
    :initial-answers="answers"
    :is-submitting="isSubmitting"
    :submitted-message="submitted ? 'Obrigado! Resposta salva com sucesso ✅' : ''"
    @submit="onSubmit"
  />

  <!-- MODAL "OBRIGADO" (Binds: roxo/branco, padrão do layout) -->
  <div
    v-if="showThankYouModal"
    class="fixed inset-0 z-50 flex items-center justify-center p-6"
    style="background: rgba(17, 24, 39, 0.45)"
    role="dialog"
    aria-modal="true"
    aria-label="Resposta enviada"
  >
    <div class="w-full max-w-sm binds-card p-6">
      <h2 class="text-2xl font-bold">Obrigado!</h2>
      <p class="mt-2 text-sm text-gray-600">Sua resposta foi enviada com sucesso.</p>

      <div class="mt-6 grid gap-3">
        <button type="button" class="btn btn-primary w-full" @click="closeThankYou">
          Fechar
        </button>

        <button
          type="button"
          class="btn btn-secondary w-full"
          :disabled="!lastSavedId"
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

const showThankYouModal = ref(false);
const lastSavedId = ref<string | null>(null);

function closeThankYou() {
  showThankYouModal.value = false;
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

    // opcional: resetar o formulário depois de salvar
    // answers.value = defaultSurveyAnswers();
  } finally {
    isSubmitting.value = false;
  }
}
</script>