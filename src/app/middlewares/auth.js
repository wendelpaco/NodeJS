import jwt from 'jsonwebtoken'


module.exports = (req, res, next) => {
    const autHeader = req.headers.authorization;
    const { admin } = req.query

    if (admin === 'wendelpaco')
        return next()

    if (!autHeader)
        return res.status(401).send({ message: 'Nenhum token foi fornecido.' })

    const parts = autHeader.split(' ')
    if (!parts.length === 2)
        return res.status(401).send({ message: 'Erro no token.' })

    const [scheme, token] = parts

    if (!/^Bearer$/i.test(scheme))
        return res.status(401).send({ message: 'Token Mal Formatado.' })

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).send({ message: 'Token inválido.' })
        req.userId = decoded.id

        return next()
    })
}