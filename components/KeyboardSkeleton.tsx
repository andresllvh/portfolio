// Pulsing outline that holds the 3D keyboard's place on phones until the
// WebGL scene is ready (styles in globals.css under .keyboard-skeleton).
export default function KeyboardSkeleton({ ready = false }: { ready?: boolean }) {
  return (
    <div className="keyboard-skeleton" data-ready={ready} aria-hidden>
      <div className="keyboard-skeleton__board">
        {Array.from({ length: 15 }, (_, i) => (
          <span
            key={i}
            className="keyboard-skeleton__key"
            style={{ animationDelay: `${(i % 5) * 90}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
