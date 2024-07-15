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

export function CardSearch() {
  const form = useForm<CardSearchRequestDTO>({
    resolver: zodResolver(CardSearchRequestSchema),
    // defaultValues: {
    //   username: "",
    // },
  })
  const [cardSearchResults, setCardSearchResults] = useState<CardEntity[]>([]);
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
      <ScrollArea className="h-72 w-72 rounded-md border" style={{ height: `${scrollAreaHeight}px` }}>
        <div className="p-4">
          {cardSearchResults.length > 0 ? (
            cardSearchResults.map((cardSearchResult) => (
              <React.Fragment key={cardSearchResult.id}>
                <div className="text-sm">
                  {cardSearchResult.color}: {cardSearchResult.name_eng}
                </div>
                <Separator className="my-2" />
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
