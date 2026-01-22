// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import SurveyView from '../views/SurveyView.vue';
import ResponsesView from '../views/ResponsesView.vue'; // (vamos criar depois)

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/p/default', name: 'survey', component: SurveyView },
    { path: '/responses', name: 'responses', component: ResponsesView },

    // (vamos criar essas telas depois, mas já pode deixar as rotas)
    { path: '/responses/:id', name: 'response-detail', component: () => import('../views/ResponseDetailView.vue') },
    { path: '/responses/:id/edit', name: 'response-edit', component: () => import('../views/ResponseEditView.vue') },
  ],
});

export default router;