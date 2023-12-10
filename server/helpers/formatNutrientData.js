const rdiValues = {
  'carbs': 275,
  'fat': 78,
  'sugar': null,
  'potassium': 4700,
  'calories': null,
  'saturatedFat': 20,
  'sodium': 2300,
  'cholesterol': 300,
  'protein': null,
  'iron': 18,
  'vitaminD': 20,
  'polyunsaturatedFat': null,
  'monounsaturatedFat': null,
  'fiber': 28,
  'calcium': 1300,
  'transFat': null,
};

const calculateDV = (nutrientName, nutrientValue) => {
  const rdi = rdiValues[nutrientName];

  if (rdi === null) {
    return null;
  }

  const dvPercentage = (nutrientValue / rdi) * 100;

  return dvPercentage.toFixed(0);
};

const mapNutrients = (nutrients) => {
  const nutrientMapping = {
    205: 'carbs',
    204: 'fat',
    269: 'sugar',
    306: 'potassium',
    208: 'calories',
    606: 'saturatedFat',
    307: 'sodium',
    601: 'cholesterol',
    203: 'protein',
    303: 'iron',
    328: 'vitaminD',
    646: 'polyunsaturatedFat',
    645: 'monounsaturatedFat',
    291: 'fiber',
    301: 'calcium',
    605: 'transFat',
  };

  const mappedNutrients = {};

  for (const nutrient of nutrients) {
    const nutrientName = nutrientMapping[nutrient.attr_id];
    if (nutrientName) {
      let roundedValue;

      if ([208, 601, 307, 203, 205, 301].includes(nutrient.attr_id)) {
        roundedValue = Math.round(nutrient.value);
      } else {
        roundedValue = parseFloat(nutrient.value.toFixed(1));
      }

      const dv = calculateDV(nutrientName, roundedValue);

      mappedNutrients[nutrientName] = {
        value: roundedValue,
        dv: dv,
      };
    }
  }

  return mappedNutrients;
};

const mapFoods = (items) => {
  const mappedFoods = [];

  const mapFoodItem = (item, isBranded = false) => ({
    foodName: item?.food_name,
    image: item?.photo.thumb,
    servingQty: item?.serving_qty,
    servingUnit: item?.serving_unit,
    servingWeight: isBranded
      ? parseFloat(item?.serving_weight_grams?.toFixed(1))
      : item?.serving_weight_grams,
    type: isBranded ? 'branded' : 'common',
    brandName: isBranded ? item?.brand_name : undefined,
    nutrients: mapNutrients(item?.full_nutrients),
  });

  const commonFoods = items.common?.map((item) => mapFoodItem(item)) || [];

  const brandedFoods =
    items.branded?.map((item) => mapFoodItem(item, true)) || [];

  mappedFoods.push(...commonFoods, ...brandedFoods);

  return mappedFoods;
};

const mapFoodDetails = (foods) => {
  if (!foods || foods.length === 0) {
    return null;
  }
  const foodItem = foods[0];

  return {
    foodName: foodItem.food_name,
    image: foodItem.photo.thumb,
    brandName: foodItem.brand_name || null,
    servingQty: foodItem.serving_qty,
    servingUnit: foodItem.serving_unit,
    servingWeight: foodItem.serving_weight_grams,
    nutrients: mapNutrients(foodItem.full_nutrients),
    altMeasures: foodItem.alt_measures || [],
  };
};

module.exports = { mapFoods, mapFoodDetails };
