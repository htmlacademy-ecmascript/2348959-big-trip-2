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

export { isPointFuture, isPointPresent, isPointPast, filter };
