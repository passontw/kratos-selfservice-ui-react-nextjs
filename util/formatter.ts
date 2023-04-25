export function convertDateString(dateString: string) {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const date = new Date(dateString)
  const month = monthNames[date.getMonth()]
  const year = date.getFullYear()

  return `${month} ${year}`
}
