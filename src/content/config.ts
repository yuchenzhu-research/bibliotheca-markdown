import { defineCollection, z } from 'astro:content';

const exhibits = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string(),
        // Transform string to Date object
        date: z.string().or(z.date()).transform((val) => new Date(val)),
        tags: z.array(z.string()).optional(),
        cover: z.string().optional(),
        author: z.string().default('Anonymous Artist'),
        image: z.string().optional(), // maintaining compatibility for now, though cover is preferred
    }),
});

export const collections = { exhibits };
