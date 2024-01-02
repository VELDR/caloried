export const formatDate = (date) => {
  if (!date) {
    date = new Date();
  }

  date = new Date(date);

  const localTime = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localTime.toISOString().substring(0, 10);
};

export const formatDateAndTime = (date) => {
  if (!date) {
    date = new Date();
  }

  date = new Date(date);

  const formattedDatePart = date.toLocaleString('default', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const formattedTimePart = date.toLocaleString('default', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return `${formattedDatePart} - ${formattedTimePart}`;
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

export const formatLineChartLabel = (data) =>
  data.map((item) => {
    const date = new Date(item.x);
    const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return { ...item, x: formattedDate };
  });

export const formatCustomFoodForm = (food) => ({
  id: food.id,
  name: food.foodName,
  servingQty: food.servingQty,
  servingUnit: food.servingUnit,
  servingSize: food.servingWeight,
  calories: food.nutrients.calories.value,
  protein: food.nutrients.protein.value,
  carbs: food.nutrients.carbs.value,
  fat: food.nutrients.fat.value,
  image: food.image,
});
