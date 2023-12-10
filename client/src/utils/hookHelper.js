import { useEffect, useLayoutEffect, useState } from 'react';

export const useUpdateSize = (callback) => {
  useLayoutEffect(() => {
    const updateSize = () => {
      callback(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, [callback]);
};

export const useServingForm = (foodDetails, defaultServingCount = 1) => {
  const [servingCount, setServingCount] = useState(defaultServingCount);
  const [selectedServingSize, setSelectedServingSize] = useState(foodDetails?.servingWeight);
  const [selectedServingUnit, setSelectedServingUnit] = useState(foodDetails?.servingUnit);
  const [selectedServingQty, setSelectedServingQty] = useState(foodDetails?.servingQty);

  useEffect(() => {
    if (foodDetails) {
      setSelectedServingSize(foodDetails.servingWeight);
      setSelectedServingUnit(foodDetails.servingUnit);
      setSelectedServingQty(foodDetails.servingQty);
      setServingCount(1);
    }
  }, [foodDetails]);

  const handleServingSizeChange = (event) => {
    const newServingSize = parseFloat(event.target.value);
    setSelectedServingSize(newServingSize);

    const selectedMeasure = foodDetails?.altMeasures?.find((measure) => measure.serving_weight === newServingSize);
    setSelectedServingUnit(selectedMeasure?.measure || foodDetails?.servingUnit);
    setSelectedServingQty(selectedMeasure?.qty || foodDetails?.servingQty);
  };

  const handleServingCountChange = (event) => {
    const { value } = event.target;
    const count = value === '' ? '' : Math.min(Math.max(parseInt(value, 10), 1), 1000);
    setServingCount(count);
  };

  return {
    servingCount,
    setServingCount,
    selectedServingSize,
    selectedServingUnit,
    selectedServingQty,
    handleServingSizeChange,
    handleServingCountChange,
  };
};
