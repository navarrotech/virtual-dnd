import { createSlice } from "@reduxjs/toolkit"

import type { State } from "./types"

const initialState: State = {
  showFriends: false,
  showSettings: false,
}

export const constants = {
  SHOW_FRIENDS: 'APP/SHOW_FRIENDS',
  SHOW_SETTINGS: 'APP/SHOW_SETTINGS'
}

const slice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    [constants.SHOW_FRIENDS](state, action) {
      state.showFriends = action.payload;
      return state;
    },
    [constants.SHOW_SETTINGS](state, action) {
      state.showSettings = action.payload;
      return state;
    },
  }
})

export default slice;

export const setFriends  = slice.actions[constants.SHOW_FRIENDS]
export const setSettings = slice.actions[constants.SHOW_SETTINGS]
