const Funcionario = require('../models/Funcionario')

const CryptoJS = require('crypto-js')
const Key = 'segredo'

const cadastrar = async (req,res) => {
    const valores = req.body

    if(!valores.nome || !valores.email || !valores.senha){
        return res.status(400).json({ message: 'Todos os campos devem ser preenchidos!' })
    }

    try {
        const senhaCripto = CryptoJS.AES.encrypt(valores.senha, Key).toString()

        await Funcionario.create({
            nome: valores.nome,
            email: valores.email,
            senha: senhaCripto
        })

        return res.status(201).json({ message: 'Dados cadastrados com sucesso!'})
        
    } catch (err) {
        console.error('Erro ao realizar operação!', err)
        return res.status(500).json({ message: 'Erro ao realizar operação! '})
    }
}

module.exports = { cadastrar }; 