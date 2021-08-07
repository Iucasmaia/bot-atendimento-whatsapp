const {
    WAConnection,
    MessageType,
    Presence,
    Mimetype,
    GroupSettingChange
} = require('@adiwajshing/baileys')
const principal = require('./principal')
const fs = require("fs")
const moment = require('moment-timezone')
const { getRandom, getBuffer, getGroupAdmins } = require('./lib/functions')

async function starts() {
    const client = new WAConnection()
    // LOGS
    client.logger.level = 'warn'
    // EXIBE O QR CODE
    client.on('qr', () => {
        const time_connecting = moment.tz('America/Sao_Paulo').format('HH:mm:ss')
        console.log(time_connecting+' | Escaneie o código QR no seu WhatsApp.')
    })
    // ABRE A SESSÃO SALVA
    fs.existsSync('./session.json') && client.loadAuthInfo('./session.json')
    // EXIBE O ESTADO DA CONEXÃO
    client.on('connecting', () => {
        const time_connecting = moment.tz('America/Sao_Paulo').format('HH:mm:ss')
        console.log(time_connecting+' | Conectando...')
    })
    // EXIBE O ESTADO DA CONEXÃO COM SUCESSO
    client.on('open', () => {
        const time_connecting = moment.tz('America/Sao_Paulo').format('HH:mm:ss')
        console.log(time_connecting+' | Conexão efetuada com sucesso!')
    })
    // EFETUA A CONEXÃO DIRETA
    await client.connect({ timeoutMs: 30 * 1000 })
    fs.writeFileSync('./session.json', JSON.stringify(client.base64EncodedAuthInfo(), null, '\t'))

    // QUANDO HOUVER NOVA MENSAGEM
    client.on('chat-update', async(message) => {
        // if (!message.messages) return
        // if (message.key && message.key.remoteJid == 'status@broadcast') return
        // if (message.key.fromMe) return
        await principal(client, message)
        // console.log(message)
        // console.log(client)
    })
}
starts()
