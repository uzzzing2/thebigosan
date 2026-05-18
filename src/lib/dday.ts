import { ELECTION_DATE } from './constants'

const MS_PER_DAY = 1000 * 60 * 60 * 24

function startOfDay(date: Date): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

export function getDaysUntilElection(now: Date = new Date()): number {
  const today = startOfDay(now)
  const election = startOfDay(new Date(ELECTION_DATE))
  return Math.round((election.getTime() - today.getTime()) / MS_PER_DAY)
}

export type DDayState =
  | { kind: 'before'; days: number }
  | { kind: 'day' }
  | { kind: 'after'; days: number }

export function getDDayState(now: Date = new Date()): DDayState {
  const days = getDaysUntilElection(now)
  if (days > 0) return { kind: 'before', days }
  if (days === 0) return { kind: 'day' }
  return { kind: 'after', days: Math.abs(days) }
}
