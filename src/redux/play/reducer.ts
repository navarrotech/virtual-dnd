
// Redux
import { createSlice } from "@reduxjs/toolkit"

// Utility
import { set } from "lodash-es"

// Types
import type { State, ChatMessage } from "./types"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { User } from "redux/user/types"
import type { Modals } from "routes/Play/Modals"

const initialState: State = {
  id: '',
  name: '',
  role: 'player',
  owner: '',
  activeModal: null,
  modalMeta: {},
  myCharacter: undefined,
  myCharacterId: undefined,
  map: {
    imageLayer: {
      url: '',
      sizeX: 0,
      sizeY: 0
    },
    entities: {},
    landmarks: {}
  },
  joinRequests: [],
  banned: [],
  gamestate: {
    mode: 'passive',
    data: {}
  },
  hideGamestate: false,
  NPCs: {},
  chat: {
    chat_id: '',
    show: false,
    newMessage: '',
    messages: [],
  },
  notes: {
    'shared': '',
  },
  characters: {},
  characterIds: [],
  players: {}
}

export const constants = {
  SET_MESSAGES: 'PLAY/SET_MESSAGES',
  ADD_MESSAGES: 'PLAY/ADD_MESSAGES',
  SET_PLAYERS: 'PLAY/SET_PLAYERS',
  SET_NOTES: 'PLAY/SET_NOTES',
  SET_ROLE: 'PLAY/SET_ROLE',
  RESET: 'PLAY/RESET',
  ON_SOCKET: 'PLAY/SOCKET',
  SET_SHOW_CHAT: 'PLAY/SET_SHOW_CHAT',
  SET_NEW_MESSAGE: 'PLAY/SET_NEW_MESSAGE',
  SET_STATE: 'PLAY/SET_STATE',
  TOGGLE_GAMESTATE_MODAL: 'PLAY/TOGGLE_GAMESTATE_MODAL',
  SET_MODAL_OPEN: 'PLAY/SET_MODAL_OPEN',
} as const

// type ActionType = typeof constants[keyof typeof constants];

const slice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    [constants.SET_MESSAGES]: (state, action: PayloadAction<ChatMessage[]>) => {
      state.chat.messages = action.payload as ChatMessage[];
      return state;
    },
    [constants.ADD_MESSAGES]: (state, action: PayloadAction<ChatMessage>) => {
      state.chat.messages.push(action.payload);
      return state;
    },
    [constants.SET_ROLE]: (state, action: PayloadAction<'dm' | 'player'>) => {
      state.role = action.payload;
      return state;
    },
    [constants.SET_PLAYERS]: (state, action: PayloadAction<User[]>) => {
      action.payload.forEach(player => {
        player.name = player.first_name + ' ' + player.last_name
        set(state.players, player.id, player)
      })
      return state;
    },
    [constants.SET_NOTES]: (state, action: PayloadAction<any>) => {
      const notes = action.payload
      notes.forEach((note: any) => {
        state.notes[note.owner] = note.content
      })
      return state;
    },
    [constants.RESET]: () => {
      return initialState;
    },
    [constants.SET_NEW_MESSAGE]: (state, action: PayloadAction<string>) => {
      state.chat.newMessage = action.payload;
      return state;
    },
    [constants.SET_SHOW_CHAT]: (state, action: PayloadAction<boolean>) => {
      state.chat.show = action.payload;
      return state;
    },
    [constants.SET_MODAL_OPEN]: (state, action: PayloadAction<Modals>) => {
      state.activeModal = action.payload;
      if(action.payload === null){
        state.modalMeta = {}
      }
      return state;
    },
    [constants.TOGGLE_GAMESTATE_MODAL]: (state) => {
      state.hideGamestate = !state.hideGamestate;
      return state;
    },
    [constants.ON_SOCKET]: (state, action: PayloadAction<any>) => {
      const message = action.payload
      const { type, data } = message
      switch (type) {
        case 'unauthorized':
        case 'init':
        case 'ready':
          break;
        case 'chat':
          state.chat.messages.push(data)
          break;
        case 'note':
          state.notes = data
          break;
        case 'gamestate':
          state.gamestate = data
          break;
        case 'entity':
          set(state.map.entities, [data.entityId, 'x'], data.x)
          set(state.map.entities, [data.entityId, 'y'], data.y)
          break;
        case 'character': 
          state.characters[data.id] = data.data;
          if(state.myCharacterId === data.id){
            state.myCharacter = data.data
          }
          if(state.previewCharacter?.id === data.id){
            state.previewCharacter = data.data
          }
          break;
        case 'player-joined':
          set(state.players, data.user.id, data.user)
          set(state.characters, data.character.id, data.character)
          break;
      }
      return state;
    },
    [constants.SET_STATE]: (state, action: PayloadAction<{ path: string, value: any }>) => {
      const { path, value } = action.payload
      state = set(state, path, value)
      return state;
    }
  }
})

export default slice;

export const _setRole = slice.actions[constants.SET_ROLE]

export const setMessages = slice.actions[constants.SET_MESSAGES]
export const addMessage = slice.actions[constants.ADD_MESSAGES]
export const setPlayers = slice.actions[constants.SET_PLAYERS]
export const setNotes = slice.actions[constants.SET_NOTES]
export const reset = slice.actions[constants.RESET]
export const setNewMessage = slice.actions[constants.SET_NEW_MESSAGE]
export const onWs = slice.actions[constants.ON_SOCKET]
export const showChat = slice.actions[constants.SET_SHOW_CHAT]
export const setReducerState = slice.actions[constants.SET_STATE]
export const toggleModal = slice.actions[constants.SET_MODAL_OPEN]
export const toggleGamestateModal = slice.actions[constants.TOGGLE_GAMESTATE_MODAL]
