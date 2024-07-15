import {z} from "zod";

export const CardEntitySchema = z.object({
	id: z.number(),
	name_kr: z.string().optional(),
	name_eng: z.string().optional(),
	code: z.string().optional(),
	rarity: z.string().optional(),
	rarity_abb: z.string().optional(),
	card_type: z.string().optional(),
	color: z.string().optional(),
	color_sub: z.string().optional(),
	card_level: z.number().nullable().optional(),
	plain_text_eng: z.string().optional(),
	plain_text: z.string().optional(),
	expansion: z.string().nullable().optional(),
	illustrator: z.string().optional(),
	link: z.string().optional(),
	image_link: z.string().optional(),
	name_eng_lower: z.string().optional(),
})

export type CardEntity = z.infer<typeof CardEntitySchema>