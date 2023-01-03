import { useMemo, useState, useContext, useEffect } from "react"

import { useParams } from "react-router-dom";

import { getDatabase, ref, remove, set } from "firebase/database"

import CampaignContext from '../CampaignContext.jsx'

import ChooseAvatar from "pages/Characters/Components/ChooseAvatar.jsx"

import Loader from "common/Loader";

export default function SelectPlayer({ start="modify", player: initialPlayer, onClose }){

    const [ player, setPlayer ] = useState(initialPlayer)
    const [ page, setPage ] = useState(start)
    const { id } = useParams()

    useEffect(() => {
        if(page === ''){ onClose() }
    }, [page, onClose])

    if(page === 'choose_avatar'){
        return 
    }

    return <></>;
}