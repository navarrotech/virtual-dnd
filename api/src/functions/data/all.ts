import prisma from '../../../../database'

import type { Response } from 'express'
import type { DndRequest } from '../../types'

export default async function Route(req: DndRequest, res: Response){
    try {
        // Must be an authorized request
        if(!req.session?.authorized){ 
          return res.sendStatus(401)
        }

        const id = req.session?.user?.id;

        const [
            characters,
            campaigns,
            playing_in
        ] = await Promise.all([
            prisma.dnd_characters.findMany({
                where: { owner: id }
            }),
            prisma.dnd_campaigns.findMany({
                where: { owner: id },
            }),
            prisma.dnd_campaigns.findMany({
                where: {
                    player_ids: {
                        has: id
                    }
                },
            }),
        ])

        let friend_ids: string[] = req.session?.user?.friend_ids as string[] || []
        let friend_req_ids: string[] = req.session?.user?.friend_req_ids as string[] || []

        const [
            relevantUsers
        ] = await Promise.all([
            prisma.dnd_user.findMany({
                where: {
                    id: {
                        in: [
                            ...friend_ids,
                            ...friend_req_ids
                        ]
                    }
                },
                select: {
                    id: true,
                    first_name: true,
                    last_name: true,
                    online: true,
                    photoURL: true,
                    last_login: true,

                    password: false,
                    friend_req_ids: false,
                    email: false,
                    reset_key: false,
                    reset_key_created: false
                }
            })
        ])

        let relevantUsersMap: any = {}
        relevantUsers.forEach(user => {
            relevantUsersMap[user.id] = user
        })

        let friends: any = friend_ids
            .map(id => relevantUsersMap[id])
            .filter(i => !!i)
            .sort((prev, curr) => {
                if (curr.online && !prev.online) {
                  return -1; // `a` is online, `b` is not, so `a` comes first
                }
                if (!curr.online && prev.online) {
                  return 1; // `b` is online, `a` is not, so `b` comes first
                }
                // Both objects have the same online status, so sort by last_login
                return prev.last_login - curr.last_login;
            });

        let friend_requests: any = friend_req_ids
            .map(id => relevantUsersMap[id])
            .filter(i => !!i)
            .sort((prev, curr) => {
                if (curr.online && !prev.online) {
                    return -1; // `a` is online, `b` is not, so `a` comes first
                }
                if (!curr.online && prev.online) {
                    return 1; // `b` is online, `a` is not, so `b` comes first
                }
                // Both objects have the same online status, so sort by last_login
                return prev.last_login - curr.last_login;
            });

        res.status(200).send({
            characters,
            campaigns,
            friends,
            friend_requests,
            playing_in
        })
    } catch(e){
        console.log(e)
        res.sendStatus(500)
    }
}
