export const formatDate = (date) => {
  const localTime = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localTime.toISOString().substring(0, 10);
};
