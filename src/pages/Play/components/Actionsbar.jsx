import { useContext } from "react"
import CampaignContext from '../CampaignContext.jsx'
import DMActions from "./DMActions.jsx"
import UserActions from "./UserActions.jsx"

export default function ActionsBar(){

    // Context
    const { myCharacter=null } = useContext(CampaignContext)

    if(myCharacter){
        return <UserActions />
    }
    return <DMActions />
}