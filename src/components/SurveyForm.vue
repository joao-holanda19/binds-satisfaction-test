<!-- src/components/SurveyForm.vue -->
<template>
  <div class="min-h-screen binds-bg p-6">
    <div class="mx-auto w-full max-w-xl binds-card p-6">
      <!-- Header -->
      <div class="flex items-start justify-between gap-4">
        <div>
          <h1 class="text-xl font-bold">{{ titulo }}</h1>
          <p class="mt-1 text-sm text-gray-500">Etapa {{ step }} de 4</p>
        </div>

        <!-- Progress -->
        <div class="flex items-center gap-2" aria-label="Progresso">
          <span
            v-for="n in 4"
            :key="n"
            class="h-2 w-8 rounded-full"
            :class="n <= step ? 'bg-binds-600' : 'bg-gray-200'"
          />
        </div>
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
              :class="localAnswers.mood === m.value ? 'border-binds-600 bg-binds-50' : 'border-gray-200 bg-white hover:bg-gray-50'"
              @click="localAnswers.mood = m.value"
              :aria-label="m.label"
            >
              <span aria-hidden="true">{{ m.icon }}</span>
            </button>
          </div>

          <p v-if="showErrors && !localAnswers.mood" class="mt-3 text-sm text-red-600">
            Selecione um humor para continuar.
          </p>
        </div>

        <!-- PASSO 2: CSAT -->
        <div v-else-if="step === 2">
          <h2 class="text-lg font-semibold">Que nota você daria para esta página?</h2>
          <p class="mt-1 text-sm text-gray-600">De 1 a 5.</p>

          <div class="mt-4 flex flex-wrap gap-2">
            <button
              v-for="n in [1, 2, 3, 4, 5]"
              :key="n"
              type="button"
              class="flex h-10 w-10 items-center justify-center rounded-xl border transition"
              :class="localAnswers.csat === n ? 'border-binds-600 bg-binds-50' : 'border-gray-200 bg-white hover:bg-gray-50'"
              @click="localAnswers.csat = n"
              :aria-label="`Selecionar nota ${n}`"
            >
              {{ n }}
            </button>
          </div>

          <p v-if="showErrors && !localAnswers.csat" class="mt-3 text-sm text-red-600">
            Selecione uma nota para continuar.
          </p>
        </div>

        <!-- PASSO 3: Newsletter (e-mail opcional) -->
        <div v-else-if="step === 3">
          <h2 class="text-lg font-semibold">Você gostaria de se inscrever em nossa lista de e-mails?</h2>
          <p class="mt-1 text-sm text-gray-600">Opcional.</p>

          <label class="mt-4 block text-sm font-medium">E-mail</label>
          <input
            v-model.trim="localAnswers.email"
            type="email"
            placeholder="seuemail@exemplo.com"
            class="input mt-1"
          />

          <p v-if="showErrors && localAnswers.email && !isEmailValid" class="mt-3 text-sm text-red-600">
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
              :class="localAnswers.feature === f.value ? 'border-binds-600 bg-binds-50' : 'border-gray-200 bg-white hover:bg-gray-50'"
              @click="localAnswers.feature = f.value"
            >
              {{ f.label }}
            </button>
          </div>

          <label class="mt-4 block text-sm font-medium">Comentário (opcional)</label>
          <textarea
            v-model.trim="localAnswers.comment"
            rows="3"
            placeholder="Digite sua resposta"
            class="input mt-1 resize-none"
          />
        </div>
      </div>

      <!-- NAVEGAÇÃO -->
      <div class="mt-8 flex items-center justify-between">
        <button
          type="button"
          class="btn btn-secondary"
          :disabled="step === 1 || isSubmitting"
          @click="prev"
        >
          Voltar
        </button>

        <button
          type="button"
          class="btn btn-primary"
          :disabled="isNextDisabled || isSubmitting"
          @click="next"
        >
          <span v-if="isSubmitting">Enviando...</span>
          <span v-else>{{ step === 4 ? rotuloEnviar : 'Próximo' }}</span>
        </button>
      </div>

      <p
        v-if="submittedMessage"
        class="mt-6 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-800"
      >
        {{ submittedMessage }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import type { SurveyAnswers } from '../types/survey';

const props = withDefaults(
  defineProps<{
    titulo?: string;
    rotuloEnviar?: string;
    initialAnswers: SurveyAnswers;
    isSubmitting?: boolean;
    submittedMessage?: string;
  }>(),
  {
    titulo: 'Pesquisa',
    rotuloEnviar: 'Enviar',
    isSubmitting: false,
    submittedMessage: '',
  }
);

const emit = defineEmits<{
  (e: 'submit', answers: SurveyAnswers): void;
}>();

const step = ref<1 | 2 | 3 | 4>(1);
const showErrors = ref(false);

const localAnswers = reactive<SurveyAnswers>({ ...props.initialAnswers });

watch(
  () => props.initialAnswers,
  (next) => {
    Object.assign(localAnswers, next);
    step.value = 1;
    showErrors.value = false;
  },
  { deep: true }
);

const moods = [
  { value: 'terrible', icon: '😡', label: 'Muito insatisfeito' },
  { value: 'bad', icon: '😕', label: 'Insatisfeito' },
  { value: 'ok', icon: '😐', label: 'Indiferente' },
  { value: 'good', icon: '🙂', label: 'Satisfeito' },
  { value: 'great', icon: '😄', label: 'Muito satisfeito' },
] as const;

const features = [
  { value: 'featureA', label: 'Recurso A' },
  { value: 'featureB', label: 'Recurso B' },
  { value: 'featureC', label: 'Recurso C' },
] as const;

const isEmailValid = computed(() => {
  if (!localAnswers.email) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(localAnswers.email);
});

const isStepValid = computed(() => {
  if (step.value === 1) return !!localAnswers.mood;
  if (step.value === 2) return !!localAnswers.csat;
  if (step.value === 3) return isEmailValid.value;
  return true;
});

const isNextDisabled = computed(() => !isStepValid.value);

function prev() {
  showErrors.value = false;
  step.value = (step.value - 1) as 1 | 2 | 3 | 4;
}

function next() {
  if (!isStepValid.value) {
    showErrors.value = true;
    return;
  }

  showErrors.value = false;

  if (step.value < 4) {
    step.value = (step.value + 1) as 1 | 2 | 3 | 4;
    return;
  }

  emit('submit', { ...localAnswers });
}
</script>