// controllers/usuarioController.js
const db = require('../db');

const loginUsuario = async (req, res) => {
    const { email, senha } = req.body;
    
    // ATENÇÃO: Em um app real, a senha deve ser hasheada (ex: bcrypt)
    const query = `
        SELECT 
            id_usuario, 
            nm_usuario, 
            nm_usuario_nick
        FROM "TAB_USUARIO"
        WHERE email = $1 AND senha = $2;
    `;

    try {
        const result = await db.query(query, [email, senha]);

        if (result.rows.length === 0) {
            return res.status(401).json({ erro: 'Credenciais inválidas.' });
        }

        const usuario = result.rows[0];
        // Você pode configurar um token JWT aqui
        res.status(200).json({ 
            mensagem: 'Login bem-sucedido!', 
            usuario: {
                id: usuario.id_usuario,
                nome: usuario.nm_usuario,
                nick: usuario.nm_usuario_nick
            }
        });
    } catch (error) {
        console.error('Erro durante o login:', error);
        res.status(500).json({ erro: 'Erro interno do servidor.' });
    }
};

module.exports = {
    loginUsuario,
};