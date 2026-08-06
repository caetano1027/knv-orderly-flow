import { motion } from "motion/react";
import { Plus } from "lucide-react";
import { brl } from "@/lib/format";

type Props = {
  nome: string;
  descricao: string;
  imagem: string;
  preco: number;
  prefixoPreco?: string | undefined;
  selo?: string | undefined;
  onClick: () => void;
};

export function ProductCard({
  nome,
  descricao,
  imagem,
  preco,
  prefixoPreco,
  selo,
  onClick,
}: Props) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="group sombra-card relative flex w-full items-center gap-4 overflow-hidden rounded-2xl border border-border bg-card p-3 text-left transition-colors hover:border-primary/60"
    >
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl sm:h-28 sm:w-28">
        <img
          src={imagem}
          alt={nome}
          loading="lazy"
          width={800}
          height={800}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {selo ? (
          <span className="w-fit rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
            {selo}
          </span>
        ) : null}
        <h3 className="truncate text-base font-bold text-foreground">{nome}</h3>
        <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">{descricao}</p>
        <div className="mt-1 flex items-center gap-2">
          {prefixoPreco ? (
            <span className="text-[11px] text-muted-foreground">{prefixoPreco}</span>
          ) : null}
          <span className="text-base font-extrabold text-accent">{brl(preco)}</span>
        </div>
      </div>

      <span className="gradiente-fogo grid h-9 w-9 shrink-0 place-items-center rounded-full text-primary-foreground transition-transform duration-200 group-hover:scale-110">
        <Plus className="h-5 w-5" />
      </span>
    </motion.button>
  );
}
