import { DESCRIPTION_CITIES } from './const.js';

const getRandomItems = (items, count) => {
  const shuffledItems = [...items].sort(() => Math.random() - 0.5);

  return shuffledItems.slice(0, count);
};

const getDescription = (count) => getRandomItems(DESCRIPTION_CITIES, count).join(' ');

const getPictures = (city, count) => Array.from({ length: count }, (_, index) => ({
  src: `https://loremflickr.com/248/152?random=${index + 1}`,
  description: `Picture ${index + 1} of ${city}`,
}));

export { getDescription, getPictures };
