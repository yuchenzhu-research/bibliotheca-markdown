export interface Document {
    id: string;
    title: string;
    category: "Philosophy" | "History" | "Art" | "Technology";
    description: string;
    imageUrl: string;
    year: string;
    author: string;
}
