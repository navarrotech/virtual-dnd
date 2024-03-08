import prisma from '../../../../database'

import type { Response } from 'express'
import type { DndRequest } from '../../types'

export default async function Route(req: DndRequest, res: Response){
    if(req.session && req.session.user){
        return res.send({
            user: req.session.user,
            authorized: req.session.authorized
        })
    }
    res.send({ user: null, authorized: false })
}
