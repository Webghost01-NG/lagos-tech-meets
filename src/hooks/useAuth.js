import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { useDispatch, useSelector } from 'react-redux'
import { auth, db } from '../firebase/config'
import { setUser } from '../features/auth/authSlice'

export const useAuth = () => {
  const dispatch = useDispatch()
  const { user, loading } = useSelector((state) => state.auth)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const snap = await getDoc(doc(db, 'users', firebaseUser.uid))
        if (snap.exists()) dispatch(setUser(snap.data()))
      } else {
        dispatch(setUser(null))
      }
    })
    return () => unsub()
  }, [dispatch])

  return { user, loading }
}
