import SaveSlotOverlay from '../../features/system-ui/SaveSlotOverlay.jsx'
import RuntimeDebugPanel from '../../ui/debug/RuntimeDebugPanel.jsx'

export default function OverlayLayer({
  openSaveMenu,
  onCloseSaveMenu,
  slots,
  onSaveSlot,
  onLoadSlot,
  onDeleteSlot,
  debugOpen,
  debugState,
  scene,
  map,
  timeline,
}) {
  return (
    <>
      <SaveSlotOverlay
        open={openSaveMenu}
        onClose={onCloseSaveMenu}
        slots={slots}
        onSaveSlot={onSaveSlot}
        onLoadSlot={onLoadSlot}
        onDeleteSlot={onDeleteSlot}
      />
      {import.meta.env.DEV && debugOpen && (
        <RuntimeDebugPanel
          state={debugState}
          scene={scene}
          map={map}
          timeline={timeline}
        />
      )}
    </>
  )
}
