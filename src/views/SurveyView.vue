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
    <div class="w-full max-w-sm rounded-2xl bg-white p-6 shadow">
      <div class="flex items-start justify-between gap-3">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Obrigado!</h2>
          <p class="mt-2 text-sm text-gray-600">
            Sua resposta foi enviada com sucesso.
          </p>
        </div>

        <span
          class="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-xl"
          aria-hidden="true"
        >
          ✅
        </span>
      </div>

      <div class="mt-6 grid gap-3">
        <button
          type="button"
          class="btn btn-primary w-full justify-center"
          @click="closeThankYou"
        >
          Fechar
        </button>

        <button
          type="button"
          class="btn btn-secondary w-full justify-center"
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

    // opcional: resetar a pesquisa após salvar
    // answers.value = defaultSurveyAnswers();
  } finally {
    isSubmitting.value = false;
  }
}
</script>