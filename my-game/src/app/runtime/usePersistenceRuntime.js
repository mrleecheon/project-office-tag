import { useCallback, useState } from 'react'

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
    dispatch(loadSave(loaded))
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

