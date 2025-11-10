// controllers/atividadeController.js
const db = require('../db');

const formatarTempo = (data) => {
    const agora = new Date();
    const diferencaMs = agora - new Date(data);
    const segundos = Math.floor(diferencaMs / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);

    if (segundos < 60) return 'agora mesmo';
    if (minutos < 60) return `há ${minutos} minutos`;
    if (horas < 24) return `há ${horas} horas`;
    if (dias < 7) return `há ${dias} dias`;
    
    return new Date(data).toLocaleDateString('pt-BR');
};

const listarAtividadeRecente = async (req, res) => {
    const limite = req.query.limit || 10;

    const query = `
        (
            -- Atividade de Avaliação/Comentário
            SELECT 
                'avaliacao' AS tipo_atividade,
                TUS.nm_usuario AS usuario,
                TJO.nm_jogo AS nome_jogo,
                TAV.nota AS valor,
                TCO.dt_comentario AS data_atividade,
                TJO.id_jogo AS id_jogo,
                TUS.nm_usuario_nick AS usuario_nick
            FROM "TAB_AVALIACAO" TAV
            JOIN "TAB_COMENTARIO" TCO ON TAV.TAB_COMENTARIO_id_comentario = TCO.id_comentario
            JOIN "TAB_USUARIO" TUS ON TCO.id_usuario = TUS.id_usuario
            JOIN "TAB_JOGOS" TJO ON TAV.TAB_JOGOS_id_jogo = TJO.id_jogo
        )
        UNION ALL
        (
            -- Atividade de Lista/Status (Marcar como Jogado/Favorito)
            SELECT
                'lista' AS tipo_atividade,
                TUS.nm_usuario AS usuario,
                TJO.nm_jogo AS nome_jogo,
                TLI.status_item AS valor, 
                TLI.dt_inclusao AS data_atividade,
                TJO.id_jogo AS id_jogo,
                TUS.nm_usuario_nick AS usuario_nick
            FROM "TAB_LISTA_ITENS" TLI
            JOIN "TAB_LISTA" TLI_PAI ON TLI.TAB_LISTA_id_lista = TLI_PAI.id_lista
            JOIN "TAB_USUARIO" TUS ON TLI_PAI.id_usuario = TUS.id_usuario
            JOIN "TAB_JOGOS" TJO ON TLI.TAB_JOGOS_id_jogo = TJO.id_jogo
            WHERE TLI.status_item IN ('Jogado', 'Favorito', 'Quer Jogar')
        )
        ORDER BY data_atividade DESC
        LIMIT $1;
    `;

    try {
        const result = await db.query(query, [limite]);
        
        const atividades = result.rows.map(item => {
            let acao = '';
            let avatarLetra = item.usuario_nick ? item.usuario_nick.charAt(0).toUpperCase() : item.usuario.charAt(0).toUpperCase();
            
            if (item.tipo_atividade === 'avaliacao') {
                acao = `avaliou **${item.nome_jogo}** com nota ${item.valor.toFixed(1)} ⭐`;
            } else if (item.tipo_atividade === 'lista') {
                switch (item.valor) {
                    case 'Jogado':
                        acao = `marcou **${item.nome_jogo}** como jogado. ✓`;
                        break;
                    case 'Favorito':
                        acao = `adicionou **${item.nome_jogo}** aos favoritos. ♥`;
                        break;
                    case 'Quer Jogar':
                        acao = `adicionou **${item.nome_jogo}** à lista 'Quer Jogar'.`;
                        break;
                    default:
                        acao = `fez uma ação em **${item.nome_jogo}**.`;
                }
            }

            return {
                id_jogo: item.id_jogo,
                usuario: item.usuario,
                usuario_nick: item.usuario_nick,
                avatar: avatarLetra,
                acao: acao,
                tempo_decorrido: formatarTempo(item.data_atividade),
            };
        });
        
        res.status(200).json(atividades);
    } catch (error) {
        console.error('Erro ao listar atividades recentes:', error);
        res.status(500).json({ erro: 'Erro interno ao buscar atividade.' });
    }
};

module.exports = {
    listarAtividadeRecente
};