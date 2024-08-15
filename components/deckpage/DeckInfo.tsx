'use client';
import { useState } from 'react';
import { DeckFindResponseDataDTO } from '@/services/deck/find/findDeckDTO';
import { FaEye } from 'react-icons/fa';
import { UpdateDeck } from '@/services/deck/update/updateDeck';
import { DeckUpdateRequestDTO } from '@/services/deck/update/deck-update.dto';
import { VisibilitySelect } from './VisibilitySelect';
import { capitalizeFirstLetter } from '@/utils/capitalizeFirstLetter';
import { calculateSinceLastUpdate } from '@/utils/deck/calculateSinceLastUpdate';

interface DeckInfoProps {
  displayDeck: DeckFindResponseDataDTO | undefined;
  onUpdate: () => void;
  isOwner: boolean | null | undefined;
}

export default function DeckInfo({ displayDeck, onUpdate, isOwner }: DeckInfoProps) {
  const [reload, setReload] = useState(false); // State to trigger reload

  if (!displayDeck) return null;
  // Destructure the properties with default values to handle undefined cases
  const { name, description, creator_username = '', visibility, views = 0 } = displayDeck;

  const handleChange = async (field: string, value: string) => {
    if (
      (field === 'description' && value.trim() === description?.trim()) ||
      (field === 'name' && value.trim() === name?.trim()) ||
      (field === 'visibility' && value.toLowerCase().trim() === visibility?.trim())
    ) {
      return;
    }
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
  const lastUpdated = calculateSinceLastUpdate(displayDeck);

  return (
    <div className="flex flex-col items-start px-[1vw] md:px-[10vw] lg:px-[10vw]">
      <div className="py-6 font-bold">
        <h2>{creator_username}</h2>
        <h1
          key={reload ? 'nameReloaded' : 'name'}
          contentEditable={isOwner ? 'true' : 'false'}
          onBlur={(e) => isOwner && handleChange('name', e.currentTarget.textContent || '')}
          onKeyDown={(e) => isOwner && handleKeyDown(e, 'name')}
          suppressContentEditableWarning={true}
        >
          {displayDeck.name}
        </h1>
        <p
          key={reload ? 'descriptionReloaded' : 'description'}
          className="font-normal"
          contentEditable={isOwner ? 'true' : 'false'}
          onBlur={(e) => isOwner && handleChange('description', e.currentTarget.textContent || '')}
          onKeyDown={(e) => isOwner && handleKeyDown(e, 'description')}
          suppressContentEditableWarning={true}
        >
          {displayDeck.description}
        </p>
        <p className="mt-1 flex flex-row items-center">
          {isOwner ? (
            <VisibilitySelect
              visibility={visibility!}
              onVisibilityChange={(value) => handleChange('visibility', value)}
            />
          ) : (
            <span>{capitalizeFirstLetter(visibility ?? '')}</span>
          )}
          <FaEye className="ml-2" />
          <span className="mx-2">{views}</span>
          <span className="ml-1">{lastUpdated}</span>
        </p>
      </div>
    </div>
  );
}
