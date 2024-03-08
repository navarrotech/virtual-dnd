import prisma from '../../../../database'

import type { Response } from 'express'
import type { DndRequest } from '../../types'

import { EventSystem } from '../../sockets/onChange'

export default async function Route(req: DndRequest, res: Response){
    try {
        // Must be an authorized request
        if(!req.session || !req.session.user){ return res.sendStatus(401) }

        const { friend_id, approve } = req.body;
        
        if(!friend_id || approve === undefined){
            return res.status(400).send({ message: "Friend ID and approval status are required!" })
        }

        const id = req.session?.user?.id;
        const friend_req_ids = req.session.user.friend_req_ids as string[] || []

        // Create a new friend request
        if(!friend_req_ids.includes(friend_id)){
            await prisma.dnd_user.update({
                where: { id: friend_id },
                data: {
                    friend_req_ids: {
                        push: id
                    }
                }
            })
            res.sendStatus(200);
            const newFriendDoc = await prisma.dnd_user.findFirst({
                where: { id: friend_id }
            })

            EventSystem.emit('friend-request-change', newFriendDoc, 'update', 'dnd_user')
            return;
        }

        let new_friend_req_ids = friend_req_ids.filter(id => id !== friend_id)

        // Approve existing friend request
        if(approve){
            await prisma.dnd_user.update({
                where: { id },
                data: {
                    friend_ids: {
                        push: friend_id
                    },
                    friend_req_ids: {
                        set: new_friend_req_ids
                    }
                }
            })
            await prisma.dnd_user.update({
                where: { id: friend_id },
                data: {
                    friend_ids: {
                        push: id
                    }
                }
            })
            // @ts-ignore
            req.session.user.friend_ids.push(friend_id)
            req.session.user.friend_req_ids = new_friend_req_ids
            await new Promise(acc => req.session.save(() => acc(null)))
            EventSystem.emit('dnd_user', req.session.user, 'update', 'dnd_user')
        } 
        // Reject existing friend request
        else {
            await prisma.dnd_user.update({
                where: { id },
                data: {
                    friend_req_ids: {
                        set: new_friend_req_ids
                    }
                }
            })
            req.session.user.friend_req_ids = new_friend_req_ids
            await new Promise(acc => req.session.save(() => acc(null)))
            EventSystem.emit('dnd_user', req.session.user, 'update', 'dnd_user')
        }

        res.status(200).send(req.session.user)
    } catch(e){
        console.log(e)
        res.sendStatus(500)
    }
}
