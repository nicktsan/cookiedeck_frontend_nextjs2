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
import { DeckslotUpdateQuantityRequestNoChangeParams } from '@/services/deckslot/update/quantity/deckslot-update-quantity.dto';

export interface DeckSlotDropDownProps {
  deckslotUpdateQuantityParams: DeckslotUpdateQuantityRequestNoChangeParams;
  onUpdate: () => void;
  viewMode: 'en' | 'kr';
}

export function DeckSlotDropDownMenu({
  deckslotUpdateQuantityParams,
  onUpdate,
  viewMode,
}: DeckSlotDropDownProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentWidth, setContentWidth] = useState('auto');

  useEffect(() => {
    if (contentRef.current) {
      const width = contentRef.current.scrollWidth;
      setContentWidth(`${width}px`);
    }
  }, []);

  return (
    <div className="mx-2">
      <DropdownMenu>
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
                deckslotUpdateQuantityParams={deckslotUpdateQuantityParams}
                onUpdate={onUpdate}
                viewMode={viewMode}
              />
            </DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
