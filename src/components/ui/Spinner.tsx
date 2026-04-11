export function Spinner({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <div className="absolute inset-0 border-2 border-gray-800 rounded-full" />
      <div
        className="absolute inset-0 border-2 border-transparent border-t-red-600 rounded-full animate-spin"
        style={{ animationDuration: '0.6s' }}
      />
    </div>
  );
}
