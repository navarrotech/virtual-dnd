import prisma from '../../../../database'
import passwordHash from "password-hash";

import type { Response } from 'express'
import type { DndRequest } from '../../types'

export default async function Route(req: DndRequest, res: Response){
    try {
        // Must be an authorized request
        if(!req.session || !req.session.user){ return res.sendStatus(401) }

        const id = req.session?.user?.id;
        const user = await prisma.dnd_user.findUnique({
            where: {
                id
            }
        })

        if(!user){
            return res.sendStatus(400)
        }

        req.session.user = user;

        await new Promise(acc => req.session.save(() => acc(null)))
        res.status(200).send(req.session.user)
    } catch(e){
        console.log(e)
        res.sendStatus(500)
    }
}
