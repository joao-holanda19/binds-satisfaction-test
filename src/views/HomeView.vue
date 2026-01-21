<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-6">
    <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow">
      <h1 class="text-2xl font-bold">Pesquisa de Satisfação</h1>
      <p class="mt-2 text-gray-600">
        Inicie a pesquisa ou veja as respostas salvas.
      </p>

      <div class="mt-6 flex gap-3">
        <RouterLink
          to="/p/default"
          class="rounded-xl bg-black px-4 py-2 text-white"
        >
          Start Survey
        </RouterLink>

        <RouterLink
          to="/responses"
          class="rounded-xl border border-gray-300 px-4 py-2"
        >
          View Responses
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>