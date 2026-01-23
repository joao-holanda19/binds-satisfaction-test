<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6"
    role="dialog"
    aria-modal="true"
    :aria-label="titulo"
  >
    <div class="w-full max-w-sm binds-card p-6">
      <div class="flex items-start justify-between gap-3">
        <div>
          <h2 class="text-xl font-bold">{{ titulo }}</h2>
          <p v-if="descricao" class="mt-2 text-sm text-gray-600">
            {{ descricao }}
          </p>
        </div>

        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
          <span class="text-red-600" aria-hidden="true">⚠️</span>
        </div>
      </div>

      <div class="mt-6 grid gap-3">
        <button
          type="button"
          class="btn btn-danger w-full"
          :disabled="loading"
          @click="$emit('confirm')"
        >
          <span v-if="loading">Processando...</span>
          <span v-else>{{ textoConfirmar }}</span>
        </button>

        <button
          type="button"
          class="btn btn-secondary w-full"
          :disabled="loading"
          @click="$emit('cancel')"
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    open: boolean;
    titulo: string;
    descricao?: string;
    textoConfirmar?: string;
    loading?: boolean;
  }>(),
  {
    descricao: '',
    textoConfirmar: 'Confirmar',
    loading: false,
  }
);

defineEmits<{
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}>();
</script>