// import { faShield } from '@fortawesome/free-solid-svg-icons'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Styles from '../../_.module.sass'

import Healthbar from '../Healthbar'

export default function CharacterPanel({ player }) {

    // console.log({ player })
    if(!player || !player.character || !player.character.name){ return <></> }

    const {
        character: {
            stats: {

                strength,
                strengthAdd,
                dexterity,
                dexterityAdd,
                constitution,
                constitutionAdd,
                intelligence,
                intelligenceAdd,
                wisdom,
                wisdomAdd,
                charisma,
                charismaAdd,
            }
        },
        current: {
            health,
            maxHealth,
            armorClass
        }
    } = player

    return (
        <div className={Styles.CharacterPanel}>
            <div className="container is-max-desktop">
                {/* <p>{myCharacter.name}</p> */}
                <div className={"block columns is-gapless " + Styles.Stats}>
                    <div className="column"> <BigStat label="strength" big={strength} small={strengthAdd}/> </div>
                    <div className="column"> <BigStat label="dexterity" big={dexterity} small={dexterityAdd}/> </div>
                    <div className="column"> <BigStat label="constitution" big={constitution} small={constitutionAdd}/> </div>
                    <div className="column"> <BigStat label="intelligence" big={intelligence} small={intelligenceAdd}/> </div>
                    <div className="column"> <BigStat label="wisdom" big={wisdom} small={wisdomAdd}/> </div>
                    <div className="column"> <BigStat label="charisma" big={charisma} small={charismaAdd}/> </div>
                    <div className={"column is-3 " + Styles.OddColumn}>
                        <div className="px-2">
                            <p>+ 2 Insight</p>
                            <p>+ 2 Medicine</p>
                            <p>+ 2 Animal Handling</p>
                            <p>+ 2 Passive Wisdom</p>
                        </div>
                    </div>
                </div>
                <div className="block columns">
                    
                    <div className="column is-1 is-paddingless">
                        <div className={Styles.ArmorClass}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                <path d="M466.5 83.71l-192-80.01c-4.875-2.031-13.17-3.701-18.46-3.701c-5.312 0-13.53 1.67-18.44 3.701L45.61 83.71C27.7 91.1 16 108.6 16 127.1C16 385.2 205.2 512 255.1 512C307.1 512 496 383.8 496 127.1C496 108.6 484.3 91.1 466.5 83.71zM255.1 496C212.1 496 32 374 32 127.1c0-12.99 7.732-24.57 19.75-29.53l191.1-79.99C246.7 17.21 252.8 16 256.1 16c3.184 0 9.381 1.232 12.28 2.441l192 80.02C472.3 103.4 480 114.1 480 127.1C480 405.6 270.9 496 255.1 496z"/>
                            </svg>
                            <label className="label">{armorClass}</label>
                        </div>
                    </div>
                    <div className="column">
                        <Healthbar current={health} max={maxHealth}/>
                        <Healthbar current={2} max={3} color="is-link"/>
                    </div>
                    
                </div>
            </div>
        </div>
    )

}

function BigStat({ big, small, label }){
    return <>
        <div className="box has-text-centered">
            <p className="is-size-3 has-text-weight-bold">{big}</p>
            <p className="is-size-6">{parseInt(small)>=0?'+':'-'} {small}</p>
        </div>
        <label className="label has-text-centered is-capitalized">{label}</label>
    </>
}