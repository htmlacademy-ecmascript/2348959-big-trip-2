import dayjs from 'dayjs';

const DATE_FORMAT = 'MMM DD';
const TIME_FORMAT = 'HH:mm';
const MINUTES_IN_HOUR = 60;
const MINUTES_IN_DAY = 1440;
const FORM_DATE_FORMAT = 'DD/MM/YY HH:mm';

const humanizeEventDate = (date) => dayjs(date).format(DATE_FORMAT).toUpperCase();
const humanizeEditEventDate = (date) => dayjs(date).format(FORM_DATE_FORMAT);
const humanizeEventTime = (date) => dayjs(date).format(TIME_FORMAT);

const getEventDuration = (dateFrom, dateTo) => {
  const durationInMinutes = dayjs(dateTo).diff(dayjs(dateFrom), 'minute');
  const days = Math.floor(durationInMinutes / MINUTES_IN_DAY);
  const hours = Math.floor((durationInMinutes % MINUTES_IN_DAY) / MINUTES_IN_HOUR);
  const minutes = durationInMinutes % MINUTES_IN_HOUR;

  const formatDurationItem = (item) => String(item).padStart(2, '0');

  if (days > 0) {
    return `${formatDurationItem(days)}D ${formatDurationItem(hours)}H ${formatDurationItem(minutes)}M`;
  }

  if (hours > 0) {
    return `${formatDurationItem(hours)}H ${formatDurationItem(minutes)}M`;
  }

  return `${formatDurationItem(minutes)}M`;
};

export { humanizeEventDate, humanizeEventTime, humanizeEditEventDate, getEventDuration };
