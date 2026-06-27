import {FilterType} from '../const.js';
import {filter} from '../utils/filter.js';

const generateFilter = (points) => [
  {
    type: FilterType.EVERYTHING,
    name: 'Everything',
    count: filter[FilterType.EVERYTHING](points).length,
  },
  {
    type: FilterType.FUTURE,
    name: 'Future',
    count: filter[FilterType.FUTURE](points).length,
  },
  {
    type: FilterType.PRESENT,
    name: 'Present',
    count: filter[FilterType.PRESENT](points).length,
  },
  {
    type: FilterType.PAST,
    name: 'Past',
    count: filter[FilterType.PAST](points).length,
  },
];

export {generateFilter};
