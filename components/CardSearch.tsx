"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import React, { useMemo, useState } from 'react';
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { CardSearchRequestDTO, CardSearchResponseDTO, CardSearchResponseDataDTO } from "@/services/card/find/card-findDTO"
import { CardSearchRequestSchema, CardSearchResponseSchema, CardSearchResponseDataSchema } from "@/services/card/find/card-find.schema"
import { CardFind } from "@/services/card/find/card-find"
import { ScrollArea } from "./ui/scroll-area"
import { CardEntity } from "@/services/card/card.entity"
import { Separator } from "./ui/separator"
import { CreateDeckSlot } from "@/services/deckslot/create/createDeckSlot";

interface DeckIdProps {
  deckId: string | undefined;
}

// export default function DeckInfo({displayDeck}: DeckInfoProps) {
export default function CardSearch({deckId}: DeckIdProps) {
  const form = useForm<CardSearchRequestDTO>({
    resolver: zodResolver(CardSearchRequestSchema),
    // defaultValues: {
    //   username: "",
    // },
  })
  const [cardSearchResults, setCardSearchResults] = useState<CardEntity[]>([]);
  let scrollAreaClass = "hidden";
  if (cardSearchResults.length > 0) {
    scrollAreaClass = "h-72 w-72 rounded-md border";
  }
  const scrollAreaHeight = useMemo(() => {
    // Assuming each item (including separator) is roughly 3rem (48px) tall
    const itemHeight = 48;
    const maxHeight = 288; // 72 * 4 (assuming 1rem = 4px)
    const calculatedHeight = Math.min(cardSearchResults.length * itemHeight, maxHeight);
    return calculatedHeight;
  }, [cardSearchResults.length]);
  async function onSubmit(data: CardSearchRequestDTO) {
    // console.log(data);
    try {
      const res: CardEntity[] = await CardFind(data);
      if (Array.isArray(res)) {
        setCardSearchResults(res);
      } else {
        console.error('CardFind did not return an array');
        setCardSearchResults([]);
      }
    } catch (error) {
      console.error('Error fetching card data:', error);
      setCardSearchResults([]);
    }
  }

  const handleCardClick = async (card: CardEntity) => {
    // console.log(card);
    // const isDeckSlotCreated: boolean = 
    await CreateDeckSlot(card, deckId)
    //console.log(isDeckSlotCreated)
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cardname</FormLabel>
                <FormControl>
                  <Input placeholder="Find and add cards to main deck." {...field} />
                </FormControl>
                {/* <FormDescription>
                  This is your public display name.
                </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
      <ScrollArea className={scrollAreaClass} style={{ height: `${scrollAreaHeight}px` }}>
        <div className="p-4">
          {cardSearchResults.length > 0 ? (
            cardSearchResults.map((cardSearchResult) => (
              <React.Fragment key={cardSearchResult.id}>
                <div 
                  className={`
                    text-sm p-2 rounded cursor-pointer
                    transition-colors duration-200 ease-in-out
                    hover:bg-gray-100

                  `}
                  // ${selectedCard === cardSearchResult.id ? 'bg-gray-200' : ''}
                  onClick={() => handleCardClick(cardSearchResult)}
                >
                  {cardSearchResult.color}: {cardSearchResult.name_eng}
                </div>
                {/* <Separator className="my-2" /> */}
              </React.Fragment>
            ))
          ) : (
            <div className="text-sm text-gray-500">No results found</div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
