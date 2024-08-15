'use client';
import { useState } from 'react';
import { DeckFindResponseDataDTO } from '@/services/deck/find/findDeckDTO';
import { FaEye } from 'react-icons/fa';
import { UpdateDeck } from '@/services/deck/update/updateDeck';
import { DeckUpdateRequestDTO } from '@/services/deck/update/deck-update.dto';
import { VisibilitySelect } from './VisibilitySelect';
import { capitalizeFirstLetter } from '@/utils/capitalizeFirstLetter';
import { calculateSinceLastUpdate } from '@/utils/deck/calculateSinceLastUpdate';
import { DeckslotFindResponseDTO } from '@/services/deckslot/find/deckslot-find.dto';

interface DeckInfoProps {
  displayDeck: DeckFindResponseDataDTO | undefined;
  deckslots: DeckslotFindResponseDTO[] | undefined | null;
  onUpdate: () => void;
  isOwner: boolean | null | undefined;
}

export default function DeckInfo({ displayDeck, deckslots, onUpdate, isOwner }: DeckInfoProps) {
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
  const lastUpdated: string = calculateSinceLastUpdate(displayDeck);
  const defaultImgURL: string = '/images/cookieruntcg.PNG';
  let bgImage: string = `url(${displayDeck.banner_url || defaultImgURL})`;
  if (deckslots && deckslots[0]) {
    bgImage = `url(${displayDeck.banner_url || deckslots[0].image_link || defaultImgURL})`;
  }
  return (
    <div
      className="relative h-[50vh] w-full bg-cover bg-center"
      style={{ backgroundImage: bgImage }}
    >
      <div className="absolute inset-0 flex flex-col justify-end bg-black bg-opacity-50">
        <div className="p-6 text-white md:p-10 lg:p-12">
          <h2 className="text-sm md:text-base">{creator_username}</h2>
          <h1
            className="mb-2 text-2xl font-bold md:text-3xl lg:text-4xl"
            contentEditable={isOwner ? 'true' : 'false'}
            onBlur={(e) => isOwner && handleChange('name', e.currentTarget.textContent || '')}
            onKeyDown={(e) => isOwner && handleKeyDown(e, 'name')}
            suppressContentEditableWarning={true}
          >
            {displayDeck.name}
          </h1>
          <p
            className="mb-4 text-sm md:text-base"
            contentEditable={isOwner ? 'true' : 'false'}
            onBlur={(e) =>
              isOwner && handleChange('description', e.currentTarget.textContent || '')
            }
            onKeyDown={(e) => isOwner && handleKeyDown(e, 'description')}
            suppressContentEditableWarning={true}
          >
            {displayDeck.description}
          </p>
          <div className="flex flex-row items-center text-sm">
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
          </div>
        </div>
      </div>
    </div>
  );
}
