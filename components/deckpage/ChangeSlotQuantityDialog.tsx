import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DeckSlotDropDownProps } from './DeckSlotDropDownMenu';
import { DeckslotUpdateQuantityRequestDTO } from '@/services/deckslot/update/quantity/deckslot-update-quantity.dto';
import { UpdateDeckSlotQuantity } from '@/services/deckslot/update/quantity/deckslot-update-quantity';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DeckslotFindResponseDTO } from '@/services/deckslot/find/deckslot-find.dto';

interface ChangeSlotQuantityDialogProps extends DeckSlotDropDownProps {
  closeParentDropdown: () => void;
}

export function ChangeSlotQuantityDialog({
  deckslotParams,
  onUpdate,
  viewMode,
  closeParentDropdown,
}: ChangeSlotQuantityDialogProps) {
  const queryClient = useQueryClient();
  const [changeValue, setChangeValue] = useState('2');
  const [isValidInput, setIsValidInput] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  let cardNameDisplay = deckslotParams.card_name_eng;
  if (viewMode === 'kr') {
    cardNameDisplay = deckslotParams.card_name_kr;
  }

  const updateQuantityMutation = useMutation({
    mutationFn: UpdateDeckSlotQuantity,
    onMutate: async (payload: DeckslotUpdateQuantityRequestDTO) => {
      console.log('Mutating deckslot quantity');
      // Optimistically update the deckslot quantity
      await queryClient.cancelQueries({ queryKey: ['deckSlots', payload.deck_id] });
      const previousDeckSlots = queryClient.getQueryData<DeckslotFindResponseDTO[]>([
        'deckSlots',
        payload.deck_id,
      ]);

      if (previousDeckSlots) {
        const updatedDeckSlots = previousDeckSlots.map((slot) => {
          if (slot.card_id === payload.card_id && slot.board === payload.board) {
            return {
              ...slot,
              quantity: slot.quantity! + payload.changeValue,
            };
          }
          return slot;
        });
        queryClient.setQueryData(['deckSlots', payload.deck_id], updatedDeckSlots);
      }

      return { previousDeckSlots };
    },
    onError: (_error, _variables, context) => {
      console.log('Error updating deckslot quantity');
      if (context?.previousDeckSlots) {
        queryClient.setQueryData(['deckSlots', _variables.deck_id], context.previousDeckSlots);
      }
    },
    onSuccess: () => {
      console.log('Deckslot quantity updated successfully');
      onUpdate();
      setIsOpen(false); // Close the dialog
      closeParentDropdown(); // Close the parent dropdown
    },
  });

  const validateInput = useCallback((value: string) => {
    // Check if the value is a valid integer
    if (!/^-?\d+$/.test(value)) {
      return false;
    }

    // Convert the value to a number
    const numberValue = Number(value);

    // Check if the value is outside the 32-bit signed integer range or is equal to 0
    if (numberValue === 0 || numberValue < -2147483647 || numberValue > 2147483647) {
      return false;
    }

    return true;
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setChangeValue(newValue);
    setIsValidInput(validateInput(newValue));
  };

  const updateQuantity = async () => {
    console.log('triggered updateQuantity in ChangeSlotQuantityDialog');
    if (!isValidInput) return;
    const change = parseInt(changeValue, 10);
    const payload: DeckslotUpdateQuantityRequestDTO = {
      deck_id: deckslotParams.deck_id,
      card_id: deckslotParams.card_id,
      board: deckslotParams.board,
      changeValue: change,
    };
    console.log('payload in ChangeSlotQuantityDialog updateQuantity: ', payload);
    await updateQuantityMutation.mutateAsync(payload);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="w-full">
        <div className="w-full cursor-pointer rounded-sm px-2 py-2 text-sm text-black hover:bg-gray-200">
          Add/Remove one or more
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>How many {cardNameDisplay} do you want to add/remove?</DialogTitle>
          <DialogDescription>
            Enter an non-zero integer value. Negative values will remove cards from the deck.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="changeValue" className="text-right">
            Change Value
          </Label>
          <Input
            id="changeValue"
            value={changeValue}
            onChange={handleInputChange}
            className="col-span-3"
          />
        </div>
        <DialogFooter>
          <Button onClick={updateQuantity} type="submit" disabled={!isValidInput}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
