import Diamond from "./Diamond";

export default function SectionDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="h-px flex-1 bg-line" />
      <Diamond />
      <div className="h-px flex-1 bg-line" />
    </div>
  );
}
