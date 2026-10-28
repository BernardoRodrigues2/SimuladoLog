const Entrega = require('../models/Entrega')

const cadastrar = async (req,res) => {
    const valores = req.body

    if(!valores.cidade || !valores.destino || !valores.status || !valores.data || !valores.hora || !valores.idCarga){
        return res.status(400).json({ message: 'Todos os campos devem ser preenchidos!' })
    }

    try {
        await Entrega.create(valores)
        return res.status(201).json({ message: 'Dados cadastrados com sucesso!'})
        
    } catch (err) {
        console.error('Erro ao realizar operação!', err)
        return res.status(500).json({ message: 'Erro ao realizar operação! '})
    }
}

const atualizar = async (req,res) => {
    const id = req.params.id
    const valores = req.body

    try {
        const dados = await Entrega.findByPk(id)
        
        if(!dados){
            return res.status(404).json({ message: 'Não foi possivel encontrar informações da Entrega'})
        }

        await Entrega.update(valores, { where: { codEntrega: id }})
        return res.status(200).json({ message: 'Dados atualizados com sucesso!'})

    } catch (err) {
        console.error('Erro ao realizar operação!', err)
        return res.status(500).json({ message: 'Erro ao realizar operação! '}) 
    }
}

module.exports = { cadastrar, atualizar }; 