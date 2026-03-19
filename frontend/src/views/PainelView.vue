<template>
 <div class="container mt-5">
  <h2 class="mb-4"> Painel de Controle da Clínica </h2>

  <div class="card p-4 shadow mb-5">
      <h4>Pacientes Cadastrados</h4>
      <table class="table table-borderless align-middle">
        <thead class="table-light">
          <tr>
            <th>Nome</th>
            <th>Documento</th>
            <th>Cidade</th>
            <th>ID para Agendamento</th>
            <th class="text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
         <tr v-for="p in pacientes" :key="p._id">
           <td>{{ p.nome }}</td>
           <td>{{ p.cpf }}</td>
           <td>{{ p.endereco?.cidade }}</td>
           <td><code class="text-primary">{{ p._id }}</code></td>
           <td>
              <button @click="deletarPaciente(p._id)" class="btn btn-outline-danger btn-sm">
              Excluir
              </button>
              </td>
        </tr>
        </tbody>
        </table>
      <p v-if= "pacientes.length === 0" class="text-muted text-center"> Nenhum paciente cadastrado. </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const pacientes = ref([])

async function carregarDados() {
  try {
    const res = await axios.get('http://localhost:3000/pacientes')
    pacientes.value = res.data
} catch (error) {
  console.error("Erro ao carregar lista:", error)
}
}

async function deletarPaciente(id) {
  if (confirm("Tem certeza que deseja apagar este paciente?")) {
    try {
      await axios.delete(`http://localhost:3000/pacientes/${id}`)
      alert("Paciente removido!")
      carregarDados()
    } catch (error) {
      alert("Erro ao deletar o paciente.")
    }
  }
}

onMounted(carregarDados)
</script>
