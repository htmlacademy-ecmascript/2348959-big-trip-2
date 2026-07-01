import dayjs from 'dayjs';
import {sortPointDay} from './sort.js';

const TRIP_DATE_FORMAT = 'D MMM';
const MAX_DESTINATIONS_COUNT = 3;

const getTripTitle = (points, destinations) => {
  const sortedPoints = [...points].sort(sortPointDay);

  const destinationNames = sortedPoints.map((point) => {
    const destination = destinations.find((item) => item.id === point.destination);

    return destination?.name;
  }).filter(Boolean);

  if (destinationNames.length === 0) {
    return '';
  }

  if (destinationNames.length <= MAX_DESTINATIONS_COUNT) {
    return destinationNames.join(' — ');
  }

  return `${destinationNames[0]} — ... — ${destinationNames[destinationNames.length - 1]}`;
};

const getTripDates = (points) => {
  if (points.length === 0) {
    return '';
  }

  const sortedPoints = [...points].sort(sortPointDay);
  const firstPoint = sortedPoints[0];
  const lastPoint = sortedPoints[sortedPoints.length - 1];

  return `${dayjs(firstPoint.dateFrom).format(TRIP_DATE_FORMAT)} — ${dayjs(lastPoint.dateTo).format(TRIP_DATE_FORMAT)}`;
};

const getTripCost = (points, offers) => points.reduce((totalCost, point) => {
  const pointOffers = offers.find((item) => item.type === point.type)?.offers ?? [];

  const selectedOffersCost = point.offers.reduce((offersCost, offerId) => {
    const selectedOffer = pointOffers.find((offer) => offer.id === offerId);

    return offersCost + (selectedOffer?.price ?? 0);
  }, 0);

  return totalCost + point.basePrice + selectedOffersCost;
}, 0);

export {getTripTitle, getTripDates, getTripCost};
