// recipes.js — Seoul Table Grill menu: grilled meat, cut with scissors,
// wrapped in lettuce with rice and ssamjang, banchan on the side.
// Each dish lists the meat, whether it must be scissor-cut, and the
// wrap / side items that belong on the plate.
export const MEATS = {
  pork:    { id: 'pork',    name: 'Pork Belly',  short: 'PORK',  cook: 9,  color: '#e8907c' },
  beef:    { id: 'beef',    name: 'Beef Bulgogi', short: 'BEEF',  cook: 8,  color: '#b5533c' },
  chicken: { id: 'chicken', name: 'Chicken',      short: 'CHKN',  cook: 10, color: '#e8c07a' },
};
export const SIDES = {
  lettuce:  { id: 'lettuce',  name: 'Lettuce',  color: '#6fbf4a' },
  rice:     { id: 'rice',     name: 'Rice',     color: '#f2ead8' },
  ssamjang: { id: 'ssamjang', name: 'Ssamjang', color: '#c1442e' },
  kimchi:   { id: 'kimchi',   name: 'Kimchi',   color: '#d84f26' },
  garlic:   { id: 'garlic',   name: 'Garlic',   color: '#efe6c8' },
};
export const RECIPES = [
  { id: 'classic-ssam', name: 'Classic Ssam Wrap', meat: 'pork', cut: true,
    sides: ['lettuce', 'rice', 'ssamjang'], price: 18, patience: 62 },
  { id: 'bulgogi-wrap', name: 'Bulgogi Night Wrap', meat: 'beef', cut: true,
    sides: ['lettuce', 'rice', 'ssamjang', 'garlic'], price: 22, patience: 66 },
  { id: 'spicy-chicken', name: 'Fire Chicken Wrap', meat: 'chicken', cut: true,
    sides: ['lettuce', 'ssamjang', 'kimchi'], price: 20, patience: 60 },
  { id: 'belly-plate', name: 'Seoul Belly Plate', meat: 'pork', cut: false,
    sides: ['rice', 'kimchi', 'garlic'], price: 19, patience: 58 },
  { id: 'banchan-feast', name: 'Banchan Feast Wrap', meat: 'beef', cut: true,
    sides: ['lettuce', 'rice', 'kimchi', 'garlic'], price: 24, patience: 70 },
];
export function recipeNeeds(recipe) {
  const parts = [MEATS[recipe.meat].name + (recipe.cut ? ' (cut)' : ' (whole)')];
  for (const s of recipe.sides) parts.push(SIDES[s].name);
  return parts;
}
