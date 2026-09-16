/**
 * Light frosted-glass panel. Sits over a photograph and gives the copy on top
 * real contrast without darkening the whole hero — the photo stays the star.
 */
export default function GlassPanel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-3xl border border-white/60 bg-white/55 backdrop-blur-xl backdrop-saturate-150 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.55)] ${className}`}
    >
      {children}
    </div>
  );
}
