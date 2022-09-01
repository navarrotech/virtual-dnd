import { useEffect, useState, useContext } from "react";
import { UserContext } from './AuthenticatedWrapper'
import { Route } from "react-router";

import { getDatabase, ref, set, onValue } from "firebase/database";

import Loader from '../common/Loader'

import Styles from './Campaigns.module.sass'

export function ViewAll({ ...props }){

    const [ user ] = useContext(UserContext)
    const [ state, setState ] = useState({
        campaigns: [],
        loading: true
    });

    useEffect(() => {
        onValue(
            ref(getDatabase(), 'campaigns/' + user.uid),
            (snapshot) => {
                console.log(snapshot.val())
                setState(state => { return { ...state, loading:false, campaigns: snapshot.val() } })
            }
        )
    }, [user])

    function create(){
        const database = getDatabase();
        ref(database, 'campaigns/' + user.uid);
        set(ref(database, 'campaigns/' + user.uid), [
            ...state.campaigns,
            {
                characters:[
                    { player: 'user_123', character:{  } }
                ]
            }
        ]);
    }

    if(state.loading){ return <Loader /> }

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
                { state.campaigns && state.campaigns.map(character => {
                    return <div className={Styles.Character} key={ character.name }>
                        <div className={Styles.image} style={{ backgroundImage:`url(${character.image})` }}/>
                        <div className={Styles.titles}>
                            <h1 className="title">{ character.name }</h1>
                        </div>
                    </div>
                }) }
            </div>
        </div>
    )

}

export default (<>
    <Route path="/campaigns" element={ <ViewAll/> } />
</>)