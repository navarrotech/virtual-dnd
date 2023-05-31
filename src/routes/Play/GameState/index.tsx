
// Redux
import { useAppSelector } from 'core/redux'

// Layers
import Rolling from './Rolling'

const GameStateMap: any = {
  'rolling': Rolling,
  'combat': () => <></>,
  'setup': () => <></>,
  'passive': null,
} as const

export type GameStateProps = {
  close: () => any
}

const closeModal = () => { /* TODO */ }

export default function GameState() {
  const gamemode = useAppSelector(state => state.play.gamestate?.mode || 'passive')

  const Overlay = GameStateMap[gamemode]
  if(!Overlay){
    return <></>;
  }

  return <Overlay key={gamemode} close={closeModal} />
}
