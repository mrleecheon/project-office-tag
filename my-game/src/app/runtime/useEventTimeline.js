import { useEffect, useState } from 'react'
import { eventBus } from '../../engine/events/eventBus.js'

export function useEventTimeline(limit = 40) {
  const [timeline, setTimeline] = useState([])

  useEffect(() => {
    const off = eventBus.on('*', ({ eventName, payload }) => {
      setTimeline((previous) => {
        const next = [...previous, {
          eventName,
          at: new Date().toISOString(),
          payload,
        }]
        return next.slice(-limit)
      })
    })
    return () => off()
  }, [limit])

  return timeline
}
