export function Skeleton({ className = '' }) {
  return (
    <div className={`relative overflow-hidden rounded-[8px] bg-white/10 ${className}`}>
      <div className="absolute inset-y-0 w-1/2 animate-shimmer bg-gradient-to-r from-transparent via-white/15 to-transparent" />
    </div>
  );
}
