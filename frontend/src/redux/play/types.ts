
import type { User } from "redux/user/types";
import type { ActiveMap, CurrentCharacter, GameState } from "redux/campaigns/types";

import type { Modals } from "routes/Play/Modals";

export type State = {
  id: string,
  name: string,
  role: 'dm' | 'player',
  owner: string,
  activeModal: Modals,
  modalMeta: any,
  myCharacter?: CurrentCharacter,
  myCharacterId?: string,
  previewCharacter?: CurrentCharacter,
  map: ActiveMap,
  joinRequests: string[],
  banned: string[],
  gamestate: GameState<any>,
  hideGamestate: boolean,
  NPCs: { // TODO
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

export type Notes = {
  'shared': string,
  [key: string]: string
};
export type ChatMessage = {
  id: string,
  what: string,
  who: string,
  when: Date
};

export type SocketMessageType = 'chat' | 'note' | 'player' | 'unauthorized' | 'ready' | 'init' | 'entity' | 'character' | 'gamestate'
export type IncomingSocketMessage<T> = {
    type: SocketMessageType,
    data: T
}
