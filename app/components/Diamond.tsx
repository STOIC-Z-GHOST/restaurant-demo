export default function Diamond({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block w-1.5 h-1.5 rotate-45 bg-accent shrink-0 ${className}`}
    />
  );
}
