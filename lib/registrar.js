const {
    MessageType,
    Presence,
    Mimetype,
    GroupSettingChange
} = require('@adiwajshing/baileys')
const fs = require('fs')
const db = require('./database')


module.exports = registrar = async (client, message) => {
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
            var body = (message.message.conversation) ? message.message.conversation : ''
        } else if (type == 'imageMessage') {
            var body = (message.message.imageMessage.caption) ? message.message.imageMessage.caption : ''
        } else if (type == 'videoMessage') {
            var body = (message.message.videoMessage.caption) ? message.message.videoMessage.caption : ''
        } else if (type == 'extendedTextMessage') {
            var body = (message.message.extendedTextMessage) ? message.message.extendedTextMessage.text : ''
        } else {
            var body = ''
        }
        var tempo = new Date()
        tempo.setHours(new Date().getHours()+2)
        await client.sendMessage(from, {
            contentText: `Olá, ${username}.\nParece que você ainda não possui cadastro em nosso sistema.\n\n`+
            "Gostaria de realizar seu cadastro agora?",
            footerText: '\nÉ um processo simples e não solicitaremos informações sensíveis.',
            buttons: [
              {buttonId: 'sim', buttonText: {displayText: 'Sim'}, type: 1},
              {buttonId: 'nao', buttonText: {displayText: 'Não'}, type: 1},              
            ],
            headerType: 1
        }, MessageType.buttonsMessage).then(idBotao => {
            db.adicionarBotao(idBotao.key.id, funcao = 'cadastro', util = {  }, opcoes = ['sim','nao'], sender, tempo = tempo.getTime() )
        })























    } catch (err) {
        console.log(err)
    }
}