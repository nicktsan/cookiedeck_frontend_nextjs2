import {z} from "zod";
import { DeckEntitySchema } from "../../deck.entity";

export const DeckSearchBarSchema = z.object({
    name: z.string().min(2, {
        message: "name must be a string of at least 2 length."
    })
})

const allowedFields = ["name", "creator_id", "username", "created_at", "updated_at", "folder_id", "banner",
            "description", "views", "visibility"] as const;
export const DeckFindCustomRequestSchema = z.object({
    select: z.array(
        z.enum(allowedFields)
      ).refine(
        (arr) => arr.length > 0,
        { message: "Array must contain at least one element" }
      ).refine(
        (arr) => new Set(arr).size === arr.length,
        { message: "Array must not contain duplicate elements" }
      ).optional(),
    name: z.string().min(2, {
        message: "name must be a string of at least length 2"
    }).optional(),
    creator: z.string().min(2, {
        message: "creator must be a string of at least length 2"
    }).optional(),
    nameOrderDirection: z.enum(["asc", "desc"], {
        message: "orderByName must be either asc or desc"
    }).optional(),
    updatedAtOrderDirection: z.enum(["asc", "desc"], {
        message: "orderByUpdatedAt must be either asc or desc"
    }).optional(),
})

export const DeckFindCustomResponseDataSchema = z.object({
	decks: z.array(DeckEntitySchema, {
        message: "decks is required"
    }).nullable().optional(),
	message: z.string({
        message: "message is required"
    }).optional(),
	error: z.string({
        message: "error is required"
    }).optional(),
})

export const DeckFindCustomResponseSchema = z.object({
	statusCode: z.number({
        required_error: "statusCode is required"
    }).min(100).max(599),
    data: DeckFindCustomResponseDataSchema
})