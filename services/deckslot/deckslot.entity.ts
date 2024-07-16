import {z} from "zod"
export const DeckSlotEntitySchema = z.object({
    // id: "not a real id it's just here to satisfy IEntity"
    deck_id: z.string().uuid({
        message: "deck_id must be a valid UUID"
    }),
    card_id: z.number({
        message: "card_id must be a number"
    }),
    quantity: z.number({
        message: "quantity must be a number"
    }).optional(),
    board: z.enum(["main", "maybe"], {
        message: `board must be "main" or "maybe"`
    }).optional(),
    created_at: z.string().datetime().optional(),
    updated_at: z.string().datetime().optional(),
})

export type DeckSlotEntity = z.infer<typeof DeckSlotEntitySchema>