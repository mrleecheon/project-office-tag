import { AnimatePresence, motion } from 'framer-motion'
import { modalRise } from '../../engine/animation/motionPresets'

export default function ModalShell({ open, title, description, children }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="modalShellBackdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.section className="modalShell" role="dialog" aria-modal="true" aria-label={title} {...modalRise}>
            <h3>{title}</h3>
            {description ? <p>{description}</p> : null}
            {children}
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
