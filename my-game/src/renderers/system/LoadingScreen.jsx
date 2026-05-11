import ScreenTransition from '../../ui/layout/ScreenTransition'

export default function LoadingScreen() {
  return (
    <ScreenTransition className="screen boot">
      <div><p>Loading...</p></div>
    </ScreenTransition>
  )
}
