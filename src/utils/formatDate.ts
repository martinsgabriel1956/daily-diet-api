interface FormatDateProps {
  date: string
  hour: string
}

export function formatDate ({ date, hour }: FormatDateProps) {
  const newDate = new Date(date);
  const getHour = parseInt(hour.substring(0, 2));
  const getMinutes = Number(hour.substring(3));
  const formattedDate = new Date(newDate.setUTCHours(getHour, getMinutes)).toISOString();
  return formattedDate
}

