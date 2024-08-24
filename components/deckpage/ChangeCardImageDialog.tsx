import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Image from 'next/image';
// import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pencil } from 'lucide-react';
import { DeckslotFindResponseDTO } from '@/services/deckslot/find/deckslot-find.dto';
import { Switch } from '../ui/switch';
import { colorMapping } from '@/utils/colorMapping';
import { useState, useEffect } from 'react';

interface IChangeCardImageDialogProps {
  deckslots: DeckslotFindResponseDTO[] | undefined | null;
  displayDeckId: string | undefined;
  displayDeckBanner: string | null | undefined;
  defaultImgURL: string;
  viewMode: 'en' | 'kr';
  setViewMode: React.Dispatch<React.SetStateAction<'en' | 'kr'>>;
}

export function ChangeCardImageDialog({
  deckslots,
  displayDeckId,
  displayDeckBanner,
  defaultImgURL,
  viewMode,
  setViewMode,
}: IChangeCardImageDialogProps) {
  const [selectedImageLink, setSelectedImageLink] = useState<string>(
    displayDeckBanner || defaultImgURL
  );

  // useEffect(() => {
  //   if (deckslots) {
  //     const selectedDeckslot = deckslots.find((slot) => slot.deck_id === displayDeckId);
  //     setSelectedImageLink(
  //       viewMode === 'en' ? selectedDeckslot?.image_link_en || defaultImgURL : selectedDeckslot?.image_link || defaultImgURL
  //     );
  //   }
  // }, [deckslots, displayDeckId, defaultImgURL, viewMode]);

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === 'en' ? 'kr' : 'en'));
  };

  const handleSelectChange = (value: string) => {
    const [deckId, imageLink] = value.split('|');
    setSelectedImageLink(imageLink);
    //todo add api call
  };
  const sortedSlots = deckslots?.sort((a, b) => {
    // const nameA = viewMode === 'en' ? a.name_eng : a.name_kr;
    // const nameB = viewMode === 'en' ? b.name_eng : b.name_kr;
    const nameA = a.name_eng;
    const nameB = b.name_eng;
    const colorA = a.color || '';
    const colorB = b.color || '';
    const codeA = a.code || '';
    const codeB = b.code || '';

    if (nameA !== nameB) {
      return nameA!.localeCompare(nameB!);
    }
    if (colorA !== colorB) {
      return colorA.localeCompare(colorB);
    }
    return codeA.localeCompare(codeB);
  });
  function handleDialogOpen(): void | undefined {
    setSelectedImageLink(displayDeckBanner || defaultImgURL);
  }
  return (
    <Dialog onOpenChange={handleDialogOpen}>
      <DialogTrigger>
        <div className="flex items-end space-x-2 hover:underline">
          <span>Change card image</span>
          <Pencil />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Change banner</DialogTitle>
          <DialogDescription>
            Change your deck&apos;s banner here. Click save when youre done.
          </DialogDescription>
        </DialogHeader>
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
        <Image
          src={selectedImageLink}
          width={500}
          height={500}
          alt="Uses default image if none selected."
        />
        <Select onValueChange={handleSelectChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a card" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Cards</SelectLabel>
              {sortedSlots?.map((deckslot) => (
                <SelectItem
                  key={deckslot.card_id.toString().concat(deckslot.board)}
                  value={[deckslot.deck_id, viewMode === 'en' ? deckslot.image_link_en : deckslot.image_link].join('|')}
                >
                  {Object.keys(colorMapping).includes(deckslot.color!.toLowerCase())
                    ? colorMapping[
                        deckslot.color?.toLowerCase() as keyof typeof colorMapping
                      ]
                    : ''} {viewMode === 'en' ? deckslot.name_eng : deckslot.name_kr} [{deckslot.code}]
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}