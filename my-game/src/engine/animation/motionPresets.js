export const fadeScreen = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
}

export const riseIn = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.26, ease: [0.22, 1, 0.36, 1] },
}

export const cinematicScreen = {
  initial: { opacity: 0, filter: 'blur(8px)', scale: 1.012 },
  animate: { opacity: 1, filter: 'blur(0px)', scale: 1 },
  exit: { opacity: 0, filter: 'blur(6px)', scale: 0.995 },
  transition: { duration: 0.42, ease: [0.16, 1, 0.3, 1] },
}

export const modalRise = {
  initial: { opacity: 0, y: 24, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 14, scale: 0.985 },
  transition: { duration: 0.24, ease: [0.22, 1, 0.36, 1] },
}

export function resolveScreenPreset(variant = 'default') {
  if (variant === 'cinematic') return cinematicScreen
  return fadeScreen
}
