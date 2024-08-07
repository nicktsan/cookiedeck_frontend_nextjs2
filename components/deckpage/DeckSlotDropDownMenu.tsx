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
import { DeckslotDeleteResponseDataDTO } from '@/services/deckslot/delete/deckslot-delete.dto';
import { ErrorResponseDataDTO } from '@/utils/error.schema';

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
  const handleDelete = async () => {
    try {
      // Adjust the URL and parameters based on your API
      // await axios.delete(`/api/deckslot/${deckslotParams.id}`);
      const deleteResponse: DeckslotDeleteResponseDataDTO | ErrorResponseDataDTO =
        await DeleteDeckSlot(deckslotParams);
      handleUpdate(); // Update after deletion
      // todo handle errorresponse
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
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <ChangeSlotQuantityDialog
                deckslotParams={deckslotParams}
                onUpdate={handleUpdate}
                viewMode={viewMode}
                closeParentDropdown={() => setIsDropdownOpen(false)}
              />
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div
                className="w-full cursor-pointer rounded-sm p-2 text-red-500 hover:bg-red-500 hover:text-white"
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
