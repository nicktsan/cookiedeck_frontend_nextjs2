"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

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

export function CardSearch() {
  const form = useForm<CardSearchRequestDTO>({
    resolver: zodResolver(CardSearchRequestSchema),
    // defaultValues: {
    //   username: "",
    // },
  })

  async function onSubmit(data: CardSearchRequestDTO) {
    // console.log(data);
    const cardRes = await CardFind(data)
    console.log(cardRes);
  }

  return (
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
  )
}
