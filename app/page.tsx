import { HeroSection } from "@/components/home/HeroSection";
import {
  AletImageCard,
  HorizontalScrollSection,
} from "@/components/archive/AletImageCard";
import { ArrowRight, ChevronRight } from "lucide-react";
import { documents } from "@/app/data/mock-documents";

export default function Home() {
  return (
    <main className="min-h-screen bg-warm-paper selection:bg-primary/20">
      <HeroSection />

      {/* ===== Horizontal Scroll Section - Featured Works ===== */}
      <HorizontalScrollSection>
        {/* Image cards with floating text elements - Alet style */}
        <div className="flex-none w-[550px]">
          <AletImageCard
            title="The Vitruvian Man"
            description="A study of the proportions of the human body."
            year="1490"
            author="Leonardo da Vinci"
            imageUrl="/archive/davinci.jpg"
            floatingTexts={{
              topLeft: "Renaissance",
              bottomLeft: "Florence",
              bottomRight: "Proportion",
            }}
            aspectRatio="video"
            className="h-[65vh]"
            focalPoint="100% 35%"
          />
        </div>

        <div className="flex-none w-[550px]">
          <AletImageCard
            title="De Revolutionibus"
            description="On the Revolutions of the Heavenly Spheres."
            year="1543"
            author="Nicolaus Copernicus"
            imageUrl="/archive/copernicus.jpg"
            floatingTexts={{
              topLeft: "Astronomy",
              centerLeft: "Heliocentrism",
              bottomRight: "Poland",
            }}
            aspectRatio="video"
            className="h-[65vh]"
            focalPoint="95% 35%"
          />
        </div>

        <div className="flex-none w-[550px]">
          <AletImageCard
            title="The Republic"
            description="A Socratic dialogue concerning justice."
            year="375 BC"
            author="Plato"
            imageUrl="/archive/plato.jpg"
            floatingTexts={{
              topLeft: "Philosophy",
              centerLeft: "Idealism",
              bottomRight: "Athens",
            }}
            aspectRatio="video"
            className="h-[65vh]"
            focalPoint="50% 15%"
          />
        </div>
      </HorizontalScrollSection>

      {/* ===== Archive Grid Section - Minimal Style ===== */}
      <section className="container mx-auto px-4 py-20">
        {/* Section Header - Alet style */}
        <div className="mb-16">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-decorative text-muted-foreground/60 block mb-3">
                Complete Collection
              </span>
              <h2 className="font-epic-serif text-4xl md:text-5xl text-foreground font-light">
                Browse Archive
              </h2>
            </div>

            <button className="hidden md:flex items-center gap-3 px-6 py-3 border border-foreground/20 hover:border-foreground/40 transition-colors duration-300">
              <span className="font-sans text-sm tracking-widest uppercase">
                View All
              </span>
              <ArrowRight className="w-4 h-4 opacity-60" />
            </button>
          </div>
        </div>

        {/* Document Grid - Bento style but cleaner */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-foreground/5 border border-foreground/5">
          {documents.slice(0, 6).map((doc, index) => (
            <div
              key={doc.id}
              className="group relative aspect-square overflow-hidden bg-card"
            >
              <AletImageCard
                title={doc.title}
                description={doc.description}
                year={doc.year}
                author={doc.author}
                imageUrl={doc.imageUrl}
                floatingTexts={
                  index === 0
                    ? { topLeft: doc.category }
                    : { topLeft: doc.category }
                }
                aspectRatio="square"
                className="h-full w-full border-none"
                focalPoint={doc.focalPoint} // Use dynamic focal point from data
              />
            </div>
          ))}
        </div>

        {/* Mobile "View All" button */}
        <button className="md:hidden w-full mt-8 flex items-center justify-center gap-3 px-6 py-4 border border-foreground/20">
          <span className="font-sans text-sm tracking-widest uppercase">
            View All Documents
          </span>
          <ArrowRight className="w-4 h-4 opacity-60" />
        </button>
      </section>

      {/* ===== Manifesto Section - Editorial Style ===== */}
      <section className="container mx-auto px-4 py-20 border-t border-foreground/5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Decorative */}
          <div className="hidden lg:block lg:col-span-2">
          </div>

          {/* Center: Manifesto Content */}
          <div className="lg:col-span-6">
            <span className="text-decorative text-muted-foreground/60 block mb-6">
              Our Mission
            </span>
            <h3 className="font-epic-serif text-3xl md:text-4xl text-foreground font-light leading-tight mb-8">
              Preserving human knowledge through digital craftsmanship
            </h3>
            <p className="font-elegant-sans text-lg text-muted-foreground/80 leading-relaxed mb-6">
              Each document tells a story of discovery, insight, and the
              relentless pursuit of understanding. We believe that knowledge
              should be accessible, beautiful, and enduring.
            </p>
            <button className="group flex items-center gap-3 mt-8">
              <span className="font-sans text-sm tracking-widest uppercase">
                Read More
              </span>
              <ChevronRight className="w-4 h-4 opacity-60 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Right: Vertical decorative elements */}
          <div className="hidden lg:block lg:col-span-4 relative">
            <div className="absolute top-0 right-0">
              <span className="font-sans text-xs tracking-[0.3em] text-muted-foreground/40 uppercase writing-mode-vertical">
                Bibliotheca Academica
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Footer - Simple & Minimal ===== */}
      <footer className="container mx-auto px-4 py-12 border-t border-foreground/5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <span className="font-serif text-xl text-foreground">
              Bibliotheca Academica
            </span>
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="font-sans text-sm text-muted-foreground/60">
              Since 2024
            </span>
          </div>

          <nav className="flex items-center gap-8">
            <a
              href="#"
              className="font-sans text-sm text-muted-foreground/60 hover:text-foreground transition-colors"
            >
              Archive
            </a>
            <a
              href="#"
              className="font-sans text-sm text-muted-foreground/60 hover:text-foreground transition-colors"
            >
              About
            </a>
            <a
              href="#"
              className="font-sans text-sm text-muted-foreground/60 hover:text-foreground transition-colors"
            >
              Contact
            </a>
          </nav>
        </div>
      </footer>
    </main>
  );
}