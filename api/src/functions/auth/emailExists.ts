import prisma from '../../../../database'

import type { Response } from 'express'
import type { DndRequest } from '../../types'

export default async function Route(req: DndRequest, res: Response){
    try {
        const { email } = req.body
    
        if(!email){
            return res.status(400).send({ message: "Email is required to check if it exists!" })
        }
    
        const user = await prisma.dnd_user.findUnique({ where: { email } })
        
        if(user){
            return res.status(200).send({ exists: true })
        }
        return res.status(204).send({ exists: false })

    } catch(e){
        console.log(e)
        res.sendStatus(500)
    }
}
