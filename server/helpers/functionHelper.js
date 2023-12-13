const calculateAge = (dob) => {
  const birthday = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthday.getFullYear();
  const m = today.getMonth() - birthday.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
    age--;
  }

  return age;
};

const determineAgeGroup = (age) => {
  if (age >= 0 && age <= 12) return '0-12';
  if (age >= 13 && age <= 17) return '13-17';
  if (age >= 18 && age <= 24) return '18-24';
  if (age >= 25 && age <= 54) return '25-54';
  if (age >= 55 && age <= 64) return '55-64';
  if (age >= 65) return '65+';
  return 'Unknown';
};

module.exports = { calculateAge, determineAgeGroup };
