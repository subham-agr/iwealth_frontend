interface MetricTileProps {
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "positive" | "negative" | "neutral";
}

const toneClasses = {
  default: "text-slate-900",
  positive: "text-emerald-600",
  negative: "text-rose-600",
  neutral: "text-slate-600",
};

export default function MetricTile({
  label,
  value,
  hint,
  tone = "default",
}: MetricTileProps) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className={`mt-1 text-2xl font-semibold ${toneClasses[tone]}`}>
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}
