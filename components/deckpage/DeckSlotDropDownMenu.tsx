import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CircleChevronDown } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import { ChangeSlotQuantityDialog } from './ChangeSlotQuantityDialog';
import { DeckslotParams } from '@/services/deckslot/update/quantity/deckslot-update-quantity.dto';
import { DeleteDeckSlot } from '@/services/deckslot/delete/deleteDeckSlot';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { DeckslotFindResponseDTO } from '@/services/deckslot/find/deckslot-find.dto';

export interface DeckSlotDropDownProps {
  deckslotParams: DeckslotParams;
  onUpdate: () => void;
  viewMode: 'en' | 'kr';
}

export function DeckSlotDropDownMenu({
  deckslotParams,
  onUpdate,
  viewMode,
}: DeckSlotDropDownProps) {
  const queryClient = useQueryClient();
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentWidth, setContentWidth] = useState('auto');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (contentRef.current) {
      const width = contentRef.current.scrollWidth;
      setContentWidth(`${width}px`);
    }
  }, []);

  const handleUpdate = () => {
    onUpdate();
    setIsDropdownOpen(false);
  };

  const deleteDeckSlotMutation = useMutation({
    mutationFn: DeleteDeckSlot,
    onMutate: async (deckslotParams: DeckslotParams) => {
      // Optimistically remove the deckslot from the display
      await queryClient.cancelQueries({ queryKey: ['deckSlots', deckslotParams.deck_id] });
      const previousDeckSlots = queryClient.getQueryData<DeckslotFindResponseDTO[]>([
        'deckSlots',
        deckslotParams.deck_id,
      ]);

      if (previousDeckSlots) {
        const updatedDeckSlots = previousDeckSlots.filter(
          (slot) =>
            !(slot.card_id === deckslotParams.card_id && slot.board === deckslotParams.board),
        );
        queryClient.setQueryData(['deckSlots', deckslotParams.deck_id], updatedDeckSlots);
      }

      return { previousDeckSlots };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousDeckSlots) {
        queryClient.setQueryData(['deckSlots', _variables.deck_id], context.previousDeckSlots);
      }
    },
    onSuccess: () => {
      handleUpdate();
    },
  });

  const handleDelete = async () => {
    try {
      await deleteDeckSlotMutation.mutateAsync(deckslotParams);
    } catch (error) {
      console.error('Error deleting deck slot:', error);
      // Handle error appropriately
    }
  };

  return (
    <div className="mx-2">
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="flex h-8 w-8 items-center justify-center"
          >
            <CircleChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          ref={contentRef}
          style={{ width: contentWidth }}
          className="inline-block"
        >
          <DropdownMenuGroup>
            <DropdownMenuItem className="p-0" asChild>
              <ChangeSlotQuantityDialog
                deckslotParams={deckslotParams}
                onUpdate={handleUpdate}
                viewMode={viewMode}
                closeParentDropdown={() => setIsDropdownOpen(false)}
              />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="p-0">
              <div
                className="w-full cursor-pointer rounded-sm px-2 py-2 text-sm text-red-500 hover:bg-red-500 hover:text-white"
                onClick={handleDelete}
              >
                Delete
              </div>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
