import { createSlice } from "@reduxjs/toolkit"

// import type { PayloadAction } from "@reduxjs/toolkit"
import type { State } from "./types"

const initialState: State = {
  authorized: false,
  user: {
    id: '0',
    first_name: '',
    last_name: '',
    name: '',
    email: '',
    photoURL: '',
    preferences: {},
    created: ''
  }
}

export const constants = {
  SET_USER: 'USER/SET',
  LOGOUT: 'USER/LOGOUT'
}

const slice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    [constants.SET_USER](state, action) {
      if(action.payload.authorized){
        const { authorized, user } = action.payload;
        state.authorized = authorized;
        state.user = {
          ...user,
          name: user.first_name + user.last_name
        };
      } else { 
        const user = action.payload;
        state.user = {
          ...user,
          name: user.first_name + user.last_name
        };
      }
      return state;
    },
    [constants.LOGOUT](state) {
      state.authorized = false;
      state.user = initialState.user;
      return state;
    },
  }
})

export default slice;

export const setUser = slice.actions[constants.SET_USER]
export const logout = slice.actions[constants.LOGOUT]

