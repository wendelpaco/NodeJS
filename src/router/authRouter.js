import express from 'express'
import { default as authenticate } from '../app/controller/authController'
import authMiddlewares from '../app/middlewares/auth'

const Router = express.Router()

//interceptor

Router.get('/users', authenticate.index)
// Router.use(authMiddlewares)
Router.get('/user/:id', authenticate.show)
Router.put('/user/:id/edit', authenticate.update)
Router.delete('/user/:id/delete', authenticate.destroy)


module.exports = (app) => app.use('/v1/auth', Router)