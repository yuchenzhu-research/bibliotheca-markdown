import { defineCollection, z } from 'astro:content';

const papers = defineCollection({
    type: 'content',
    schema: ({ image }) => z.object({
        title: z.string(),
        authors: z.string(),
        date: z.string().or(z.date()).transform((val) => new Date(val)),
        abstract: z.string(),
        pdf_link: z.string(),
        cover: image().optional(),
    }),
});

export const collections = { papers };
