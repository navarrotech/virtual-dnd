import prisma from '../../../../database'


import type { Response } from 'express'
import type { DndRequest } from '../../types'

export default async function Route(req: DndRequest, res: Response){
    try{ 
        req.session.destroy(() => {
            res.sendStatus(200)
        })
    } catch(e){
        res.sendStatus(200)
    }
}
