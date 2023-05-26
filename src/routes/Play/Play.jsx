// Components
import Navbar from './components/Navbar.jsx'
import LiveChat from "./components/LiveChat.jsx"
import CharacterPanel from "./components/CharacterPanel.jsx"
import PlayerList from "./components/PlayerList.jsx"
import GameState from './components/GameState.jsx'
import Map from './components/Map.jsx'
import ActionsBar from './components/Actionsbar.jsx'

// Context
import { CampaignProvider } from './CampaignContext.jsx'

// Common
import ErrorBoundary from 'widget/ErrorBoundary.jsx'

// Styles
import Styles from './_.module.sass'

export default function Play() {
    return (
        <div className={Styles.Game}>
            <CampaignProvider>
                <Navbar         />
                <ErrorBoundary>
                    <Map            />
                    <ActionsBar     />
                    <PlayerList     />
                    <CharacterPanel />
                    <GameState      />
                </ErrorBoundary>
            </CampaignProvider>
            <LiveChat />
        </div>
    )
}
