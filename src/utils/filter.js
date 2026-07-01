import dayjs from 'dayjs';
import {FilterType} from '../const.js';

const isPointFuture = (point) => dayjs(point.dateFrom).isAfter(dayjs());
const isPointPresent = (point) => dayjs(point.dateFrom).isBefore(dayjs()) && dayjs(point.dateTo).isAfter(dayjs());
const isPointPast = (point) => dayjs(point.dateTo).isBefore(dayjs());

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isPointFuture(point)),
  [FilterType.PRESENT]: (points) => points.filter((point) => isPointPresent(point)),
  [FilterType.PAST]: (points) => points.filter((point) => isPointPast(point)),
};

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

export {isPointFuture, isPointPresent, isPointPast, filter, generateFilter};
