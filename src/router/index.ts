import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import SurveyView from '../views/SurveyView.vue';
import ResponsesView from '../views/ResponsesView.vue';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/p/:id', name: 'survey', component: SurveyView },
    { path: '/responses', name: 'responses', component: ResponsesView },
  ],
});