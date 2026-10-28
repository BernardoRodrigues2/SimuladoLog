const { Carga, Entrega, Funcionario, Motorista } = require('./models/rel')

const conn = require('./db/conn')

async function sincronizarTabelas(){

    try {
        await conn.sync({ force: true })
        console.log('Tabelas sincronizadas com sucesso!')

    } catch (err) {
        console.error('Erro ao sincronizar tabelas', err)
    }finally{
        conn.close()
        console.log('Fechando a conexão com o banco de dados!')
    }
}

sincronizarTabelas()