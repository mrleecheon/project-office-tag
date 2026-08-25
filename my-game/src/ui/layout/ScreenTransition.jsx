import { motion } from 'framer-motion'
import { resolveScreenPreset } from '../../engine/animation/motionPresets'

export default function ScreenTransition({ children, className = '', variant = 'default' }) {
  const preset = resolveScreenPreset(variant)
  return (
    <motion.div className={className} {...preset}>
      {children}
    </motion.div>
  )
}
