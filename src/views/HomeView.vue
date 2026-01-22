<template>
  <div
    class="min-h-screen flex items-center justify-center p-6"
  >
    <!-- fundo suave (tipo print) -->
    <div class="fixed inset-0 -z-10 bg-gradient-to-b from-white to-[#f3f0ff]" />
    <div class="fixed inset-0 -z-10 opacity-60 blur-3xl"
      style="background: radial-gradient(circle at 50% 35%, rgba(124,58,237,0.18), transparent 55%);"
    />

    <!-- card central -->
    <div class="w-full max-w-md rounded-2xl bg-white/90 backdrop-blur p-8 shadow-lg border border-black/5">
      <div class="flex flex-col items-center text-center gap-6">
        <!-- “falso header” (opcional, só pra ficar mais parecido com o print) -->
        <div class="h-4 w-40 rounded-full bg-black/5" />

        <RouterLink
          to="/p/default"
          class="w-full rounded-xl px-6 py-3 font-semibold text-white text-center transition active:scale-[0.99]"
          style="background: linear-gradient(90deg, #6d28d9, #7c3aed);"
        >
          Iniciar pesquisa
        </RouterLink>

        <div class="w-full border-t border-black/5" />

        <RouterLink
          to="/responses"
          class="text-sm text-black/70 hover:text-black transition"
        >
          <span class="font-medium">Admin:</span> Ver respostas →
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>