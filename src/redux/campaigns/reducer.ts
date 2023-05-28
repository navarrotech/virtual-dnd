import { createSlice } from "@reduxjs/toolkit"

import type { State, CampaignDoc } from "./types"
import type { onWsChange } from "redux/app/types"

import { constants as appConsts } from "redux/app/reducer"

const initialState: State = {
  myCampaigns: {},
  playingIn: {},
  all: {}
}

export const constants = {
  SET_MYCAMPAIGNS: 'CAMPAIGNS/SET_MYCAMPAIGNS',
  SET_PLAYING_IN: 'CAMPAIGNS/SET_PLAYING_IN',
  CREATE_CAMPAIGN: 'CAMPAIGNS/CREATE',
}

const slice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    [constants.SET_MYCAMPAIGNS]: (state, action) => {
      const list: CampaignDoc[] = action.payload;
      list.forEach((campaign) => {
        state.myCampaigns[campaign.id] = campaign;
        state.all[campaign.id] = campaign;
      })
      return state;
    },
    [constants.SET_PLAYING_IN]: (state, action) => {
      const list: CampaignDoc[] = action.payload;
      list.forEach((campaign) => {
        state.playingIn[campaign.id] = campaign;
        state.all[campaign.id] = campaign;
      })
      return state;
    },
    [constants.CREATE_CAMPAIGN]: (state, action) => {
      state.myCampaigns[action.payload.id] = action.payload;
      state.all[action.payload.id] = action.payload;
      return state;
    },
    [appConsts.ON_CHANGE_WS]: (state, action) => {
      if(action.payload.table !== "dnd_campaigns"){
        return state;
      }
      const payload = action.payload as onWsChange<CampaignDoc>;

      const isOwner = payload.meta.isOwner;
      const id = payload.data.id

      switch(payload.update_type){
        case "create":
        case "update":
          if(isOwner){
            state.myCampaigns[id] = payload.data;
          } else {
            state.playingIn[id] = payload.data;
          }
          state.all[id] = payload.data;
          break;
        case "delete":
          delete state.myCampaigns[id];
          delete state.playingIn[id];
          break;
      }
    },
  }
})

export default slice;

export const setCampaigns = slice.actions[constants.SET_MYCAMPAIGNS]
export const setPlayingIn = slice.actions[constants.SET_PLAYING_IN]
export const createCampaign = slice.actions[constants.CREATE_CAMPAIGN]
