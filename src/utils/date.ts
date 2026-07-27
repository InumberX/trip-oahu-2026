import { TZDate } from '@date-fns/tz'
import { format } from 'date-fns'

import { HST_TIMEZONE, JST_TIMEZONE } from '~/config/consts'

const DEFAULT_FORMAT = 'yyyy/MM/dd HH:mm'

export const formatInTimeZone = (
  isoDate: string,
  timeZone: string,
  formatStr: string = DEFAULT_FORMAT,
) => {
  return format(new TZDate(isoDate, timeZone), formatStr)
}

export const formatJst = (isoDate: string, formatStr?: string) => {
  return formatInTimeZone(isoDate, JST_TIMEZONE, formatStr)
}

export const formatHst = (isoDate: string, formatStr?: string) => {
  return formatInTimeZone(isoDate, HST_TIMEZONE, formatStr)
}
