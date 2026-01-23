<template>
  <div class="min-h-screen binds-bg p-6">
    <div class="mx-auto w-full max-w-3xl">
      <!-- Logo central -->
      <div class="flex justify-center">
        <div class="rounded-2xl bg-white/70 px-6 py-3 shadow-sm backdrop-blur">
          <span class="text-lg font-extrabold text-violet-700">Binds.co</span>
        </div>
      </div>

      <!-- Card principal -->
      <div class="mt-6 binds-card p-8">
        <div class="flex flex-col gap-2">
          <h1 class="text-2xl font-bold">Pesquisa de satisfação</h1>
          <p class="text-sm text-gray-600">
            Responda em poucos passos. Você também pode consultar, editar ou excluir respostas já salvas.
          </p>
        </div>

        <!-- Blocos de ação -->
        <div class="mt-8 grid gap-4 md:grid-cols-2">
          <div class="rounded-2xl border border-gray-200 bg-white p-5">
            <h2 class="text-base font-semibold">Iniciar pesquisa</h2>
            <p class="mt-1 text-sm text-gray-600">
              Comece agora e envie sua resposta.
            </p>

            <div class="mt-4">
              <RouterLink to="/p/default" class="btn btn-primary w-full">
                Iniciar pesquisa
              </RouterLink>
            </div>
          </div>

          <div class="rounded-2xl border border-gray-200 bg-white p-5">
            <h2 class="text-base font-semibold">Ver respostas</h2>
            <p class="mt-1 text-sm text-gray-600">
              Visualize as respostas salvas no navegador.
            </p>

            <div class="mt-4">
              <RouterLink to="/responses" class="btn btn-secondary w-full">
                Ver respostas
              </RouterLink>
            </div>
          </div>
        </div>

        <!-- Observação -->
        <div class="mt-8 rounded-2xl border border-violet-100 bg-violet-50 p-4 text-sm text-gray-700">
          <p>
            <span class="font-semibold">Onde fica salvo?</span>
            As respostas são armazenadas no <span class="font-mono">localStorage</span> do seu navegador.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>