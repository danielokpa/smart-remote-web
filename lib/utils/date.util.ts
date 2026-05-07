const today = new Date();

export const isSameDay = (d: Date) =>
  d.getFullYear() === today.getFullYear() &&
  d.getMonth() === today.getMonth() &&
  d.getDate() === today.getDate();
