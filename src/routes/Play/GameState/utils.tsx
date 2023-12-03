
import { Portal } from "react-portal"
import type { ReactNode } from "react"

import { dispatch } from "store"
import { toggleGamestateModal } from "redux/play/reducer"

import Styles from '../_.module.sass'

const element = document.querySelector('body') as HTMLElement

export function GameStateModal({ children }: { children: ReactNode }){
  return <Portal node={element}>
    <div className={"modal is-active " + Styles.GamestateModal}>
        <div className="modal-background" />
        <button className="delete is-large" onClick={() => dispatch(toggleGamestateModal())}/>
        { children }
    </div>
  </Portal>
}
