import { z } from "zod"

export const DeckEntity = z.object({
    id: z.string().uuid({
		message: `creator_id must be a valid UUID`,
	}),
	name: z.string().min(3).optional(),
	creator_id: z.string().uuid({
		message: `creator_id must be a valid UUID`,
	}).optional(),
	folder_id: z.string().uuid({
		message: `creator_id must be a valid UUID`,
	}).nullable().optional(),
	banner: z.number().nullable().optional(),
    description: z.string().nullable().optional(),
	views: z.number().min(1).optional(),
	visibility: z.enum(["public", "private", "unlisted"], {
		message: "Visibility must be a valid value.",
	  }).optional(),
	created_at: z.string().datetime().nullable().optional(),
	updated_at: z.string().datetime().nullable().optional(),
})