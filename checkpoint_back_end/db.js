// db.js (Verifique as credenciais!)
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres', // SEU USUÁRIO
    host: 'localhost',
    database: 'CheckPoint', // NOME DO SEU BANCO
    password: '123456', // SUA SENHA
    port: 5432,
});

pool.on('error', (err) => {
    console.error('Erro inesperado no cliente idle', err);
    process.exit(-1);
});

console.log('Conexão com o PostgreSQL iniciada.');

module.exports = {
    query: (text, params) => pool.query(text, params),
};