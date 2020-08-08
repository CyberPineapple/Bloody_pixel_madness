export const getUniqId = () => {
  const number = Math.random(); // 0.9394456857981651
  number.toString(36); // '0.xtis06h6'
  const id = number.toString(36).substr(2, 9); // 'xtis06h6'
  return id;
};
