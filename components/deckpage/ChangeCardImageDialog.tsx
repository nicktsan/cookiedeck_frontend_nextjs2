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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pencil } from 'lucide-react';
import { DeckslotFindResponseDTO } from '@/services/deckslot/find/deckslot-find.dto';

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
  //todo add card image change functionality
  return (
    <Dialog>
      <DialogTrigger>
        <div className="flex items-end space-x-2 hover:underline">
          <span>Change card image</span>
          <Pencil />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change banner</DialogTitle>
          <DialogDescription>
            Change your deck&apos;s banner here. Click save when youre done.
          </DialogDescription>
        </DialogHeader>
        {/* todo make Image Preview change to the url of the selected card */}
        {/* todo add language toggle */}
        <Image
          src={displayDeckBanner || defaultImgURL}
          width={500}
          height={500}
          alt="Uses default image if none selected."
        />
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Cards</SelectLabel>
              {/* todo Dynamically generate SelectItems from deckslots with 
              value={deckslots[i].id + " " + deckslots[i].image_link/deckslots[i].image_link_en
              and Text={deckslots[i].name_eng/name_kr}}*/}
              {/* todo change displayed information based on language toggle*/}
              {deckslots?.map((deckslot) => (
                <SelectItem
                  key={deckslot.card_id.toString().concat(deckslot.board)}
                  value={[deckslot.deck_id, deckslot.image_link].join('|')}
                >
                  {deckslot.name_eng}
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
