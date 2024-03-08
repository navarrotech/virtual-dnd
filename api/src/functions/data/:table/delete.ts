import prisma from '../../../../../database'

import type { Response } from 'express'
import type { DndRequest } from '../../../types'

import { EventSystem } from '../../../sockets/onChange'
import { tablesWhitelist } from '../contants'

export default async function Route(req: DndRequest, res: Response){
  try{
    // Must be an authorized request
    if(!req.session?.authorized){ 
      return res.sendStatus(401)
    }

    const owner = req.session?.user?.id;
    const { table } = req.params;

    if(!tablesWhitelist.includes(table) || !req.body.id){
      return res.sendStatus(400)
    }

    // TODO: Check if user is authorized to update this data (for chat and campaigns)

    // @ts-ignore
    const deleted = await prisma[table]?.findMany({
      where: {
        id: req.body.id,
        owner
      }
    })
    // @ts-ignore
    await prisma[table]?.deleteMany({
      where: {
        id: req.body.id,
        owner
      }
    })

    if(deleted.length){
      deleted.forEach((doc: any) => {
        EventSystem.emit(doc.id, doc, 'delete', table)
      })

      if(table === 'dnd_campaigns'){
        await Promise.all([
          prisma.dnd_notes.deleteMany({
            where: {
              campaign_id: req.body.id
            }
          }),
          prisma.dnd_chat.deleteMany({
            where: {
              campaign_id: req.body.id,
            }
          })
        ])
      }
    }

    res.status(200).send({ total: deleted.length })
  } catch(e){
      console.log(e)
      if(res.headersSent){
        return;
      }
      res.status(500).send(
        process.env.NODE_ENV === 'development' 
          ? e?.toString() || String(e)
          : 'Internal Server Error'
      )
  }
}
