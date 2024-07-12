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
import { toast } from "@/components/ui/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { CreateDeck } from "@/actions/deck/createDeck"
import { IDeckCreateResponseDto } from "@/actions/deck/createDeckDTO"
import { useRouter } from 'next/navigation'

const folders = [
  { label: "No folder", value: " " },//Select Items cannot have an empty value. We will get rid of leading and trailing whitespace on form submit.
] as const

const visibilities = [
  { label: "Public", value: "public" },
  { label: "Private", value: "private" },
  { label: "Unlisted", value: "unlisted" },
] as const

export const formSchema = z.object({
  name: z.string().min(3, {
    message: "name must be at least 3 characters.",
  }),
  folder: z.string({
    message: "Folder must be a string.",
  }),
  visibility: z.enum(["public", "private", "unlisted"], {
    message: "Visibility must be a valid value.",
  }),
  description: z.string().optional(),
})

export function CreateDeckForm() {
  const router = useRouter();
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      folder: "",
      visibility: "public",
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // console.log(values)
    const res: IDeckCreateResponseDto = await CreateDeck(values)
    // console.log("res")
    // console.log(res)
    // console.log("res data: ")
    // console.log(res.data)
    // export interface IDeckCreateResponseData {
    //   id?: string;
    //   message?: string;
    //     error?: string;
    // }
    
    // export interface IDeckCreateResponseDto {
    //   statusCode: number;
    //     data: IDeckCreateResponseData;
    // }
    if (res.data.id) {
      router.push(`/deck/${res.data.id}`)
    }
    if (res.data.error){
      // console.log(res.data.error)
      toast({
        title: "Error",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(res, null, 2)}</code>
          </pre>
        ),
        // variant: "destructive",
      })
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your deck's name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="folder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Folder</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="No folder" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {folders.map((folder) => (
                    <SelectItem value={folder.value}>{folder.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                The folder where this deck will be contained.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="visibility"
          render={({ field }) => (
            <FormItem>
              <FormLabel>visibility</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Public" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {visibilities.map((visibility) => (
                    <SelectItem value={visibility.value}>{visibility.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Public decks are visible to everyone.
                Private decks are visible only to you.
                Unlisted decks are visible to everyone but not searchable.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Deck description."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}