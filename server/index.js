import * as dotenv from 'dotenv'
dotenv.config()

import express from 'express'

import cors from 'cors'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'

import PostgresExpress from 'pg-express'
import PostgresSchema  from './schema.js'

import session from 'express-session'
import getPostgresStore from 'connect-pg-simple'

import Postgres from 'pg'

import Auth from './API/auth.js'

const PgExpressMiddleware = PostgresExpress({
    mode: 'pool',
    connection: process.env.DATABASE_URL,
    connectionConfig:{
        connectionTimeoutMillis: 0,
        idleTimeoutMillis: 10000,
        max: 10
    },
    migrate: true,
    schema: PostgresSchema,
    verbose: true
})

const { Pool } = Postgres
const { DATABASE_URL='', NODE_ENV, PORT=8080 } = process.env
const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: DATABASE_URL.includes('localhost:5432')?false:{
        rejectUnauthorized: false
    }
})

pool.connect()

const PGStore = getPostgresStore(session)

const app = express()

app.use(session({
    secret: 'kuaecuXRemBJpuuNeuBXjijaaixejXBR',
    name: 'sid',
    resave: true, // Save even if nothing is changed
    saveUninitialized: true, // Save even if nothing has been set in req.session yet
    rolling: true,
    cookie: {
        secure: 'auto',
        httpOnly: true,
        //domain:react_domain,
        //sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
    },
    store: new PGStore({
        pool,
        createTableIfMissing: true,
        tableName : 'session' // Default is "session"
    })
}))

app.enable('trust proxy')
// app.use(express.static(path.join(directory, 'public')));
    
app.use(helmet({ contentSecurityPolicy: false }))
    
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
    
app.use('/db', cors({
    credentials:true
}))
app.use('/api', cors({
    origin:['http://localhost:3000', 'https://dnd.navarrotech.net'],
    credentials:true
}))

app.use(PgExpressMiddleware)

Auth(app, { pool })

app.get('*', (req, res) => res.redirect('/'))

app.listen(PORT, () => { console.log("Running at http://localhost:" + PORT) })