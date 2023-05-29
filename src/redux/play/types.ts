
import type { User } from "redux/user/types";
import type { ActiveMap, CurrentCharacter, GameState } from "redux/campaigns/types";

export type State = {
  id: string,
  name: string,
  role: 'dm' | 'player',
  owner: string,
  myCharacter?: CurrentCharacter,
  myCharacterId?: string,
  map: ActiveMap,
  joinRequests: string[],
  banned: string[],
  gamestate: GameState,
  NPCs: {
    [key: string]: CurrentCharacter
  },
  chat: {
    chat_id: string,
    show: boolean,
    newMessage: string,
    messages: ChatMessage[],
  },
  notes: Notes
  characters: {
    [key: string]: CurrentCharacter
  },
  characterIds: string[],
  players :{
    [key: string]: User
  },
}

export type Notes = any;
export type ChatMessage = {
  id: string,
  what: string,
  who: string,
  when: Date
};

export type SocketMessageType = 'chat' | 'note' | 'campaign' | 'player' | 'unauthorized' | 'ready' | 'init'
export type IncomingSocketMessage<T> = {
    type: SocketMessageType,
    data: T
}
