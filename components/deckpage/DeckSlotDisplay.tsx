'use client';
import { DeckslotFindResponseDTO } from '@/services/deckslot/find/deckslot-find.dto';
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';
import {
  DeckslotUpdateQuantityRequestDTO,
  DeckslotUpdateQuantityResponseDataDTO,
} from '@/services/deckslot/update/quantity/deckslot-update-quantity.dto';
import { UpdateDeckSlotQuantity } from '@/services/deckslot/update/quantity/deckslot-update-quantity';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { colorMapping } from '@/utils/colorMapping';

interface DeckInfoProps {
  deckslots: DeckslotFindResponseDTO[] | undefined | null;
  onUpdate: () => void;
  viewMode: 'en' | 'kr';
}

interface DeckSlotProps {
  deckslot: DeckslotFindResponseDTO;
  viewMode: 'en' | 'kr';
  onMouseEnter: (imageLink: string) => void;
  onUpdateQuantity: (deckslot: DeckslotFindResponseDTO, change: number) => void;
}

const DeckSlot = ({ deckslot, viewMode, onMouseEnter, onUpdateQuantity }: DeckSlotProps) => {
  const name = viewMode === 'en' ? deckslot.name_eng : deckslot.name_kr;
  const colorEmoji = Object.keys(colorMapping).includes(deckslot.color!.toLowerCase())
    ? colorMapping[deckslot.color?.toLowerCase() as keyof typeof colorMapping]
    : '';

  return (
    <div
      key={deckslot.card_id}
      className="flex items-center justify-between"
      onMouseEnter={() => onMouseEnter(deckslot.image_link!)}
    >
      <div className="flex items-center space-x-1">
        <span className="w-6 text-left">{deckslot.quantity}</span>
        <span className="inline-flex w-6 items-center justify-center text-base leading-none">
          {colorEmoji}
        </span>
        <span className="hover:underline">{name}</span>
        {deckslot.plain_text_eng?.includes('[FLIP]') && (
          <span className="ml-2 rounded bg-blue-500 px-2 py-0.5 text-xs font-semibold text-white">
            FLIP
          </span>
        )}
      </div>
      <div className="ml-1 flex space-x-2">
        {[
          { icon: Plus, change: 1 },
          { icon: Minus, change: -1 },
        ].map(({ icon: Icon, change }) => (
          <Button
            key={change}
            variant="outline"
            size="icon"
            className="flex h-8 w-8 items-center justify-center"
            onClick={() => onUpdateQuantity(deckslot, change)}
          >
            <Icon className="h-4 w-4" />
          </Button>
        ))}
      </div>
    </div>
  );
};

export default function DeckSlotDisplay({ deckslots, onUpdate, viewMode }: DeckInfoProps) {
  // Group the objects by card_type
  const groupedByCardType = deckslots?.reduce(
    (acc, deckslot) => {
      const key = deckslot.card_type || 'undefined';
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(deckslot);
      return acc;
    },
    {} as Record<string, DeckslotFindResponseDTO[]>,
  );

  // Sort the groups and sort items within each group
  const sortedGroups = Object.entries(groupedByCardType || {}).sort(([a], [b]) =>
    a.localeCompare(b),
  );
  const sortedGroupedByCardType = sortedGroups.reduce(
    (acc, [card_type, slots]) => {
      // Sort the slots within each group by name
      const sortedSlots = slots.sort((a, b) => {
        const nameA = viewMode === 'en' ? a.name_eng : a.name_kr;
        const nameB = viewMode === 'en' ? b.name_eng : b.name_kr;
        return nameA!.localeCompare(nameB!);
      });
      acc[card_type] = sortedSlots;
      return acc;
    },
    {} as Record<string, DeckslotFindResponseDTO[]>,
  );

  const [currentImage, setCurrentImage] = useState<string>('');
  useEffect(() => {
    if (sortedGroupedByCardType) {
      // Find the first deckslot in the sortedGroupedByCardType
      const firstDeckslot = Object.values(sortedGroupedByCardType).flat()[0];
      if (firstDeckslot) {
        // Set the image link of the first deckslot as the default image
        setCurrentImage(firstDeckslot.image_link || '');
      }
    }
  }, [deckslots]);

  const updateQuantity = async (deckslot: DeckslotFindResponseDTO, change: number) => {
    try {
      const payload: DeckslotUpdateQuantityRequestDTO = {
        deck_id: deckslot.deck_id,
        card_id: deckslot.card_id,
        board: deckslot.board,
        changeValue: change,
      };
      const response: DeckslotUpdateQuantityResponseDataDTO = await UpdateDeckSlotQuantity(payload);

      if (response.error) {
        throw new Error('Failed to update deckslot');
      }

      // Call the onUpdate function to refresh the deckslots in the parent component
      await onUpdate();
    } catch (error) {
      console.error('Error updating deckslot:', error);
      // You might want to show an error message to the user here
    }
  };

  const handleMouseEnter = (imageLink: string) => {
    setCurrentImage(imageLink);
  };

  return (
    <div className="flex">
      <div className="relative h-96 w-96">
        <Image src={currentImage || ''} layout="fill" objectFit="contain" alt="" />
      </div>
      <div className="grid grid-cols-3 justify-items-stretch gap-20">
        {Object.entries(sortedGroupedByCardType).map(([card_type, slots]) => (
          <div key={card_type} className="w-full">
            <h2 className="mb-4 text-xl font-bold">{card_type}</h2>
            {slots.map((deckslot) => (
              <DeckSlot
                key={deckslot.card_id}
                deckslot={deckslot}
                viewMode={viewMode}
                onMouseEnter={handleMouseEnter}
                onUpdateQuantity={updateQuantity}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
