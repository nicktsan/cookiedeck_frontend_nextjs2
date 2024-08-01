"use client"
import { DeckFindResponseDataDTO } from "@/services/deck/find/findDeckDTO";
import { FaEye } from "react-icons/fa";

interface DeckInfoProps {
    displayDeck: DeckFindResponseDataDTO | undefined;
  }

export default function DeckInfo({displayDeck}: DeckInfoProps) {
    return (
    <div className="flex flex-col items-start px-[1vw] md:px-[10vw] lg:px-[10vw]">
      <div className="py-6 font-bold">
          <h2>{displayDeck!.creator_username}</h2>
          <h1>{displayDeck!.name}</h1>
          <p className="font-normal">{displayDeck!.description}</p>
          <p className="flex flex-row items-center">
              <FaEye />
              <span className="ml-2">{displayDeck!.views}</span>
          </p>
      </div>
    </div>
  );
}
