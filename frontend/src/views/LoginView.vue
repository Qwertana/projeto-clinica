<template>
  <div class="container-fluid min-vh-100 bg-light d-flex align-items-center justify-content-center py-5">
    
    <div class="card p-4 p-md-5 shadow-lg border-0 bg-white" style="border-radius: 15px; width: 100%; max-width: 480px;">
      
      <h2 class="text-center mb-4 text-primary fw-bold text-nowrap">
        {{ modoCadastro ? 'Criar Conta' : 'Entrar na Clínica' }}
      </h2>
      
      <hr class="mb-4">

      <div v-if="modoCadastro" class="mb-3">
        <label class="form-label fw-bold">Nome Completo</label>
        <input v-model="usuario.nome" type="text" class="form-control" placeholder="Seu nome">
      </div>

      <div class="mb-3">
        <label class="form-label fw-bold">E-mail</label>
        <input v-model="usuario.email" type="email" class="form-control" placeholder="email@exemplo.com">
      </div>

      <div class="mb-4">
        <label class="form-label fw-bold">Senha</label>
        <input v-model="usuario.senha" type="password" class="form-control" placeholder="******">
      </div>

      <button @click="executarAcao" class="btn btn-primary w-100 fw-bold py-2 text-nowrap">
        {{ modoCadastro ? 'Cadastrar Agora' : 'Entrar' }}
      </button>

      <hr class="my-4">

      <p class="text-center m-0">
        {{ modoCadastro ? 'Já tem conta?' : 'Novo por aqui?' }}
        <a href="#" @click.prevent="modoCadastro = !modoCadastro" class="fw-bold text-decoration-none">
          {{ modoCadastro ? 'Faça Login' : 'Crie sua conta' }}
        </a>
      </p>

      <div v-if="mensagem" :class="['alert mt-3 text-center', erro ? 'alert-danger' : 'alert-success']" role="alert">
        {{ mensagem }}
      </div>
      
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const modoCadastro = ref(false)
const usuario = ref({ nome: '', email: '', senha: '', cargo: 'secretario' })
const mensagem = ref('')
const erro = ref(false)

async function executarAcao() {
  mensagem.value = 'Processando...'
  erro.value = false
  
  const rota = modoCadastro.value ? '/auth/cadastro' : '/auth/login'
  
  try {
    console.log("Enviando dados para:", rota, usuario.value);
    const res = await axios.post(`https://projeto-clinica-mocc.onrender.com${rota}`, usuario.value)
    console.log("Resposta do servidor:", res.data);

    if (modoCadastro.value) {
      mensagem.value = "Entrando..."
      setTimeout(() => {
        modoCadastro.value = false
        mensagem.value = ""
      }, 2000)
    } else {
      // LOGIN COM SUCESSO
      localStorage.setItem('usuarioLogado', JSON.stringify(res.data.usuario))
      mensagem.value = "Sucesso! Redirecionando..."
      
      setTimeout(() => {
        window.location.href = '/agendar' 
      }, 1000)
    }
  } catch (e) {
    erro.value = true
    mensagem.value = e.response?.data || "E-mail ou senha incorretos."
    console.error("Erro no login:", e)
  }
}
</script>