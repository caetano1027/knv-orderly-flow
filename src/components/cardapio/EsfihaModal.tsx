import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { QuantityStepper } from "./QuantityStepper";
import { getEsfiha } from "@/config/menu";
import { brl } from "@/lib/format";
import type { EsfihaItem } from "@/lib/cart";

type Props = {
  aberto: boolean;
  onFechar: () => void;
  esfihaId: string | null;
  itemEdicao: EsfihaItem | null;
  onConfirmar: (dados: Omit<EsfihaItem, "uid">, uid?: string) => void;
};

export function EsfihaModal({ aberto, onFechar, esfihaId, itemEdicao, onConfirmar }: Props) {
  const [quantidade, setQuantidade] = useState(1);
  const [observacao, setObservacao] = useState("");

  const id = itemEdicao?.esfihaId ?? esfihaId;
  const esfiha = id ? getEsfiha(id) : undefined;

  useEffect(() => {
    if (!aberto) return;
    setQuantidade(itemEdicao?.quantidade ?? 1);
    setObservacao(itemEdicao?.observacao ?? "");
  }, [aberto, itemEdicao]);

  if (!esfiha) return null;

  return (
    <Dialog open={aberto} onOpenChange={(o) => !o && onFechar()}>
      <DialogContent className="max-h-[92vh] gap-0 overflow-hidden p-0 sm:max-w-md">
        <div className="relative h-40 w-full shrink-0 overflow-hidden">
          <img
            src={esfiha.imagem}
            alt={esfiha.nome}
            className="h-full w-full object-cover"
            width={800}
            height={800}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
        </div>

        <div className="esconder-scroll -mt-8 overflow-y-auto px-5 pb-4">
          <DialogHeader className="space-y-1 text-left">
            <DialogTitle className="text-2xl font-extrabold">{esfiha.nome}</DialogTitle>
            <p className="text-sm text-muted-foreground">{esfiha.descricao}</p>
          </DialogHeader>
          <p className="mt-2 text-lg font-extrabold text-accent">{brl(esfiha.preco)}</p>

          <div className="mt-5">
            <h4 className="mb-2 text-sm font-bold uppercase tracking-wide">Observações</h4>
            <Textarea
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              maxLength={300}
              placeholder="Ex: bem assada, sem cebola..."
              className="min-h-20 resize-none bg-secondary"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 border-t border-border bg-card p-4">
          <QuantityStepper valor={quantidade} onChange={setQuantidade} />
          <button
            type="button"
            onClick={() =>
              onConfirmar(
                { tipo: "esfiha", esfihaId: esfiha.id, quantidade, observacao },
                itemEdicao?.uid,
              )
            }
            className="gradiente-fogo flex flex-1 items-center justify-between rounded-full px-5 py-3 text-sm font-bold text-primary-foreground transition-transform active:scale-[0.98]"
          >
            <span>{itemEdicao ? "Salvar alterações" : "Adicionar ao pedido"}</span>
            <span className="tabular-nums">{brl(esfiha.preco * quantidade)}</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
