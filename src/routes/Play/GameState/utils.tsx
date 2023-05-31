
import { Portal } from "react-portal"
import type { ReactNode } from "react"

const element = document.querySelector('body') as HTMLElement

export function GameStateModal({ children }: { children: ReactNode }){
  return <Portal node={element}>
    <div className="modal is-active">
        <div className="modal-background" />
        { children }
    </div>
  </Portal>
}
