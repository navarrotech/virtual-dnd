import prisma from '../../../../database'
import passwordHash from "password-hash";

import type { Response } from 'express'
import type { DndRequest } from '../../types'

import { getRandomAvatarUrl } from '../avatars';

export default async function Route(req: DndRequest, res: Response){
    try {
        let { first_name='', last_name='', email, password } = req.body
    
        // Validation
        if(!email || !password){
            return res.status(400).send({ message: "Name, email and password is required in order to signup!" })
        }

        if(!email.includes('@')){ return res.status(400).send({ message: "Invalid email, it must include an '@' symbol" }) }
        if(password.length < 7){ return res.status(400).send({ message: "Password must be 8 characters or longer!" }) }

        // Password encryption
        password = passwordHash.generate(password)
        
        const user = await prisma.dnd_user.create({
            data: {
                first_name, 
                last_name, 
                email, 
                password,
                photoURL: getRandomAvatarUrl()
            },
            select: {
                id: true, 
                email: true, 
                photoURL: true, 
                first_name: true, 
                last_name: true, 
                online: true, 
                friend_ids: true, 
                friend_req_ids: true, 
                preferences: true, 
                created: true,
                last_login: true, 
            }
        })
    
        if(user) {
            // @ts-ignore
            req.session.user = user
            req.session.authorized = true
            await req.session.save()
            res.status(200).send({ user, authorized:true })
        }
    } catch(e: any){
        console.log(e)
        console.log({
            msg: e?.toString()
        })
        res.sendStatus(500)
    }
}
