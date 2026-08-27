/** Coffee order helpers. Brewing UI lives in CoffeeStation; delivery VN in ChipWakeStage. */

/** Fixed order: 최민준(팀장) → 김수진(대리) → 그루미 */
export const COFFEE_ORDERS = Object.freeze([
  { name: '팀장님', shots: 2, target: 'staff-choi' },
  { name: '대리님', shots: 1, target: 'staff-kim' },
  { name: '그루미', shots: 5, target: 'coffee-groomy' },
])

export function createCoffeeOrders() {
  return COFFEE_ORDERS.map((order) => ({ ...order }))
}

export function coffeeRecipientForLook(lookId) {
  if (lookId === 'staff-choi') return '팀장님'
  if (lookId === 'staff-kim') return '대리님'
  if (lookId === 'coffee-groomy') return '그루미'
  return null
}

/** Next brew/deliver target from currentOrderIndex only. */
export function activeCoffeeOrder(coffeeGame) {
  if (!coffeeGame || coffeeGame.coffeeGameDone) return null
  const order = coffeeGame.orders?.[coffeeGame.currentOrderIndex]
  return order ?? null
}

export function isCoffeeGameDone(coffeeGame) {
  if (!coffeeGame) return false
  if (coffeeGame.coffeeGameDone) return true
  return coffeeGame.currentOrderIndex >= (coffeeGame.orders?.length ?? 0)
}
