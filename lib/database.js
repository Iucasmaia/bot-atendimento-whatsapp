const { AsyncNedb } = require('nedb-async')
var db = {}
db.usuario = new AsyncNedb({filename : './database/db/usuario.db', autoload: true})
db.botao = new AsyncNedb({filename : './database/db/botao.db', autoload: true})
db.mensagem = new AsyncNedb({filename : './database/db/mensagem.db', autoload: true})
db.item = new AsyncNedb({filename : './database/db/item.db', autoload: true})

module.exports = {
    // BOTAO
    adicionarBotao: async(id, funcao, util, opcoes, usuario, tempo) =>{
        var dadosData = {
            id,
            funcao,
            util,
            opcoes,
            usuario,
            tempo
        }
        await db.botao.asyncInsert(dadosData)
    },
    removerBotao: async (id) =>{
        await db.botao.asyncRemove({ id: id }, { multi: true })
    },
    obterBotoes: async () => {
        let botoes = await db.botao.asyncFind({})
        return botoes
    },
    // endereco, complemento, numero, bairro, troco, pagamento
    // USUÁRIOS
    adicionarUsuario: async (id, nomeCompleto, etapa, promocao) => {
        var dados = {
            id,
            nomeCompleto,
            etapa,
            promocao
        }
        await db.usuario.asyncInsert(dados)
    },
    alterarNome: async (id, nome) => {
        await db.usuario.asyncUpdate({id}, {$set: {nomeCompleto: nome}})
    },
    alterarPromocao: async (id, valor) => {
        await db.usuario.asyncUpdate({id}, {$set: {promocao: valor}})
    },
    removerUsuario: async (id) => {
        await db.usuario.asyncRemove({ id: id}, { multi: true })
    },
    obterUsuario: async (id) => {
        let dadosUsuario = await db.usuario.asyncFindOne({ id })
        if(dadosUsuario == null) return false
        return dadosUsuario
    },
    alterarEtapa: async (id, etapa) => {
        await db.usuario.asyncUpdate({id}, {$set: {etapa: etapa}})
    },
    // MENSAGEM
    adicionarMensagem: async(id, funcao, util, usuario, tempo) =>{
        var dadosData = {
            id,
            funcao,
            util,
            usuario,
            tempo
        }
        await db.mensagem.asyncInsert(dadosData)
    },
    removerMensagem: async (id) =>{
        await db.mensagem.asyncRemove({ id: id }, { multi: true })
    },
    obterMensagem: async (id) => {
        let dadosMensagem = await db.mensagem.asyncFindOne({ id })
        if(dadosMensagem == null) return false
        return dadosMensagem
    },
    obterMensagens: async () => {
        let msgs = await db.mensagem.asyncFind({})
        return msgs
    },
    // ITENS
    adicionarItem: async(id, nome, valor) =>{
        var dadosItem = {
            id,
            nome,
            valor
        }
        await db.item.asyncInsert(dadosItem)
    },
    removerItem: async (id) =>{
        await db.item.asyncRemove({ id: id }, { multi: true })
    },
    obterItem: async (id) => {
        let dadosItem = await db.item.asyncFindOne({ id })
        if(dadosItem == null) return false
        return dadosItem
    },
    obterItens: async () => {
        let itens = await db.item.asyncFind({})
        return itens
    },
    obterQuantidade: async () => {
        var qntd = await db.item.asyncCount({})
        return qntd
    }
}
