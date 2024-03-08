

import type { Request } from 'express'
import type { dnd_user } from '@prisma/client'

export type DndRequest = Request & {
    session: DnDSession
}

export type DnDSession = {
    user?: dnd_user,
    authorized?: boolean
}
