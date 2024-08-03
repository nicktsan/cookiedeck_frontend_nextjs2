'use client';
import { DeckFindResponseDataDTO } from '@/services/deck/find/findDeckDTO';
import { FaEye } from 'react-icons/fa';

interface DeckInfoProps {
  displayDeck: DeckFindResponseDataDTO | undefined;
}

export default function DeckInfo({ displayDeck }: DeckInfoProps) {
  if (!displayDeck) return null;

  // Destructure the properties with default values to handle undefined cases
  const {
    creator_username = '',
    name = '',
    description = '',
    views = 0,
    years = 0,
    months = 0,
    days = 0,
    hours = 0,
    minutes = 0,
    seconds = 0,
  } = displayDeck;

  // Create an array of time units for easier iteration and filtering
  const timeUnits = [
    { label: 'year', value: years },
    { label: 'month', value: months },
    { label: 'day', value: days },
    { label: 'hour', value: hours },
    { label: 'minute', value: minutes },
    { label: 'second', value: seconds },
  ];

  let lastUpdated: string = "";
  timeUnits.filter((unit) => unit.value > 0)
  .map((unit) => (
    lastUpdated = lastUpdated + " " + Math.round(unit.value) + " " + unit.label + (Math.round(unit.value) > 1 ? "s" : "" ) + " "
  ));
  lastUpdated = lastUpdated + "since last update"

  return (
    <div className="flex flex-col items-start px-[1vw] md:px-[10vw] lg:px-[10vw]">
      <div className="py-6 font-bold">
        <h2>{creator_username}</h2>
        <h1>{name}</h1>
        <p className="font-normal">{description}</p>
        <p className="flex flex-row items-center">
          <FaEye />
          <span className="mx-2">{views}</span>
          <span className="ml-1">{lastUpdated}</span>
        </p>
      </div>
    </div>
  );
}
