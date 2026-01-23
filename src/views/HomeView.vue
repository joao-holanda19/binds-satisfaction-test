<template>
  <div class="min-h-screen binds-bg p-6">
    <div class="mx-auto w-full max-w-5xl space-y-8">
      <div class="binds-card p-10">
        <p class="text-center text-sm font-semibold text-gray-600">Binds.co</p>

        <div class="mt-3 max-w-2xl">
          <h1 class="text-3xl font-bold text-gray-900">Pesquisa de Satisfação</h1>
          <p class="mt-3 text-gray-600">
            Ajude-nos a melhorar respondendo uma pesquisa rápida. Você também pode consultar e
            gerenciar as respostas já salvas.
          </p>
        </div>
      </div>

      <div class="grid gap-6 md:grid-cols-2 pt-2">
        <div class="binds-card p-8">
          <h2 class="text-xl font-bold text-gray-900">Iniciar agora</h2>
          <p class="mt-2 text-gray-600">
            Responda em poucos passos: humor, nota, e-mail (opcional) e sugestão de recurso.
          </p>

          <RouterLink to="/p/default" class="btn btn-primary mt-6 w-full justify-center">
            Começar
          </RouterLink>
        </div>

        <div class="binds-card p-8">
          <h2 class="text-xl font-bold text-gray-900">Gerenciar respostas</h2>
          <p class="mt-2 text-gray-600">
            Veja detalhes, edite ou exclua respostas salvas no navegador.
          </p>

          <RouterLink to="/responses" class="btn btn-secondary mt-6 w-full justify-center">
            Acessar lista
          </RouterLink>
        </div>
      </div>

      <p class="pt-2 text-center text-sm text-gray-500">
        As respostas são salvas localmente neste navegador (localStorage).
      </p>
    </div>
  </div>
</template>

<script setup lang="ts"></script>