"use client"
import { DeckslotFindResponseDTO } from "@/services/deckslot/find/deckslot-find.dto";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from 'lucide-react';
import { IDeckslotUpdateQuantityRequestDTO, IDeckslotUpdateQuantityResponseDataDTO } from "@/services/deckslot/update/quantity/deckslot-update-quantity.dto";
import { UpdateDeckSlotQuantity } from "@/services/deckslot/update/quantity/deckslot-update-quantity";

interface DeckInfoProps {
    deckslots: DeckslotFindResponseDTO[] | undefined | null;
    onUpdate: () => Promise<void>;
}

export default function DeckSlotDisplay({deckslots, onUpdate}: DeckInfoProps) {
    const updateQuantity = async (deckslot: DeckslotFindResponseDTO, change: number) => {
        try {
            const payload: IDeckslotUpdateQuantityRequestDTO = {
                deck_id: deckslot.deck_id,
                card_id: deckslot.card_id,
                board: deckslot.board,
                changeValue: change
            }
            const response: IDeckslotUpdateQuantityResponseDataDTO = await UpdateDeckSlotQuantity(payload)

            if (response.error) {
                throw new Error('Failed to update deckslot');
            }

            // Call the onUpdate function to refresh the deckslots in the parent component
            await onUpdate();
        } catch (error) {
            console.error('Error updating deckslot:', error);
            // You might want to show an error message to the user here
        }
    };

    return (
        <div className="flex-1 flex flex-col gap-20 items-center">
            {deckslots?.map(deckslot => (
                <div>
                    {deckslot.color}: {deckslot.name_eng} {deckslot.quantity}
                    <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => updateQuantity(deckslot, 1)}
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                    <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => updateQuantity(deckslot, -1)}
                    >
                        <Minus className="h-4 w-4" />
                    </Button>
                </div>
            ))}
        </div>
    );
}