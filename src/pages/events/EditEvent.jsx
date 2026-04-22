import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { fetchEventById, updateEvent } from '../../features/events/eventsSlice'
import Spinner from '../../components/Spinner'
import { FiArrowLeft } from 'react-icons/fi'

const Page = styled.div`max-width: 720px; margin: 0 auto; padding: 2rem 1.5rem;`

const BackBtn = styled.button`
  display: flex; align-items: center; gap: 0.4rem;
  background: transparent; color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.9rem; margin-bottom: 1.5rem;
  &:hover { color: ${({ theme }) => theme.colors.text}; }
`

const Title = styled.h1`font-size: 1.6rem; font-weight: 800; margin-bottom: 0.25rem;`
const Sub = styled.p`color: ${({ theme }) => theme.colors.textMuted}; font-size: 0.9rem; margin-bottom: 2rem;`

const Card = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: 2rem;
`

const Grid = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;
  @media (max-width: 600px) { grid-template-columns: 1fr; }
`

const Field = styled.div`margin-bottom: 1.2rem; &.full { grid-column: 1 / -1; }`

const Label = styled.label`
  display: block; font-size: 0.85rem; font-weight: 500;
  margin-bottom: 0.4rem; color: ${({ theme }) => theme.colors.textMuted};
`

const Input = styled.input`
  width: 100%; background: ${({ theme }) => theme.colors.bgLight};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 0.75rem 0.9rem; color: ${({ theme }) => theme.colors.text}; font-size: 0.95rem;
  &:focus { outline: none; border-color: ${({ theme }) => theme.colors.primary}; }
`

const Select = styled.select`
  width: 100%; background: ${({ theme }) => theme.colors.bgLight};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 0.75rem 0.9rem; color: ${({ theme }) => theme.colors.text}; font-size: 0.95rem; cursor: pointer;
  &:focus { outline: none; border-color: ${({ theme }) => theme.colors.primary}; }
`

const Textarea = styled.textarea`
  width: 100%; background: ${({ theme }) => theme.colors.bgLight};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 0.75rem 0.9rem; color: ${({ theme }) => theme.colors.text}; font-size: 0.95rem;
  resize: vertical; min-height: 120px;
  &:focus { outline: none; border-color: ${({ theme }) => theme.colors.primary}; }
`

const Btn = styled.button`
  width: 100%; background: ${({ theme }) => theme.colors.primary}; color: #000;
  padding: 0.9rem; border-radius: ${({ theme }) => theme.radius.md};
  font-weight: 700; font-size: 1rem; margin-top: 0.5rem; transition: background 0.2s;
  &:hover { background: ${({ theme }) => theme.colors.primaryDark}; color: #fff; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`

const CATEGORIES = ['Tech Talk', 'Hackathon', 'Workshop', 'Networking', 'Conference', 'Bootcamp']

const EditEvent = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { currentEvent, loading } = useSelector((s) => s.events)
  const [form, setForm] = useState(null)

  useEffect(() => { dispatch(fetchEventById(id)) }, [dispatch, id])

  useEffect(() => {
    if (currentEvent) {
      setForm({
        title: currentEvent.title || '',
        description: currentEvent.description || '',
        date: currentEvent.date || '',
        time: currentEvent.time || '',
        location: currentEvent.location || '',
        category: currentEvent.category || 'Tech Talk',
        lat: currentEvent.lat || '',
        lng: currentEvent.lng || '',
      })
    }
  }, [currentEvent])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await dispatch(updateEvent({
      id,
      data: { ...form, lat: form.lat ? parseFloat(form.lat) : null, lng: form.lng ? parseFloat(form.lng) : null }
    }))
    if (!res.error) navigate(`/events/${id}`)
  }

  if (loading || !form) return <Page><Spinner /></Page>

  return (
    <Page>
      <BackBtn onClick={() => navigate(`/events/${id}`)}><FiArrowLeft /> Back to Event</BackBtn>
      <Title>Edit Event</Title>
      <Sub>Update your event details below</Sub>
      <Card>
        <form onSubmit={handleSubmit}>
          <Grid>
            <Field className="full">
              <Label>Event Title *</Label>
              <Input name="title" value={form.title} onChange={handleChange} required />
            </Field>
            <Field>
              <Label>Date *</Label>
              <Input name="date" type="date" value={form.date} onChange={handleChange} required />
            </Field>
            <Field>
              <Label>Time *</Label>
              <Input name="time" type="time" value={form.time} onChange={handleChange} required />
            </Field>
            <Field>
              <Label>Category</Label>
              <Select name="category" value={form.category} onChange={handleChange}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </Select>
            </Field>
            <Field>
              <Label>Location *</Label>
              <Input name="location" value={form.location} onChange={handleChange} required />
            </Field>
            <Field className="full">
              <Label>Description *</Label>
              <Textarea name="description" value={form.description} onChange={handleChange} required />
            </Field>
            <Field>
              <Label>Latitude</Label>
              <Input name="lat" type="number" step="any" value={form.lat} onChange={handleChange} />
            </Field>
            <Field>
              <Label>Longitude</Label>
              <Input name="lng" type="number" step="any" value={form.lng} onChange={handleChange} />
            </Field>
          </Grid>
          <Btn type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</Btn>
        </form>
      </Card>
    </Page>
  )
}

export default EditEvent
