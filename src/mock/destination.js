import { getDescription, getPictures } from './util.js';

const destinations = [
  {
    id: '1',
    name: 'Tokyo',
    description: getDescription(5),
    pictures: getPictures('Tokyo', 5),
  },
  {
    id: '2',
    name: 'Berlin',
    description: getDescription(5),
    pictures: getPictures('Berlin', 3),
  },
  {
    id: '3',
    name: 'Minsk',
    description: getDescription(5),
    pictures: getPictures('Minsk', 4),
  },
];

export { destinations };
