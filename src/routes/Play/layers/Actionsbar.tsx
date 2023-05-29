
import type { Modals } from "../Modals"

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBolt, faBook, faCoins, faScroll } from '@fortawesome/free-solid-svg-icons'
import { ReactComponent as HelmetIcon } from 'images/icons/helmet-battle.svg'
// import { ReactComponent as TreasureIcon } from 'images/icons/treasure-chest.svg'
// import { ReactComponent as SwordsIcon } from 'icons/swords.svg'

// Redux
import { useAppSelector } from 'core/redux'
import { dispatch } from "core/redux"
import { toggleModal } from "redux/play/reducer"

import Styles from '../_.module.sass'

const openModal = (modal: Modals) => () => dispatch(toggleModal(modal))

export default function ActionsBar(){

    const myRole = useAppSelector(state => state.play.role)
    const myCharacter = useAppSelector(state => state.play.myCharacter)

    const { gold=0, experience=0 } = myCharacter?.current || {}

    return (
        <div className={Styles.UserActions}>
            <button className="button is-light is-fullwidth" type="button" onClick={openModal('notes')}>
                <span className="icon">
                    <FontAwesomeIcon icon={faBook} />
                </span>
                <span>My Notes</span>
            </button>
            { myRole === 'player'
                ? <>
                    {/* <button className="button is-light is-fullwidth" type="button" onClick={openModal('inventory')}>
                        <span className="icon">
                            <TreasureIcon />
                        </span>
                        <span>My Inventory</span>
                    </button> */}
                    <button className="button is-light is-fullwidth" type="button" onClick={openModal('spells')}>
                        <span className="icon">
                            <FontAwesomeIcon icon={faScroll}/>
                        </span>
                        <span>My Spells</span>
                    </button>
                    <div className={Styles.InventoryQuip}>
                        <div className="tags">
                            <span className="tag is-black icon-text has-tooltip-bottom" data-tooltip="Money">
                                <span className="icon">
                                    <FontAwesomeIcon icon={faCoins}/>
                                </span>
                                <span>{gold}</span>
                            </span>
                            <span className="tag is-black icon-text has-tooltip-bottom" data-tooltip="Experience">
                                <span className="icon">
                                    <FontAwesomeIcon icon={faBolt}/>
                                </span>
                                <span>{experience}</span>
                            </span>
                        </div>
                    </div>
                </>
                : <>
                    {/* <button className="button is-light is-fullwidth" type="button">
                        <span className="icon">
                            <SwordsIcon />
                        </span>
                        <span>Roll Initiative</span>
                    </button> */}
                    <button className="button is-light is-fullwidth" type="button" onClick={openModal('spawn')}>
                        <span className="icon">
                            <HelmetIcon />
                        </span>
                        <span>Spawn Entity</span>
                    </button>
                    {/* <button className="button is-light is-fullwidth" type="button" onClick={() => setRollChooser(true)}>
                        <span className="icon">
                            <FontAwesomeIcon icon={faDiceD20}/>
                        </span>
                        <span>Make Player Roll</span>
                    </button> */}
                </>
            }
        </div>
    )
}
