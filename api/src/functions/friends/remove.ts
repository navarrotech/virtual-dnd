import prisma from '../../../../database'

import type { Response } from 'express'
import type { DndRequest } from '../../types'

import { EventSystem } from '../../sockets/onChange'

export default async function Route(req: DndRequest, res: Response){
    try {
        // Must be an authorized request
        if(!req.session || !req.session.user){ return res.sendStatus(401) }

        const { friend_id } = req.body;
        
        if(!friend_id){
            return res.status(400).send({ message: "Friend ID is required!" })
        }

        const id = req.session?.user?.id;
        const friend_req_ids = req.session.user.friend_req_ids as string[] || []
        const friend_ids = req.session.user.friend_ids as string[] || []

        const friendDoc = await prisma.dnd_user.findFirst({
            where: { id: friend_id }
        })

        const updated_friend_req_ids = friend_req_ids.filter(id => id !== friend_id)
        const updated_friend_ids = friend_ids.filter(id => id !== friend_id)

        await Promise.all([
            // Update the user's friend request list
            prisma.dnd_user.update({
                where: { id },
                data: {
                    friend_req_ids: {
                        set: updated_friend_req_ids
                    },
                    friend_ids: {
                        set: updated_friend_ids
                  }
                }
            }),
            // Update the friend's friend list
            friendDoc
                ? prisma.dnd_user.update({
                    where: { id: friend_id },
                    data: {
                        friend_req_ids: {
                            set: friendDoc?.friend_req_ids?.filter(id => id !== friend_id) || []
                        },
                        friend_ids: {
                            set: friendDoc?.friend_ids?.filter(id => id !== id) || []
                        }
                    }
                })
                : undefined
        ])

        req.session.user.friend_ids = updated_friend_ids
        req.session.user.friend_req_ids = updated_friend_req_ids
        await new Promise(acc => req.session.save(() => acc(null)))

        EventSystem.emit('friend-request-change', req.session.user, 'update', 'dnd_user')

        res.sendStatus(200)
    } catch(e){
        console.log(e)
        res.sendStatus(500)
    }
}
