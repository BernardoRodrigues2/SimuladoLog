const Funcionario = require('../models/Funcionario')

const CryptoJS = require('crypto-js')
const Key = 'segredo'

const login = async (req, res) => {
    const valores = req.body

    if (!valores.email || !valores.senha) {
        return res.status(400).json({ message: 'Todos os campos devem ser preenchidos!' })
    }

    try {
        const funcionario = await Funcionario.findOne({ where: { email: valores.email }})

        if(!funcionario){
            return res.status(404).json({ message: 'Não foi possivel encontrar funcionario com este email!'})
        }

        const bytes = CryptoJS.AES.decrypt(funcionario.senha, Key)
        const senhaBd = bytes.toString(CryptoJS.enc.Utf8)

        if(valores.senha !== senhaBd){
            return res.status(401).json({ message: 'Senha incorreta! ' })
        }

        const timeOut = 3 * 60 * 60 * 1000
        const tempoExpira = Date.now() + timeOut

        const payload = {
            idFuncionario: funcionario.codFuncionario,
            nome: funcionario.nome,
            expiraEm: tempoExpira
        }

        const token = CryptoJS.AES.encrypt(JSON.stringify(payload), Key).toString()
        
        return res.status(200).json({
            message: 'Login realizado com sucesso!',
            token: token,
            nome: funcionario.nome
        })
        
    } catch (err) {
        console.error('Erro ao realizar operação!', err)
        return res.status(500).json({ message: 'Erro ao realizar operação! '})
    }
}

module.exports = { login };