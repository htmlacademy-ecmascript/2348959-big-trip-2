import {FilterType} from '../const.js';
import {isPointFuture, isPointPresent, isPointPast} from '../utils/filter.js';

const generateFilter = (points) => [
  {
    type: FilterType.EVERYTHING,
    name: 'Everything',
    count: points.length,
  },
  {
    type: FilterType.FUTURE,
    name: 'Future',
    count: points.filter((point) => isPointFuture(point)).length,
  },
  {
    type: FilterType.PRESENT,
    name: 'Present',
    count: points.filter((point) => isPointPresent(point)).length,
  },
  {
    type: FilterType.PAST,
    name: 'Past',
    count: points.filter((point) => isPointPast(point)).length,
  },
];

export {generateFilter};
