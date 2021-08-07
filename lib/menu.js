const {
    MessageType,
    Presence,
    Mimetype,
    GroupSettingChange
} = require('@adiwajshing/baileys')
const fs = require('fs')
const db = require('./database')

module.exports = menu = async (client, message, nomeCompleto) => {
    try {
        if (!message.message.conversation) return
        if (message.key.fromMe) return
        const from = message.key.remoteJid
        const isFromMe = message.key.fromMe
        const content = message.message
        const type = Object.keys(message.message)[0]
        const sender = message.key.remoteJid
        var username = nomeCompleto
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

        var tudo = [
        { title: 'Lanches',
        rows: [
        { title: 'X-Salada\nPreço: R$ 9,90', description: 'Pão, queijo, presunto, tomate, alface, hamburguer 90g, maionese.', rowId: 'xsalada' },
        { title: 'X-Bacon\nPreço: R$ 12,00', description: 'Pão, queijo, presunto, tomate, alface, hamburguer 90g, maionese, bacon.', rowId: 'xbacon' }]
        },
        { title: 'Refrigerantes',
        rows: [
        { title: 'Coca-Cola 350ml\nPreço: R$ 5,00', description: '', rowId: 'cocacola350ml' },
        { title: 'Coca-Cola 2L\nPreço: R$ 12,00', description: '', rowId: 'cocacola2l' }]
        },
        ]

        client.sendMessage(from, {
            buttonText: 'Cardápio',
            description: `Olá, ${nomeCompleto}.\nEste é o nosso cardápio.`,
            sections: tudo,
            listType: 1
            }, MessageType.listMessage)

        // client.sendMessage(from, {
        // buttonText: 'Cardápio',
        // description: `Olá, ${nomeCompleto}.\nEste é o nosso cardápio.`,
        // sections: [
        // { title: 'Lanches',
        // rows: [
        // { title: 'X-Salada', description: `Preço: R$ 9,90`, rowId: 'xsalada' },
        // { title: 'X-Bacon', description: `Preço: R$ 11,90`, rowId: 'xbacon' }]
        // },
        // { title: 'Refrigerantes',
        // rows: [
        // { title: 'Coca-cola 350ml', description: `Preço: R$ 5,00`, rowId: 'coca350ml' },
        // { title: 'Coca-cola 2L', description: `Preço: R$ 12,00`, rowId: 'coca2l' }]
        // },
        // ],
        // listType: 1
        // }, MessageType.listMessage)
















    } catch (err) {
        console.log(err)
    }
}