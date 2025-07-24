export const formatDate = (date: string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('ja-JP', {
    month: 'short',
    day: 'numeric',
    weekday: 'short'
  });
};

export const isToday = (date: string): boolean => {
  const today = new Date().toISOString().split('T')[0];
  return date === today;
};

export const getDaysBetween = (start: Date, end: Date): number => {
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.ceil((end.getTime() - start.getTime()) / oneDay) + 1;
};