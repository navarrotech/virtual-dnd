
import type { CampaignDoc } from "redux/campaigns/types";

// Utility
import axios, { type AxiosResponse } from "axios";

export function onKeyDown(event: any){
  const { key, target }: { key: string, target: HTMLElement } = event;
  if (['Enter', 'Esc', 'Escape'].includes(key)) {
    target.blur()
  }
}

export async function saveChanges(state: any, id: string){
  const result: AxiosResponse<CampaignDoc, any> = await axios.post(`/data/dnd_campaigns/update`, {
    id,
    update: state
  })

  return result;
}

export async function deleteCampaign(id: string): Promise<boolean>{
  if(!confirm("WAIT! Are you sure you want to delete this campaign? This action cannot be undone.")){
    return false;
  }
  const result: AxiosResponse<CampaignDoc, any> = await axios.post(`/data/dnd_campaigns/delete`, { id })

  return result.status === 200;
}

