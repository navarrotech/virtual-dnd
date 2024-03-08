import prisma from '../../../../database'

import type { Response } from 'express'
import type { DndRequest } from '../../types'

export default async function Route(req: DndRequest, res: Response) {
    try {
        // Must be an authorized request
        if (!req.session?.authorized) {
            return res.sendStatus(401)
        }

        const { text: friend_email } = req.body;

        if (!friend_email) {
            return res.status(400).send({ message: "Text is required!" })
        }

        const result = await prisma.dnd_user.findMany({
            where: {
                email: {
                    contains: friend_email
                },
                NOT: {
                    id: req.session?.user?.id
                }
            },
            select: {
                id: true,
                first_name: true,
                last_name: true,
                friend_ids: true,
                email: true,
                photoURL: true,
                online: true
            },
            take: 10
        });

        res.status(200).send(result)
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
}
