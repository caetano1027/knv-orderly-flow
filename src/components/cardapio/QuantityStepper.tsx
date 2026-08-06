import { Minus, Plus } from "lucide-react";

export function QuantityStepper({
  valor,
  onChange,
  min = 1,
}: {
  valor: number;
  onChange: (v: number) => void;
  min?: number;
}) {
  return (
    <div className="flex items-center gap-1 rounded-full border border-border bg-secondary p-1">
      <button
        type="button"
        aria-label="Diminuir quantidade"
        onClick={() => onChange(Math.max(min, valor - 1))}
        className="grid h-8 w-8 place-items-center rounded-full text-foreground transition-colors hover:bg-background active:scale-95 disabled:opacity-40"
        disabled={valor <= min}
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-6 text-center text-sm font-bold tabular-nums">{valor}</span>
      <button
        type="button"
        aria-label="Aumentar quantidade"
        onClick={() => onChange(valor + 1)}
        className="grid h-8 w-8 place-items-center rounded-full text-foreground transition-colors hover:bg-background active:scale-95"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
