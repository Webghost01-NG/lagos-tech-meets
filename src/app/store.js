import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import eventsReducer from '../features/events/eventsSlice'
import rsvpReducer from '../features/rsvp/rsvpSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventsReducer,
    rsvp: rsvpReducer,
  },
})
