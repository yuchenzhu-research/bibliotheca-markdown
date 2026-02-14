import { HeroSection } from "@/components/home/HeroSection";
import { ArchiveGallery } from "@/components/archive/ArchiveGallery";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/20 pb-20">
      <HeroSection />

      <section className="container mx-auto px-4 md:px-8">
        <h2 className="mb-12 text-center font-serif text-3xl text-muted-foreground">
          Curated Collection
        </h2>
        <ArchiveGallery />
      </section>
    </main>
  );
}
