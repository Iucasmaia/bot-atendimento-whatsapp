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
        if (!message.message.buttonsResponseMessage) return
        if (message.key.fromMe) return
        const from = message.key.remoteJid
        const isFromMe = message.key.fromMe
        const content = message.message
        const type = Object.keys(message.message)[0]
        const sender = message.key.remoteJid
        var username = client.contacts[sender] != undefined ? client.contacts[sender].vname || client.contacts[sender].notify : undefined
        const { text, extendedText, contact, location, liveLocation, image, video, sticker, document, audio, product } = MessageType
        const botaoSelecionado = message.message.buttonsResponseMessage.selectedButtonId
        const mensagemId = message.message.buttonsResponseMessage.contextInfo.stanzaId

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

        var botoes = await db.obterBotoes()
        for (botao of botoes) {
            // EXCLUI O BOTÃO SOZINHO APÓS X HORAS
            if (Date.now() > botao.tempo) {
                return db.removerBotao(botao.id)
            }
            // SE A MENSAGEM MENCIONADA FOR IGUAL O ID DO BOTÃO
            if (mensagemId == botao.id) {
                // SE FOR O BOTÃO DE CADASTRO
                if (botao.funcao == 'cadastro') {
                    // SE NÃO FOR QUEM MANDOU, NÃO FAÇA NADA
                    if (sender != botao.usuario) return
                    // SE APERTOU EM SIM
                    if (botaoSelecionado == botao.opcoes[0]) {
                        var tempo = new Date()
                        tempo.setHours(new Date().getHours()+2)
                        await client.sendMessage(from, {
                            contentText: `Ótimo, ${username}.\nMe informe seu nome completo.`,
                            footerText: '',
                            buttons: [
                            {buttonId: 'voltar', buttonText: {displayText: 'Voltar'}, type: 1},
                            {buttonId: 'cancelar', buttonText: {displayText: 'Cancelar'}, type: 1},              
                            ],
                            headerType: 1
                        }, MessageType.buttonsMessage).then(idBotao => {
                            db.alterarEtapa(sender, 'esperando-nome')
                            db.adicionarMensagem(idBotao.key.id, funcao = 'esperando-nome', util = { }, sender, tempo.getTime())
                            db.adicionarBotao(idBotao.key.id, funcao = 'esperando-nome', util = {  }, opcoes = ['voltar','cancelar'], sender, tempo = tempo.getTime() )
                        })
                    // SE APERTOU EM NÃO
                    } else if (botaoSelecionado == botao.opcoes[1]) {
                        return db.removerBotao(botao.id).then( () => {
                            db.removerMensagem(botao.id)
                            db.alterarEtapa(sender, 'cadastrar')
                            client.sendMessage(from, 'Tudo bem, quem sabe na próxima. 😕', text, { quoted: message})
                        })
                    }
                } else if (botao.funcao == 'esperando-nome') {
                    // SE NÃO FOR QUEM MANDOU, NÃO FAÇA NADA
                    if (sender != botao.usuario) return
                    // SE APERTOU EM VOLTAR
                    if (botaoSelecionado == botao.opcoes[0]) {
                        return db.removerBotao(botao.id).then(async () => {
                            db.removerMensagem(botao.id)
                            db.alterarEtapa(sender, 'cadastrar')
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
                        })
                    // SE APERTOU EM NÃO
                    } else if (botaoSelecionado == botao.opcoes[1]) {
                        return db.removerBotao(botao.id).then( () => {
                            db.removerMensagem(botao.id)
                            db.alterarEtapa(sender, 'cadastrar')
                            client.sendMessage(from, 'Tudo bem, quem sabe na próxima. 😕', text, { quoted: message})
                        })
                    }
                } else if (botao.funcao == 'cadastro-promocao') {
                    // SE NÃO FOR QUEM MANDOU, NÃO FAÇA NADA
                    if (sender != botao.usuario) return
                    // SE APERTOU EM SIM
                    if (botaoSelecionado == botao.opcoes[0]) {
                        db.removerBotao(botao.id).then(async () => {
                            db.alterarPromocao(sender, true)
                            db.alterarEtapa(sender, 'cadastrado')
                            client.sendMessage(from, 'Tudo certo, seu cadastro foi concluído. 🥳\nConfira nosso cardápio logo abaixo.', text, { quoted: message})
                            client.sendMessage(from, {
                                buttonText: 'Cardápio',
                                description: `Este é o nosso cardápio.`,
                                sections: [
                                { title: 'Lanches',
                                rows: [
                                { title: 'X-Salada', description: `Preço: R$ 9,90`, rowId: 'xsalada' },
                                { title: 'X-Bacon', description: `Preço: R$ 11,90`, rowId: 'xbacon' }]
                                },
                                { title: 'Refrigerantes',
                                rows: [
                                { title: 'Coca-cola 350ml', description: `Preço: R$ 5,00`, rowId: 'coca350ml' },
                                { title: 'Coca-cola 2L', description: `Preço: R$ 12,00`, rowId: 'coca2l' }]
                                },
                                ],
                                listType: 1
                                }, MessageType.listMessage)
                        })
                    // SE APERTOU EM NÃO
                    } else if (botaoSelecionado == botao.opcoes[1]) {
                        db.removerBotao(botao.id).then(async () => {
                            db.alterarPromocao(sender, false)
                            db.alterarEtapa(sender, 'cadastrado')
                            client.sendMessage(from, 'Tudo certo, seu cadastro foi concluído. 🥳\nConfira nosso cardápio logo abaixo.', text, { quoted: message})
                            client.sendMessage(from, {
                                buttonText: 'Cardápio',
                                description: `Este é o nosso cardápio.`,
                                sections: [
                                { title: 'Lanches',
                                rows: [
                                { title: 'X-Salada', description: `Preço: R$ 9,90`, rowId: 'xsalada' },
                                { title: 'X-Bacon', description: `Preço: R$ 11,90`, rowId: 'xbacon' }]
                                },
                                { title: 'Refrigerantes',
                                rows: [
                                { title: 'Coca-cola 350ml', description: `Preço: R$ 5,00`, rowId: 'coca350ml' },
                                { title: 'Coca-cola 2L', description: `Preço: R$ 12,00`, rowId: 'coca2l' }]
                                },
                                ],
                                listType: 1
                                }, MessageType.listMessage)
                        })
                    }
                }
            }
        }























    } catch (err) {
        console.log(err)
    }
}