<template>
  <div class="min-h-screen binds-bg p-6">
    <div class="mx-auto w-full max-w-4xl space-y-6">
      <!-- HERO -->
      <div class="binds-card p-8">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p class="text-sm font-semibold text-gray-600">Binds.co</p>
            <h1 class="mt-1 text-3xl font-bold text-gray-900">
              Pesquisa de Satisfação
            </h1>
            <p class="mt-2 max-w-2xl text-sm text-gray-600">
              Ajude-nos a melhorar respondendo uma pesquisa rápida. Você também pode consultar e gerenciar
              as respostas já salvas.
            </p>
          </div>

          <div class="flex flex-wrap gap-2">
            <RouterLink to="/p/default" class="btn btn-primary">
              Iniciar pesquisa
            </RouterLink>

            <RouterLink to="/responses" class="btn btn-secondary">
              Ver respostas
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- AÇÕES EM CARDS -->
      <div class="grid gap-4 md:grid-cols-2">
        <div class="binds-card p-6">
          <h2 class="text-lg font-bold">Iniciar agora</h2>
          <p class="mt-2 text-sm text-gray-600">
            Responda em poucos passos: humor, nota, e-mail (opcional) e sugestão de recurso.
          </p>

          <div class="mt-5">
            <RouterLink to="/p/default" class="btn btn-primary w-full justify-center">
              Começar
            </RouterLink>
          </div>
        </div>

        <div class="binds-card p-6">
          <h2 class="text-lg font-bold">Gerenciar respostas</h2>
          <p class="mt-2 text-sm text-gray-600">
            Veja detalhes, edite ou exclua respostas salvas no navegador.
          </p>

          <div class="mt-5">
            <RouterLink to="/responses" class="btn btn-secondary w-full justify-center">
              Acessar lista
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- Rodapé simples -->
      <p class="text-center text-xs text-gray-500">
        As respostas são salvas localmente neste navegador (localStorage).
      </p>
    </div>
  </div>
</template>

<script setup lang="ts"></script>