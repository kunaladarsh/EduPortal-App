// Simple date utility functions to replace date-fns
export const format = (date: Date, formatStr: string): string => {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const daysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const d = new Date(date);
  const day = d.getDate();
  const month = d.getMonth();
  const year = d.getFullYear();
  const hours = d.getHours();
  const minutes = d.getMinutes();
  const dayOfWeek = d.getDay();

  const formatters: { [key: string]: string } = {
    'yyyy': year.toString(),
    'MM': String(month + 1).padStart(2, '0'),
    'MMM': months[month],
    'dd': String(day).padStart(2, '0'),
    'h': String(hours % 12 || 12),
    'mm': String(minutes).padStart(2, '0'),
    'a': hours >= 12 ? 'PM' : 'AM',
    'EEEE': days[dayOfWeek],
    'PPP': `${months[month]} ${day}, ${year}`,
  };

  let result = formatStr;
  
  // Replace format tokens
  Object.entries(formatters).forEach(([token, value]) => {
    result = result.replace(new RegExp(token, 'g'), value);
  });

  return result;
};

export const isToday = (date: Date): boolean => {
  const today = new Date();
  const compareDate = new Date(date);
  
  return compareDate.getDate() === today.getDate() &&
         compareDate.getMonth() === today.getMonth() &&
         compareDate.getFullYear() === today.getFullYear();
};

export const isYesterday = (date: Date): boolean => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const compareDate = new Date(date);
  
  return compareDate.getDate() === yesterday.getDate() &&
         compareDate.getMonth() === yesterday.getMonth() &&
         compareDate.getFullYear() === yesterday.getFullYear();
};

export const isThisWeek = (date: Date): boolean => {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);
  
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);
  
  const compareDate = new Date(date);
  
  return compareDate >= weekStart && compareDate <= weekEnd;
};

export const isThisMonth = (date: Date): boolean => {
  const now = new Date();
  const compareDate = new Date(date);
  
  return compareDate.getMonth() === now.getMonth() &&
         compareDate.getFullYear() === now.getFullYear();
};

export const parseISO = (dateString: string): Date => {
  return new Date(dateString);
};