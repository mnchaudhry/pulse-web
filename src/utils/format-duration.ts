// Format a duration in minutes into a compact "2h 14m" / "54m" label,
// matching the tabular figures used across the dashboard.
export const formatDurationFromMinutes = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return hours ? `${hours}h ${mins.toString().padStart(2, '0')}m` : `${mins}m`
}

// Format a duration in seconds into "2h 14m".
export const formatDuration = (seconds: number) => {
  return formatDurationFromMinutes(Math.round(seconds / 60))
}
