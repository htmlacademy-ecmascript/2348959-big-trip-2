const points = [
  {
    id: '1',
    type: 'taxi',
    destination: '1',
    dateFrom: '2024-06-01T10:00:00.000Z',
    dateTo: '2024-06-01T11:00:00.000Z',
    basePrice: 100,
    offers: ['1'],
    isFavorite: true,
  },
  {
    id: '2',
    type: 'restaurant',
    destination: '2',
    dateFrom: '2024-06-01T12:00:00.000Z',
    dateTo: '2024-06-01T13:00:00.000Z',
    basePrice: 50,
    offers: ['1'],
    isFavorite: false,
  },
  {
    id: '3',
    type: 'flight',
    destination: '3',
    dateFrom: '2024-06-01T14:00:00.000Z',
    dateTo: '2024-06-01T16:00:00.000Z',
    basePrice: 200,
    offers: ['1', '2'],
    isFavorite: true,
  },
];

export { points };
