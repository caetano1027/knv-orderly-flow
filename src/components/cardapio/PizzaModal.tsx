import { useEffect, useMemo, useState } from "react";
import { Check, ChevronRight, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { QuantityStepper } from "./QuantityStepper";
import { bordas, getSabor, getTamanho, tamanhos, todosSabores, type TamanhoId } from "@/config/menu";
import { brl } from "@/lib/format";
import { precoUnitario, type PizzaItem } from "@/lib/cart";
import { toast } from "sonner";

type Props = {
  aberto: boolean;
  onFechar: () => void;
  saborInicial: string | null;
  itemEdicao: PizzaItem | null;
  onConfirmar: (dados: Omit<PizzaItem, "uid">, uid?: string) => void;
};

export function PizzaModal({ aberto, onFechar, saborInicial, itemEdicao, onConfirmar }: Props) {
  const [tamanho, setTamanho] = useState<TamanhoId | null>(null);
  const [sabores, setSabores] = useState<string[]>([]);
  const [borda, setBorda] = useState("sem");
  const [quantidade, setQuantidade] = useState(1);
  const [observacao, setObservacao] = useState("");

  useEffect(() => {
    if (!aberto) return;
    if (itemEdicao) {
      setTamanho(itemEdicao.tamanho);
      setSabores(itemEdicao.sabores);
      setBorda(itemEdicao.borda);
      setQuantidade(itemEdicao.quantidade);
      setObservacao(itemEdicao.observacao);
    } else {
      setTamanho(null);
      setSabores(saborInicial ? [saborInicial] : []);
      setBorda("sem");
      setQuantidade(1);
      setObservacao("");
    }
  }, [aberto, itemEdicao, saborInicial]);

  const maxSabores = tamanho ? getTamanho(tamanho).maxSabores : 1;

  useEffect(() => {
    if (tamanho) {
      setSabores((atual) => atual.slice(0, maxSabores));
    }
  }, [maxSabores, tamanho]);

  const total = useMemo(() => {
    if (!tamanho) return 0;
    const itemSimulado: PizzaItem = { tipo: "pizza", uid: "x", tamanho, sabores, borda, quantidade, observacao };
    return precoUnitario(itemSimulado) * quantidade;
  }, [tamanho, sabores, borda, quantidade, observacao]);

  const principal = getSabor(sabores[0] ?? saborInicial ?? "");

  const handleConfirmar = () => {
    if (!tamanho) {
      toast.error("Escolha um tamanho antes de continuar.");
      return;
    }
    if (sabores.length === 0) {
      toast.error("Selecione pelo menos um sabor.");
      return;
    }

    onConfirmar(
      { tipo: "pizza", tamanho, sabores, borda, quantidade, observacao },
      itemEdicao?.uid
    );
    toast.success(itemEdicao ? "Pedido atualizado!" : "Pizza adicionada ao pedido.");
  };

  const alternarSabor = (id: string, posicao: number) => {
    setSabores((atual) => {
      const copia = [...atual];
      if (copia[posicao] === id) {
        copia.splice(posicao, 1);
        return copia;
      }
      copia[posicao] = id;
      return copia.filter(Boolean);
    });
  };

  return (
    <Dialog open={aberto} onOpenChange={(o) => !o && onFechar()}>
      <DialogContent
        className="max-h-[95vh] w-[95%] max-w-[600px] flex flex-col gap-0 overflow-hidden p-0 sm:rounded-3xl border-none bg-card shadow-2xl"
      >
        <div className="custom-scroll flex-1 overflow-y-auto overflow-x-hidden">
          <div className="relative h-48 w-full shrink-0 overflow-hidden sm:h-56">
            {principal ? (
              <img
                src={principal.imagem}
                alt={principal.nome}
                className="h-full w-full object-cover"
                width={800}
                height={800}
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
          </div>

          <div className="-mt-12 px-5 pb-6">
            <DialogHeader className="space-y-1 text-left">
              <DialogTitle className="text-2xl font-black text-foreground sm:text-3xl">
                {principal ? principal.nome : "Monte sua pizza"}
              </DialogTitle>
              <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
                {principal?.descricao ?? "Escolha o tamanho e os sabores"}
              </DialogDescription>
            </DialogHeader>

            <Secao titulo="Tamanho" obrigatorio>
              <div className="grid gap-2">
                {tamanhos.map((t) => (
                  <Opcao
                    key={t.id}
                    ativo={tamanho === t.id}
                    titulo={t.nome}
                    subtitulo={t.descricao}
                    valor={principal ? brl(principal.precos[t.id]) : undefined}
                    onClick={() => setTamanho(t.id)}
                  />
                ))}
              </div>
            </Secao>

            {Array.from({ length: maxSabores }).map((_, index) => (
              <Secao
                key={index}
                titulo={`${["Primeiro", "Segundo", "Terceiro"][index]} sabor`}
                obrigatorio={index === 0}
                opcional={index > 0}
              >
                <div className="grid gap-2">
                  {todosSabores
                    .filter((s) => !principal || s.categoriaId === principal.categoriaId)
                    .map((s) => (
                      <Opcao
                        key={s.id}
                        ativo={sabores[index] === s.id}
                        titulo={s.nome}
                        subtitulo={s.descricao}
                        valor={tamanho ? brl(s.precos[tamanho]) : "—"}
                        onClick={() => alternarSabor(s.id, index)}
                      />
                    ))}
                </div>
              </Secao>
            ))}

            <Secao titulo="Borda">
              <div className="grid gap-2">
                {bordas.map((b) => (
                  <Opcao
                    key={b.id}
                    ativo={borda === b.id}
                    titulo={b.nome}
                    valor={b.preco > 0 ? `+ ${brl(b.preco)}` : "Grátis"}
                    onClick={() => setBorda(b.id)}
                  />
                ))}
              </div>
            </Secao>

            <Secao titulo="Observações">
              <Textarea
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                maxLength={300}
                placeholder="Ex.: bem assada, retirar cebola, cortar em 8 pedaços..."
                className="min-h-24 resize-none bg-secondary text-sm"
              />
            </Secao>
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

function Secao({
  titulo,
  obrigatorio,
  opcional,
  children,
}: {
  titulo: string;
  obrigatorio?: boolean;
  opcional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-6">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-black uppercase tracking-wider text-foreground">{titulo}</h4>
        {obrigatorio ? (
          <span className="rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-black uppercase text-primary-foreground">
            Obrigatório
          </span>
        ) : opcional ? (
          <span className="text-[10px] font-bold uppercase text-muted-foreground">Opcional</span>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function Opcao({
  ativo,
  titulo,
  subtitulo,
  valor,
  onClick,
}: {
  ativo: boolean;
  titulo: string;
  subtitulo?: string | undefined;
  valor?: string | undefined;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all active:scale-[0.99] ${
        ativo
          ? "border-primary bg-primary/10 sombra-glow"
          : "border-border bg-secondary/40 hover:border-primary/40"
      }`}
    >
      <span
        className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition-colors ${
          ativo ? "border-primary bg-primary" : "border-muted-foreground"
        }`}
      >
        {ativo ? <Check className="h-3.5 w-3.5 text-primary-foreground" /> : null}
      </span>
      <span className="min-w-0 flex-1 space-y-0.5">
        <span className="block truncate text-sm font-bold text-foreground">{titulo}</span>
        {subtitulo ? (
          <span className="block line-clamp-2 text-xs text-muted-foreground">{subtitulo}</span>
        ) : null}
      </span>
      {valor ? (
        <span className="ml-2 shrink-0 whitespace-nowrap text-sm font-black text-accent tabular-nums">
          {valor}
        </span>
      ) : (
        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
      )}
    </button>
  );
}
