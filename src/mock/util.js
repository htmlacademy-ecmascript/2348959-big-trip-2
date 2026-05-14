const DESCRIPTION_CITIES = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.',
];

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
