const express = require('express')
const app = express()
const cors = require('cors')

const PORT = 3000
const hostname = 'localhost'

const conn = require('./db/conn')

require('./models/rel')

const authMiddleware = require('./middleware/auth.middleware')

const authController = require('./controller/auth.controller')
const cargaController = require('./controller/Carga.controller')
const entregaController = require('./controller/Entrega.controller')
const funcionarioController = require('./controller/Funcionario.controller')
const motoristaController = require('./controller/Motorista.controller')

// =============================== Middlewares =================================

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

// =============================================================================

// =================================== Rotas ===================================

// Rotas publicas -->
app.post('/funcionario', funcionarioController.cadastrar)
app.post('/login', authController.login)

app.get('/', (req,res)=> {
    res.status(200).json({ message: 'Aplicação rodando!'})
})

// Middleware para a validação das permissões de rotas
app.use(authMiddleware)

// Rotas privadas -->
app.post('/carga', cargaController.cadastrar)
app.post('/entrega', entregaController.cadastrar)
app.put('/entrega/:id', entregaController.atualizar)

// Rotas privadas do Crud -->
app.post('/motorista', motoristaController.cadastrar)
app.get('/motoristas', motoristaController.listar)
app.get('/motorista/:id', motoristaController.consultar)
app.put('/motorista/:id', motoristaController.atualizar)
app.delete('/motorista/:id', motoristaController.apagar)



// =============================================================================

// =================================== Server ==================================

conn.sync()
    .then(() => {
        app.listen(PORT, hostname, () => {
            console.log(`Aplicação rodando em http://${hostname}:${PORT}`)
        })
    })
    .catch((err) => {
        console.error('Erro ao rodar aplicação!')
    })

// =============================================================================