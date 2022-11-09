export default function (app, { pool }) {
    app.post('/api/login', async (req, res) => {
        try {
            const { email, password } = req.body
            if (!(email && password)) {
                return res.status(400).send({})
            }

            const query = await pool.query(`SELECT * FROM users WHERE email = $1 AND password = $2`, [email, password])
            const [result=null] = query.rows
            // const [result = null] = await pool.query(`SELECT * FROM users WHERE email = $1 AND password = $2`, [email, password])
            
            req.session.user = result

            if (result) {
                delete result.password
            }
            res.status(200).send(result)
        }
        catch (e) {
            console.log(e)
            res.status(500).send({})
        }
    })
    app.post('/api/signup', async (req, res) => {
        try {
            const { email, password, name } = req.body
            if (!(email && password && name && email.includes('@') && password.length >= 8)) {
                return res.status(400).send({})
            }
            const query = await pool.query(`INSERT INTO users(email, password, name, created, last_login) VALUES($1, $2, $3, current_timestamp, current_timestamp) RETURNING *`, [email, password, name]);
            const [result=null] = query.rows

            req.session.user = result

            res.status(200).send(result)
        }
        catch (e) {
            console.log(e)
            res.status(500).send({})
        }
    })
    app.post('/api/logout', async (req, res) => {
        req.session.user = {}
        await req.session.regenerate(() => { res.sendStatus(200) })
    })
    app.post('/api/getSession', async (req, res) => {
        if (!req.session || !req.session.user) {
            return res.send({})
        }
        res.send(req.session.user)
    })
}