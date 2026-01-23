<template>
  <div class="min-h-screen binds-bg p-6">
    <div class="mx-auto w-full max-w-xl binds-card p-6">
      <!-- Cabeçalho -->
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 class="text-xl font-bold">{{ titulo }}</h1>
          <p class="mt-1 text-sm text-gray-600">Etapa {{ step }} de 4</p>
        </div>

        <!-- Progresso (padrão prints) -->
        <div class="flex items-center gap-2" aria-label="Progresso">
          <span
            v-for="n in 4"
            :key="n"
            class="h-2 w-10 rounded-full"
            :class="n <= step ? 'bg-violet-600' : 'bg-gray-200'"
          />
        </div>
      </div>

      <!-- Conteúdo -->
      <div class="mt-6">
        <!-- PASSO 1 -->
        <div v-if="step === 1">
          <h2 class="text-lg font-semibold">Qual é o seu humor hoje?</h2>
          <p class="mt-1 text-sm text-gray-600">Escolha uma opção.</p>

          <div class="mt-4 grid grid-cols-5 gap-2">
            <button
              v-for="m in moods"
              :key="m.value"
              type="button"
              class="rounded-xl border p-3 text-2xl transition"
              :class="localAnswers.mood === m.value ? 'border-violet-600 bg-violet-50' : 'border-gray-200 bg-white'"
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

        <!-- PASSO 2 -->
        <div v-else-if="step === 2">
          <h2 class="text-lg font-semibold">Que nota você daria para esta página?</h2>
          <p class="mt-1 text-sm text-gray-600">De 1 a 5.</p>

          <div class="mt-4 flex gap-2">
            <button
              v-for="n in [1, 2, 3, 4, 5]"
              :key="n"
              type="button"
              class="flex h-10 w-10 items-center justify-center rounded-xl border transition"
              :class="localAnswers.csat === n ? 'border-violet-600 bg-violet-50' : 'border-gray-200 bg-white'"
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

        <!-- PASSO 3 -->
        <div v-else-if="step === 3">
          <h2 class="text-lg font-semibold">Você gostaria de se inscrever em nossa lista de e-mails?</h2>
          <p class="mt-1 text-sm text-gray-600">Opcional.</p>

          <label class="mt-4 block text-sm font-medium">E-mail</label>
          <input
            v-model.trim="localAnswers.email"
            type="email"
            placeholder="seuemail@exemplo.com"
            class="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 outline-none focus:border-violet-600"
          />

          <p v-if="showErrors && localAnswers.email && !isEmailValid" class="mt-3 text-sm text-red-600">
            E-mail inválido.
          </p>
        </div>

        <!-- PASSO 4 -->
        <div v-else>
          <h2 class="text-lg font-semibold">Se você pudesse escolher o próximo recurso, qual seria?</h2>
          <p class="mt-1 text-sm text-gray-600">Opcional.</p>

          <div class="mt-4 grid gap-2">
            <button
              v-for="f in features"
              :key="f.value"
              type="button"
              class="rounded-xl border px-4 py-3 text-left transition"
              :class="localAnswers.feature === f.value ? 'border-violet-600 bg-violet-50' : 'border-gray-200 bg-white'"
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
            class="mt-1 w-full resize-none rounded-xl border border-gray-200 bg-white px-3 py-2 outline-none focus:border-violet-600"
          />
        </div>
      </div>

      <!-- Navegação -->
      <div class="mt-8 flex items-center justify-between">
        <button
          type="button"
          class="btn btn-secondary"
          :disabled="step === 1 || isSubmitting"
          :class="step === 1 || isSubmitting ? 'opacity-50' : ''"
          @click="prev"
        >
          Voltar
        </button>

        <button
          type="button"
          class="btn btn-primary"
          :disabled="isNextDisabled || isSubmitting"
          :class="isNextDisabled || isSubmitting ? 'opacity-50' : ''"
          @click="next"
        >
          <span v-if="isSubmitting">Enviando...</span>
          <span v-else>{{ step === 4 ? rotuloEnviar : 'Próximo' }}</span>
        </button>
      </div>

      <p v-if="submittedMessage" class="mt-6 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
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