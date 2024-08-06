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
import {
  DeckslotUpdateQuantityRequestDTO,
  DeckslotUpdateQuantityRequestNoChangeParams,
  DeckslotUpdateQuantityResponseDataDTO,
} from '@/services/deckslot/update/quantity/deckslot-update-quantity.dto';
import { UpdateDeckSlotQuantity } from '@/services/deckslot/update/quantity/deckslot-update-quantity';

interface ChangeSlotQuantityDialogProps extends DeckSlotDropDownProps {
  closeParentDropdown: () => void;
}

export function ChangeSlotQuantityDialog({
  deckslotUpdateQuantityParams,
  onUpdate,
  viewMode,
  closeParentDropdown,
}: ChangeSlotQuantityDialogProps) {
  const [changeValue, setChangeValue] = useState('2');
  const [isValidInput, setIsValidInput] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  let cardNameDisplay = deckslotUpdateQuantityParams.card_name_eng;
  if (viewMode === 'kr') {
    cardNameDisplay = deckslotUpdateQuantityParams.card_name_kr;
  }

  const validateInput = useCallback((value: string) => {
    return /^-?\d+$/.test(value);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setChangeValue(newValue);
    setIsValidInput(validateInput(newValue));
  };

  const updateQuantity = async (deckslot: DeckslotUpdateQuantityRequestNoChangeParams) => {
    if (!isValidInput) return;

    try {
      const change = parseInt(changeValue, 10);
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
      onUpdate();
      setIsOpen(false); // Close the dialog
      closeParentDropdown(); // Close the parent dropdown
    } catch (error) {
      console.error('Error updating deckslot:', error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="w-full cursor-pointer rounded-sm px-2 py-2 text-black hover:bg-gray-200">
          Add/Remove one or more
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>How many {cardNameDisplay} do you want to add/remove?</DialogTitle>
          <DialogDescription>
            Enter an integer value. Negative values will remove cards from the deck.
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
          <Button
            onClick={() => updateQuantity(deckslotUpdateQuantityParams)}
            type="submit"
            disabled={!isValidInput}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
