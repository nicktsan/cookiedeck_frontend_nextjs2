'use client';
import { DeckslotFindResponseDTO } from '@/services/deckslot/find/deckslot-find.dto';
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';
import {
  DeckslotUpdateQuantityRequestDTO,
  DeckslotParams,
} from '@/services/deckslot/update/quantity/deckslot-update-quantity.dto';
import { UpdateDeckSlotQuantity } from '@/services/deckslot/update/quantity/deckslot-update-quantity';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { colorMapping } from '@/utils/colorMapping';
import { Separator } from '@/components/ui/separator';
import { DeckSlotDropDownMenu } from './DeckSlotDropDownMenu';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DeckSlotDialog } from './DeckSlotDialog';

interface DeckInfoProps {
  deckslots: DeckslotFindResponseDTO[] | undefined | null;
  onUpdate: () => void;
  viewMode: 'en' | 'kr';
  setViewMode: React.Dispatch<React.SetStateAction<'en' | 'kr'>>;
  isOwner: boolean | null | undefined;
}

interface DeckSlotProps {
  deckslot: DeckslotFindResponseDTO;
  viewMode: 'en' | 'kr';
  onMouseEnter: (imageLink: string) => void;
  onUpdateQuantity: (deckslot: DeckslotFindResponseDTO, change: number) => void;
  onUpdate: () => void;
  isOwner: boolean | null | undefined;
  onDeckSlotClick: (deckslot: DeckslotFindResponseDTO) => void;
}

const DeckSlot = ({
  deckslot,
  viewMode,
  onMouseEnter,
  onUpdateQuantity,
  onUpdate,
  isOwner,
  onDeckSlotClick,
}: DeckSlotProps) => {
  const deckslotParams: DeckslotParams = {
    deck_id: deckslot.deck_id,
    card_id: deckslot.card_id,
    board: deckslot.board,
    card_name_eng: deckslot.name_eng!,
    card_name_kr: deckslot.name_kr!,
  };
  const name = viewMode === 'en' ? deckslot.name_eng : deckslot.name_kr;
  const colorEmoji = Object.keys(colorMapping).includes(deckslot.color!.toLowerCase())
    ? colorMapping[deckslot.color?.toLowerCase() as keyof typeof colorMapping]
    : '';
  const imgLink = viewMode === 'en' ? deckslot.image_link_en || '': deckslot.image_link || '';
  return (
    <>
      <div
        key={deckslot.card_id}
        className="flex items-center justify-between gap-y-1 py-1"
        onMouseEnter={() => 
          onMouseEnter(imgLink)
        }
      >
        <div className="flex min-w-0 flex-grow items-center pr-2">
          <span className="w-4 flex-shrink-0 text-left">{deckslot.quantity}</span>
          <span className="flex w-6 flex-shrink-0 items-center justify-center text-base">
            {colorEmoji}
          </span>
          <div className="flex min-w-0 flex-grow items-center">
            <span
              className="mr-2 break-words hover:cursor-pointer hover:underline"
              onClick={() => onDeckSlotClick(deckslot)}
            >
              {name} {deckslot.code}
            </span>
            {deckslot.plain_text_eng?.includes('[FLIP]') && (
              <span className="inline-block flex-shrink-0 whitespace-nowrap rounded bg-blue-500 px-2 py-0.5 text-xs font-semibold text-white">
                FLIP
              </span>
            )}
          </div>
        </div>
        {isOwner && (
          <div className="flex flex-shrink-0 items-center space-x-2">
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
        )}
        {isOwner && (
          <DeckSlotDropDownMenu
            deckslotParams={deckslotParams}
            onUpdate={onUpdate}
            viewMode={viewMode}
          />
        )}
      </div>
      <Separator />
    </>
  );
};

export default function DeckSlotDisplay({
  deckslots,
  onUpdate,
  viewMode,
  setViewMode,
  isOwner,
}: DeckInfoProps) {
  const queryClient = useQueryClient();
  const [selectedDeckSlot, setSelectedDeckSlot] = useState<DeckslotFindResponseDTO | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<string>('');
  const [currentCardId, setCurrentCardId] = useState<number | null>(null);

  const handleDeckSlotClick = (deckslot: DeckslotFindResponseDTO) => {
    setSelectedDeckSlot(deckslot);
    setIsDialogOpen(true);
  };

  const updateQuantityMutation = useMutation({
    mutationFn: UpdateDeckSlotQuantity,
    onMutate: async (payload: DeckslotUpdateQuantityRequestDTO) => {
      // Optimistically update the deckslot quantity
      await queryClient.cancelQueries({ queryKey: ['deckSlots', payload.deck_id] });
      const previousDeckSlots = queryClient.getQueryData<DeckslotFindResponseDTO[]>([
        'deckSlots',
        payload.deck_id,
      ]);

      if (previousDeckSlots) {
        const updatedDeckSlots = previousDeckSlots.reduce((acc, slot) => {
          if (slot.card_id === payload.card_id && slot.board === payload.board) {
            const newQuantity = slot.quantity! + payload.changeValue;
            if (newQuantity > 0) {
              acc.push({
                ...slot,
                quantity: newQuantity,
              });
            }
            // If newQuantity <= 0, we don't add this slot to the accumulator
          } else {
            acc.push(slot);
          }
          return acc;
        }, [] as DeckslotFindResponseDTO[]);

        queryClient.setQueryData(['deckSlots', payload.deck_id], updatedDeckSlots);
      }

      return { previousDeckSlots };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousDeckSlots) {
        queryClient.setQueryData(['deckSlots', _variables.deck_id], context.previousDeckSlots);
      }
    },
    onSuccess: () => {
      onUpdate();
    },
  });

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
      // Sort the slots within each group by name and then by color
      const sortedSlots = slots.sort((a, b) => {
        const nameA = viewMode === 'en' ? a.name_eng : a.name_kr;
        const nameB = viewMode === 'en' ? b.name_eng : b.name_kr;
        const colorA = a.color || '';
        const colorB = b.color || '';

        if (nameA !== nameB) {
          return nameA!.localeCompare(nameB!);
        }
        return colorA.localeCompare(colorB);
      });
      acc[card_type] = sortedSlots;
      return acc;
    },
    {} as Record<string, DeckslotFindResponseDTO[]>,
  );

  // Set default image when component mounts or viewMode changes
  useEffect(() => {
    if (deckslots && deckslots.length > 0) {
      let cardToDisplay = deckslots.find(slot => slot.card_id === currentCardId);
      if (!cardToDisplay) {
        cardToDisplay = deckslots[0];
        setCurrentCardId(cardToDisplay.card_id);
      }
      setCurrentImage(viewMode === 'en' ? cardToDisplay.image_link_en! : cardToDisplay.image_link!);
    }
  }, [deckslots, viewMode, currentCardId]);


  const updateQuantity = async (deckslot: DeckslotFindResponseDTO, change: number) => {
    const payload: DeckslotUpdateQuantityRequestDTO = {
      deck_id: deckslot.deck_id,
      card_id: deckslot.card_id,
      board: deckslot.board,
      changeValue: change,
    };
    await updateQuantityMutation.mutateAsync(payload);
  };


  const handleMouseEnter = (deckslot: DeckslotFindResponseDTO) => {
    setCurrentCardId(deckslot.card_id);
    setCurrentImage(viewMode === 'en' ? deckslot.image_link_en || '' : deckslot.image_link || '');
  };
  return (
    <div className="flex pt-5">
      <div className="relative size-96 flex-shrink-0">
        <Image src={currentImage || ''} layout="fill" objectFit="contain" alt="" />
      </div>
      <div className="grid grid-cols-3 justify-items-stretch gap-x-5 gap-y-6">
        {Object.entries(sortedGroupedByCardType).map(([card_type, slots]) => (
          <div key={card_type} className="w-full">
            <h2 className="mb-2 text-xl font-bold">{card_type}</h2>
            {slots.map((deckslot) => (
              <DeckSlot
                key={deckslot.card_id}
                deckslot={deckslot}
                viewMode={viewMode}
                onMouseEnter={() => handleMouseEnter(deckslot)}
                onUpdateQuantity={updateQuantity}
                onUpdate={onUpdate}
                isOwner={isOwner}
                onDeckSlotClick={handleDeckSlotClick}
              />
            ))}
          </div>
        ))}
      </div>
      <DeckSlotDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedDeckSlot={selectedDeckSlot}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />
    </div>
  );
}
