import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DeckSlotDropDownProps } from "./DeckSlotDropDownMenu"

export function ChangeSlotQuantityDialog({ deckslotUpdateQuantityParams, onUpdate, viewMode }: DeckSlotDropDownProps) {
  let cardNameDisplay = deckslotUpdateQuantityParams.card_name_eng
  if (viewMode === 'kr') {
    cardNameDisplay = deckslotUpdateQuantityParams.card_name_kr
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="text-black hover:bg-gray-200 w-full px-2 py-2 cursor-pointer rounded-sm">
          Add/Remove one or more
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>How many {cardNameDisplay} do you want to add/remove?</DialogTitle>
          <DialogDescription>
            Enter an integer value. Negative values will remove cards from the deck.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="changeValue" className="text-right">
            Change Value
          </Label>
          <Input
            id="changeValue"
            defaultValue="2"
            className="col-span-3"
          />
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
