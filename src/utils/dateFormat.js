export const formatDisplayDate = (value) => {
  if (!value) return '';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value))) return value;

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};
