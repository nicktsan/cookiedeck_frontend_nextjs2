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
    // Group the objects by card_type
    const groupedByCardType = deckslots?.reduce((acc, deckslot) => {
        const key = deckslot.card_type || "undefined";
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(deckslot);
        return acc;
    }, {} as Record<string, DeckslotFindResponseDTO[]>);
    
    const [currentImage, setCurrentImage] = useState<string>("");

    const updateQuantity = async (deckslot: DeckslotFindResponseDTO, change: number) => {
        try {
            const payload: DeckslotUpdateQuantityRequestDTO = {
                deck_id: deckslot.deck_id,
                card_id: deckslot.card_id,
                board: deckslot.board,
                changeValue: change
            };
            const response: DeckslotUpdateQuantityResponseDataDTO = await UpdateDeckSlotQuantity(payload);

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
                <Image src={currentImage || ""} layout="fill" objectFit="contain" alt="" />
            </div>
            {/* <div className="grid grid-cols-3 gap-20 justify-items-center items-center"> */}
            <div className="grid grid-cols-3 gap-20 justify-items-stretch">
                {groupedByCardType && Object.entries(groupedByCardType).map(([card_type, slots]) => (
                    <div key={card_type} className="w-full">
                        <h2 className="text-xl font-bold mb-4">{card_type}</h2>
                        {slots.map(deckslot =>
                            viewMode === 'en' ? (
                                <div 
                                    key={deckslot.card_id}
                                    className="flex items-center justify-between"
                                    onMouseEnter={() => handleMouseEnter(deckslot.image_link!)}
                                >
                                    <span className="flex-shrink-0 hover:underline">{deckslot.quantity} {deckslot.name_eng}</span>
                                    <div className="flex space-x-2">
                                        <Button 
                                            variant="outline" 
                                            size="icon"
                                            className="h-auto"
                                            onClick={() => updateQuantity(deckslot, 1)}
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                        <Button 
                                            variant="outline" 
                                            size="icon"
                                            className="h-auto"
                                            onClick={() => updateQuantity(deckslot, -1)}
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div 
                                    key={deckslot.card_id}
                                    className="flex items-center justify-between"
                                    onMouseEnter={() => handleMouseEnter(deckslot.image_link!)}
                                >
                                    <span className="flex-shrink-0 hover:underline">{deckslot.quantity} {deckslot.name_kr}</span>
                                    <div className="flex space-x-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-auto"
                                            onClick={() => updateQuantity(deckslot, 1)}
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-auto"
                                            onClick={() => updateQuantity(deckslot, -1)}
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
