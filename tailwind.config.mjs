/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            colors: {
                'museum-bg': '#1a1a1a',      // Dark charcoal background
                'museum-gold': '#d4af37',    // Gold leaf for borders/accents
                'museum-crimson': '#800020', // Burgundy for highlights
                'museum-paper': '#f4e4bc',   // Parchment for cards
                'museum-ink': '#2c2c2c',     // Ink black for text
            },
            fontFamily: {
                display: ['Cinzel', 'serif'],
                body: ['EB Garamond', 'serif'],
            },
            boxShadow: {
                'frame': '0 10px 30px -10px rgba(0, 0, 0, 0.5), 0 0 0 1px #d4af37',
            },
            backgroundImage: {
                'noise': "url('/noise.png')", // Placeholder for noise texture.
            }
        },
    },
    plugins: [],
}
