//integrando rota para o front
import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import CadastroPacienteView from '../views/CadastroPacienteView.vue'
import AgendamentoView from '../views/AgendamentoView.vue'
import PainelView from '../views/PainelView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView
    },
    {
      path: '/cadastro',
      name: 'cadastro',
      component: () => import('../views/CadastroPacienteView.vue')
    },
    {
      path: '/agendar',
      name: 'agendar',
      component: () => import('../views/AgendamentoView.vue')
    },
    {
      path: '/painel',
      name: 'painel',
      component: () => import('../views/PainelView.vue')
    },
    {
      path: '/consultas',
      name: 'consultas',
      component: () => import('../views/ConsultasView.vue')
    }
  ]
});

export default router

