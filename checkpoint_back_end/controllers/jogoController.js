// controllers/jogoController.js
const db = require('../db');

// Lista todos os jogos
const listarJogos = async (req, res) => {
    try {
        const query = `
            SELECT 
                id_jogo AS id, 
                nm_jogo AS title, 
                filtro AS genre,
                classificacao AS rating_literal, -- Ex: '16 anos'
                dt_jogo AS release_date,
                (SELECT AVG(nota) FROM "TAB_AVALIACAO" WHERE "TAB_JOGOS_id_jogo" = TJO.id_jogo) AS rating_avg
            FROM "TAB_JOGOS" TJO
            ORDER BY rating_avg DESC NULLS LAST, id_jogo ASC;
        `;
        const result = await db.query(query);
        
        // Formata os dados para o frontend (baseado no games-data.js)
        const jogosFormatados = result.rows.map(jogo => ({
            id: jogo.id,
            title: jogo.title,
            genre: jogo.genre,
            rating: jogo.rating_avg ? parseFloat(jogo.rating_avg).toFixed(1) : 0,
            year: new Date(jogo.release_date).getFullYear(),
            // Adicione aqui outros campos (platform, poster, description) conforme precisar
        }));

        res.status(200).json(jogosFormatados);
    } catch (error) {
        console.error('Erro ao listar jogos:', error);
        res.status(500).json({ erro: 'Erro interno ao buscar jogos.' });
    }
};

// Busca um jogo específico pelo ID
const buscarJogoPorId = async (req, res) => {
    const { id } = req.params;
    try {
        // Busca o jogo principal
        const jogoQuery = `
            SELECT 
                id_jogo AS id, 
                nm_jogo AS title, 
                filtro AS genre,
                classificacao AS rating_literal, 
                dt_jogo AS release_date,
                (SELECT AVG(nota) FROM "TAB_AVALIACAO" WHERE "TAB_JOGOS_id_jogo" = TJO.id_jogo) AS rating_avg
            FROM "TAB_JOGOS" TJO
            WHERE id_jogo = $1;
        `;
        const jogoResult = await db.query(jogoQuery, [id]);
        
        if (jogoResult.rows.length === 0) {
            return res.status(404).json({ erro: 'Jogo não encontrado.' });
        }
        
        const jogo = jogoResult.rows[0];

        // Busca avaliações e comentários
        const reviewsQuery = `
            SELECT 
                TUS.nm_usuario AS user,
                TAV.nota AS rating,
                TCO.comentario AS text,
                TCO.dt_comentario AS date
            FROM "TAB_AVALIACAO" TAV
            JOIN "TAB_COMENTARIO" TCO ON TAV.TAB_COMENTARIO_id_comentario = TCO.id_comentario
            JOIN "TAB_USUARIO" TUS ON TCO.id_usuario = TUS.id_usuario
            WHERE TAV."TAB_JOGOS_id_jogo" = $1
            ORDER BY TCO.dt_comentario DESC;
        `;
        const reviewsResult = await db.query(reviewsQuery, [id]);

        // Retorna o objeto do jogo com as avaliações
        const jogoFormatado = {
            id: jogo.id,
            title: jogo.title,
            genre: jogo.genre,
            rating: jogo.rating_avg ? parseFloat(jogo.rating_avg).toFixed(1) : 0,
            year: new Date(jogo.release_date).getFullYear(),
            reviews: reviewsResult.rows.map(review => ({
                ...review,
                rating: parseFloat(review.rating),
                date: new Date(review.date).toLocaleDateString('pt-BR'),
            })),
            // Adicione mais detalhes do jogo aqui se tiver na tabela TAB_JOGOS
        };

        res.status(200).json(jogoFormatado);
    } catch (error) {
        console.error('Erro ao buscar jogo por ID:', error);
        res.status(500).json({ erro: 'Erro interno ao buscar jogo.' });
    }
};

module.exports = {
    listarJogos,
    buscarJogoPorId,
};