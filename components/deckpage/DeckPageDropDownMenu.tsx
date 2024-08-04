import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DeleteDeckAlertDialog } from '../deckoptions/DeleteDeckAlertDialog';
interface DeckIdProps {
  deckId: string;
}
export function DeckPageDropDownMenu({ deckId }: DeckIdProps) {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Options</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {/* marking DropdownMenuItem with asChild prevents DeleteDeckAlertDialog from closing after clicking on it,
                even if it is inside a DropdownMenuItem*/}
            <DropdownMenuItem asChild>
              <DeleteDeckAlertDialog deckId={deckId} />
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
