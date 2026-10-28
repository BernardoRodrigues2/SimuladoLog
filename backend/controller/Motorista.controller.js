const Motorista = require('../models/Motorista')

const CryptoJS = require('crypto-js')
const Key = 'segredo'

const cadastrar = async (req,res) =>{
    const valores = req.body

    if(!valores.nome || !valores.cnh || !valores.cpf || !valores.telefone){
        return res.status(400).json({ message: 'Todos os campos devem ser preenchidos!' })
    }

    if(valores.cpf.length !== 11){
        return res.status(400).json({ message: 'O Cpf deve conter exatamente 11 digitos'})
    }

    try {
        const cnhCriptografada = CryptoJS.AES.encrypt(valores.cnh, Key).toString()
        const cpfCriptografado = CryptoJS.AES.encrypt(valores.cpf, Key).toString()

        await Motorista.create({
            nome: valores.nome,
            cnh: cnhCriptografada,
            cpf: cpfCriptografado,
            telefone: valores.telefone
        })

        return res.status(201).json({ message: 'Dados cadastrados com sucesso! '})
        
    } catch (err) {
        console.error('Erro ao realizar operação!', err)
        return res.status(500).json({ message: 'Erro ao realizar operação! '})
    }
}

const listar = async (req,res) => {
    try {
        const motorista = await Motorista.findAll()

        const resultado = []

        motorista.forEach((el)=>{
            let cnhDescript = ''
            let cpfDescript = ''

            try {
                const bytes = CryptoJS.AES.decrypt(el.cnh, Key)
                const bytes2 = CryptoJS.AES.decrypt(el.cpf, Key)

                 cnhDescript = bytes.toString(CryptoJS.enc.Utf8)
                 cpfDescript = bytes2.toString(CryptoJS.enc.Utf8)

            } catch (err) {
                cnhDescript = 'Erro ao descriptografar'
                cpfDescript = 'Erro ao descriptografar'
                console.error(cnhDescript, err)
                console.error(cpfDescript, err)
            }
            
            resultado.push({
                codMotorista: el.codMotorista,
                nome: el.nome,
                cnh: cnhDescript,
                cpf: cpfDescript,
                telefone: el.telefone
            })
        })

        return res.status(200).json(resultado)

    } catch (err) {
        console.error('Erro ao realizar operação!', err)
        return res.status(500).json({ message: 'Erro ao realizar operação! '})
    }
}

const consultar = async (req,res) => {
    const id = req.params.id

    try {
        const dados = await Motorista.findByPk(id)

        if(!dados){
            return res.status(404).json({ message: 'Não foi possivel encontrar informações do Motorista'})
        }

        const bytes = CryptoJS.AES.decrypt(dados.cnh, Key)
        const bytes2 = CryptoJS.AES.decrypt(dados.cpf, Key)

        const cnhDescript = bytes.toString(CryptoJS.enc.Utf8)
        const cpfDescript = bytes2.toString(CryptoJS.enc.Utf8)

        return res.status(200).json({
            codMotorista: dados.codMotorista,
            nome: dados.nome,
            cnh: cnhDescript,
            cpf: cpfDescript,
            telefone: dados.telefone
        })

    } catch (err) {
        console.error('Erro ao realizar operação!', err)
        return res.status(500).json({ message: 'Erro ao realizar operação! '})  
    }
}

const atualizar = async (req,res) => {
    const id = req.params.id
    const valores = req.body

    try {
        const dados = await Motorista.findByPk(id)
        
        if(!dados){
            return res.status(404).json({ message: 'Não foi possivel encontrar informações do Motorista'})
        }

        const dadosAtualizados = { ...valores }
        
        if(valores.cnh){
            dadosAtualizados.cnh = CryptoJS.AES.encrypt(valores.cnh, Key).toString()
        }

        if(valores.cpf){
            if(valores.cpf.length !== 11){
                return res.status(400).json({ message: 'O Cpf deve conter exatamente 11 digitos'})
            }

            dadosAtualizados.cpf = CryptoJS.AES.encrypt(valores.cpf, Key).toString()
        }

        await Motorista.update(dadosAtualizados, { where: { codMotorista: id }})
        return res.status(200).json({ message: 'Dados atualizados com sucesso!'})

    } catch (err) {
        console.error('Erro ao realizar operação!', err)
        return res.status(500).json({ message: 'Erro ao realizar operação! '}) 
    }
}

const apagar = async (req,res) => {
    const id = req.params.id

    try {
        const dados = await Motorista.findByPk(id)
        
        if(!dados){
            return res.status(404).json({ message: 'Não foi possivel encontrar informações do Motorista'})
        }

        await Motorista.destroy({ where: { codMotorista: id }})
        return res.status(200).json({ message: 'Dados excluidos com sucesso!'})

    } catch (err) {
        console.error('Erro ao realizar operação!', err)
        return res.status(500).json({ message: 'Erro ao realizar operação! '}) 
    }
}

module.exports = { cadastrar, listar, consultar, atualizar, apagar };