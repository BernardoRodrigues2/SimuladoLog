const Carga = require('../models/Carga')

const cadastrar = async (req,res) => {
    const valores = req.body

    if(!valores.descricao || !valores.peso || !valores.volume || !valores.codRastreio || !valores.idMotorista){
        return res.status(400).json({ message: 'Todos os campos devem ser preenchidos!' })
    }

    try {
        await Carga.create(valores)
        return res.status(201).json({ message: 'Dados cadastrados com sucesso!'})
        
    } catch (err) {
        console.error('Erro ao realizar operação!', err)
        return res.status(500).json({ message: 'Erro ao realizar operação! '})
    }
}

module.exports = { cadastrar }; 