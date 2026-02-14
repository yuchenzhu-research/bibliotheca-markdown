import { cn } from "@/lib/utils";

interface BentoGridProps {
    className?: string;
    children?: React.ReactNode;
}

export const BentoGrid = ({ className, children }: BentoGridProps) => {
    return (
        <div
            className={cn(
                "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3",
                // "auto-rows-[18rem]" // Optional uniform height
                className
            )}
        >
            {children}
        </div>
    );
};
