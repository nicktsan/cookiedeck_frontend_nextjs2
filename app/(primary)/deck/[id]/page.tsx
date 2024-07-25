"use client"
import { useState, useEffect, useCallback } from 'react';
import { DeckFindResponseDataDTO } from "@/services/deck/find/findDeckDTO";
import DeckInfo from "@/components/deckpage/DeckInfo";
import CardSearch from "@/components/deckpage/CardSearch";
import DeckSlotDisplay from "@/components/deckpage/DeckSlotDisplay";
import { DeckslotFindResponseDTO } from "@/services/deckslot/find/deckslot-find.dto";
import { FindDeck } from '@/services/deck/find/findDeck';
import { DeckSlotFindByDeckId } from '@/services/deckslot/find/bydeckId/deckslot-find-bydeckid';

export default function DeckView({ params }: { params: { id: string } }) {
  const [displayDeck, setDisplayDeck] = useState<DeckFindResponseDataDTO | undefined>(undefined);
  const [deckSlots, setDeckSlots] = useState<DeckslotFindResponseDTO[] | undefined | null>([]);
  const fetchDeckData = useCallback(async () => {
    const deckFindResponse: DeckFindResponseDataDTO = await FindDeck(params.id)
    // console.log("deckFindResponse: ", deckFindResponse);
    if (!deckFindResponse.error && deckFindResponse.id) {
      setDisplayDeck(deckFindResponse);
    }
  }, [params.id]);
  const fetchDeckSlots = useCallback(async () => {
    const deckSlotFindResponse = await DeckSlotFindByDeckId(params.id)
    // console.log("deckSlotFindResponse: ", deckSlotFindResponse);
    if (!deckSlotFindResponse.error && deckSlotFindResponse.deckslots) {
      setDeckSlots(deckSlotFindResponse.deckslots);
    }
  }, [params.id]);

  useEffect(() => {
    fetchDeckData();
    fetchDeckSlots();
  }, [fetchDeckData, fetchDeckSlots]);
  

  if (!displayDeck) {
    return (
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <div className="w-full">
          <div className="py-6 font-bold text-center">
            Deck not found for {params.id}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <DeckInfo displayDeck={displayDeck} />
      <CardSearch deckId={params.id} onUpdate={fetchDeckSlots} />
      <DeckSlotDisplay deckslots={deckSlots} onUpdate={fetchDeckSlots} />
    </div>
  );
}