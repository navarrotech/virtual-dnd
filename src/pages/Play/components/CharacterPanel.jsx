import Styles from '../_.module.sass'
import Healthbar from './Healthbar'

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
        current:{
            health,
            maxHealth,
        }
    } = player

    return (
        <div className={'container is-max-desktop' + Styles.CharacterPanel}>
            {/* <p>{myCharacter.name}</p> */}
            <div className="block">
                <div className="block columns">
                    
                    <div className="column"> <BigStat label="strength" big={strength} small={strengthAdd}/> </div>
                    <div className="column"> <BigStat label="dexterity" big={dexterity} small={dexterityAdd}/> </div>
                    <div className="column"> <BigStat label="constitution" big={constitution} small={constitutionAdd}/> </div>
                    <div className="column"> <BigStat label="intelligence" big={intelligence} small={intelligenceAdd}/> </div>
                    <div className="column"> <BigStat label="wisdom" big={wisdom} small={wisdomAdd}/> </div>
                    <div className="column"> <BigStat label="charisma" big={charisma} small={charismaAdd}/> </div>
                    <div className="column">
                        <p>+ 2 Insight</p>
                        <p>+ 2 Medicine</p>
                        <p>+ 2 Animal Handling</p>
                        <p>+ 2 Passive Wisdom</p>
                    </div>
                    
                </div>
                <div className="block">
                    <Healthbar current={health} max={maxHealth}/>
                </div>
                <div className="block">
                    <Healthbar current={2} max={3} color="is-link"/>
                </div>
            </div>
        </div>
    )

}

function BigStat({ big, small, label }){
    return <>
        <div className="box has-text-centered">
            <p className="is-size-3">{big}</p>
            <p className="is-size-6">{parseInt(small)>=0?'+':'-'} {small}</p>
        </div>
        <label className="label has-text-centered is-capitalized">{label}</label>
    </>
}