const {
    MessageType,
    Presence,
    Mimetype,
    GroupSettingChange
} = require('@adiwajshing/baileys')
const fs = require('fs')
const db = require('./database')

module.exports = processarMensagem = async (client, message) => {
    try {
        if (!message.message.conversation) return
        if (message.key.fromMe) return
        const from = message.key.remoteJid
        const isFromMe = message.key.fromMe
        const content = message.message
        const type = Object.keys(message.message)[0]
        const sender = message.key.remoteJid
        var username = client.contacts[sender] != undefined ? client.contacts[sender].vname || client.contacts[sender].notify : undefined
        const { text, extendedText, contact, location, liveLocation, image, video, sticker, document, audio, product } = MessageType
        if (type == 'conversation') {
            body = (message.message.conversation) ? message.message.conversation : ''
        } else if (type == 'imageMessage') {
            body = (message.message.imageMessage.caption) ? message.message.imageMessage.caption : ''
        } else if (type == 'videoMessage') {
            body = (message.message.videoMessage.caption) ? message.message.videoMessage.caption : ''
        } else if (type == 'extendedTextMessage') {
            body = (message.message.extendedTextMessage) ? message.message.extendedTextMessage.text : ''
        } else {
            body = ''
        }
        var mensagens = await db.obterMensagens()
        for (mensagem of mensagens) {
            // EXCLUI O BOTÃO SOZINHO APÓS X HORAS
            if (Date.now() > mensagem.tempo) {
                return db.removerMensagem(mensagem.id).then(async () => {
                    db.alterarEtapa(sender, 'cadastrar')
                })
            }

            // SE A MENSAGEM MENCIONADA FOR IGUAL O ID DO BOTÃO
            if (sender == mensagem.usuario) {
                if (body.length < 3) return client.sendMessage(from, 'Seu nome precisar conter no mínimo 3 letras.', text, { quoted: message})
                if (body.length >= 50) return client.sendMessage(from, 'Nome muito longo.', text, { quoted: message})
                db.alterarNome(sender, body).then(async () => {
                    db.alterarEtapa(sender, 'quase-cadastrado')
                    db.removerMensagem(mensagem.id)
                    var tempo = new Date()
                    tempo.setHours(new Date().getHours()+2)
                    await client.sendMessage(from, {
                        contentText: `Tudo certo, ${body}.\n`+
                        "Você gostaria de receber nossas promoções?",
                        footerText: 'Você poderá cancelar a qualquer momento.',
                        buttons: [
                          {buttonId: 'sim', buttonText: {displayText: 'Sim'}, type: 1},
                          {buttonId: 'nao', buttonText: {displayText: 'Não'}, type: 1},              
                        ],
                        headerType: 1
                    }, MessageType.buttonsMessage).then(idBotao => {
                        db.adicionarBotao(idBotao.key.id, funcao = 'cadastro-promocao', util = {  }, opcoes = ['sim','nao'], sender, tempo = tempo.getTime() )
                    })
                })
            }
        }
        





















    } catch (err) {
        console.log(err)
    }
}