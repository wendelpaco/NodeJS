import express from 'express'
import { default as authenticate } from '../app/controller/authController'
import authMiddlewares from '../app/middlewares/auth'

const Router = express.Router()

//interceptor
Router.use(authMiddlewares)

Router.get('/', authenticate.index)
Router.get('/usuario/:id', authenticate.show)
    // Router.post('/cadastro', authenticate.storeCadastro)
    // Router.post('/token', authenticate.storeToken)
Router.put('/usuario/:id/editar', authenticate.update)
Router.delete('/usuario/:id/apagar', authenticate.destroy)


module.exports = (app) => app.use('/v1/auth', Router)