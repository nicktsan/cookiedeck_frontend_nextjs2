import {z} from "zod";
export const IDeckslotUpdateQuantityRequestSchema = z.object({
    deck_id: z.string().uuid({
        message: "deck_id must be a valid UUID."
    }),
    card_id: z.number({
        message: "card_id must be a number."
    }),
    board: z.enum(["main", "maybe"], {
        message: `board must be 'main' or 'maybe'.`
    }).optional(),
    changeValue: z.number().int({
        message: "changeValue must be an integer."
    }),
})

export const IDeckslotUpdateQuantityResponseDataSchema = z.object({
    deck_id: z.string().uuid({
        message: "deck_id must be a valid UUID."
    }).optional(),
    card_id: z.number({
        message: "card_id must be a number."
    }).optional(),
    board: z.enum(["main", "maybe"], {
        message: `board must be 'main' or 'maybe'.`
    }).optional(),
    quantity: z.number({
        message: "quantity must be a number."
    }).optional(),
    message: z.string().optional(),
    error: z.string().optional(),
})

export const IDeckslotUpdateQuantityResponseSchema = z.object({
	statusCode: z.number().min(100).max(599),
    data: IDeckslotUpdateQuantityResponseDataSchema
})