export const formatDate = (date) => {
  if (!date) {
    date = new Date();
  }

  date = new Date(date);

  const localTime = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localTime.toISOString().substring(0, 10);
};
