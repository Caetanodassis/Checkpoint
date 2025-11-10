// routes/usuario.js
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// Simples rota de login (não inclui JWT/sessão)
router.post('/login', usuarioController.loginUsuario); 

module.exports = router;