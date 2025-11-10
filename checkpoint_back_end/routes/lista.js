// routes/lista.js
const express = require('express');
const router = express.Router();
const listaController = require('../controllers/listaController');

// Rota para buscar as listas de um usuário (ex: GET /api/listas/1)
// O ID do usuário virá da URL para demonstração.
router.get('/:id_usuario', listaController.listarListasPorUsuario);

// Rota para adicionar um jogo a uma lista (ex: POST /api/listas)
router.post('/', listaController.adicionarJogoALista);

module.exports = router;