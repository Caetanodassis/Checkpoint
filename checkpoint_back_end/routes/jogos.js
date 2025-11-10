// routes/jogo.js
const express = require('express');
const router = express.Router();
const jogoController = require('../controllers/jogoController');

router.get('/', jogoController.listarJogos);
router.get('/:id', jogoController.buscarJogoPorId);
// Rotas de CRUD para admins/usuários autenticados (opcional, mas recomendado)
// router.post('/', jogoController.criarJogo); 

module.exports = router;