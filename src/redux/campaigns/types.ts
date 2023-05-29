
import type { Character } from "../characters/types";
import type { User } from "redux/user/types";

export type State = {
  myCampaigns: {
    [key: string]: CampaignDoc
  },
  playingIn: {
    [key: string]: CampaignDoc
  },
  all: {
    [key: string]: CampaignDoc
  }
}

// TODO: Should rethink CampaignCharacter, and think about how it's saved?
export type CampaignCharacter = {
  current: {
    level: number,
    speed: number,
    health: number,
    maxHealth: number,
    armorClass: number,
    experience: number,
    initiative: number,
    gold: number
  },
  inventory: {
    [key: string]: InventoryItem
  },
} & Character

export type InventoryItem = {
  name: string,
  image: string,
  quantity: number
}

export type CampaignDoc = {
  id: string,
  owner: string,

  name: string,
  photoURL?: string,

  player_ids: string[],
  character_ids: string[],
  join_requests: string[],
  banned: string[],

  state: GameState,
  map: ActiveMap,
  character_data: {
    [key: string]: CurrentCharacter
  },
  
  created: Date,
  updated: Date
}

export type ActiveMap = {
  imageLayer: {
    url: string,
    sizeX: number,
    sizeY: number
  },
  entities: {
    [key: string]: {
      x: number,
      y: number
    }
  },
  landmarks: {
    [key: string | symbol | number]: {
      x: number,
      y: number,
      name: string
    }
  }
}

export type GameState = {
  turn?: 1,
  phase?: 'combat' | 'passive' | 'setup',
  action?: {
    who?: string,
    dice?: 20,
    type?: string,
    check?: string
  }
}

export type CurrentCharacter = {
  id: string,
  player_id: string,
  player?: User,
  current: {
    level: number,
    speed: number,
    health: number,
    maxHealth: number,
    armorClass: number,
    experience: number,
    initiative: number,
    gold: number
  },
  inventory: any
} & Character
