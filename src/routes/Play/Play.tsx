// Components
import Navbar from './layers/Navbar'
import LiveChat from "./layers/LiveChat"
// import Map from './layers/Map'
// import ActionsBar from './layers/Actionsbar'
import PlayerList from "./layers/PlayerList"
// import CharacterPanel from "./layers/CharacterPanel"
// import GameState from './layers/GameState'

// Common
import ErrorBoundary from 'common/ErrorBoundary'

export default function Play() { 
    return (<>
        <Navbar />
        <ErrorBoundary>
            {/* <Map            /> */}
            {/* <ActionsBar     /> */}
            <PlayerList     />
            {/* <CharacterPanel /> */}
            {/* <GameState      /> */}
        </ErrorBoundary>
        <LiveChat />
    </>)
}
