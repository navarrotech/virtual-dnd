import prisma from '../../../../database'
import passwordHash from "password-hash";

import moment from "moment";

import type { Response } from 'express'
import type { DndRequest } from '../../types'

export default async function Route(req: DndRequest, res: Response){
    try {
        let { password, search="" } = req.body
    
        if(!password){
            return res.status(400).send({ message: "Password is required in order to reset your account!" })
        }

        const query = new URLSearchParams(search)
        const token = query.get('i')
        const user = await prisma.dnd_user.findUnique({
            where: {
                // @ts-ignore
                reset_key: token
            }
        })

        if(!user){
            return res.status(400).send({ message: "This reset password link has expired! Code: A" })
        }

        // Has the link expired? (Link expires 1 hour after it being created...)
        if(moment(user?.reset_key_created).add(1, 'hour').isBefore(moment())){
            return res.status(400).send({ message: "This reset password link has expired! Code: B" })
        }

        // Password encryption
        password = passwordHash.generate(password)

        await prisma.dnd_user.update({
            where: { 
                id: user.id
            }, 
            data: {
                password,
                reset_key: undefined,
                reset_key_created: undefined
            }
        })
        
        res.sendStatus(200)
    } catch(e){
        console.log(e)
        res.sendStatus(500)
    }
}

// Clean up expired forgot password links on server startup (In production, should be once every 24 hours)
// Forgot password links 'expire' after 1 hour
prisma.dnd_user
    .updateMany({ 
        where: {
            reset_key_created: {
                lt: moment().subtract(1, 'hour').toDate()
            }
        },
        data: {
            reset_key: undefined,
            reset_key_created: undefined
        }
    })
    .catch((e) => {
        console.log('[Cleanup Reset Passwords] Error : ', e.message)
    })
