// Core
import { createRoot } from 'react-dom/client'
import Router from './Router.tsx'
import Initialization from './core/Initialization.tsx'
import axios from 'axios'

// Redux
import { Provider } from 'react-redux'
import store from './store'

// Styling
import './sass/index.sass'

axios.defaults.baseURL = import.meta.env.VITE_API_DOMAIN + '/dnd/'
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json'

const root = document.getElementById('root') as HTMLElement

createRoot(root).render(
  <Provider store={store}>
    <Initialization>
      <Router />
    </Initialization>
  </Provider>
)
