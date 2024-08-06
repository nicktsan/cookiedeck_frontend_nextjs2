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

interface DeleteDeckSlotDialogProps extends DeckSlotDropDownProps {
  closeParentDropdown: () => void;
}

export function DeleteDeckSlotDialog({
  deckslotParams,
  onUpdate,
  viewMode,
  closeParentDropdown,
}: DeleteDeckSlotDialogProps) {
  const [changeValue, setChangeValue] = useState('2');
  const [isValidInput, setIsValidInput] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  let cardNameDisplay = deckslotParams.card_name_eng;
  if (viewMode === 'kr') {
    cardNameDisplay = deckslotParams.card_name_kr;
  }

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
          <Button
            onClick={() => updateQuantity(deckslotParams)}
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
