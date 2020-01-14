export default {
    host: process.env.MAILER_HOST,
    port: process.env.PORT,
    auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASS
    }
}