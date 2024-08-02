"use client"
import { DeckslotFindResponseDTO } from "@/services/deckslot/find/deckslot-find.dto";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from 'lucide-react';
import { DeckslotUpdateQuantityRequestDTO, DeckslotUpdateQuantityResponseDataDTO } from "@/services/deckslot/update/quantity/deckslot-update-quantity.dto";
import { UpdateDeckSlotQuantity } from "@/services/deckslot/update/quantity/deckslot-update-quantity";
import Image from 'next/image';
import { useState } from "react";

interface DeckInfoProps {
    deckslots: DeckslotFindResponseDTO[] | undefined | null;
    onUpdate: () => Promise<void>;
    viewMode: 'en' | 'kr';
}

export default function DeckSlotDisplay({deckslots, onUpdate, viewMode}: DeckInfoProps) {
    const [currentImage, setCurrentImage] = useState<string>("");
    const updateQuantity = async (deckslot: DeckslotFindResponseDTO, change: number) => {
        try {
            const payload: DeckslotUpdateQuantityRequestDTO = {
                deck_id: deckslot.deck_id,
                card_id: deckslot.card_id,
                board: deckslot.board,
                changeValue: change
            }
            const response: DeckslotUpdateQuantityResponseDataDTO = await UpdateDeckSlotQuantity(payload)

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

    const handleMouseEnter = (imageLink: string) => {
        setCurrentImage(imageLink);
    };

    return (
        <div className="flex">
            <div className="relative w-96 h-96">
                <Image src={currentImage || ""} layout="fill" objectFit="contain" alt="Deckslot Image" />
            </div>
            <div className="grid grid-cols-3 gap-20 justify-items-center items-center"
            >
                {deckslots?.map(deckslot => 
                    viewMode ==='en' ?
                (
                    <div 
                        key={deckslot.card_id} 
                        onMouseEnter={() => handleMouseEnter(deckslot.image_link!)}
                    >
                        <span className="hover:underline">{deckslot.color}: {deckslot.name_eng} {deckslot.quantity}</span>
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
                ) :
                (
                    <div 
                        key={deckslot.card_id} 
                        onMouseEnter={() => handleMouseEnter(deckslot.image_link!)}
                    >
                        <span className="hover:underline">{deckslot.color}: {deckslot.name_kr} {deckslot.quantity}</span>
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
                )
            )}
            </div>
        </div>
    );
}