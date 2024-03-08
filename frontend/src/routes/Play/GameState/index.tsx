import { useEffect } from 'react'

import type { CurrentCharacter, GameState, AskToRoll, Combat } from 'redux/campaigns/types'
import type { User } from 'redux/user/types'

// Redux
import { dispatch, useAppSelector } from 'core/redux'
import { toggleGamestateModal } from 'redux/play/reducer'

// Layers
import Rolling from './Rolling'

const GameStateMap: any = {
  'rolling': Rolling,
  'combat': () => <></>,
  'setup': () => <></>,
  'passive': null,
} as const

type GetText = Record<string, (gamestate: GameState<any>, players: Record<string, User>, characters: Record<string, CurrentCharacter>) => string>
const ReturnToGamestateText: GetText = ({
  'rolling': (gs: GameState<AskToRoll>, players) => {
    const { who, reason } = gs.data
    const whoList = Object.values(who)
    const whoLength = whoList.length

    const prettyReasonMap: any = {
      'damage': 'rolling for damage',
      'initiative': 'rolling for initiative',
      'ability': 'rolling for ability',
      'healing': 'rolling for healing',
      'save': 'rolling for saving throw',
      'skill': 'rolling for skill',
    }

    const prettyReason: string = prettyReasonMap[reason] || 'rolling'

    if(whoLength === 1){
      const { playerId } = whoList[0]
      const player = players[playerId]

      if(!player){
        return `One player is ${prettyReason} now!`
      }
      const name = player.first_name + ' ' + player.last_name

      return name + ` is ${prettyReason} now!`
    }
    if(whoLength === Object.keys(players).length){
      return `Everyone is ${prettyReason} now!`
    }

    return whoLength + ` players are ${prettyReason} now!`
  },
  'combat': (gs: GameState<Combat>) => {
    if(gs.data.playerId === 'initiative'){
      // TODO
      return 'TODO because this does not make sense right now'
    }
    return 'TODO because this does not make sense right now'
  }
})

export type GameStateProps = {
  close: () => any
}

export default function GameState() {
  const gamemode = useAppSelector(state => state.play.gamestate?.mode || 'passive')
  const hideGamestate = useAppSelector(state => state.play.hideGamestate)

  useEffect(() => {
    if(hideGamestate){
      document.getElementById('PlayGame')?.classList?.add('hide-gamestate')
    } else {
      document.getElementById('PlayGame')?.classList?.remove('hide-gamestate')
    }
  }, [ hideGamestate ])

  const Overlay = GameStateMap[gamemode]
  if(!Overlay){
    return <></>;
  }

  if(hideGamestate){
    return <ReturnToGamestate />
  }

  return <Overlay key={gamemode} />
}

function ReturnToGamestate(){
  const gamestate = useAppSelector(state => state.play.gamestate || 'passive')
  const players = useAppSelector(state => state.play.players)
  const characters = useAppSelector(state => state.play.characters)

  const text = ReturnToGamestateText[gamestate.mode]?.(gamestate, players, characters) || 'An event is happening now!'
  
  return <div className="toast is-top is-clickable" onClick={() => dispatch(toggleGamestateModal())}>
      <div className="notification is-black has-text-centered">
          <h1 className="title is-size-5">{ text }</h1>
          <h2 className="subtitle is-size-6">Don't miss out! Click to join back in!</h2>
      </div>
  </div>

}
