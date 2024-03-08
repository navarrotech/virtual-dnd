import prisma from '../../../../database'
import passwordHash from 'password-hash'

import type { Response } from 'express'
import type { DndRequest } from '../../types'

export default async function Route(req: DndRequest, res: Response){
    try {
        const { email, password } = req.body
    
        if(!email || !password){
            return res.status(400).send({ message: "Email and password is required in order to login!" })
        }

        const user = await prisma.dnd_user.findUnique({
            where:{ email },
            select: {
                id: true, 
                email: true, 
                photoURL: true, 
                first_name: true, 
                last_name: true, 
                password: true,
                online: true, 
                friend_ids: true, 
                friend_req_ids: true, 
                preferences: true, 
                created: true,
                last_login: true, 
            }
        })
        
        // Successful login
        if(user && user.email && passwordHash.verify(password, user.password)) {

            // @ts-ignore
            delete user.password

            // @ts-ignore
            req.session.user = user
            req.session.authorized = true
            await new Promise(acc => req.session.save(() => acc(null)))
            await prisma.dnd_user.update({ 
                where: {
                    id: user.id 
                },
                data: {
                    last_login: new Date()
                }
            })

            res.status(200).send({ user, authorized:true })
        }
        // Invalid password
        else if (user){
            res.status(401).send({ message:"Invalid password, please try again!" })
        }
        // Invalid email
        else {
            res.status(404).send({ message:"A user with that email does not exist, did you mean to signup instead?" })
        }
    } catch(e){
        console.log(e)
        res.sendStatus(500)
    }
}
