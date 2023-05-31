import { createSlice } from "@reduxjs/toolkit"

// import type { PayloadAction } from "@reduxjs/toolkit"
import type { State, User } from "./types"

import { constants as appConsts } from "redux/app/reducer"

const initialState: State = {
  authorized: false,
  user: {
    id: '',
    name: '',
    first_name: '',
    last_name: '',
    email: '',
    photoURL: '',
    preferences: {},
    created: '',
    online: false,
    friend_ids: [],
    friend_req_ids: [],
  },
  friends: [],
  friend_requests: [],
  friendsMap: {},
  friendsRequestsMap: {}
}

export const constants = {
  SET_USER: 'USER/SET',
  SET_FRIENDS: 'USER/SET_FRIENDS',
  SET_FRIEND_REQUESTS: 'USER/SET_FRIEND_REQUESTS',
  LOGOUT: 'USER/LOGOUT'
}

const slice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    [constants.SET_USER]: (state, action) => {
      if(action.payload.authorized){
        const { authorized, user } = action.payload;
        state.authorized = authorized;
        state.user = {
          ...user,
          name: user.first_name + ' ' + user.last_name
        };
      } else { 
        const user = action.payload;
        state.user = {
          ...user,
          name: user.first_name + ' ' + user.last_name
        };
      }
      return state;
    },
    [constants.SET_FRIEND_REQUESTS]: (state, action) => {
      state.friend_requests = action.payload;
      action.payload.forEach((friend: User) => {
        state.friendsRequestsMap[friend.id] = friend;
      })
      return state;
    },
    [constants.SET_FRIENDS]: (state, action) => {
      state.friends = action.payload;
      action.payload.forEach((friend: User) => {
        state.friendsMap[friend.id] = friend;
      })
      return state;
    },
    [constants.LOGOUT]: (state) => {
      state.authorized = false;
      state.user = initialState.user;
      return state;
    },
    [appConsts.ON_CHANGE_WS](state, action) {
      const { update_type, table, data } = action.payload
      if(table !== 'dnd_user'){
        return;
      }
      if(update_type === 'update'){
        state.user = {
          ...data,
          name: data.first_name + ' ' + data.last_name
        }
      }
      return state;
    }
  }
})

export default slice;

export const setUser = slice.actions[constants.SET_USER]
export const logout = slice.actions[constants.LOGOUT]
export const setFriends = slice.actions[constants.SET_FRIENDS]
export const setFriendRequests = slice.actions[constants.SET_FRIEND_REQUESTS]

