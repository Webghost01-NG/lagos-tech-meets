import { useEffect } from 'react'

export const useNotification = (events) => {
  useEffect(() => {
    if (!('Notification' in window)) return
    if (Notification.permission === 'default') {
      Notification.requestPermission()
    }

    const timers = []

    events.forEach((event) => {
      const eventTime = new Date(event.date + 'T' + event.time).getTime()
      const reminderTime = eventTime - 60 * 60 * 1000 // 1 hour before
      const now = Date.now()
      const delay = reminderTime - now

      if (delay > 0 && Notification.permission === 'granted') {
        const timer = setTimeout(() => {
          new Notification('🚀 Lagos Tech Meets Reminder', {
            body: `"${event.title}" starts in 1 hour! 📍 ${event.location}`,
            icon: '/logo.svg',
          })
        }, delay)
        timers.push(timer)
      }
    })

    return () => timers.forEach(clearTimeout)
  }, [events])
}
