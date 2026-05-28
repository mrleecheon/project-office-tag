import { getUiText } from '../../game/runtime/settings/locale.js'

function lookupUi(locale, textKey) {
  const pack = getUiText(locale)
  if (typeof pack[textKey] === 'string') return pack[textKey]
  return null
}

export function resolveUiText(textKey, fallback = '', locale = 'ko') {
  return lookupUi(locale, textKey) ?? fallback
}

export function resolveTemplate(textKey, vars = {}, fallback = '', locale = 'ko') {
  const template = resolveUiText(textKey, fallback, locale)
  return template.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? ''))
}

export function resolveLineText(line, context = {}) {
  if (!line) return ''
  if (typeof line.text === 'function') {
    try {
      return String(line.text(context) ?? '')
    } catch {
      return ''
    }
  }
  if (typeof line.text === 'string') return line.text
  if (typeof line.textKey === 'string') return resolveTemplate(line.textKey, { ...context, ...(line.vars ?? {}) }, line.textKey)
  return ''
}
