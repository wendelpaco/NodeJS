import express from 'express'
import { default as notAuthenticate } from '../app/controller/projectController'

const Router = express.Router()


Router.post('/create', notAuthenticate.storeCadastro)
Router.post('/esqueci-minha-senha', notAuthenticate.storeEsqueciSenha)
Router.post('/resetar-senha', notAuthenticate.storeResetSenha)
Router.post('/token', notAuthenticate.storeToken)

module.exports = (app) => app.use('/v1/user', Router)