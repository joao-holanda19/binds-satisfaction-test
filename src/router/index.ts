import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import SurveyView from '../views/SurveyView.vue';
import ResponsesView from '../views/ResponsesView.vue';

const UUID_RE =
  '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/p/default', name: 'survey', component: SurveyView },
    { path: '/responses', name: 'responses', component: ResponsesView },

    // EDIT (com regex) - mais específico
    {
      path: `/responses/:id(${UUID_RE})/edit`,
      name: 'response-edit',
      component: () => import('../views/ResponseEditView.vue'),
    },

    // DETALHE (com regex)
    {
      path: `/responses/:id(${UUID_RE})`,
      name: 'response-detail',
      component: () => import('../views/ResponseDetailView.vue'),
    },

    // fallback opcional:
    // { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
});

export default router;