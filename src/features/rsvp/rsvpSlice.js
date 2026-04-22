import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  collection, addDoc, getDocs, deleteDoc,
  query, where, doc, updateDoc, increment, serverTimestamp,
} from 'firebase/firestore'
import { db } from '../../firebase/config'

export const fetchMyRSVPs = createAsyncThunk('rsvp/fetchMine', async (uid, thunkAPI) => {
  try {
    const q = query(collection(db, 'rsvps'), where('uid', '==', uid))
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message)
  }
})

export const fetchEventRSVPs = createAsyncThunk('rsvp/fetchForEvent', async (eventId, thunkAPI) => {
  try {
    const q = query(collection(db, 'rsvps'), where('eventId', '==', eventId))
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message)
  }
})

export const rsvpToEvent = createAsyncThunk('rsvp/add', async ({ eventId, eventTitle, user }, thunkAPI) => {
  try {
    const docRef = await addDoc(collection(db, 'rsvps'), {
      eventId,
      eventTitle,
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      rsvpAt: serverTimestamp(),
    })
    await updateDoc(doc(db, 'events', eventId), { rsvpCount: increment(1) })
    return { id: docRef.id, eventId, eventTitle, uid: user.uid, displayName: user.displayName }
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message)
  }
})

export const cancelRSVP = createAsyncThunk('rsvp/cancel', async ({ rsvpId, eventId }, thunkAPI) => {
  try {
    await deleteDoc(doc(db, 'rsvps', rsvpId))
    await updateDoc(doc(db, 'events', eventId), { rsvpCount: increment(-1) })
    return rsvpId
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message)
  }
})

const rsvpSlice = createSlice({
  name: 'rsvp',
  initialState: { myRSVPs: [], eventRSVPs: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyRSVPs.fulfilled, (state, action) => { state.myRSVPs = action.payload })
      .addCase(fetchEventRSVPs.fulfilled, (state, action) => { state.eventRSVPs = action.payload })
      .addCase(rsvpToEvent.pending, (state) => { state.loading = true })
      .addCase(rsvpToEvent.fulfilled, (state, action) => {
        state.loading = false
        state.myRSVPs.push(action.payload)
      })
      .addCase(rsvpToEvent.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(cancelRSVP.fulfilled, (state, action) => {
        state.myRSVPs = state.myRSVPs.filter(r => r.id !== action.payload)
      })
  },
})

export default rsvpSlice.reducer
