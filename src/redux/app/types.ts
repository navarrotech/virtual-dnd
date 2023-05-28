import type { CharacterDoc } from "redux/characters/types"
import type { User } from "redux/user/types"
import type { CampaignDoc } from "redux/campaigns/types";

export type State = {
  showFriends: boolean;
  showSettings: boolean;
}

export type Tables = "dnd_characters" | "dnd_user" | "dnd_notes" | "dnd_campaigns" | "dnd_chat"
export type UpdateType = "create" | "update" | "delete"

export type onWsChange <T = CharacterDoc | User | CampaignDoc | any> = {
  table : Tables,
  type : string,
  update_type : UpdateType,
  data: T,
  meta: {
    isOwner: boolean
  }
}
