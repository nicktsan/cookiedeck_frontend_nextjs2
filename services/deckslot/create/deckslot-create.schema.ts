import {z} from "zod";
export const DeckslotCreateRequestSchema = z.object({
    deck_id: z.string().uuid({
        message: `deck_id must be a valid UUID`
    }),
    card_id: z.number({
        message: `card_id must be a number`
    }),
    board: z.enum(["main", "maybe"], {
        message: `board must be "main" or "maybe"`
    }).optional()
});

export const DeckslotCreateResponseDataSchema = z.object({
    deck_id: z.string().uuid({
        message: `deck_id must be a valid UUID`
    }).optional(),
    card_id: z.number({
        message: `card_id must be a number`
    }).optional(),
    board: z.enum(["main", "maybe"], {
        message: `board must be "main" or "maybe"`
    }).optional(),
    quantity: z.number().min(1).optional(),
    message: z.string().nullable().optional(),
    error: z.string().nullable().optional(),
})

export const DeckslotCreateResponseSchema = z.object({
	statusCode: z.number().min(100).max(599),
    data: DeckslotCreateResponseDataSchema
})