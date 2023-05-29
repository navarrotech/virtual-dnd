
// Store configuration
import { configureStore } from '@reduxjs/toolkit'

// Reducers
import userReducer from './redux/user/reducer'
import appReducer from './redux/app/reducer'
import campaignReducer from './redux/campaigns/reducer'
import charactersReducer from './redux/characters/reducer'
import playReducer from './redux/play/reducer'

const store = configureStore({
  reducer: {
    campaigns: campaignReducer.reducer,
    characters: charactersReducer.reducer,
    user: userReducer.reducer,
    app: appReducer.reducer,
    play: playReducer.reducer,
  },
  middleware: getDefaultMiddleware =>
  getDefaultMiddleware({
    thunk: true
  }),
  devTools: process.env.NODE_ENV !== 'production'
})

export default store;

export const dispatch = store.dispatch;
export const getState = store.getState;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred dispatch with everything we need!
export type AppDispatch = typeof store.dispatch

