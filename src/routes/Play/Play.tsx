
// Layers
import Navbar from './layers/Navbar'
import LiveChat from "./layers/LiveChat"
import Map from './layers/Map'
import ActionsBar from './layers/Actionsbar'
import PlayerList from "./layers/PlayerList"
import CharacterPanel from "./layers/CharacterPanel"

// Advanced layers
import GameState from './GameState'
import Modals from './Modals'

// Common
import ErrorBoundary from 'common/ErrorBoundary'

export default function Play(){ 
    return (<>
        <Navbar />
        <ErrorBoundary>

            <Map />
            <ActionsBar />
            <PlayerList />
            <CharacterPanel />
            
            <GameState />
            <Modals />

        </ErrorBoundary>
        <LiveChat />
    </>)
}
