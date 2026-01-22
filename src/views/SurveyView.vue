<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="mx-auto w-full max-w-xl rounded-2xl bg-white p-6 shadow">
      <div class="flex items-center justify-between">
        <h1 class="text-xl font-bold">Pesquisa</h1>
        <span class="text-sm text-gray-500">Passo {{ step }} de 4</span>
      </div>

      <div class="mt-6">
        <!-- PASSO 1: Humor -->
        <div v-if="step === 1">
          <h2 class="text-lg font-semibold">Qual é o seu humor hoje?</h2>
          <p class="mt-1 text-sm text-gray-600">Escolha uma opção.</p>

          <div class="mt-4 grid grid-cols-5 gap-2">
            <button
              v-for="m in moods"
              :key="m.value"
              type="button"
              class="rounded-xl border p-3 text-2xl transition"
              :class="answers.mood === m.value ? 'border-black bg-gray-50' : 'border-gray-200'"
              @click="answers.mood = m.value"
              :aria-label="m.label"
            >
              <span aria-hidden="true">{{ m.icon }}</span>
            </button>
          </div>

          <p v-if="showErrors && !answers.mood" class="mt-3 text-sm text-red-600">
            Selecione um humor para continuar.
          </p>
        </div>

        <!-- PASSO 2: CSAT -->
        <div v-else-if="step === 2">
          <h2 class="text-lg font-semibold">Que nota você daria para esta página?</h2>
          <p class="mt-1 text-sm text-gray-600">De 1 a 5.</p>

          <div class="mt-4 flex gap-2">
            <button
              v-for="n in [1, 2, 3, 4, 5]"
              :key="n"
              type="button"
              class="flex h-10 w-10 items-center justify-center rounded-xl border transition"
              :class="answers.csat === n ? 'border-black bg-gray-50' : 'border-gray-200'"
              @click="answers.csat = n"
              :aria-label="`Selecionar nota ${n}`"
            >
              {{ n }}
            </button>
          </div>

          <p v-if="showErrors && !answers.csat" class="mt-3 text-sm text-red-600">
            Selecione uma nota para continuar.
          </p>
        </div>

        <!-- PASSO 3: Newsletter (e-mail opcional) -->
        <div v-else-if="step === 3">
          <h2 class="text-lg font-semibold">Você gostaria de se inscrever em nossa lista de e-mails?</h2>
          <p class="mt-1 text-sm text-gray-600">Opcional.</p>

          <label class="mt-4 block text-sm font-medium">E-mail</label>
          <input
            v-model.trim="answers.email"
            type="email"
            placeholder="seuemail@exemplo.com"
            class="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-black"
          />

          <p v-if="showErrors && answers.email && !isEmailValid" class="mt-3 text-sm text-red-600">
            E-mail inválido.
          </p>
        </div>

        <!-- PASSO 4: Escolha de recurso + comentário (opcional) -->
        <div v-else>
          <h2 class="text-lg font-semibold">Se você pudesse escolher o próximo recurso, qual seria?</h2>
          <p class="mt-1 text-sm text-gray-600">Opcional.</p>

          <div class="mt-4 grid gap-2">
            <button
              v-for="f in features"
              :key="f.value"
              type="button"
              class="rounded-xl border px-4 py-3 text-left transition"
              :class="answers.feature === f.value ? 'border-black bg-gray-50' : 'border-gray-200'"
              @click="answers.feature = f.value"
            >
              {{ f.label }}
            </button>
          </div>

          <label class="mt-4 block text-sm font-medium">Comentário (opcional)</label>
          <textarea
            v-model.trim="answers.comment"
            rows="3"
            placeholder="Digite sua resposta"
            class="mt-1 w-full resize-none rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-black"
          />
        </div>
      </div>

      <!-- NAVEGAÇÃO -->
      <div class="mt-8 flex items-center justify-between">
        <button
          type="button"
          class="rounded-xl border border-gray-300 px-4 py-2"
          :disabled="step === 1 || isSubmitting"
          :class="step === 1 || isSubmitting ? 'opacity-50' : ''"
          @click="prev"
        >
          Voltar
        </button>

        <button
          type="button"
          class="rounded-xl bg-black px-4 py-2 text-white"
          :disabled="isNextDisabled || isSubmitting"
          :class="isNextDisabled || isSubmitting ? 'opacity-50' : ''"
          @click="next"
        >
          <span v-if="isSubmitting">Enviando...</span>
          <span v-else>{{ step === 4 ? 'Enviar' : 'Próximo' }}</span>
        </button>
      </div>

      <p v-if="submitted" class="mt-6 rounded-xl bg-green-50 p-3 text-sm text-green-700">
        Obrigado! Resposta salva com sucesso ✅
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { defaultSurveyAnswers } from '../types/Survey';
import { salvarResposta } from '../services/storage';

const step = ref<1 | 2 | 3 | 4>(1);
const answers = ref(defaultSurveyAnswers());

const showErrors = ref(false);
const isSubmitting = ref(false);
const submitted = ref(false);

const moods = [
  { value: 'terrible', icon: '😡', label: 'Muito Insatisfeito' },
  { value: 'bad', icon: '😕', label: 'Insatisfeito' },
  { value: 'ok', icon: '😐', label: 'Indiferente' },
  { value: 'good', icon: '🙂', label: 'Satisfeito' },
  { value: 'great', icon: '😄', label: 'Muito Satisfeito' },
] as const;

const features = [
  { value: 'featureA', label: 'Recurso A' },
  { value: 'featureB', label: 'Recurso B' },
  { value: 'featureC', label: 'Recurso C' },
] as const;

const isEmailValid = computed(() => {
  // valida só se estiver preenchido
  if (!answers.value.email) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(answers.value.email);
});

const isStepValid = computed(() => {
  if (step.value === 1) return !!answers.value.mood;
  if (step.value === 2) return !!answers.value.csat;
  if (step.value === 3) return isEmailValid.value; // e-mail opcional, mas se tiver, precisa ser válido
  return true; // passo 4 opcional
});

const isNextDisabled = computed(() => !isStepValid.value);

function prev() {
  submitted.value = false;
  showErrors.value = false;
  step.value = (step.value - 1) as 1 | 2 | 3 | 4;
}

async function next() {
  submitted.value = false;

  if (!isStepValid.value) {
    showErrors.value = true;
    return;
  }

  showErrors.value = false;

  if (step.value < 4) {
    step.value = (step.value + 1) as 1 | 2 | 3 | 4;
    return;
  }

  // SUBMIT (real): salva no LocalStorage
  isSubmitting.value = true;

  // pequeno delay só para UX
  await new Promise((r) => setTimeout(r, 300));

  salvarResposta(answers.value);

  isSubmitting.value = false;
  submitted.value = true;
}
</script>