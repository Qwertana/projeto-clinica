Sistema de Gestão de Clínica Médica - Self-Care Clinic
Este é um projeto Full Stack completo para gerenciamento de clínicas, permitindo o cadastro de pacientes com busca automática de endereço e agendamento de consultas com integração de previsão do tempo. Criado para AVA2 de Desenvolvimento Backend I na Universidade Veiga de Almeida.

•Demonstração:
O projeto está no ar e pode ser acessado nos links abaixo:

Frontend: https://projeto-clinica-ashy.vercel.app

Backend (API): https://projeto-clinica-mocc.onrender.com

•Tecnologias Utilizadas:
*Frontend
Vue.js 3: Framework progressivo para a interface.

Vite: Ferramenta de build ultra-rápida.

Bootstrap 5: Estilização responsiva e moderna.

Axios: Consumo de APIs REST.

Vercel: Hospedagem do Front-end.

*Backend
Node.js & Express: Servidor de alta performance.

TypeScript: Segurança e tipagem no código.

MongoDB Atlas: Banco de dados NoSQL na nuvem.

Mongoose: Modelagem de dados e conexão com o banco.

Render: Hospedagem do Back-end.

•Funcionalidades Principais:
*Autenticação Completa: Sistema de Login e Cadastro de usuários com criptografia de senhas (BCrypt).

*Cadastro Inteligente de Pacientes: Ao digitar o CEP, o sistema utiliza a API ViaCEP para preencher o endereço automaticamente.

*Agendamento com Alerta Climático: Ao agendar uma consulta, o sistema consome a API OpenWeather para verificar a previsão do tempo na cidade do paciente e exibe alertas caso haja previsão de chuva.

*Gestão de Consultas: Listagem em tempo real e opção de cancelamento de agendamentos.

•Como rodar o projeto localmente
*Clone o repositório:
Bash
git clone https://github.com/seu-usuario/seu-repositorio.git

*Configure o Backend:
Entre na pasta backend.

Crie um arquivo .env com sua MONGODB_URI e OPENWEATHER_KEY.

Rode npm install e npm run dev.

*Configure o Frontend:

Entre na pasta frontend.

Rode npm install e npm run dev.

Acesse http://localhost:5173.

•Autora
Ana Júlia Moreira