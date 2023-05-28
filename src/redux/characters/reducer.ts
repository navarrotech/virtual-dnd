import { createSlice } from "@reduxjs/toolkit"

import type { State, CharacterDoc } from "./types"
import type { onWsChange } from "redux/app/types"

import { constants as appConsts } from "redux/app/reducer"

import { set } from 'lodash-es'

const initialState: State = {
  current: undefined,
  currentCharacterId: undefined,
  list: {},
  hasUnsavedChanges: false
}

export const constants = {
  SET_CHARACTERS: 'CHARACTERS/SET_CHARACTERS',
  SET_CURRENT_CHARACTER: 'CHARACTERS/SET_CURRENT_CHARACTER',
  CLEAR_CURRENT_CHARACTER: 'CHARACTERS/CLEAR_CURRENT_CHARACTER',
  ADD_CHARACTER: 'CHARACTERS/ADD_CHARACTER',
  UPDATE_CHARACTER: 'CHARACTERS/UPDATE_CHARACTER',
  DELETE_CHARACTER: 'CHARACTERS/DELETE_CHARACTER',
  UPDATE_CURRENT_CHARACTER: 'CHARACTERS/UPDATE_CURRENT_CHARACTER',
  SAVE_CHARACTER: 'CHARACTERS/SAVE_CHARACTER',
}

const storageKey = (id: string) => `character_draft_${id}`
const getFromStorage = (id: string) => localStorage.getItem(storageKey(id)) ? JSON.parse(localStorage.getItem(storageKey(id)) || '{}') : null
const setToStorage = (id: string, value: object) => localStorage.setItem(storageKey(id), JSON.stringify(value))
const clearStorage = (id: string) => localStorage.removeItem(storageKey(id))

const slice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    [constants.CLEAR_CURRENT_CHARACTER]: (state) => {
      state.current = initialState.current;
      state.currentCharacterId = initialState.currentCharacterId;
      return state;
    },
    [constants.SET_CURRENT_CHARACTER]: (state, action) => {
      const id = action.payload
      const savedHistory = getFromStorage(id);
      if(savedHistory){
        state.hasUnsavedChanges = true;
        state.current = savedHistory
      } else {
        state.current = state.list[id]
      }
      if(id !== state.currentCharacterId){
        state.currentCharacterId = id;
      }
      return state;
    },
    [constants.SAVE_CHARACTER]: (state) => {
      const id = state.currentCharacterId;
      if(id){
        clearStorage(id)
      }
      state.hasUnsavedChanges = false;
      return state;
    },
    [constants.UPDATE_CURRENT_CHARACTER]: (state, action) => {
      if(!state.currentCharacterId){
        return state;
      }
      const newData = set(state.current as any, action.payload.path, action.payload.value)
      state.current = newData
      setToStorage(state.currentCharacterId, newData)
      state.hasUnsavedChanges = true;
      return state;
    },
    [constants.SET_CHARACTERS]: (state, action) => {
      const payload = action.payload as CharacterDoc[];
      payload.forEach((character: CharacterDoc) => state.list[character.id] = character.data)
      return state;
    },
    [constants.ADD_CHARACTER]: (state, action) => {
      const payload = action.payload as CharacterDoc;
      state.list[payload.id] = payload.data;
      return state;
    },
    [constants.UPDATE_CHARACTER]: (state, action) => {
      const payload = action.payload as CharacterDoc;
      state.list[payload.id] = payload.data;
      return state;
    },
    [constants.DELETE_CHARACTER]: (state, action) => {
      delete state.list[action.payload];
      return state;
    },
    [appConsts.ON_CHANGE_WS]: (state, action) => {
      if(action.payload.table !== "dnd_characters"){
        return state;
      }
      const payload = action.payload as onWsChange<CharacterDoc>;

      switch(payload.update_type){
        case "create":
        case "update":
          state.list[payload.data.id] = payload.data.data;
          break;
        case "delete":
          delete state.list[payload.data.id];
          break;
      }

      return state;
    }
  }
})

export default slice;

export const setCharacters = slice.actions[constants.SET_CHARACTERS]
export const setCurrentCharacter = slice.actions[constants.SET_CURRENT_CHARACTER]
export const updateCurrentCharacter = slice.actions[constants.UPDATE_CURRENT_CHARACTER]
export const clearCurrentCharacter = slice.actions[constants.CLEAR_CURRENT_CHARACTER]
export const addCharacter = slice.actions[constants.ADD_CHARACTER]
export const updateCharacter = slice.actions[constants.UPDATE_CHARACTER]
export const deleteCharacter = slice.actions[constants.DELETE_CHARACTER]
export const saveCharacter = slice.actions[constants.SAVE_CHARACTER]
