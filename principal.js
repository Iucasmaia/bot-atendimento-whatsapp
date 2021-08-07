const {
    MessageType,
    Presence,
    Mimetype,
    GroupSettingChange
} = require('@adiwajshing/baileys')
const fs = require('fs')
const { getGroupAdmins } = require('./lib/functions')
const db = require('./lib/database')
const processarBotao = require('./lib/processarBotao')
const registrar = require('./lib/registrar')
const processarMensagem = require('./lib/processarMensagem')
const menu = require('./lib/menu')


module.exports = principal = async (client, message) => {
    try {
        if (!message.messages) return
        message = JSON.parse(JSON.stringify(message)).messages[0]
        const from = message.key.remoteJid
        const isFromMe = message.key.fromMe
        const content = message.message
        const type = Object.keys(message.message)[0]
        const isGroupMsg = from.endsWith('@g.us')
        const groupMetadata = isGroupMsg ? await client.groupMetadata(from) : ''
	    const groupMembers = isGroupMsg ? groupMetadata.participants : ''
        const groupAdmins = isGroupMsg ? getGroupAdmins(groupMembers) : ''
        const sender = isGroupMsg ? message.participant : message.key.remoteJid
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

        if (message.message.buttonsResponseMessage) {
            return await processarBotao(client, message)
        }

        var registrado = await db.obterUsuario(sender)
        if (!registrado) {
            await db.adicionarUsuario(sender, null, 'cadastrar').then(async () => {
                return await registrar(client, message)
            })
        } else {
            if (registrado.etapa == 'cadastrar') {
                return await registrar(client, message)
            } else if (registrado.etapa == 'esperando-nome') {
                return await processarMensagem(client, message)
            } else if (registrado.etapa == 'quase-cadastrado') {
                return await processarBotao(client, message)
            } else if (registrado.etapa == 'cadastrado') {
                return await menu(client, message, registrado.nomeCompleto)
            }
        }
        
            // fs.writeFile('log.txt', JSON.stringify(message, null, "\t"), function (err) {
            // if (err) return console.log(err);
            // console.log('Adicionado ao log.txt');
            // });































    } catch (err) {
        console.log(err)
    }
}