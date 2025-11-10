// controllers/listaController.js
const db = require('../db');

// Função para listar todas as listas (ex: Quer Jogar, Jogados, Favoritos)
// do usuário logado (assumindo que o id_usuario virá do corpo da requisição ou de um token)
const listarListasPorUsuario = async (req, res) => {
    // Para simplificar, vamos assumir que o id_usuario é passado como um parâmetro na URL (ex: /api/listas/1)
    const id_usuario = req.params.id_usuario; 

    if (!id_usuario) {
        return res.status(400).json({ erro: 'ID do usuário é obrigatório.' });
    }

    try {
        const query = `
            SELECT 
                TL.nm_lista AS list_name,
                TJO.nm_jogo AS game_title,
                TJO.id_jogo AS game_id,
                TL.gostei AS is_favorite
            FROM "TAB_LISTA" TL
            JOIN "TAB_JOGOS" TJO ON TL."TAB_JOGOS_id_jogo" = TJO.id_jogo
            WHERE TL.id_usuario = $1
            ORDER BY TL.nm_lista, TJO.nm_jogo;
        `;
        
        const result = await db.query(query, [id_usuario]);
        
        // Agrupa os jogos por nome de lista (Quer Jogar, Jogado, etc.) para o frontend
        const listasAgrupadas = result.rows.reduce((acc, current) => {
            const nomeLista = current.list_name || (current.is_favorite ? 'Favoritos' : 'Outros');
            
            if (!acc[nomeLista]) {
                acc[nomeLista] = {
                    title: nomeLista,
                    games: []
                };
            }
            
            acc[nomeLista].games.push({
                id: current.game_id,
                title: current.game_title,
                is_favorite: current.is_favorite,
                // Adicione outros dados do jogo que você precisa no frontend aqui
            });
            
            return acc;
        }, {});

        // Converte o objeto de listas agrupadas em um array para o frontend
        const listas = Object.values(listasAgrupadas);

        res.status(200).json(listas);
    } catch (error) {
        console.error('Erro ao listar listas do usuário:', error);
        res.status(500).json({ erro: 'Erro interno ao buscar listas.' });
    }
};

// Exemplo de função para adicionar um jogo a uma lista
const adicionarJogoALista = async (req, res) => {
    const { id_usuario, id_jogo, nome_lista, gostei } = req.body; // id_jogo é o id da TAB_JOGOS
    
    // Simples validação
    if (!id_usuario || !id_jogo) {
        return res.status(400).json({ erro: 'ID de usuário e jogo são obrigatórios.' });
    }

    try {
        // Verifica se o jogo já está na lista para evitar duplicatas (opcional)
        // Se a lista não for única, você pode remover esta verificação.

        const query = `
            INSERT INTO "TAB_LISTA" (gostei, nm_lista, id_usuario, "TAB_JOGOS_id_jogo")
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const result = await db.query(query, [gostei, nome_lista, id_usuario, id_jogo]);

        res.status(201).json({ mensagem: 'Jogo adicionado à lista com sucesso!', lista_item: result.rows[0] });

    } catch (error) {
        console.error('Erro ao adicionar jogo à lista:', error);
        res.status(500).json({ erro: 'Erro interno ao adicionar jogo à lista.' });
    }
};

module.exports = {
    listarListasPorUsuario,
    adicionarJogoALista,
};