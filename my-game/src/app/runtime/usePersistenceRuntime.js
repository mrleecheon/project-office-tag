import { useCallback, useState } from 'react'
import { DEMO_MODE, isDemoPlayablePosition } from '../../config/demo.js'

export function usePersistenceRuntime({ saveService, state, dispatch, loadSave, setRuntimeError }) {
  const [slots, setSlots] = useState(() => saveService.listSlots())

  const refreshSlots = useCallback(() => {
    setSlots(saveService.listSlots())
  }, [saveService])

  const handleSaveSlot = useCallback((slotId) => {
    saveService.saveSlot(slotId, state)
    refreshSlots()
  }, [refreshSlots, saveService, state])

  const handleLoadSlot = useCallback((slotId) => {
    const loaded = saveService.loadSlot(slotId)
    if (!loaded) return
    const saveState = DEMO_MODE && !isDemoPlayablePosition(loaded.activeChapterId, loaded.activeSceneId)
      ? { ...loaded, screen: 'demoEnd' }
      : loaded
    dispatch(loadSave(saveState))
    setRuntimeError(null)
    refreshSlots()
  }, [dispatch, loadSave, refreshSlots, saveService, setRuntimeError])

  const handleDeleteSlot = useCallback((slotId) => {
    saveService.clearSlot(slotId)
    refreshSlots()
  }, [refreshSlots, saveService])

  return {
    slots,
    refreshSlots,
    handleSaveSlot,
    handleLoadSlot,
    handleDeleteSlot,
  }
}

