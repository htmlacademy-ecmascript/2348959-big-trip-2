import dayjs from 'dayjs';

const isPointFuture = (point) => dayjs(point.dateFrom).isAfter(dayjs());
const isPointPresent = (point) => dayjs(point.dateFrom).isBefore(dayjs()) && dayjs(point.dateTo).isAfter(dayjs());
const isPointPast = (point) => dayjs(point.dateTo).isBefore(dayjs());

export { isPointFuture, isPointPresent, isPointPast };
