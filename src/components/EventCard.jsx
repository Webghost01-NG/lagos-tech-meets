import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { FiMapPin, FiCalendar, FiClock, FiUsers } from 'react-icons/fi'
import { formatDate, formatTime, isUpcoming } from '../utils/formatDate'

const Card = styled(Link)`
  display: block;
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  transition: all 0.2s;
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-3px);
    box-shadow: 0 8px 28px rgba(0, 200, 83, 0.12);
  }
`

const Top = styled.div`
  background: linear-gradient(135deg, #00C85322 0%, #00962422 100%);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: 1.25rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`

const CategoryBadge = styled.span`
  background: ${({ theme }) => theme.colors.primary}22;
  color: ${({ theme }) => theme.colors.primary};
  padding: 0.25rem 0.7rem;
  border-radius: 20px;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

const StatusBadge = styled.span`
  background: ${({ $upcoming, theme }) => $upcoming ? theme.colors.success + '22' : theme.colors.bgLight};
  color: ${({ $upcoming, theme }) => $upcoming ? theme.colors.success : theme.colors.textMuted};
  padding: 0.25rem 0.7rem;
  border-radius: 20px;
  font-size: 0.72rem;
  font-weight: 700;
`

const Body = styled.div`
  padding: 1.25rem 1.5rem;
`

const Title = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  line-height: 1.4;
  color: ${({ theme }) => theme.colors.text};
`

const Meta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.82rem;
  color: ${({ theme }) => theme.colors.textMuted};
  svg { color: ${({ theme }) => theme.colors.primary}; flex-shrink: 0; }
`

const EventCard = ({ event }) => {
  const upcoming = isUpcoming(event.date)
  return (
    <Card to={`/events/${event.id}`}>
      <Top>
        <CategoryBadge>{event.category || 'Tech'}</CategoryBadge>
        <StatusBadge $upcoming={upcoming}>{upcoming ? 'Upcoming' : 'Past'}</StatusBadge>
      </Top>
      <Body>
        <Title>{event.title}</Title>
        <Meta>
          <MetaItem><FiCalendar size={13} />{formatDate(event.date)}</MetaItem>
          <MetaItem><FiClock size={13} />{formatTime(event.time)}</MetaItem>
          <MetaItem><FiMapPin size={13} />{event.location}</MetaItem>
          <MetaItem><FiUsers size={13} />{event.rsvpCount || 0} attending</MetaItem>
        </Meta>
      </Body>
    </Card>
  )
}

export default EventCard
