import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  collection, addDoc, getDocs, doc, getDoc,
  updateDoc, deleteDoc, query, orderBy, where, serverTimestamp,
} from 'firebase/firestore'
import { db } from '../../firebase/config'

export const fetchEvents = createAsyncThunk('events/fetchAll', async (_, thunkAPI) => {
  try {
    const q = query(collection(db, 'events'), orderBy('date', 'asc'))
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message)
  }
})

export const fetchMyEvents = createAsyncThunk('events/fetchMine', async (uid, thunkAPI) => {
  try {
    const q = query(collection(db, 'events'), where('organizerUid', '==', uid), orderBy('date', 'asc'))
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message)
  }
})

export const fetchEventById = createAsyncThunk('events/fetchOne', async (id, thunkAPI) => {
  try {
    const snap = await getDoc(doc(db, 'events', id))
    if (!snap.exists()) return thunkAPI.rejectWithValue('Event not found')
    return { id: snap.id, ...snap.data() }
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message)
  }
})

export const createEvent = createAsyncThunk('events/create', async (eventData, thunkAPI) => {
  try {
    const docRef = await addDoc(collection(db, 'events'), {
      ...eventData,
      rsvpCount: 0,
      createdAt: serverTimestamp(),
    })
    return { id: docRef.id, ...eventData, rsvpCount: 0 }
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message)
  }
})

export const updateEvent = createAsyncThunk('events/update', async ({ id, data }, thunkAPI) => {
  try {
    await updateDoc(doc(db, 'events', id), data)
    return { id, data }
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message)
  }
})

export const deleteEvent = createAsyncThunk('events/delete', async (id, thunkAPI) => {
  try {
    await deleteDoc(doc(db, 'events', id))
    return id
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message)
  }
})

const eventsSlice = createSlice({
  name: 'events',
  initialState: {
    events: [],
    myEvents: [],
    currentEvent: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentEvent: (state) => { state.currentEvent = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => { state.loading = true })
      .addCase(fetchEvents.fulfilled, (state, action) => { state.loading = false; state.events = action.payload })
      .addCase(fetchEvents.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(fetchMyEvents.fulfilled, (state, action) => { state.myEvents = action.payload })
      .addCase(fetchEventById.pending, (state) => { state.loading = true })
      .addCase(fetchEventById.fulfilled, (state, action) => { state.loading = false; state.currentEvent = action.payload })
      .addCase(fetchEventById.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.events.push(action.payload)
        state.myEvents.push(action.payload)
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        const { id, data } = action.payload
        const idx = state.myEvents.findIndex(e => e.id === id)
        if (idx !== -1) state.myEvents[idx] = { ...state.myEvents[idx], ...data }
        if (state.currentEvent?.id === id) state.currentEvent = { ...state.currentEvent, ...data }
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.myEvents = state.myEvents.filter(e => e.id !== action.payload)
        state.events = state.events.filter(e => e.id !== action.payload)
      })
  },
})

export const { clearCurrentEvent } = eventsSlice.actions
export default eventsSlice.reducer
