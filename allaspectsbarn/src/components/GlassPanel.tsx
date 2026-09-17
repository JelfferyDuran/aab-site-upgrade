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
      className={`aab-glass-warm rounded-3xl border backdrop-blur-2xl backdrop-saturate-150 ${className}`}
    >
      {children}
    </div>
  );
}
