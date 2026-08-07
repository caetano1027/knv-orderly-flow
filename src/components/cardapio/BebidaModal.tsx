import { useEffect, useState } from "react";
import { Check, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { QuantityStepper } from "./QuantityStepper";
import { getBebida } from "@/config/menu";
import { brl } from "@/lib/format";
import type { BebidaItem } from "@/lib/cart";
import { toast } from "sonner";
import { SuccessToast } from "../ui/SuccessToast";

type Props = {
  aberto: boolean;
  onFechar: () => void;
  bebidaId: string | null;
  itemEdicao: BebidaItem | null;
  onConfirmar: (dados: Omit<BebidaItem, "uid">, uid?: string) => void;
};

export function BebidaModal({ aberto, onFechar, bebidaId, itemEdicao, onConfirmar }: Props) {
  const [opcaoId, setOpcaoId] = useState<string | null>(null);
  const [quantidade, setQuantidade] = useState(1);
  const [observacao, setObservacao] = useState("");

  const id = itemEdicao?.bebidaId ?? bebidaId;
  const bebida = id ? getBebida(id) : undefined;

  useEffect(() => {
    if (!aberto) return;
    if (itemEdicao) {
      setOpcaoId(itemEdicao.opcaoId);
      setQuantidade(itemEdicao.quantidade);
      setObservacao(itemEdicao.observacao);
    } else {
      setOpcaoId(null);
      setQuantidade(1);
      setObservacao("");
    }
  }, [aberto, itemEdicao]);

  if (!bebida) return null;

  const precoUnitario = bebida.opcoes.find(o => o.id === opcaoId)?.preco ?? 0;
  const total = precoUnitario * quantidade;

  const handleConfirmar = () => {
    if (!opcaoId) {
      toast.error("Selecione o sabor da bebida.");
      return;
    }

    onConfirmar(
      { tipo: "bebida", bebidaId: bebida.id, opcaoId, quantidade, observacao },
      itemEdicao?.uid
    );
    toast.custom((t) => (
      <SuccessToast 
        title={itemEdicao ? "Pedido atualizado!" : "Bebida adicionada ao pedido"} 
        description={itemEdicao ? "As alterações foram salvas." : "Seu pedido foi atualizado."} 
        onClose={() => toast.dismiss(t)}
      />
    ));
  };

  return (
    <Dialog open={aberto} onOpenChange={(o) => !o && onFechar()}>
      <DialogContent className="max-h-[95vh] w-[95%] max-w-[600px] flex flex-col gap-0 overflow-hidden p-0 sm:rounded-3xl border-none bg-card shadow-2xl">
        <div className="custom-scroll flex-1 overflow-y-auto overflow-x-hidden">
          <div className="relative h-40 w-full shrink-0 overflow-hidden sm:h-48">
            <img
              src={bebida.imagem}
              alt={bebida.nome}
              className="h-full w-full object-cover"
              width={800}
              height={800}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
          </div>

          <div className="custom-scroll flex-1 overflow-y-auto overflow-x-hidden -mt-10 px-5 pb-6">
            <DialogHeader className="relative space-y-1 text-left z-10">
              <DialogTitle className="text-2xl font-black text-foreground drop-shadow-sm">{bebida.nome}</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground bg-card/60 backdrop-blur-sm p-2 rounded-lg -mx-2">
                {bebida.descricao}
              </DialogDescription>
            </DialogHeader>

            <section className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-sm font-black uppercase tracking-wider text-foreground">Escolha o sabor</h4>
                <span className="rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-black uppercase text-primary-foreground">
                  Obrigatório
                </span>
              </div>
              <div className="grid gap-2">
                {bebida.opcoes.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => setOpcaoId(o.id)}
                    className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all active:scale-[0.99] ${
                      opcaoId === o.id
                        ? "border-primary bg-primary/10 sombra-glow"
                        : "border-border bg-secondary/40 hover:border-primary/40"
                    }`}
                  >
                    <span
                      className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition-colors ${
                        opcaoId === o.id ? "border-primary bg-primary" : "border-muted-foreground"
                      }`}
                    >
                      {opcaoId === o.id ? <Check className="h-3.5 w-3.5 text-primary-foreground" /> : null}
                    </span>
                    <span className="flex-1 text-sm font-bold text-foreground">{o.nome}</span>
                    <span className="ml-2 shrink-0 whitespace-nowrap text-sm font-black text-accent tabular-nums">
                      {brl(o.preco)}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            <section className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-sm font-black uppercase tracking-wider text-foreground">Observações</h4>
                <span className="text-[10px] font-bold uppercase text-muted-foreground">Opcional</span>
              </div>
              <Textarea
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                maxLength={300}
                placeholder="Ex.: enviar gelada, sem gelo..."
                className="min-h-24 resize-none bg-secondary text-sm"
              />
            </section>
          </div>
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
              {total > 0 ? brl(total) : ""}
            </span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
