import assert from 'node:assert/strict'
import {
  buildChatDeliveries,
  resolveTypingSpeakerLabel,
  shouldKeepLineTogether,
  shouldShowTypingIndicator,
  splitChatDeliveryChunks,
} from '../renderers/chat/formatChatText.js'

assert.equal(shouldShowTypingIndicator('kim'), true)
assert.equal(shouldShowTypingIndicator('groomy'), true)
assert.equal(shouldShowTypingIndicator('iseol'), true)
assert.equal(shouldShowTypingIndicator('choi'), true)
assert.equal(shouldShowTypingIndicator('system'), false)

assert.equal(resolveTypingSpeakerLabel('kim'), '김수진 대리')
assert.equal(resolveTypingSpeakerLabel('groomy'), '그루미')
assert.equal(resolveTypingSpeakerLabel('choi'), '최민준 팀장')

assert.deepEqual(
  splitChatDeliveryChunks('첫 문장입니다. 둘째 문장이에요.'),
  ['첫 문장입니다.', '둘째 문장이에요.'],
)

assert.deepEqual(
  splitChatDeliveryChunks('긴 설명 첫 줄. 둘째 줄.', { keepTogether: true }),
  ['긴 설명 첫 줄. 둘째 줄.'],
)

assert.equal(shouldKeepLineTogether({ monologue: true }), true)

const deliveries = buildChatDeliveries(
  [{ char: 'groomy', text: '하나. 둘.' }, { char: 'iseol', text: '셋.' }],
  (line) => line.text,
)
assert.equal(deliveries.length, 3)
assert.equal(deliveries[0].text, '하나.')
assert.equal(deliveries[1].text, '둘.')
assert.equal(deliveries[2].text, '셋.')

const playerDeliveries = buildChatDeliveries(
  [{ char: 'player', text: '왜요?' }, { char: 'system', text: '조용해진다.', isNarration: true }],
  (line) => line.text,
)
assert.equal(playerDeliveries[0].isPlayer, true)
assert.equal(playerDeliveries[0].isNarration, false)
assert.equal(playerDeliveries[1].isNarration, true)

console.log('formatChatText.test.js passed')
