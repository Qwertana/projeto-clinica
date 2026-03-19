import express, { Request, Response } from 'express';
import axios from 'axios';
import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3000;

// conexao do banco de dados
const MONGO_URI = "mongodb://admin:clinica123@ac-ufhda31-shard-00-00.eo5c0mi.mongodb.net:27017,ac-ufhda31-shard-00-01.eo5c0mi.mongodb.net:27017,ac-ufhda31-shard-00-02.eo5c0mi.mongodb.net:27017/?ssl=true&replicaSet=atlas-bp1uzi-shard-0&authSource=admin&appName=Cluster0";

mongoose.connect(MONGO_URI)
   .then(() => console.log("Conectado ao MongoDB com sucesso"))
   .catch((err) => console.error("Erro ao conectar ao MongoDB:", err));

//modelos-schemas
const Usuario = mongoose.model('Usuario', new mongoose.Schema({
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    senha: { type: String, required: true },
    cargo: { type: String, enum: ['secretario', 'paciente'], default: 'paciente' }
}));

const Paciente = mongoose.model('Paciente', new mongoose.Schema({
    nome: String,
    cpf: String,
    telefone: String,
    endereco: { logradouro: String, bairro: String, cidade: String, estado: String, cep: String },
    climaNoCadastro: String
}));

const Agendamento = mongoose.model('Agendamento', new mongoose.Schema({
    pacienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Paciente', required: true },
    data: Date,
    hora: String,
    medico: String,
    previsaoChuva: String
}));

//rotas
app.get('/', (req, res) => res.send('Servidor da Clínica Rodando com Sucesso! 🏥'));

// rota de clima
app.get('/clima/:cidade', async (req: Request, res: Response) => {
    const { cidade } = req.params;
    const apiKey = process.env.OPENWEATHER_KEY;
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&lang=pt_br&units=metric&appid=${apiKey}`;
        const resposta = await axios.get(url);
        res.json({
            temperatura: `${resposta.data.main.temp}°C`,
            descricao: resposta.data.weather[0].description,
            cidade: resposta.data.name
        });
    } catch (error) {
        res.status(500).send('Erro ao consultar o clima.');
    }
});

//rota de pacientes
app.get('/pacientes', async (req, res) => {
    const lista = await Paciente.find();
    res.json(lista);
});

app.post('/pacientes', async (req: Request, res: Response) => {
    try {
        const { nome, cpf, telefone, cep } = req.body;
        const cepRes = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        const endereco = {
            logradouro: cepRes.data.logradouro,
            bairro: cepRes.data.bairro,
            cidade: cepRes.data.localidade,
            estado: cepRes.data.uf,
            cep
        };
        const apiKey = process.env.OPENWEATHER_KEY;
        const climaRes = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${endereco.cidade}&lang=pt_br&units=metric&appid=${apiKey}`);
        const climaInfo = `${climaRes.data.main.temp}°C e ${climaRes.data.weather[0].description}`;

        const novo = new Paciente({ nome, cpf, telefone, endereco, climaNoCadastro: climaInfo });
        await novo.save();
        res.status(201).json({ mensagem: "Paciente cadastrado!", paciente: novo });
    } catch (error) {
        res.status(500).send("Erro ao salvar paciente.");
    }
});

app.delete('/pacientes/:id', async (req, res) => {
    await Paciente.findByIdAndDelete(req.params.id);
    res.json({ mensagem: "Paciente removido!" });
});

//rota de agendamentos
//ver todos
app.get('/agendamentos', async (req: Request, res: Response) => {
    try {
        const consultas = await Agendamento.find().populate('pacienteId');
        res.json(consultas);
    } catch (error) {
        res.status(500).json({ erro: "Erro ao buscar agendamentos" });
    }
});

//criar um novo
app.post('/agendamentos', async (req: Request, res: Response) => {
    try {
        const { pacienteId, data, hora, medico } = req.body;
        const paciente = await Paciente.findById(pacienteId);
        if (!paciente) return res.status(404).send("Paciente não encontrado.");

        const cidade = paciente.endereco?.cidade || "Rio de Janeiro";
        const apiKey = process.env.OPENWEATHER_KEY;
        const climaRes = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cidade}&lang=pt_br&units=metric&appid=${apiKey}`);
        
        const tempo = climaRes.data.weather[0].main.toLowerCase();
        const desc = climaRes.data.weather[0].description;
        let alerta = "Tempo firme planejado.";
        if (tempo.includes("rain") || tempo.includes("drizzle") || tempo.includes("chuva")) {
            alerta = `Alerta de Chuva (${desc}). Avise o paciente!`;
        }

        const novoAgendamento = new Agendamento({ pacienteId, data, hora, medico, previsaoChuva: alerta });
        await novoAgendamento.save();
        res.status(201).json({ mensagem: "Agendado com sucesso!", detalhes: novoAgendamento });
    } catch (error) {
        res.status(500).send("Erro ao agendar.");
    }
});

//deletar UM agendamento
app.delete('/agendamentos/:id', async (req: Request, res: Response) => {
    try {
        await Agendamento.findByIdAndDelete(req.params.id);
        res.json({ mensagem: "Agendamento removido!" });
    } catch (error) {
        res.status(500).send("Erro ao excluir.");
    }
});

//resetar TUDO
app.delete('/agendamentos-reset', async (req: Request, res: Response) => {
    try {
        await Agendamento.deleteMany({});
        res.json({ mensagem: "Todos os agendamentos foram limpos!" });
    } catch (error) {
        res.status(500).send("Erro ao limpar banco.");
    }
});

//autenticacao
app.post('/auth/cadastro', async (req: Request, res: Response) => {
    const { nome, email, senha, cargo } = req.body;
    const salt = await bcrypt.genSalt(10);
    const novo = new Usuario({ nome, email, senha: await bcrypt.hash(senha, salt), cargo });
    await novo.save();
    res.status(201).json({ mensagem: "Usuário criado!" });
});

app.post('/auth/login', async (req: Request, res: Response) => {
    try {
        const { email, senha } = req.body;
        const user = await Usuario.findOne({ email });
        
        if (user && await bcrypt.compare(senha, user.senha)) {
            return res.json({ 
                mensagem: "Login realizado!", 
                usuario: { nome: user.nome, cargo: user.cargo } 
            });
        } else {
            return res.status(401).send("Credenciais inválidas.");
        }
    } catch (error) {
        return res.status(500).send("Erro interno no servidor.");
    }
});

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));