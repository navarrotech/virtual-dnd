
// Redux
import { useAppSelector } from 'core/redux'
import { dispatch } from 'core/redux'
import { toggleModal } from 'redux/play/reducer'

// Utility
import { Portal } from 'react-portal'

// Modals
import Notes from './Notes'

const element = document.querySelector('body')

const modalMap = {
  'notes': Notes,
  'inventory': () => <></>,
  'spells': () => <></>,
  'spawn': () => <></>,
  'player': () => <></>
} as const

export type Modals = keyof typeof modalMap | null

const closeModal = () => dispatch(toggleModal(null))

export default function ModalManager() {
  const activeModal = useAppSelector(state => state.play.activeModal)

  if(!activeModal){
    return <></>
  }

  const Modal = modalMap[activeModal]
  if(!Modal){
    return <></>;
  }

  return <Portal node={element} key={activeModal}>
    <div className="modal is-active">
      <div className="modal-background" onClick={closeModal}></div>
      <Modal key={activeModal} close={closeModal} />
    </div>
  </Portal>
}
