import prisma from '../../../../database'

import type { Response } from 'express'
import type { DndRequest } from '../../types'

export default async function Route(req: DndRequest, res: Response) {
  // Must be an authorized request
  if (!req.session || !req.session.user) { return res.sendStatus(401) }

  const { campaign_id } = req.body;

  if (!campaign_id){
    return res.status(400).send({ message: "Friend ID and approval status are required!" })
  }

  const user_id = req.session?.user?.id;

  const campaign = await prisma.dnd_campaigns.findFirst({
    where: { id: campaign_id }
  })

  if(!campaign){
    return res.status(204).send([])
  }

  const player_ids = [
    campaign.owner,
    ...campaign.player_ids as string[] || []
  ]

  const players = await prisma.dnd_user.findMany({
    where: {
      id: {
        in: player_ids
      }
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      online: true,
      photoURL: true,
      friend_ids: true,
      friend_req_ids: true,
      created: true,
      last_login: true
    }
  })

  res.status(200).send(players)
}
