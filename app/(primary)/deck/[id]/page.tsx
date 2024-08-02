"use client"
import { useState, useEffect, useCallback } from 'react';
import { DeckFindResponseDataDTO } from "@/services/deck/find/findDeckDTO";
import DeckInfo from "@/components/deckpage/DeckInfo";
import CardSearch from "@/components/deckpage/CardSearch";
import DeckSlotDisplay from "@/components/deckpage/DeckSlotDisplay";
import { DeckslotFindResponseDTO } from "@/services/deckslot/find/deckslot-find.dto";
import { FindDeck } from '@/services/deck/find/findDeck';
import { DeckSlotFindByDeckId } from '@/services/deckslot/find/bydeckId/deckslot-find-bydeckid';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function DeckView({ params }: { params: { id: string } }) {
  const [displayDeck, setDisplayDeck] = useState<DeckFindResponseDataDTO | undefined>(undefined);
  const [deckSlots, setDeckSlots] = useState<DeckslotFindResponseDTO[] | undefined | null>([]);
  const [viewMode, setViewMode] = useState<'en' | 'kr'>('en');

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
  
  const toggleViewMode = () => {
    setViewMode(prev => prev === 'en' ? 'kr' : 'en');
  };

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
      <div className="flex justify-center items-center space-x-2 mb-4">
        <Switch id="view-mode" onCheckedChange={toggleViewMode} />
        <Label htmlFor="view-mode">
          {viewMode === 'en' ? 'EN' : 'KR'}
        </Label>
      
        <CardSearch deckId={params.id} onUpdate={fetchDeckSlots} viewMode={viewMode} />
      </div>
      <DeckSlotDisplay deckslots={deckSlots} onUpdate={fetchDeckSlots} viewMode={viewMode}/>
    </div>
  );
}