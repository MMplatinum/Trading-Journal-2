export function getCalendarDays(currentDate: Date): Date[] {
  const days: Date[] = [];
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  // Add days from previous month to start on Monday
  let firstDayOfWeek = firstDay.getDay() - 1;
  if (firstDayOfWeek === -1) firstDayOfWeek = 6; // Sunday should be 6
  
  for (let i = firstDayOfWeek; i > 0; i--) {
    const date = new Date(firstDay);
    date.setDate(firstDay.getDate() - i);
    days.push(date);
  }

  // Add days of current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
  }

  // Add days from next month
  const remainingDays = 42 - days.length; // 6 rows * 7 days = 42
  for (let i = 1; i <= remainingDays; i++) {
    const date = new Date(lastDay);
    date.setDate(lastDay.getDate() + i);
    days.push(date);
  }

  return days;
}