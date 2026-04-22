import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { fetchEventById } from '../../features/events/eventsSlice'
import { rsvpToEvent, cancelRSVP, fetchMyRSVPs, fetchEventRSVPs } from '../../features/rsvp/rsvpSlice'
import MapView from '../../components/MapView'
import Spinner from '../../components/Spinner'
import { FiMapPin, FiCalendar, FiClock, FiUsers, FiArrowLeft, FiShare2, FiCheck, FiX } from 'react-icons/fi'
import { formatDate, formatTime } from '../../utils/formatDate'

const Page = styled.div`
  max-width: 860px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
`

const BackBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: transparent;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  &:hover { color: ${({ theme }) => theme.colors.text}; }
`

const Card = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.xl};
  overflow: hidden;
`

const Banner = styled.div`
  background: linear-gradient(135deg, #00C85322, #00962411);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: 2rem;
`

const CategoryBadge = styled.span`
  background: ${({ theme }) => theme.colors.primary}22;
  color: ${({ theme }) => theme.colors.primary};
  padding: 0.25rem 0.8rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: inline-block;
  margin-bottom: 1rem;
`

const Title = styled.h1`
  font-size: clamp(1.4rem, 3vw, 2rem);
  font-weight: 800;
  margin-bottom: 0.5rem;
`

const Organizer = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.9rem;
  span { color: ${({ theme }) => theme.colors.primary}; font-weight: 600; }
`

const Body = styled.div`padding: 2rem;`

const MetaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`

const MetaCard = styled.div`
  background: ${({ theme }) => theme.colors.bgLight};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 0.9rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  svg { color: ${({ theme }) => theme.colors.primary}; flex-shrink: 0; }
`

const MetaText = styled.div`
  p { font-size: 0.7rem; color: ${({ theme }) => theme.colors.textMuted}; margin-bottom: 0.1rem; }
  strong { font-size: 0.9rem; font-weight: 600; }
`

const Section = styled.div`
  margin-bottom: 1.5rem;
  h3 { font-size: 1rem; font-weight: 700; margin-bottom: 0.75rem; }
  p { color: ${({ theme }) => theme.colors.textMuted}; line-height: 1.8; font-size: 0.95rem; white-space: pre-wrap; }
`

const ActionRow = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-top: 1.5rem;
`

const RSVPBtn = styled.button`
  flex: 1;
  min-width: 160px;
  background: ${({ $going, theme }) => $going ? theme.colors.danger + '22' : theme.colors.primary};
  color: ${({ $going, theme }) => $going ? theme.colors.danger : '#000'};
  border: ${({ $going, theme }) => $going ? `1px solid ${theme.colors.danger}44` : 'none'};
  padding: 0.85rem 1.5rem;
  border-radius: ${({ theme }) => theme.radius.md};
  font-weight: 700;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s;
  &:hover { opacity: 0.85; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`

const ShareBtn = styled.button`
  background: ${({ theme }) => theme.colors.bgLight};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textMuted};
  padding: 0.85rem 1.2rem;
  border-radius: ${({ theme }) => theme.radius.md};
  font-weight: 600;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  transition: all 0.2s;
  &:hover { color: ${({ theme }) => theme.colors.text}; border-color: ${({ theme }) => theme.colors.primary}; }
`

const AttendeesBox = styled.div`
  background: ${({ theme }) => theme.colors.bgLight};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 1rem 1.25rem;
  margin-top: 1.5rem;
  h4 { font-size: 0.9rem; font-weight: 700; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.4rem; }
`

const AttendeeList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`

const AttendeeChip = styled.span`
  background: ${({ theme }) => theme.colors.primary}11;
  border: 1px solid ${({ theme }) => theme.colors.primary}33;
  color: ${({ theme }) => theme.colors.text};
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
`

const EventDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((s) => s.auth)
  const { currentEvent, loading } = useSelector((s) => s.events)
  const { myRSVPs, eventRSVPs, loading: rsvpLoading } = useSelector((s) => s.rsvp)

  const myRSVP = myRSVPs.find(r => r.eventId === id)
  const isGoing = !!myRSVP

  useEffect(() => {
    dispatch(fetchEventById(id))
    dispatch(fetchEventRSVPs(id))
    if (user) dispatch(fetchMyRSVPs(user.uid))
  }, [dispatch, id, user])

  const handleRSVP = async () => {
    if (!user) return navigate('/login')
    if (isGoing) {
      await dispatch(cancelRSVP({ rsvpId: myRSVP.id, eventId: id }))
    } else {
      await dispatch(rsvpToEvent({ eventId: id, eventTitle: currentEvent.title, user }))
      // Request notification permission and schedule reminder
      if ('Notification' in window && Notification.permission !== 'denied') {
        const perm = await Notification.requestPermission()
        if (perm === 'granted') {
          const eventTime = new Date(currentEvent.date + 'T' + currentEvent.time).getTime()
          const delay = eventTime - Date.now() - 60 * 60 * 1000
          if (delay > 0) {
            setTimeout(() => {
              new Notification('🚀 Lagos Tech Meets', {
                body: `"${currentEvent.title}" starts in 1 hour! 📍 ${currentEvent.location}`,
                icon: '/logo.svg',
              })
            }, delay)
          }
        }
      }
    }
  }

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      await navigator.share({ title: currentEvent?.title, url })
    } else {
      await navigator.clipboard.writeText(url)
      alert('Link copied to clipboard!')
    }
  }

  if (loading || !currentEvent) return <Spinner />

  return (
    <Page>
      <BackBtn onClick={() => navigate(-1)}><FiArrowLeft /> Back to events</BackBtn>
      <Card>
        <Banner>
          <CategoryBadge>{currentEvent.category || 'Tech'}</CategoryBadge>
          <Title>{currentEvent.title}</Title>
          <Organizer>Organized by <span>{currentEvent.organizerName}</span></Organizer>
        </Banner>

        <Body>
          <MetaGrid>
            <MetaCard>
              <FiCalendar size={20} />
              <MetaText><p>Date</p><strong>{formatDate(currentEvent.date)}</strong></MetaText>
            </MetaCard>
            <MetaCard>
              <FiClock size={20} />
              <MetaText><p>Time</p><strong>{formatTime(currentEvent.time)}</strong></MetaText>
            </MetaCard>
            <MetaCard>
              <FiMapPin size={20} />
              <MetaText><p>Location</p><strong>{currentEvent.location}</strong></MetaText>
            </MetaCard>
            <MetaCard>
              <FiUsers size={20} />
              <MetaText><p>Attending</p><strong>{currentEvent.rsvpCount || 0} people</strong></MetaText>
            </MetaCard>
          </MetaGrid>

          <Section>
            <h3>About this event</h3>
            <p>{currentEvent.description}</p>
          </Section>

          {currentEvent.lat && currentEvent.lng && (
            <Section>
              <h3>📍 Venue on Map</h3>
              <MapView lat={currentEvent.lat} lng={currentEvent.lng} title={currentEvent.location} />
            </Section>
          )}

          <ActionRow>
            <RSVPBtn onClick={handleRSVP} disabled={rsvpLoading} $going={isGoing}>
              {isGoing ? <><FiX size={15} /> Cancel RSVP</> : <><FiCheck size={15} /> RSVP — I'm Going!</>}
            </RSVPBtn>
            <ShareBtn onClick={handleShare}><FiShare2 size={15} /> Share Event</ShareBtn>
          </ActionRow>

          {eventRSVPs.length > 0 && (
            <AttendeesBox>
              <h4><FiUsers size={14} /> Who's Going ({eventRSVPs.length})</h4>
              <AttendeeList>
                {eventRSVPs.map(r => (
                  <AttendeeChip key={r.id}>{r.displayName}</AttendeeChip>
                ))}
              </AttendeeList>
            </AttendeesBox>
          )}
        </Body>
      </Card>
    </Page>
  )
}

export default EventDetail
