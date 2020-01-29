import bcrypt from 'bcryptjs'
import User from '../models/userModels'

function gerateDateGMT() {
    const now = new Date()
    now.setHours(now.getHours() - 3)
    return now
}

export default {

    // retorno todos os usuários
    async index(req, res) {
        try {
            const user = await User.find()
            return res.send(user)
        } catch (err) {
            return res.status(400).send({
                debugMessage: err
            })
        }
    },
    // retorna um determinado usuário
    async show(req, res) {
        try {
            const user = await User.findById({ _id: req.params.id })
            if (!user)
                return res.status(400).send({ message: 'Usuário não encontrado' })

            return res.send({ users: user })
        } catch (err) {
            return res.status(400).send({
                debugMessage: err
            })
        }
    },
    // altera o cadastro do usuário
    async update(req, res) {
        const { name, email, password } = req.body
        try {
            const user = await User.findById({ _id: req.params.id })
            if (!user)
                return res.status(400).send({ message: 'Usuário não encontrado' })

            const hashPassword = await bcrypt.hash(password, 10)
            await User.findByIdAndUpdate({ _id: req.params.id }, {
                '$set': {
                    name,
                    email,
                    password: hashPassword,
                    updateAt: gerateDateGMT() //gambiarra feia, mas funciona =D
                }
            }, { new: true })
            return res.send()

        } catch (err) {
            return res.status(400).send({
                debugMessage: err
            })
        }
    },
    // exclui o cadastro do usuário
    async destroy(req, res) {
        try {
            const user = await User.findById({ _id: req.params.id })
            if (!user)
                return res.status(400).send({ message: 'Usuário não encontrado' })
            await user.remove()
            return res.send({message: 'Usuário excluído com sucesso!'})
        } catch (err) {
            res.status(400).send({
                debugMessage: err
            })
        }
    }
}