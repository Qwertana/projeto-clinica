<template>
  <div class="container mt-5">
    <h2 class="mb-4">Consultas Agendadas</h2>
    
    <div class="card p-4 shadow">
      <table class="table table-hover align-middle">
        <thead class="table-light">
          <tr>
            <th>Paciente</th>
            <th>Médico</th>
            <th>Data</th>
            <th>Status Climático</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in consultas" :key="c._id">
            <td class="fw-bold">{{ c.pacienteId?.nome || 'Paciente não encontrado' }}</td>
            <td>{{ c.medico }}</td>
            <td>{{ new Date(c.data).toLocaleDateString('pt-BR') }}</td>
            <td>
              <span :class="c.previsaoChuva.includes('!!') ? 'text-danger fw-bold' : 'text-success'">
                {{ c.previsaoChuva }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="consultas.length === 0" class="text-center text-muted mt-3">Nenhuma consulta agendada.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const consultas = ref([])

async function buscarConsultas() {
  try {
    const res = await axios.get('http://localhost:3000/agendamentos')
    consultas.value = res.data
    console.log("Consultas carregadas:", res.data)
  } catch (error) {
    console.error("Erro ao buscar consultas:", error)
  }
}

onMounted(buscarConsultas)
</script>