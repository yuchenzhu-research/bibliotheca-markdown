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
        text_theme: z.enum(['light', 'dark']).default('dark'),
        layout_style: z.enum(['overlay', 'split']).default('overlay'),
    }),
});

const gallery = defineCollection({
    type: 'content',
    schema: ({ image }) => z.object({
        title: z.string(),
        author: z.string(),
        date: z.string().or(z.date()).transform((val) => new Date(val)),
        milestone: z.string(),
        abstract: z.string(),
        pdf_link: z.string(),
        cover: image(),
    }),
});

const papers = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        authors: z.string(),
        date: z.string(),
        abstract: z.string(),
        pdf_link: z.string(),
        cover: z.string().optional(),
    }),
});

export const collections = { exhibits, gallery, papers };
