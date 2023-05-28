
// Typescript
import type { CharacterDoc } from "redux/characters/types";
import type { ThunkAction } from "redux-thunk";
import type { RootState } from "store";

// Utility
import axios, { type AxiosResponse } from "axios";
import { saveCharacter, updateCharacter } from "./reducer";

export const saveCurrentCharacter = (): ThunkAction<any, RootState, any, any> => async (dispatch, getState) => {
  const state = getState();

  const character = state.characters.current;
  const currentCharacterId = state.characters.currentCharacterId;

  if(!character){
    return;
  }

  const result: AxiosResponse<CharacterDoc, any> = await axios.post(`/data/dnd_characters/update`, {
      id: currentCharacterId,
      update: {
        data: character
      }
  })

  dispatch(updateCharacter(result.data))
  dispatch(saveCharacter(null))
  
  return result;
}
