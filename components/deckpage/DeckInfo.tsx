'use client';
import { useState } from 'react';
import { DeckFindResponseDataDTO } from '@/services/deck/find/findDeckDTO';
import { FaEye } from 'react-icons/fa';
import { UpdateDeck } from '@/services/deck/update/updateDeck';
import { DeckUpdateRequestDTO } from '@/services/deck/update/deck-update.dto';

interface DeckInfoProps {
  displayDeck: DeckFindResponseDataDTO | undefined;
  onUpdate: () => void;
}

export default function DeckInfo({ displayDeck, onUpdate }: DeckInfoProps) {
  const [reload, setReload] = useState(false); // State to trigger reload

  if (!displayDeck) return null;

  // Destructure the properties with default values to handle undefined cases
  const {
    creator_username = '',
    views = 0,
    years = 0,
    months = 0,
    days = 0,
    hours = 0,
    minutes = 0,
    seconds = 0,
  } = displayDeck;

  const handleChange = async (field: string, value: string) => {
    const deckUpdateRequestData: DeckUpdateRequestDTO = {
      id: displayDeck.id!,
    };
    (deckUpdateRequestData as any)[field] = value;
    try {
      await UpdateDeck(deckUpdateRequestData);
      await onUpdate();
    } catch (error) {
      // If there is an error, trigger a reload
      setReload(!reload);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>, field: string) => {
    if (e.key === 'Enter') {
      handleChange(field, e.currentTarget.textContent || '');
      e.currentTarget.blur(); // Remove focus from the editable element
    }
  };

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

  return (
    <div className="flex flex-col items-start px-[1vw] md:px-[10vw] lg:px-[10vw]">
      <div className="py-6 font-bold">
        <h2>{creator_username}</h2>
        <h1
          key={reload ? 'nameReloaded' : 'name'}
          contentEditable
          onBlur={(e) => handleChange('name', e.currentTarget.textContent || '')}
          onKeyDown={(e) => handleKeyDown(e, 'name')}
          suppressContentEditableWarning={true}
        >
          {displayDeck.name}
        </h1>
        <p
          key={reload ? 'descriptionReloaded' : 'description'}
          className="font-normal"
          contentEditable
          onBlur={(e) => handleChange('description', e.currentTarget.textContent || '')}
          onKeyDown={(e) => handleKeyDown(e, 'description')}
          suppressContentEditableWarning={true}
        >
          {displayDeck.description}
        </p>
        <p className="flex flex-row items-center">
          <FaEye />
          <span className="mx-2">{views}</span>
          <span className="ml-1">{lastUpdated}</span>
        </p>
      </div>
    </div>
  );
}
