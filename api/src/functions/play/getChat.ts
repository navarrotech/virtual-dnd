import prisma from '../../../../database'

import type { Response } from 'express'
import type { DndRequest } from '../../types'

export default async function Route(req: DndRequest, res: Response) {
  // Must be an authorized request
  if (!req.session || !req.session.user) { return res.sendStatus(401) }

  const { campaign_id, limit=50 } = req.body;

  if (!campaign_id){
    return res.sendStatus(400)
  }

  const user_id = req.session?.user?.id;

  const [
    campaign, chat
  ] = await Promise.all([
    // Grab the campaign to ensure the user is a player (and has "permission")
    prisma.dnd_campaigns.findFirst({
      where: { id: campaign_id }
    }),
    prisma.dnd_chat.findFirst({
      where: { campaign_id },
    })
  ])

  if(!campaign || !(campaign.owner === user_id || campaign.player_ids.includes(user_id))){
    return res.status(200).send({ messages: null, campaign: null })
  }

  // @ts-ignore
  const messages = chat?.messages?.slice(-limit) || []

  res.status(200).send({ messages, campaign })
}
