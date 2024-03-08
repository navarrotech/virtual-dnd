import prisma from '../../../../database'

import type { Response } from 'express'
import type { DndRequest } from '../../types'

export default async function Route(req: DndRequest, res: Response) {
  // Must be an authorized request
  if (!req.session || !req.session.user) { return res.sendStatus(401) }

  const { campaign_id, content } = req.body;

  if (!campaign_id){
    return res.sendStatus(400)
  }

  const owner = req.session.user.id

  const notes = await prisma.dnd_notes.updateMany({
    where: {
      campaign_id,
      owner
    },
    data: {
      content
    }
  })

  res.status(200).send(notes)
}
