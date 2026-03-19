<template>
  <div class="container mt-5 pb-5">
    <div class="card p-4 shadow mb-5">
      <h2 class="mb-4 text-primary"> Agendar Consulta</h2>
      <div class="mb-3">
        <label class="form-label fw-bold">ID do Paciente:</label>
        <input v-model="agenda.pacienteId" class="form-control" placeholder="Cole o ID do painel admin">
      </div>
      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="form-label fw-bold">Data:</label>
          <input v-model="agenda.data" type="date" class="form-control">
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label fw-bold">Médico:</label>
          <select v-model="agenda.medico" class="form-control">
            <option>Dr. Rodrigo Faro</option>
            <option>Dr. Celso Portiolli</option>
            <option>Dra. Ariana Grande</option>
          </select>
        </div>
      </div>
      <button @click="agendar" class="btn btn-primary w-100 fw-bold">Confirmar Agendamento</button>

      <div v-if="mensagemSucesso" class="mt-4 alert alert-success">{{ mensagemSucesso }}</div>
      <div v-if="alertaChuva" class="mt-2 alert alert-warning">{{ alertaChuva }}</div>
      <div v-if="mensagemErro" class="mt-3 alert alert-danger">{{ mensagemErro }}</div>
    </div>

    <div class="card p-4 shadow">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h3 class="m-0">Próximas Consultas</h3>
        <button v-if="listaConsultas.length > 0" @click="limparTudo" class="btn btn-sm btn-danger">
          Limpar Lista
        </button>
      </div>

      <div class="alert alert-info py-2 mb-3">
        Total: <strong>{{ listaConsultas.length }}</strong> consulta(s) agendada(s).
      </div>

      <div class="table-responsive">
        <table class="table table-hover align-middle">
          <thead class="table-light">
            <tr>
              <th>Paciente</th>
              <th>Médico</th>
              <th>Data</th>
              <th>Clima/Aviso</th>
              <th class="text-center">Ações</th> 
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in listaConsultas" :key="c._id">
              <td class="fw-bold">{{ c.pacienteId?.nome || 'Paciente não encontrado' }}</td>
              <td>{{ c.medico }}</td>
              <td>{{ new Date(c.data).toLocaleDateString('pt-BR') }}</td>
              <td>
                <small :class="c.previsaoChuva?.includes('⚠️') || c.previsaoChuva?.includes('Alerta') ? 'text-danger fw-bold' : 'text-muted'">
                  {{ c.previsaoChuva }}
                </small>
              </td>
              <td class="text-center">
                <button @click="excluirAgendamento(c._id)" class="btn btn-sm btn-outline-danger">
                  Cancelar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-if="listaConsultas.length === 0" class="text-center text-muted mt-3">Nenhuma consulta agendada.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const agenda = ref({ pacienteId: '', data: '', medico: 'Dr. Rodrigo Faro' })
const mensagemSucesso = ref('')
const alertaChuva = ref('')
const mensagemErro = ref('')
const listaConsultas = ref([])

//busca lista do servidor
async function buscarConsultas() {
  try {
    const res = await axios.get('https://projeto-clinica-mocc.onrender.com/agendamentos')
    listaConsultas.value = res.data
  } catch (error) {
    console.error("Erro ao carregar lista:", error)
  }
}

//criar agendamento
async function agendar() {
  mensagemSucesso.value = ''; alertaChuva.value = ''; mensagemErro.value = ''
  try {
    const res = await axios.post('http://localhost:3000/agendamentos', agenda.value)
    mensagemSucesso.value = "✅ " + res.data.mensagem
    if (res.data.detalhes?.previsaoChuva) alertaChuva.value = res.data.detalhes.previsaoChuva
    agenda.value = { pacienteId: '', data: '', medico: 'Dr. Rodrigo Faro' }
    buscarConsultas()
  } catch (e) {
    mensagemErro.value = "❌ " + (e.response?.data || "Erro ao agendar.")
  }
}

//excluir um único
async function excluirAgendamento(id) {
  if (confirm("Deseja cancelar esta consulta?")) {
    try {
      await axios.delete(`http://localhost:3000/agendamentos/${id}`)
      buscarConsultas()
    } catch (error) {
      alert("Erro ao excluir.")
    }
  }
}

// Limpar tudo
async function limparTudo() {
  if (confirm("Isso vai apagar TODOS os agendamentos. Tem certeza?")) {
    try {
      await axios.delete('http://localhost:3000/agendamentos-reset')
      buscarConsultas()
    } catch (error) {
      alert("Erro ao limpar lista.")
    }
  }
}

onMounted(buscarConsultas)
</script>