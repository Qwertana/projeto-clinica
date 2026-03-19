<template>
  <div class="container mt-5">
    <div class="card p-4 shadow">
      <h2>Novo Paciente</h2>
      <div class="row">
        <div class="col-md-6">
          <label>Nome:</label>
          <input v-model="paciente.nome" class="form-control mb-2" placeholder="Ex: João Silva">
          
          <label>CPF:</label>
          <input v-model="paciente.cpf" class="form-control mb-2" placeholder="Ex: 000.000.000-00">
          
          <label>CEP:</label>
          <input v-model="paciente.cep" class="form-control mb-2" placeholder="Apenas números">
        </div>
        <div class="col-md-6">
          <label>Telefone:</label>
          <input v-model="paciente.telefone" class="form-control mb-2" placeholder="Ex:(21) 99999-9999">
        </div>
      </div>
      
      <button @click="salvar" class="btn btn-success mt-3">Cadastrar no Sistema</button>
      
      <div v-if="mensagem" class="alert alert-success mt-3">{{ mensagem }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const paciente = ref({
  nome: '',
  cpf: '',
  telefone: '',
  cep: ''
})

const mensagem = ref('')

async function salvar() {
  try {
    // chama backend na porta 3000
    const res = await axios.post('https://projeto-clinica-mocc.onrender.com/pacientes', paciente.value)
    mensagem.value = "☺" + res.data.mensagem
    // Limpa o formulário
    paciente.value = { nome: '', cpf: '', telefone: '', cep: '' }
  } catch (error) {
    mensagem.value = "Erro ao cadastrar. Verifique os dados."
  }
}
</script>