"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {DeckSearchBarDTO} from "@/services/deck/find/custom/deck-find-custom.dto"
import { DeckSearchBarSchema } from "@/services/deck/find/custom/deck-find-custom.schema";
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

export function DeckSearchBar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const form = useForm<DeckSearchBarDTO>({
    resolver: zodResolver(DeckSearchBarSchema),
  })

  async function onSubmit(data: DeckSearchBarDTO) {
    const params = new URLSearchParams(searchParams);
    if (data.name) {
      params.set('name', data.name.trim());
    } else {
      params.delete('name');
    }
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <div className="flex space-x-2">
                <FormControl className="flex-grow">
                  <Input placeholder="Search Decks" {...field} 
                    defaultValue={searchParams.get('name')?.toString()}
                  />
                </FormControl>
                <Button type="submit">Submit</Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}