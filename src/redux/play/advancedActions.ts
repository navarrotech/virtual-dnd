
// Typescript
import type { CampaignDoc } from "redux/campaigns/types";
import type { ThunkAction } from "redux-thunk";
import type { RootState } from "store";

// Actions
import { _setRole, setNewMessage, showChat, setReducerState } from "./reducer";

// Utility
import { v4 as uuid } from 'uuid';

// Events
import { updateViaSocket } from "routes/Play/socket";
import { ChatMessage } from "./types";

export const initCampaign = (campaign: CampaignDoc): ThunkAction<any, RootState, any, any> => async (dispatch, getState) => {
  const state = getState();

  const userId = state.user.user.id;
  // const players = state.play.players;

  let myCharacter: any;

  Object
    .values(campaign.character_data)
    .forEach((character) => {
      if(character.player_id === userId){
        myCharacter = character
      }
      // character.player = players[character.player_id]
      dispatch(
        setReducerState({
          path: `characters.${character.id}`,
          value: character
        })
      )
    })
  
  dispatch(setReducerState({ path: 'id', value: campaign.id }))
  dispatch(setReducerState({ path: 'name', value: campaign.name }))
  dispatch(setReducerState({ path: 'characterIds', value: campaign.character_ids }))
  dispatch(setReducerState({ path: 'owner', value: campaign.owner }))
  dispatch(setReducerState({ path: 'map', value: campaign.map }))
  dispatch(_setRole(campaign.owner === userId ? 'dm' : 'player'))
  
  if(myCharacter){
    dispatch(setReducerState({ path: 'myCharacter', value: myCharacter }))
    dispatch(setReducerState({ path: 'myCharacterId', value: myCharacter?.id }))
  }
}

export const sendMessage = (): ThunkAction<any, RootState, any, any> => async (dispatch, getState) => {
  const state = getState();

  const who = state.user.user.id;
  const what = state.play.chat.newMessage;

  if(!what){
    return;
  }

  updateViaSocket('chat', <ChatMessage>{
    id: uuid(),
    what,
    who,
    when: new Date(),
  })

  dispatch(setNewMessage(''));
  dispatch(showChat(false))
}
