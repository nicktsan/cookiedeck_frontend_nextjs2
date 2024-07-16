"use client"
import { DeckFindResponseDataDTO } from "@/services/deck/find/findDeckDTO";
import { FaEye } from "react-icons/fa";

interface DeckInfoProps {
    displayDeck: DeckFindResponseDataDTO | undefined;
  }

export default function DeckInfo({displayDeck}: DeckInfoProps) {
    return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <div className="w-full">
        <div className="py-6 font-bold text-center">
            Deck View page for {displayDeck!.id}
            <p>{displayDeck!.creator_username}</p>
            <p>{displayDeck!.name}</p>
            <p>{displayDeck!.description}</p>
            <div className="flex-2 flex-row">
                {/* todo fix eye */}
                <FaEye /> 
                <p>{displayDeck!.views}</p>
            </div>
            
        </div>
      </div>
    </div>
  );
}
