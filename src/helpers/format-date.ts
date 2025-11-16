export function formatDate(date: string) {
  const [day, month, year] = date.split("/");

  const formattedDate = new Date(`${year}-${month}-${day}T00:00:00Z`);
  return formattedDate.toISOString();
}
