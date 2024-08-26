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
  displayDeckBanner: string | null | undefined;
  displayDeckBannerId: number | null | undefined;
  defaultImgURL: string;
  viewMode: 'en' | 'kr';
  setViewMode: React.Dispatch<React.SetStateAction<'en' | 'kr'>>;
  onBannerChange: (value: number) => void;
}

export function ChangeCardImageDialog({
  deckslots,
  displayDeckBanner,
  displayDeckBannerId,
  defaultImgURL,
  viewMode,
  setViewMode,
  onBannerChange,
}: IChangeCardImageDialogProps) {
  const [selectedImageLink, setSelectedImageLink] = useState<string>(
    displayDeckBanner || defaultImgURL,
  );
  const [bannerId, setBannerId] = useState(displayDeckBannerId);
  const [isValidBannerId, setIsValidBannerId] = useState(false);

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === 'en' ? 'kr' : 'en'));
  };

  const validateBannerId = (value: string) => {
    // Convert the value to a number
    const numberValue = Number(value);

    if (!numberValue || numberValue === displayDeckBannerId) {
      return false;
    }

    return true;
  };

  const handleSelectChange = (value: string) => {
    const [card_id, imageLink] = value.split('|');
    setSelectedImageLink(imageLink);
    setBannerId(Number(card_id));
    setIsValidBannerId(validateBannerId(card_id));
  };

  const updateBanner = async () => {
    // console.log('updating banner to ', bannerId);
    if (!isValidBannerId) return;
    onBannerChange(bannerId!);
  };

  const sortedSlots = deckslots?.sort((a, b) => {
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
    setBannerId(displayDeckBannerId);
    setIsValidBannerId(false);
  }
  return (
    <Dialog onOpenChange={handleDialogOpen}>
      <DialogTrigger>
        <div className="flex items-end space-x-2 hover:underline">
          <span>Change card image</span>
          <Pencil />
        </div>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[425px]">
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
                  value={[
                    deckslot.card_id,
                    viewMode === 'en' ? deckslot.image_link_en : deckslot.image_link,
                  ].join('|')}
                >
                  {Object.keys(colorMapping).includes(deckslot.color!.toLowerCase())
                    ? colorMapping[deckslot.color?.toLowerCase() as keyof typeof colorMapping]
                    : ''}{' '}
                  {viewMode === 'en' ? deckslot.name_eng : deckslot.name_kr} [{deckslot.code}]
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <DialogFooter>
          <Button onClick={updateBanner} type="submit" disabled={!isValidBannerId}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
