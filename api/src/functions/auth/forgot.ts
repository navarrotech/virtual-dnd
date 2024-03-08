import prisma from '../../../../database'
import { v4 as uuid } from 'uuid'


import type { Response } from 'express'
import type { DndRequest } from '../../types'

export default async function Route(req: DndRequest, res: Response){
    try {
        const { email } = req.body
    
        if(!email){
            return res.status(400).send({ message: "Email is required in order to request a forgot password link!" })
        }

        const user = await prisma.dnd_user.findUnique({ where: { email } })
        
        if(user){
            const token = uuid();
            await prisma.dnd_user.update({ 
                where: { 
                    id: user.id 
                },
                data: {
                    reset_key_created: new Date(),
                    reset_key: token
                }
            })
            
            const reset_url = (process.env.DOMAIN||'') + "/forgot/reset?i=" + token

            // Put your email provider in here!
            console.log("Password reset request has been received, but there is no email provider to handle the request! Password reset link: " + reset_url)

            return res.status(200).send({ success: true })
        }
        res.status(404).send({ success: false })

    } catch(e){
        console.log(e)
        res.sendStatus(500)
    }
}
