<template>
  <nav v-if="exibirMenu" class="navbar navbar-expand-lg navbar-dark shadow-sm" style="background-color: #0056b3;">
    <div class="container">
      <span class="navbar-brand fw-bold">Self-Care Clinic</span>
      
      <div class="navbar-nav ms-auto">
        <router-link to="/cadastro" class="nav-link px-3">Novo Paciente</router-link>
        <router-link to="/agendar" class="nav-link px-3">Agenda & Clima</router-link>
        <router-link to="/painel" class="nav-link px-3">Painel Admin</router-link>
        <router-link to="/consultas" class="nav-link px-3">Consultas</router-link>
        
        <a href="#" @click.prevent="logout" class="nav-link px-3 text-warning fw-bold">🏃 Sair</a>
      </div>
    </div>
  </nav>

  <div class="bg-light min-vh-100 py-4">
    <router-view />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const exibirMenu = ref(false)

//função que decide se o menu aparece ou não
const checarAcesso = () => {
  const usuarioNoCache = localStorage.getItem('usuarioLogado')
  
  //menu SÓ aparece se:
  //tiver alguém logado no localStorage
  //e a página atual NÃO for a de login ('/')
  if (usuarioNoCache && route.path !== '/') {
    exibirMenu.value = true
  } else {
    exibirMenu.value = false
  }
}

const logout = () => {
  localStorage.removeItem('usuarioLogado')
  window.location.href = '/' // Volta pro login e limpa o menu
}

watch(() => route.path, () => checarAcesso())
onMounted(() => checarAcesso())
</script>

<style>
body { 
  background-color: #f0f2f5; 
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  margin: 0;
}

.nav-link {
  transition: all 0.3s;
  font-weight: 500;
  color: rgba(255,255,255,0.8) !important;
}
.nav-link:hover {
  background-color: rgba(255,255,255,0.1);
  border-radius: 8px;
  color: white !important;
}
.router-link-active {
  border-bottom: 2px solid white;
  color: white !important;
}

.card {
  border: none !important;
  border-radius: 15px !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05) !important;
}

.btn-primary {
  background-color: #0056b3 !important;
  border: none !important;
  border-radius: 8px !important;
  font-weight: 600;
  padding: 10px 20px !important;
}

.btn-success {
  background-color: #28a745 !important;
  border: none !important;
  border-radius: 8px !important;
  font-weight: 600;
}

.form-control {
  border-radius: 8px !important;
  padding: 10px !important;
  border: 1px solid #ced4da !important;
}

.form-control:focus {
  border-color: #0056b3 !important;
  box-shadow: 0 0 0 0.25rem rgba(0, 86, 179, 0.1) !important;
}
</style>