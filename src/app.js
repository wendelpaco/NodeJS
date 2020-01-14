import 'dotenv/config'

import express from 'express'
import morgon from 'morgan'
import bodyParser from 'body-parser'
import streamLogger from './lib/loggers'

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(morgon("combined", { stream: streamLogger }))

//Controle de Rotas da Aplicação
require('./router/index')(app)

app.listen(3001, () => {
    console.log(`A aplicação está ouvindo a porta 3000`)
})