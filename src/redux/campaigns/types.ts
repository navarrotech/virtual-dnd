
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

export type InventoryItem = {
  name: string,
  icon: string,
  quantity: number,
  description: string
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

  state: GameState<any>,
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

export type GameState<T> = {
  mode: 'rolling' | 'combat' | 'passive' | 'setup',
  data: T
}

export type AskToRoll = {
  dice: DiceRoll,
  who: {
    [key: PlayerId]: {
      playerId: PlayerId,
      characterId: CharacterId,
      result: DiceRoll | null
      when: string,
    }
  },
  reason: 'damage' | 'initiative' | 'ability' | 'skill' | 'save' | 'other' | '',
}

export type Combat = {
  round: number,
  playerId: PlayerId,
  initiative: Record<number, PlayerId>,
}

export type PlayerId = string;
export type CharacterId = string;

export type DiceRoll = "d4" | "d6" | "d8" | "d10" | "d12" | "d20" | "d50" | "d100"

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
  inventory: Record<string, InventoryItem>,
} & Character
