import { useEffect, useState, useContext } from "react"
import { useNavigate } from "react-router-dom"

import { getDatabase, ref, push, onValue } from "firebase/database"

import UserContext from "../../context/User.jsx"

import CharacterTile from './Components/CharacterTile.jsx'
import Loader from "../../common/Loader"

import Styles from "./_.module.sass"

export default function ViewAll({ ...props }) {
    const [user] = useContext(UserContext)
    const [state, setState] = useState({ characters: [], loading: true, })
    const navigate = useNavigate()

    useEffect(() => {
        const unsubscribe = onValue(ref(getDatabase(), "characters/" + user.uid), (snapshot) => {
            let doc = snapshot.val() || {}
            let characters = Object.keys(doc).map(key => {
                return { ...doc[key], uid: key }
            })
            setState((state) => {
                return { ...state, loading: false, characters }
            })
        })
        return () => { unsubscribe(); }
    }, [user])

    function create() {
        push(ref(getDatabase(), "characters/" + user.uid), {
            name: "New Character",
            image: "",
            stats: {
                inspiration: 0,
                proficienyBonus: 0,
                passiveWisdom: 0,

                strength: 0,
                strengthAdd: 0,
                dexterity: 0,
                dexterityAdd: 0,
                constitution: 0,
                constitutionAdd: 0,
                intelligence: 0,
                intelligenceAdd: 0,
                wisdom: 0,
                wisdomAdd: 0,
                charisma: 0,
                charismaAdd: 0,

                acrobatics: 0,
                animalHandling: 0,
                arcana: 0,
                athletics: 0,
                deception: 0,
                history: 0,
                insight: 0,
                intimidation: 0,
                investigation: 0,
                medicine: 0,
                nature: 0,
                perception: 0,
                performance: 0,
                persuasion: 0,
                religion: 0,
                sleightOfHand: 0,
                stealth: 0,
                survival: 0,
            },
            savingThrows: {
                strength: 0,
                dexterity: 0,
                constitution: 0,
                intelligence: 0,
                wisdom: 2,
                charisma: 2,
            },
            features: {
                class: "",
                race: "",
                background: "",
                alignment: "",
                age: "",
                height: "",
                weight: "",
                eyes: "",
                skin: "",
                hair: "",
                image: "",
                backstory: "",
                additionalFeatures: "",
                ideals: "",
                bonds: "",
                flaws: "",
                languagesKnown: [],
            },
            spells: {
                class: "",
                ability: "",
                saveDC: "",
                attackBonus: "",
                cantrips: [],
                slot1: [],
                slot2: [],
                slot3: [],
                slot4: [],
                slot5: [],
                slot6: [],
                slot7: [],
                slot8: [],
                slot9: [],
            },
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
        }).then((document) => {
            const { key } = document
            navigate("/characters/" + key, { replace: false })
        })
    }

    if (state.loading) {
        return <Loader />
    }

    return (
        <div className="container is-max-widescreen">
            <div className="block level">
                <div className="block buttons is-left">
                    <button className="button is-primary is-medium" type="button" onClick={create}>
                        <span>Create +</span>
                    </button>
                </div>
            </div>
            <div className={"block " + Styles.CharacterList}>
                {state.characters.map((character) => <CharacterTile key={character.uid} character={character} />)}
            </div>
        </div>
    )
}
