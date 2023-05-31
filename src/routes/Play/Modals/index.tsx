import { useEffect, useState } from 'react'

// Redux
import { useAppSelector } from 'core/redux'
import { dispatch } from 'core/redux'
import { toggleModal } from 'redux/play/reducer'

// Utility
import { Portal } from 'react-portal'

import Styles from '../_.module.sass'

// Modals
import Notes      from './Notes'
import Inventory  from './Inventory'
import ViewPlayer from './ViewPlayer'

const element = document.querySelector('body')

const modalMap = {
  'notes': Notes,
  'inventory': Inventory,
  'spells': () => <></>,
  'spawn': () => <></>,
  'player': ViewPlayer
} as const

export type Modals = keyof typeof modalMap | null
export type ModalProps = {
  close: () => any,
  meta?: {
    playerId?: string,
    startState?: any
  }
}

const closeModal = () => dispatch(toggleModal(null))

export default function ModalManager() {
  const activeModal = useAppSelector(state => state.play.activeModal)
  const meta = useAppSelector(state => state.play.modalMeta)

  if(!activeModal){
    return <></>
  }

  const Modal = modalMap[activeModal]
  if(!Modal){
    return <></>;
  }

  return <Portal node={element} key={activeModal}>
    <AnimateToActive>
      <div className="modal-background" onClick={closeModal}></div>
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
