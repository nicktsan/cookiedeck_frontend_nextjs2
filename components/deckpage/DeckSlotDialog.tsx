import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DeckslotFindResponseDTO } from '@/services/deckslot/find/deckslot-find.dto';

interface DeckSlotDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDeckSlot: DeckslotFindResponseDTO | null;
  viewMode: 'en' | 'kr';
}

export function DeckSlotDialog({
  isOpen,
  onOpenChange,
  selectedDeckSlot,
  viewMode,
}: DeckSlotDialogProps) {
  if (!selectedDeckSlot) return null;

  const name = viewMode === 'en' ? selectedDeckSlot.name_eng : selectedDeckSlot.name_kr;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {name} {selectedDeckSlot.code}
          </DialogTitle>
          <DialogDescription>Card details</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="cardType" className="text-right">
              Card Type
            </Label>
            <Input
              id="cardType"
              value={selectedDeckSlot.card_type}
              className="col-span-3"
              readOnly
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="color" className="text-right">
              Color
            </Label>
            <Input id="color" value={selectedDeckSlot.color} className="col-span-3" readOnly />
          </div>
          {/* Add more fields as needed */}
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
