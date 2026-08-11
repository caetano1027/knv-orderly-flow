import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { QuantityStepper } from "./QuantityStepper";
import { getEsfiha } from "@/config/menu";
import { brl } from "@/lib/format";
import type { EsfihaItem } from "@/lib/cart";
import { toast } from "sonner";
import { SuccessToast } from "../ui/SuccessToast";

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

  const handleConfirmar = () => {
    onConfirmar(
      { tipo: "esfiha", esfihaId: esfiha.id, quantidade, observacao },
      itemEdicao?.uid
    );
    toast.custom((t) => (
      <SuccessToast 
        title={itemEdicao ? "Pedido atualizado!" : "Esfiha adicionada ao pedido"} 
        description={itemEdicao ? "As alterações foram salvas." : "Seu pedido foi atualizado."} 
        onClose={() => toast.dismiss(t)}
      />
    ));
  };

  return (
    <Dialog open={aberto} onOpenChange={(o) => !o && onFechar()}>
      <DialogContent className="max-h-[95vh] w-[95%] max-w-[600px] flex flex-col gap-0 overflow-hidden p-0 sm:rounded-3xl border-none bg-card shadow-2xl">
        <div className="relative h-48 w-full shrink-0 overflow-hidden sm:h-56">
          <img
            src={esfiha.imagem}
            alt={esfiha.nome}
            className="h-full w-full object-cover"
            width={800}
            height={800}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
        </div>

        <div className="custom-scroll flex-1 overflow-y-auto overflow-x-hidden -mt-14 px-5 pb-6">
          <DialogHeader className="relative space-y-1 text-left z-10">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-black text-foreground sm:text-3xl drop-shadow-sm">
                <span className="line-clamp-2">{esfiha.nome}</span>
              </DialogTitle>
              <span className="text-lg font-black text-accent drop-shadow-sm">
                {brl(esfiha.preco)}
              </span>
            </div>
            <DialogDescription className="text-sm leading-relaxed text-muted-foreground bg-card/60 backdrop-blur-sm p-2 rounded-lg -mx-2">
              {esfiha.descricao}
            </DialogDescription>
          </DialogHeader>
          

          <section className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-sm font-black uppercase tracking-wider text-foreground">Observações</h4>
              <span className="text-[10px] font-bold uppercase text-muted-foreground">Opcional</span>
            </div>
            <Textarea
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              maxLength={300}
              placeholder="Ex: bem assada, sem cebola..."
              className="min-h-24 resize-none bg-secondary text-sm"
            />
          </section>
        </div>

        <div className="flex shrink-0 flex-col gap-3 border-t border-border bg-card p-4 sm:flex-row sm:items-center sm:gap-4 sm:p-5">
          <div className="flex items-center justify-between sm:justify-start sm:gap-6">
            <DialogClose asChild>
              <button
                type="button"
                className="flex h-11 items-center justify-center text-sm font-bold text-muted-foreground transition-colors hover:text-foreground"
              >
                Cancelar
              </button>
            </DialogClose>
            
            <div className="flex-shrink-0">
              <QuantityStepper valor={quantidade} onChange={setQuantidade} />
            </div>
          </div>

          <button
            type="button"
            onClick={handleConfirmar}
            className="gradiente-fogo flex flex-1 items-center justify-between rounded-xl px-5 py-4 text-sm font-black text-primary-foreground shadow-lg transition-transform active:scale-[0.98] sm:py-3.5"
          >
            <span className="truncate">
              {itemEdicao ? "Salvar alterações" : "Adicionar ao pedido"}
            </span>
            <span className="ml-2 whitespace-nowrap tabular-nums">
              {brl(esfiha.preco * quantidade)}
            </span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
