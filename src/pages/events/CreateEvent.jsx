import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { createEvent } from '../../features/events/eventsSlice'

const Page = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
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
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  @media (max-width: 600px) { grid-template-columns: 1fr; }
`

const Field = styled.div`
  margin-bottom: 1.2rem;
  &.full { grid-column: 1 / -1; }
`

const Label = styled.label`
  display: block;
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 0.4rem;
  color: ${({ theme }) => theme.colors.textMuted};
`

const Hint = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-left: 0.4rem;
`

const Input = styled.input`
  width: 100%;
  background: ${({ theme }) => theme.colors.bgLight};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 0.75rem 0.9rem;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.95rem;
  &:focus { outline: none; border-color: ${({ theme }) => theme.colors.primary}; }
`

const Select = styled.select`
  width: 100%;
  background: ${({ theme }) => theme.colors.bgLight};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 0.75rem 0.9rem;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.95rem;
  cursor: pointer;
  &:focus { outline: none; border-color: ${({ theme }) => theme.colors.primary}; }
`

const Textarea = styled.textarea`
  width: 100%;
  background: ${({ theme }) => theme.colors.bgLight};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 0.75rem 0.9rem;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.95rem;
  resize: vertical;
  min-height: 120px;
  &:focus { outline: none; border-color: ${({ theme }) => theme.colors.primary}; }
`

const MapHint = styled.div`
  background: ${({ theme }) => theme.colors.primary}11;
  border: 1px solid ${({ theme }) => theme.colors.primary}33;
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 0.75rem 1rem;
  font-size: 0.82rem;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 1.2rem;
  a { color: ${({ theme }) => theme.colors.primary}; }
`

const Btn = styled.button`
  width: 100%;
  background: ${({ theme }) => theme.colors.primary};
  color: #000;
  padding: 0.9rem;
  border-radius: ${({ theme }) => theme.radius.md};
  font-weight: 700;
  font-size: 1rem;
  margin-top: 0.5rem;
  transition: background 0.2s;
  &:hover { background: ${({ theme }) => theme.colors.primaryDark}; color: #fff; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`

const CATEGORIES = ['Tech Talk', 'Hackathon', 'Workshop', 'Networking', 'Conference', 'Bootcamp']

const CreateEvent = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((s) => s.auth)
  const { loading } = useSelector((s) => s.events)

  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: 'Tech Talk',
    lat: '',
    lng: '',
  })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await dispatch(createEvent({
      ...form,
      lat: form.lat ? parseFloat(form.lat) : null,
      lng: form.lng ? parseFloat(form.lng) : null,
      organizerUid: user.uid,
      organizerName: user.displayName,
    }))
    if (!res.error) navigate(`/events/${res.payload.id}`)
  }

  return (
    <Page>
      <Title>Create an Event</Title>
      <Sub>Host a meetup, hackathon, or workshop for the Lagos tech community</Sub>
      <Card>
        <form onSubmit={handleSubmit}>
          <Grid>
            <Field className="full">
              <Label>Event Title *</Label>
              <Input name="title" placeholder="e.g. Lagos React Developers Meetup" value={form.title} onChange={handleChange} required />
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
              <Input name="location" placeholder="e.g. CcHub, Yaba, Lagos" value={form.location} onChange={handleChange} required />
            </Field>
            <Field className="full">
              <Label>Description *</Label>
              <Textarea name="description" placeholder="What's this event about? Who should attend?" value={form.description} onChange={handleChange} required />
            </Field>

            <Field className="full">
              <MapHint>
                📍 <strong>Optional:</strong> Add coordinates for map display. Find them on{' '}
                <a href="https://www.latlong.net/" target="_blank" rel="noreferrer">latlong.net</a> — search your venue address.
              </MapHint>
            </Field>

            <Field>
              <Label>Latitude <Hint>(optional)</Hint></Label>
              <Input name="lat" type="number" step="any" placeholder="e.g. 6.5158" value={form.lat} onChange={handleChange} />
            </Field>
            <Field>
              <Label>Longitude <Hint>(optional)</Hint></Label>
              <Input name="lng" type="number" step="any" placeholder="e.g. 3.3898" value={form.lng} onChange={handleChange} />
            </Field>
          </Grid>
          <Btn type="submit" disabled={loading}>{loading ? 'Creating...' : '🚀 Publish Event'}</Btn>
        </form>
      </Card>
    </Page>
  )
}

export default CreateEvent
