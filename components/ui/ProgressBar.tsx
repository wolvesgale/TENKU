export default function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
      <div
        className={`h-full bg-gradient-to-r from-brand-teal to-brand-blue`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
