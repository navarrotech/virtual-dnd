import { createSlice } from "@reduxjs/toolkit"

import type { State, CampaignDoc, MinimalInfoCampaign } from "./types"

const initialState: State = {
  current: undefined,
  list: [],
}

export const constants = {
  CLEAR_CURRENT_CAMPAIGN: 'CAMPAIGNS/CLEAR_CURRENT',
  SET_CAMPAIGNS: 'CAMPAIGNS/SET_CAMPAIGNS',
  SET_CURRENT_CAMPAIGN: 'CAMPAIGNS/SET_CURRENT',
}

const slice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    [constants.CLEAR_CURRENT_CAMPAIGN]: (state) => {
      state.current = initialState.current;
      return state;
    },
    [constants.SET_CAMPAIGNS]: (state, action) => {
      const list: CampaignDoc[] = action.payload;
      state.list = list.map((campaign) => (<MinimalInfoCampaign>{
        id: campaign.id,
        name: campaign.name,
        owner: campaign.owner,
        created: campaign.created,
        photoURL: campaign?.photoURL || '',
      }));
      return state;
    },
    [constants.SET_CURRENT_CAMPAIGN]: (state, action) => {
      console.log('NEED TO IMPLEMENT SET_CURRENT_CAMPAIGN', action.payload)
      return state;
    }
  }
})

export default slice;

export const clearCurrentCampaign = slice.actions[constants.CLEAR_CURRENT_CAMPAIGN]
export const setCampaigns = slice.actions[constants.SET_CAMPAIGNS]
