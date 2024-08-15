import { DeckFindResponseDataDTO } from '@/services/deck/find/findDeckDTO';

export function calculateSinceLastUpdate(deck: DeckFindResponseDataDTO): string {
  const { years = 0, months = 0, days = 0, hours = 0, minutes = 0, seconds = 0 } = deck;
  // Create an array of time units for easier iteration and filtering
  const timeUnits = [
    { label: 'year', value: years },
    { label: 'month', value: months },
    { label: 'day', value: days },
    { label: 'hour', value: hours },
    { label: 'minute', value: minutes },
    { label: 'second', value: seconds },
  ];

  let lastUpdated: string = '';
  timeUnits
    .filter((unit) => unit.value > 0)
    .map(
      (unit) =>
        (lastUpdated =
          lastUpdated +
          ' ' +
          Math.round(unit.value) +
          ' ' +
          unit.label +
          (Math.round(unit.value) > 1 ? 's' : '') +
          ' '),
    );
  lastUpdated = lastUpdated + 'since last update';
  return lastUpdated;
}
