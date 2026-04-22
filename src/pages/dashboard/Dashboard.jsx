import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { fetchMyEvents, deleteEvent } from '../../features/events/eventsSlice'
import { fetchMyRSVPs, cancelRSVP } from '../../features/rsvp/rsvpSlice'
import Spinner from '../../components/Spinner'
import { FiPlusCircle, FiEdit2, FiTrash2, FiCalendar, FiMapPin, FiX } from 'react-icons/fi'
import { formatDate, formatTime } from '../../utils/formatDate'

const Page = styled.div`max-width: 1000px; margin: 0 auto; padding: 2rem 1.5rem;`

const TopBar = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;
`

const PageTitle = styled.h1`
  font-size: 1.6rem; font-weight: 800;
  span { color: ${({ theme }) => theme.colors.primary}; }
`

const CreateBtn = styled(Link)`
  display: flex; align-items: center; gap: 0.4rem;
  background: ${({ theme }) => theme.colors.primary}; color: #000;
  padding: 0.7rem 1.2rem; border-radius: ${({ theme }) => theme.radius.md};
  font-weight: 700; font-size: 0.9rem; transition: all 0.2s;
  &:hover { background: ${({ theme }) => theme.colors.primaryDark}; color: #fff; }
`

const StatsRow = styled.div`
  display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1rem; margin-bottom: 2rem;
`

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 1.25rem 1.5rem;
  p { color: ${({ theme }) => theme.colors.textMuted}; font-size: 0.8rem; margin-bottom: 0.3rem; }
  strong { font-size: 1.8rem; font-weight: 800; color: ${({ theme }) => theme.colors.primary}; }
`

const SectionTitle = styled.h2`font-size: 1.1rem; font-weight: 700; margin-bottom: 1rem;`

const Divider = styled.div`margin: 2rem 0; border-top: 1px solid ${({ theme }) => theme.colors.border};`

const EventRow = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 1.25rem 1.5rem;
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: 1rem; margin-bottom: 0.75rem;
  transition: border-color 0.2s;
  &:hover { border-color: ${({ theme }) => theme.colors.primary}; }
`

const EventInfo = styled(Link)`
  flex: 1;
  h3 { font-size: 0.95rem; font-weight: 700; margin-bottom: 0.3rem; transition: color 0.2s; }
  p { color: ${({ theme }) => theme.colors.textMuted}; font-size: 0.82rem; display: flex; align-items: center; gap: 0.3rem; flex-wrap: wrap; }
  &:hover h3 { color: ${({ theme }) => theme.colors.primary}; }
`

const Actions = styled.div`display: flex; align-items: center; gap: 0.5rem;`

const IconLink = styled(Link)`
  background: ${({ theme }) => theme.colors.bgLight};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textMuted};
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: 0.4rem 0.6rem; display: flex; align-items: center; transition: all 0.2s;
  &:hover { color: ${({ theme }) => theme.colors.text}; }
`

const IconBtn = styled.button`
  background: ${({ theme }) => theme.colors.bgLight};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ $danger, theme }) => $danger ? theme.colors.danger : theme.colors.textMuted};
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: 0.4rem 0.6rem; display: flex; align-items: center; cursor: pointer; transition: all 0.2s;
  &:hover {
    background: ${({ $danger, theme }) => $danger ? theme.colors.danger + '22' : theme.colors.bgCard};
    color: ${({ $danger, theme }) => $danger ? theme.colors.danger : theme.colors.text};
  }
`

const RSVPRow = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 1rem 1.5rem;
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: 0.75rem; margin-bottom: 0.75rem;
`

const RSVPInfo = styled(Link)`
  flex: 1;
  h4 { font-size: 0.9rem; font-weight: 600; margin-bottom: 0.2rem; transition: color 0.2s; }
  p { color: ${({ theme }) => theme.colors.textMuted}; font-size: 0.8rem; display: flex; align-items: center; gap: 0.3rem; }
  &:hover h4 { color: ${({ theme }) => theme.colors.primary}; }
`

const CancelBtn = styled.button`
  display: flex; align-items: center; gap: 0.3rem;
  background: transparent; border: 1px solid ${({ theme }) => theme.colors.danger}44;
  color: ${({ theme }) => theme.colors.danger}; padding: 0.35rem 0.8rem;
  border-radius: ${({ theme }) => theme.radius.sm}; font-size: 0.8rem; font-weight: 600;
  cursor: pointer; transition: all 0.2s;
  &:hover { background: ${({ theme }) => theme.colors.danger}22; }
`

const Empty = styled.div`
  text-align: center; padding: 2.5rem;
  color: ${({ theme }) => theme.colors.textMuted};
  p { margin-bottom: 0.75rem; }
  a { color: ${({ theme }) => theme.colors.primary}; font-weight: 600; }
`

const Dashboard = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((s) => s.auth)
  const { myEvents, loading: eventsLoading } = useSelector((s) => s.events)
  const { myRSVPs } = useSelector((s) => s.rsvp)

  useEffect(() => {
    if (user) {
      dispatch(fetchMyEvents(user.uid))
      dispatch(fetchMyRSVPs(user.uid))
    }
  }, [dispatch, user])

  const handleDelete = (id) => {
    if (window.confirm('Delete this event? This cannot be undone.')) dispatch(deleteEvent(id))
  }

  const handleCancel = (rsvpId, eventId) => {
    if (window.confirm('Cancel your RSVP for this event?')) dispatch(cancelRSVP({ rsvpId, eventId }))
  }

  return (
    <Page>
      <TopBar>
        <PageTitle>Hey, <span>{user?.displayName?.split(' ')[0]}</span> 👋</PageTitle>
        <CreateBtn to="/events/create"><FiPlusCircle size={15} /> Create Event</CreateBtn>
      </TopBar>

      <StatsRow>
        <StatCard><p>Events Created</p><strong>{myEvents.length}</strong></StatCard>
        <StatCard><p>Events Attending</p><strong>{myRSVPs.length}</strong></StatCard>
      </StatsRow>

      <SectionTitle>📅 My Events</SectionTitle>
      {eventsLoading ? <Spinner /> : myEvents.length === 0 ? (
        <Empty>
          <p>You haven't created any events yet.</p>
          <Link to="/events/create">Create your first event →</Link>
        </Empty>
      ) : (
        myEvents.map(event => (
          <EventRow key={event.id}>
            <EventInfo to={`/events/${event.id}`}>
              <h3>{event.title}</h3>
              <p>
                <FiCalendar size={11} />{formatDate(event.date)} at {formatTime(event.time)}
                &nbsp;·&nbsp;
                <FiMapPin size={11} />{event.location}
              </p>
            </EventInfo>
            <Actions>
              <IconLink to={`/events/edit/${event.id}`}><FiEdit2 size={14} /></IconLink>
              <IconBtn $danger onClick={() => handleDelete(event.id)}><FiTrash2 size={14} /></IconBtn>
            </Actions>
          </EventRow>
        ))
      )}

      <Divider />

      <SectionTitle>✅ My RSVPs</SectionTitle>
      {myRSVPs.length === 0 ? (
        <Empty>
          <p>You haven't RSVPed to any events yet.</p>
          <Link to="/events">Browse events →</Link>
        </Empty>
      ) : (
        myRSVPs.map(rsvp => (
          <RSVPRow key={rsvp.id}>
            <RSVPInfo to={`/events/${rsvp.eventId}`}>
              <h4>{rsvp.eventTitle}</h4>
              <p><FiCalendar size={11} />You're going!</p>
            </RSVPInfo>
            <CancelBtn onClick={() => handleCancel(rsvp.id, rsvp.eventId)}>
              <FiX size={12} /> Cancel RSVP
            </CancelBtn>
          </RSVPRow>
        ))
      )}
    </Page>
  )
}

export default Dashboard
