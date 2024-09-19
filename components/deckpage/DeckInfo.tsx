'use client';
import { DeckFindResponseDataDTO } from '@/services/deck/find/findDeckDTO';
import { FaEye } from 'react-icons/fa';
import { UpdateDeck } from '@/services/deck/update/updateDeck';
import { DeckUpdateRequestDTO } from '@/services/deck/update/deck-update.dto';
import { VisibilitySelect } from './VisibilitySelect';
import { capitalizeFirstLetter } from '@/utils/capitalizeFirstLetter';
import { calculateSinceLastUpdate } from '@/utils/deck/calculateSinceLastUpdate';
import { useMutation } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { ChangeCardImageDialog } from './ChangeCardImageDialog';
import { DeckslotFindResponseDTO } from '@/services/deckslot/find/deckslot-find.dto';

interface DeckInfoProps {
  displayDeck: DeckFindResponseDataDTO | undefined;
  deckslots: DeckslotFindResponseDTO[] | undefined | null;
  onUpdate: () => void;
  isOwner: boolean | null | undefined;
  viewMode: 'en' | 'kr';
  setViewMode: React.Dispatch<React.SetStateAction<'en' | 'kr'>>;
}

export const defaultImgURL: string = '/images/cookieruntcg.PNG';
export default function DeckInfo({
  displayDeck,
  deckslots,
  onUpdate,
  isOwner,
  viewMode,
  setViewMode,
}: DeckInfoProps) {
  const [localDeck, setLocalDeck] = useState(displayDeck);
  const [nameErrorClass, setNameErrorClass] = useState('hidden');
  const [optimisticBannerUrl, setOptimisticBannerUrl] = useState<string | null>(null);

  useEffect(() => {
    setLocalDeck(displayDeck);
  }, [displayDeck]);
  //todo add deck tag edit functionality
  const updateDeckMutation = useMutation({
    mutationFn: UpdateDeck,
    onMutate: async (updatedDeck) => {
      // Optimistically update to the new value
      setLocalDeck((current) => ({ ...current, ...updatedDeck }));
    },
    onError: () => {
      // If the mutation fails, revert to the previous value
      setLocalDeck(displayDeck);
    },
    onSuccess: () => {
      setNameErrorClass('hidden');
    },
    onSettled: () => {
      // Always call onUpdate after error or success
      onUpdate();
    },
  });

  const handleChange = useCallback(
    async (field: string, value: string | number) => {
      if (!displayDeck || !displayDeck.id) return;

      if (
        (field === 'description' && String(value).trim() === localDeck?.description?.trim()) ||
        (field === 'name' && String(value).trim() === localDeck?.name?.trim()) ||
        (field === 'visibility' &&
          String(value).toLowerCase().trim() === localDeck?.visibility?.trim()) ||
        (field === 'banner' && Number(value) === localDeck?.banner)
      ) {
        return;
      }
      if (field === 'name' && String(value).trim().length < 3) {
        setNameErrorClass('text-red-500');
      }
      const deckUpdateRequestData: DeckUpdateRequestDTO = {
        id: displayDeck.id,
        [field]: value,
      };
      if (field === 'banner') {
        const selectedDeckslot = deckslots?.find((slot) => slot.card_id === Number(value));
        if (selectedDeckslot) {
          setOptimisticBannerUrl(
            viewMode === 'en' ? selectedDeckslot.image_link_en! : selectedDeckslot.image_link!,
          );
        }
      }

      updateDeckMutation.mutate(deckUpdateRequestData);
    },
    [
      displayDeck,
      deckslots,
      viewMode,
      updateDeckMutation,
      localDeck?.banner,
      localDeck?.description,
      localDeck?.name,
      localDeck?.visibility,
    ],
  );

  useEffect(() => {
    // Only reset optimisticBannerUrl if there's no optimistic update happening
    if (!optimisticBannerUrl) {
      setLocalDeck(displayDeck);
    }
  }, [displayDeck, optimisticBannerUrl]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLElement>, field: string) => {
      if (e.key === 'Enter') {
        handleChange(field, e.currentTarget.textContent || '');
        e.currentTarget.blur(); // Remove focus from the editable element
      }
    },
    [handleChange],
  );

  if (!localDeck) return null;

  const { name, description, creator_username = '', visibility, views = 0, tag_names } = localDeck;
  const lastUpdated: string = calculateSinceLastUpdate(localDeck);
  const bgImage: string = `url(${optimisticBannerUrl || localDeck.kr_banner_url || defaultImgURL})`;

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
            {name}
          </h1>
          <p className={nameErrorClass}>Name must be at least 3 characters long.</p>
          <p
            className="mb-4 text-sm md:text-base"
            contentEditable={isOwner ? 'true' : 'false'}
            onBlur={(e) =>
              isOwner && handleChange('description', e.currentTarget.textContent || '')
            }
            onKeyDown={(e) => isOwner && handleKeyDown(e, 'description')}
            suppressContentEditableWarning={true}
          >
            {description}
          </p>
          <div className="flex w-full flex-row items-center justify-between text-sm">
            <div className="flex items-center">
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
            {isOwner ? (
              <ChangeCardImageDialog
                deckslots={deckslots}
                displayDeckBanner={displayDeck?.kr_banner_url}
                displayDeckBannerId={displayDeck?.banner}
                defaultImgURL={defaultImgURL}
                viewMode={viewMode}
                setViewMode={setViewMode}
                onBannerChange={(value) => handleChange('banner', value)}
              />
            ) : null}
          </div>
          <div className="flex flex-row flex-wrap gap-2 mx-2">
            {tag_names?.map((tag_name) => (
              <p key={tag_name} className="max-w-full truncate hover:bg-gray-200 border-2 hover:text-black border-black px-2 py-1 rounded-full text-sm">
                {tag_name}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
