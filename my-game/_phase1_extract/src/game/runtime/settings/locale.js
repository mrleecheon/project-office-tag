import { koUiText } from '../../../content/localization/ko/ui.js'

const localeTable = {
  ko: koUiText,
}

export function getUiText(locale = 'ko') {
  return localeTable[locale] ?? localeTable.ko
}
