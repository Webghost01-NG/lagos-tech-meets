import { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { fetchEvents } from '../../features/events/eventsSlice'
import EventCard from '../../components/EventCard'
import Spinner from '../../components/Spinner'
import { FiSearch, FiFilter } from 'react-icons/fi'

const Page = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
`

const Hero = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
  padding: 2rem 0;
`

const HeroTitle = styled.h1`
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  font-weight: 800;
  margin-bottom: 0.5rem;
  span { color: ${({ theme }) => theme.colors.primary}; }
`

const HeroSub = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 1rem;
`

const SearchBar = styled.div`
  position: relative;
  margin-bottom: 1.25rem;
  svg { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: ${({ theme }) => theme.colors.textMuted}; }
`

const SearchInput = styled.input`
  width: 100%;
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 0.9rem 1rem 0.9rem 3rem;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.95rem;
  &:focus { outline: none; border-color: ${({ theme }) => theme.colors.primary}; }
`

const Filters = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
  align-items: center;
`

const FilterLabel = styled.span`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.85rem;
`

const Select = styled.select`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 0.5rem 0.9rem;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.85rem;
  cursor: pointer;
  &:focus { outline: none; border-color: ${({ theme }) => theme.colors.primary}; }
`

const Count = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.9rem;
  margin-bottom: 1rem;
  span { color: ${({ theme }) => theme.colors.primary}; font-weight: 600; }
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
`

const Empty = styled.div`
  text-align: center;
  padding: 4rem;
  color: ${({ theme }) => theme.colors.textMuted};
  h3 { margin-bottom: 0.5rem; color: ${({ theme }) => theme.colors.text}; }
`

const CATEGORIES = ['All', 'Tech Talk', 'Hackathon', 'Workshop', 'Networking', 'Conference', 'Bootcamp']
const CITIES = ['All', 'Lagos', 'Abuja', 'Port Harcourt', 'Ibadan', 'Remote']

const EventsPage = () => {
  const dispatch = useDispatch()
  const { events, loading } = useSelector((s) => s.events)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [city, setCity] = useState('All')
  const [showUpcoming, setShowUpcoming] = useState('all')

  useEffect(() => { dispatch(fetchEvents()) }, [dispatch])

  const filtered = useMemo(() => {
    return events.filter(e => {
      const matchSearch = e.title?.toLowerCase().includes(search.toLowerCase()) ||
        e.location?.toLowerCase().includes(search.toLowerCase()) ||
        e.description?.toLowerCase().includes(search.toLowerCase())
      const matchCat = category === 'All' || e.category === category
      const matchCity = city === 'All' || e.location?.includes(city)
      const matchTime = showUpcoming === 'all' ? true :
        showUpcoming === 'upcoming' ? new Date(e.date) >= new Date() :
        new Date(e.date) < new Date()
      return matchSearch && matchCat && matchCity && matchTime
    })
  }, [events, search, category, city, showUpcoming])

  return (
    <Page>
      <Hero>
        <HeroTitle>🇳🇬 <span>Lagos Tech</span> Events</HeroTitle>
        <HeroSub>Discover meetups, hackathons & workshops across Nigeria</HeroSub>
      </Hero>

      <SearchBar>
        <FiSearch size={18} />
        <SearchInput
          placeholder="Search events by title, location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </SearchBar>

      <Filters>
        <FilterLabel><FiFilter size={14} /> Filter:</FilterLabel>
        <Select value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </Select>
        <Select value={city} onChange={(e) => setCity(e.target.value)}>
          {CITIES.map(c => <option key={c}>{c}</option>)}
        </Select>
        <Select value={showUpcoming} onChange={(e) => setShowUpcoming(e.target.value)}>
          <option value="all">All Events</option>
          <option value="upcoming">Upcoming</option>
          <option value="past">Past</option>
        </Select>
      </Filters>

      {loading ? <Spinner /> : (
        <>
          <Count><span>{filtered.length}</span> event{filtered.length !== 1 ? 's' : ''} found</Count>
          {filtered.length === 0 ? (
            <Empty>
              <h3>No events found</h3>
              <p>Try adjusting your filters or search term</p>
            </Empty>
          ) : (
            <Grid>{filtered.map(e => <EventCard key={e.id} event={e} />)}</Grid>
          )}
        </>
      )}
    </Page>
  )
}

export default EventsPage
