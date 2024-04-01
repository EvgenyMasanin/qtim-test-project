import { TimePeriod } from '../enums'

export function getTimePeriodDates(timePeriod: TimePeriod) {
  const now = new Date()

  const todayDate = new Date(new Date().setHours(0, 0, 0))

  const lastWeekDate = new Date(new Date().setDate(new Date().getDate() - 7))

  const lastMonthDate = new Date(new Date().setMonth(new Date().getMonth() - 1))

  if (timePeriod === TimePeriod.Daily) return [todayDate, now] as const
  if (timePeriod === TimePeriod.Weekly) return [lastWeekDate, now] as const
  if (timePeriod === TimePeriod.Monthly) return [lastMonthDate, now] as const
  if (timePeriod === TimePeriod.AllTime) return [new Date(0), now] as const

  throw new Error(`Time period "${timePeriod}" is not implemented!`)
}
