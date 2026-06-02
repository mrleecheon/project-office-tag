import { DEMO_MODE } from '../config/demo.js'

import './sceneGraph.test.js'
import './progression.test.js'
import './saveSchema.test.js'
import './saveSlots.test.js'
import './contentSchema.test.js'
import './runtimeIntegrity.test.js'
import './transitionPolicy.test.js'
import './formatChatText.test.js'
import './vnPrologueFlow.test.js'
import './endingResolution.test.js'

if (!DEMO_MODE) {
  await import('./chapterFlow.test.js')
  await import('./chapter02Endings.test.js')
  await import('./phase0Flow.test.js')
  await import('./chapter04Branching.test.js')
  await import('./chapter05Branching.test.js')
  await import('./fullPlaythrough.test.js')
} else {
  await import('./demoPlaythrough.test.js')
}

console.log('All validation tests passed')
