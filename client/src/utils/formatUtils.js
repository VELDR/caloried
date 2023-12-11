export const formatDate = (date) => {
  if (!date) {
    date = new Date();
  }

  date = new Date(date);

  const localTime = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localTime.toISOString().substring(0, 10);
};

export const getActivityLevel = (activityCode) => {
  switch (activityCode) {
    case 1:
      return 'Sedentary';
    case 2:
      return 'Lightly Active';
    case 3:
      return 'Moderately Active';
    case 4:
      return 'Very Active';
    case 5:
      return 'Intensely Active';
    default:
      return 'Unknown Activity Level';
  }
};
