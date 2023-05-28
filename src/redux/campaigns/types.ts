
import type { Character } from "../characters/types";

export type State = {
  // current?: {
  //   name: string,
  //   game: GameState,
  //   activeMap: ActiveMap,
  //   campaign: Campaign,
  //   players: User[],
  //   characters: CampaignCharacter[],
  //   chat: ChatMessage[],
  //   notes: Notes
  // },
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
  name: string,
  photoURL?: string,
  owner: string,
  player_ids: string[],
  character_ids: string[],
  chat_id: string,
  data: Campaign,
  created: Date,
  updated: Date
}

export type ActiveMap = {
  image: string,
  entities: {
    sam: {
      x: 300,
      y: 150
    },
    alex: {
      x: 10,
      y: 15
    }
  },
  landmarks: {
    1: {
      x: 10,
      y: 10,
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

export type Campaign = {
  activeMap: ActiveMap,
  state: GameState,
  banned: [],
  kicked: [],
  players: {
    [key: string]: {
      current: {
        level: number,
        speed: number,
        health: number,
        maxHealth: number,
        armorClass: number,
        experience: number,
        initiative: number,
      },
      inventory: any,
      player_id: string,
      chatbanned: true,
      character_id: string
    }
  }
}
