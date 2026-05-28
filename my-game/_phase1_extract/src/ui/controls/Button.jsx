export default function Button({ children, variant = 'primary', ...props }) {
  return (
    <button className={`uiButton ${variant}`} type="button" {...props}>
      {children}
    </button>
  )
}
