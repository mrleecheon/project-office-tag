import { motion } from 'framer-motion'
import { fadeScreen } from '../../engine/animation/motionPresets'

export default function ScreenTransition({ children, className = '' }) {
  return (
    <motion.div className={className} {...fadeScreen}>
      {children}
    </motion.div>
  )
}
