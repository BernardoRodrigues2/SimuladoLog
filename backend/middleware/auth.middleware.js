const CryptoJS = require('crypto-js')
const Key = 'segredo'

function authMiddleware(req,res,next){
    const token = req.headers['authorization']
    console.log('Token:', token)

    if(!token){
        return res.status(401).json({ message: 'Acesso negado! Token não fornecido'})
    }

    try {
        const bytes = CryptoJS.AES.decrypt(token, Key)
        const dadosDescriptografados = bytes.toString(CryptoJS.enc.Utf8)

        if(!dadosDescriptografados){
            return res.status(401).json({ message: 'Token inválido!'})
        }

        const payload = JSON.parse(dadosDescriptografados)

        if(Date.now() > payload.expiraEm){
            return res.status(401).json({ message: 'Tempo expirado! Faça o login novamente para continuar'})
        }

        req.funcionario = payload
        next()

    } catch (err) {
        console.error('Erro ao realizar operação de Login!', err)
        return res.status(500).json({ message: 'Erro ao realizar operação de Login!'})
    }
}

module.exports = authMiddleware