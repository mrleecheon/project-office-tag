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
    if (!loaded) {
      setRuntimeError({
        code: 'save-load-failed',
        message: '저장 데이터를 불러올 수 없습니다. 손상되었거나 형식이 맞지 않습니다.',
      })
      return
    }
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

