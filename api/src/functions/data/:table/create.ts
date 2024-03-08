import prisma from '../../../../../database'

import type { Response } from 'express'
import type { DndRequest } from '../../../types'

import { EventSystem } from '../../../sockets/onChange'
import { tablesWhitelist } from '../contants'

import { getRandomAvatarUrl } from '../../avatars'

const defaults: any = () => ({
  dnd_characters: {
    data: {
      name: "New Character",
      image: getRandomAvatarUrl(),
      stats: {
        arcana: 0,
        nature: 0,
        wisdom: 0,
        history: 0,
        insight: 0,
        stealth: 0,
        charisma: 0,
        medicine: 0,
        religion: 0,
        strength: 0,
        survival: 0,
        athletics: 0,
        deception: 0,
        dexterity: 0,
        wisdomAdd: 0,
        acrobatics: 0,
        perception: 0,
        persuasion: 0,
        charismaAdd: 0,
        inspiration: 0,
        performance: 0,
        strengthAdd: 0,
        constitution: 0,
        dexterityAdd: 0,
        intelligence: 0,
        intimidation: 0,
        investigation: 0,
        passiveWisdom: 0,
        sleightOfHand: 0,
        animalHandling: 0,
        constitutionAdd: 0,
        intelligenceAdd: 0,
        proficienyBonus: 0
      },
      spells: {
        class: "",
        saveDC: "",
        ability: "",
        attackBonus: ""
      },
      features: {
        age: "",
        eyes: "",
        hair: "",
        race: "",
        skin: "",
        bonds: "",
        class: "",
        flaws: "",
        image: "",
        height: "",
        ideals: "",
        weight: "",
        alignment: "",
        backstory: "",
        background: "",
        additionalFeatures: ""
      },
      savingThrows: {
        wisdom: 0,
        charisma: 0,
        strength: 0,
        dexterity: 0,
        constitution: 0,
        intelligence: 0
      }
    }
  },
  dnd_campaign: {
    name: "New campaign",
    data: {
      map: {
        image: "",
        entities: {},
        landmarks: {}
      },
      state: {
        mode: 'passive',
        data: {}
      },
      banned: [],
      kicked: [],
      players: {}
    }
  }
})

export default async function Route(req: DndRequest, res: Response){
  try{
    // Must be an authorized request
    if(!req.session?.authorized){ 
      return res.sendStatus(401)
    }

    const owner = req.session?.user?.id;
    const { table } = req.params;

    if(!tablesWhitelist.includes(table) || !owner){
      return res.sendStatus(400)
    }

    // @ts-ignore
    const result = await prisma[table]?.create({
      data: {
        ...defaults()[table],
        ...req.body || {},
        owner,
      }
    })

    if(table === 'dnd_campaigns'){
      await Promise.all([
        prisma.dnd_notes.create({
          data: {
            owner,
            campaign_id: result.id,
            type: 'personal',
            content: ''
          }
        }),
        prisma.dnd_chat.create({
          data: {
            campaign_id: result.id,
          }
        })
      ])
    }

    EventSystem.emit(result.id, result, 'create', table)

    res.status(200).send(result)
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
