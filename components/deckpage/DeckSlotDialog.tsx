import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { DeckslotFindResponseDTO } from '@/services/deckslot/find/deckslot-find.dto';
import Image from 'next/image';
import React from 'react';
import { Switch } from '@/components/ui/switch';

interface DeckSlotDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDeckSlot: DeckslotFindResponseDTO | null;
  viewMode: 'en' | 'kr';
  setViewMode: React.Dispatch<React.SetStateAction<'en' | 'kr'>>;
}

export function DeckSlotDialog({
  isOpen,
  onOpenChange,
  selectedDeckSlot,
  viewMode,
  setViewMode,
}: DeckSlotDialogProps) {
  if (!selectedDeckSlot) return null;
  const toggleViewMode = () => {
    setViewMode((prev) => (prev === 'en' ? 'kr' : 'en'));
  };
  const displayName = viewMode === 'en' ? selectedDeckSlot.name_eng : selectedDeckSlot.name_kr;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="flex min-w-[65vw] sm:max-w-md">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center justify-center">
            <Switch
              id="language-toggle"
              checked={viewMode === 'kr'}
              onCheckedChange={toggleViewMode}
            />
            <Label htmlFor="language-toggle" className="ml-2">
              {viewMode === 'en' ? 'EN' : 'KR'}
            </Label>
          </div>
          <div className="relative h-96 w-96">
            <Image
              src={selectedDeckSlot.image_link || ''}
              layout="fill"
              objectFit="contain"
              alt=""
            />
          </div>
        </div>
        <div className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {displayName} {selectedDeckSlot.code}
            </DialogTitle>
            <DialogDescription>{selectedDeckSlot.card_type}</DialogDescription>
          </DialogHeader>
          {selectedDeckSlot.card_level ? <div>Level: {selectedDeckSlot.card_level}</div> : null}
          <div className="mt-6">
            {viewMode === 'en' ? selectedDeckSlot.plain_text_eng : selectedDeckSlot.plain_text}
          </div>
          <div className="mt-6">{selectedDeckSlot.rarity}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
