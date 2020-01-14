const express = require('express')
const User = require('../models/userModels')

import mid from '../middlewares/auth'

const router = express.Router()

router.use(mid)

router.get('/', async(req, res) => {

    const users = await User.find()

    return res.send({ users })
})

router.post('/register', async(req, res) => {

    const { email } = req.body

    try {

        if (await User.findOne({ email }))
            return res.status(400).send({ trace: 'O e-mail já está sendo usado por outra pessoa.' })

        const user = await User.create(req.body)

        user.password = undefined
        return res.send({ user })

    } catch (err) {
        return res.status(400).send({
            debugMessage: err,
        })
    }
})

router.post('/authenticate', async(req, res) => {

    const { email, password } = req.body
    try {

        const user = await User.findOne({ email }).select('+password')

        if (!user)
            return res.status(400).send({ message: 'Usuário não encontrado' })

        if (!await bcrypt.compare(password, user.password))
            return res.status(400).send({ message: 'Usuário ou senha inválido' })

        user.password = undefined
        res.send({ user })

    } catch (err) {
        return res.status(400).send({
            debugMessage: err,
        })
    }
})

router.post('/edit/:id', async(req, res) => {

    const { id } = req.params

    try {

        const user = await User.findByIdAndUpdate(id, {
            $set: req.body
        }, { new: true })
        return res.send()

    } catch (err) {
        return res.status(400).send({
            debugMessage: err,
        })
    }
})

module.exports = (app) => app.use('/v1/auth', router)