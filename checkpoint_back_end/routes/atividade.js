// routes/atividade.js
const express = require('express');
const router = express.Router();
const atividadeController = require('../controllers/atividadeController');

router.get('/', atividadeController.listarAtividadeRecente);

module.exports = router;