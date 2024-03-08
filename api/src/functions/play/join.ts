import prisma from '../../../../database'
import { PlayEventSystem } from '../../sockets/play'

import type { Response } from 'express'
import type { DndRequest } from '../../types'

type Body = {
  campaign_id?: string,
  character_id?: string,
}

export default async function Route(req: DndRequest, res: Response) {

  // Must be an authorized request
  if (!req.session || !req.session.user) {
    return res.sendStatus(401)
  }

  // Request body
  const { campaign_id, character_id } = req.body as Body;  
  const user_id = req.session?.user?.id;
  if (!campaign_id || !character_id){
    return res.status(400).send({ error: "Missing campaign_id or character_id from request body" })
  }

  const [ character, campaign ] = await Promise.all([
    prisma.dnd_characters.findFirst({
      where: { id: character_id }
    }),
    prisma.dnd_campaigns.findFirst({
      where: { id: campaign_id }
    }),
  ])

  if(!character){
    return res.status(400).send({ error: "Character not found" })
  }
  if(!campaign){
    return res.status(400).send({ error: "Campaign not found" })
  }

  const currentCharacter = {
    // @ts-ignore
    ...character.data,
    created: character.created,
    id: character_id,
    owner: user_id,
    player_id: user_id,
    current: {
      level: 1,
      speed: 30,
      health: 20,
      maxHealth: 20,
      armorClass: 10,
      experience: 0,
      initiative: 0,
      gold: 0
    },
    inventory: {},
  }

  await prisma.dnd_campaigns.update({
    where: { id: campaign_id },
    data: {
      player_ids: {
        push: user_id
      },
      character_ids: {
        push: character_id
      },
      map: {
        // @ts-ignore
        ...campaign.map,
        entities: {
          // @ts-ignore
          ...campaign.map.entities,
          [character_id]: {
            x: null,
            y: null,
            isNPC: false,
            color: '#6FC961'
          }
        }
      },
      character_data: {
        // @ts-ignore
        ...campaign.character_data,
        [character_id]: currentCharacter
      }
    }
  })

  await prisma.dnd_notes.create({
    data: {
      campaign_id,
      owner: user_id,
      type: 'private',
      content: ''
    }
  })

  PlayEventSystem.emit(campaign_id, {
    type: 'player-joined',
    data: {
      user: req.session.user,
      character: currentCharacter,
    }
  })

  res.sendStatus(200)
}
