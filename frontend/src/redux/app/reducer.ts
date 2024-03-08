import { createSlice } from "@reduxjs/toolkit"

import type { State } from "./types"

const initialState: State = {
  showFriends: false,
  showSettings: false,
}

export const constants = {
  SHOW_FRIENDS: 'APP/SHOW_FRIENDS',
  SHOW_SETTINGS: 'APP/SHOW_SETTINGS',
  ON_CHANGE_WS: 'APP/ON_CHANGE',
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
    [constants.ON_CHANGE_WS](state) {
      
      return state;
    }
  }
})

export default slice;

export const setFriends  = slice.actions[constants.SHOW_FRIENDS]
export const setSettings = slice.actions[constants.SHOW_SETTINGS]
export const onChange    = slice.actions[constants.ON_CHANGE_WS]
