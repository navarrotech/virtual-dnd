import { useEffect, useState, useContext } from "react"
import { UserContext } from "./AuthenticatedWrapper"
import { Route } from "react-router"

import { getDatabase, ref, set, onValue } from "firebase/database"

import Loader from "../common/Loader"

import Styles from "./Characters.module.sass"

export default (
    <>
        <Route path="/characters" element={<ViewAll />} />
    </>
)

export function ViewAll({ ...props }) {
    const [user] = useContext(UserContext)
    const [state, setState] = useState({
        characters: [],
        loading: true,
    })

    useEffect(() => {
        onValue(ref(getDatabase(), "characters/" + user.uid), (snapshot) => {
            console.log(snapshot.val())
            setState((state) => {
                return { ...state, loading: false, characters: snapshot.val() }
            })
        })
    }, [user])

    function create() {
        const database = getDatabase()
        ref(database, "characters/" + user.uid)
        set(ref(database, "characters/" + user.uid), [
            { name: "Cho'Gath", image: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Chogath_0.jpg", abilities: { slot_1: "punch" } },
            { name: "Shyvanna", image: "https://static.wikia.nocookie.net/leagueoflegends/images/5/51/Shyvana_OriginalCentered.jpg/revision/latest/scale-to-width-down/1280?cb=20180414203547", abilities: { slot_1: "bite" } },
            { name: "Spike", image: "https://www.mangajam.com/wp-content/uploads/2016/09/How_Draw_Spike-Spiegel_Cowboy_Bebop.jpg", abilities: { slot_1: "spike" } },
        ])
    }

    if (state.loading) {
        return <Loader />
    }

    return (
        <div className="container is-fluid">
            <div className="block level">
                <div className="block buttons is-left">
                    <button className="button is-primary is-medium" type="button" onClick={create}>
                        <span>Create +</span>
                    </button>
                </div>
            </div>
            <div className={"block " + Styles.CharacterList}>
                {state.characters.map((character) => {
                    return (
                        <div className={Styles.Character} key={character.name}>
                            <div className={Styles.image} style={{ backgroundImage: `url(${character.image})` }} />
                            <div className={Styles.titles}>
                                <h1 className="title">{character.name}</h1>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
