import prisma from '../../../database'

import path from 'path'
import fs from 'fs'

import type { Response } from 'express'
import type { DndRequest } from '../types'

const avatars = fs.readdirSync(
    path.resolve(
      __dirname,
      '../public/images/avatars'
    )
)

export const avatarUrls = avatars.map(filename => `/images/avatars/${filename}`)
export const getRandomAvatarUrl = () => avatarUrls[Math.floor(Math.random() * avatarUrls.length)]

export default async function Route(req: DndRequest, res: Response){
    try {
        res.status(200).send(avatarUrls)
    } catch(e){
        console.log(e)
        res.sendStatus(500)
    }
}
