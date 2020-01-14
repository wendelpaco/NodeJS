import bcrypt from 'bcryptjs'
import User from '../models/userModels'
import jwt from 'jsonwebtoken'
import Mail from '../../lib/mailer'
import crypto from 'crypto'

function generateToken(params = []) {
    return jwt.sign(params, process.env.JWT_SECRET, { expiresIn: 86400, })
}

function generateDateGMT(horas) {
    const now = new Date()
    now.setHours(now.getHours() - horas)
    return now
}

export default {

    // grava um novo usuário
    async storeCadastro(req, res) {
        const { name, email, password } = req.body
        try {
            if (await User.findOne({ email }))
                return res.status(400).send({ trace: 'O e-mail já está sendo usado por outra pessoa.' })

            const user = await User.create({
                name,
                email,
                password,
                createdAt: generateDateGMT(3),
                updateAt: generateDateGMT(3)
            })

            await Mail.sendMail({
                from: 'Fila Teste <wendelpaco@live.com>',
                to: `${name} <${email}>`,
                subject: 'Cadastro de Usuário',
                html: `Olá, ${name}, seja bem vindo ao sistema de filas`
            })

            user.password = undefined
            return res.status(201).send({ user, token: generateToken({ id: user.id }) })
        } catch (err) {
            return res.status(400).send({
                debugMessage: err,
            })
        }
    },
    async storeToken(req, res) {
        const { email, password } = req.body
        try {
            const user = await User.findOne({ email }).select('+password')
            if (!user)
                return res.status(400).send({ message: 'Usuário não encontrado' })

            if (!await bcrypt.compare(password, user.password))
                return res.status(400).send({ message: 'Usuário ou senha inválido' })

            user.password = undefined

            res.send({ user, token: generateToken({ id: user.id }) })
        } catch (err) {
            return res.status(400).send({
                debugMessage: err,
            })
        }
    },
    async storeEsqueciSenha(req, res) {
        const { email } = req.body
        try {
            const user = await User.findOne({ email })

            if (!user)
                return res.status(400).send({ message: 'Usuário não encontrado' })

            const token = crypto.randomBytes(20).toString('hex')

            await User.findByIdAndUpdate({ _id: user.id }, {
                '$set': {
                    passwordResetToken: token,
                    passwordResetExpires: generateDateGMT(2),
                }
            }, { new: true })

            await Mail.sendMail({
                from: 'Fila Teste <fila@fila.com>',
                to: `<${email}>`,
                subject: 'Cadastro de Usuário',
                html: `Você solicitou a alteração da senha, por favor, clique no link ao lado ${token}`
            }, (err) => {
                return res.status(400).send({
                    debugMessage: `Ocorreu um erro ao tentar enviar email. ${err}`
                })
            })

            return res.send()

        } catch (err) {
            return res.status(400).send({
                debugMessage: err,
            })
        }
    },
    async storeResetSenha(req, res) {
        const { email, token, password } = req.body
        try {
            const user = await User.findOne({ email })
                .select('+passwordResetToken passwordResetExpires')

            if (!user)
                return res.status(400).send({ message: 'Usuário não encontrado' })

            if (token !== user.passwordResetToken)
                return res.status(400).send({ message: 'O token está inválido.' })

            if (generateDateGMT(3) > user.passwordResetExpires)
                return res.status(400).send({ message: 'Token Expirado. Por favor gere um novo.' })

            user.password = password

            await user.save()

            return res.send({
                message: 'Senha alterada com sucesso!'
            })

        } catch (err) {
            return res.status(400).send({
                debugMessage: err,
            })
        }
    }

}