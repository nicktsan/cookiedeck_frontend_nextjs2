"use client"
import { DeckslotFindResponseDTO } from "@/services/deckslot/find/deckslot-find.dto";
import Link from "next/link";

interface DeckInfoProps {
    deckslots: DeckslotFindResponseDTO[] | undefined | null;
}

export default function DeckSlotDisplay({deckslots}: DeckInfoProps) {
    return (
    <div className="flex-1 flex flex-col gap-20 items-center">
        {deckslots?.map(deckslot => (
            <div>
                {deckslot.color}: {deckslot.name_eng} {deckslot.quantity}
            </div>
        ))}
    </div>
  );
}
