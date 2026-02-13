import { defineCollection, z } from 'astro:content';

const exhibits = defineCollection({
    type: 'content',
    schema: ({ image }) => z.object({
        title: z.string(),
        description: z.string(),
        // Transform string to Date object
        date: z.string().or(z.date()).transform((val) => new Date(val)),
        tags: z.array(z.string()).optional(),
        cover: image().optional(),
        author: z.string().default('Anonymous Artist'),
        image: z.string().optional(), // maintaining compatibility for now
    }),
});

export const collections = { exhibits };
