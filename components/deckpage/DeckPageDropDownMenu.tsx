import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DeleteDeckAlertDialog } from '../deckoptions/DeleteDeckAlertDialog';
import { useRef, useEffect, useState } from 'react';
import { IDeckIdProps } from '@/services/deck/deck.entity';

export function DeckPageDropDownMenu({ deckId }: IDeckIdProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentWidth, setContentWidth] = useState('auto');

  useEffect(() => {
    if (contentRef.current) {
      const width = contentRef.current.scrollWidth;
      setContentWidth(`${width}px`);
    }
  }, []);

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Options</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          ref={contentRef}
          style={{ width: contentWidth }}
          className="inline-block"
        >
          <DropdownMenuGroup>
            <DropdownMenuItem className="p-0" asChild>
              <DeleteDeckAlertDialog deckId={deckId} />
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
