import { useEffect, useState } from 'react'

// Redux
import { useAppSelector } from 'core/redux'
import { dispatch } from 'core/redux'
import { toggleModal } from 'redux/play/reducer'

// Utility
import { Portal } from 'react-portal'

import Styles from '../_.module.sass'

// Modals
import Notes       from './Notes'
import Inventory   from './Inventory'
import ViewPlayer  from './ViewPlayer'
import AskToRoll   from './AskToRoll'
import SpawnEntity from './SpawnEntity'

const element = document.querySelector('body')

const modalMap = {
  'notes': {
    element: Notes,
    closeOnBackground: true
  },
  'inventory': {
    element: Inventory,
    closeOnBackground: true
  },
  'spells': {
    element: () => <></>,
    closeOnBackground: true
  },
  'spawn': {
    element: SpawnEntity,
    closeOnBackground: false
  },
  'player': {
    element: ViewPlayer,
    closeOnBackground: true
  },
  'asktoroll': {
    element: AskToRoll,
    closeOnBackground: false
  },
} as const

export type Modals = keyof typeof modalMap | null
export type ModalProps = {
  close: () => any,
  meta?: {
    playerId?: string,
    startState?: any,
  }
}

const closeModal = () => dispatch(toggleModal(null))

// Modals are only for local state
// Meaning that they are not synced with the server
export default function ModalManager() {
  const gamemode = useAppSelector(state => state.play.gamestate?.mode || 'passive')
  const activeModal = useAppSelector(state => state.play.activeModal)
  const meta = useAppSelector(state => state.play.modalMeta)

  if(!activeModal || gamemode !== 'passive'){
    return <></>
  }

  const selectedModal = modalMap[activeModal]
  if(!selectedModal){
    return <></>;
  }

  const Modal = selectedModal.element
  const { closeOnBackground } = selectedModal

  return <Portal node={element} key={activeModal}>
    <AnimateToActive>
      <div className="modal-background" onClick={closeOnBackground ? closeModal : undefined}></div>
      <Modal key={activeModal} close={closeModal} meta={meta} />
    </AnimateToActive>
  </Portal>
}

function AnimateToActive({ children }: { children: any }){
  const [ animated, setAnimated ] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setAnimated(true)
    }, 1)
  }, [])

  return <div className={`modal is-active ${Styles.AnimatedModal} ${(animated ? Styles.isAnimated : Styles.isAnimating)}`}>
    { children }
  </div>
}
