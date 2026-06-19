import dayjs from 'dayjs';

const sortPointDay = (pointA, pointB) => dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));

const sortPointTime = (pointA, pointB) => {
  const durationA = dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));
  const durationB = dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom));

  return durationB - durationA;
};

const sortPointPrice = (pointA, pointB) => pointB.basePrice - pointA.basePrice;

export {sortPointDay, sortPointTime, sortPointPrice};
