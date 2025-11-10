// index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const path = require('path');

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir arquivos estáticos (HTML, CSS, JS, Imagens)
app.use(express.static(path.join(__dirname, 'public'))); // Garanta que a pasta 'public' existe

// ------------------------------------------------------------------
// ROTAS DA API - Mantenha esta seção apenas UMA VEZ
// ------------------------------------------------------------------
// Rotas da API
const usuarioRoutes = require('./routes/usuario');
const jogoRoutes = require('./routes/jogos');
const atividadeRoutes = require('./routes/atividade');
const listaRoutes = require('./routes/lista'); // <--- ESSA LINHA PRECISA ESTAR AQUI

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/jogos', jogoRoutes);
app.use('/api/atividade', atividadeRoutes);
app.use('/api/listas', listaRoutes); // <--- Assim, a variável já existe quando usada
// ------------------------------------------------------------------

// Rota de teste
app.get('/api/status', (req, res) => {
    res.status(200).json({ status: 'Online', service: 'Checkpoint API' });
});

// Iniciar o Servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}/inicio.html`);
});