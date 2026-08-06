import { useEffect, useMemo, useState } from "react";
import { Check, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { QuantityStepper } from "./QuantityStepper";
import { bordas, getSabor, getTamanho, tamanhos, todosSabores, type TamanhoId } from "@/config/menu";
import { brl } from "@/lib/format";
import { precoUnitario, type PizzaItem } from "@/lib/cart";

type Props = {
  aberto: boolean;
  onFechar: () => void;
  saborInicial: string | null;
  itemEdicao: PizzaItem | null;
  onConfirmar: (dados: Omit<PizzaItem, "uid">, uid?: string) => void;
};

export function PizzaModal({ aberto, onFechar, saborInicial, itemEdicao, onConfirmar }: Props) {
  const [tamanho, setTamanho] = useState<TamanhoId>("grande");
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
      setTamanho("grande");
      setSabores(saborInicial ? [saborInicial] : []);
      setBorda("sem");
      setQuantidade(1);
      setObservacao("");
    }
  }, [aberto, itemEdicao, saborInicial]);

  const maxSabores = getTamanho(tamanho).maxSabores;

  useEffect(() => {
    setSabores((atual) => atual.slice(0, maxSabores));
  }, [maxSabores]);

  const item = useMemo<Omit<PizzaItem, "uid">>(
    () => ({ tipo: "pizza", tamanho, sabores, borda, quantidade, observacao }),
    [tamanho, sabores, borda, quantidade, observacao],
  );

  const total = precoUnitario({ ...item, uid: "x" }) * quantidade;
  const podeAdicionar = sabores.length > 0;
  const principal = getSabor(sabores[0] ?? saborInicial ?? "");

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
        className="max-h-[92vh] gap-0 overflow-hidden p-0 sm:max-w-lg"
        showCloseButton
      >
        <div className="relative h-40 w-full shrink-0 overflow-hidden sm:h-48">
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

        <div className="esconder-scroll -mt-8 overflow-y-auto px-5 pb-4">
          <DialogHeader className="space-y-1 text-left">
            <DialogTitle className="text-2xl font-extrabold">
              {principal ? principal.nome : "Monte sua pizza"}
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              {principal?.descricao ?? "Escolha o tamanho e os sabores"}
            </p>
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
                {todosSabores.map((s) => (
                  <Opcao
                    key={s.id}
                    ativo={sabores[index] === s.id}
                    titulo={s.nome}
                    subtitulo={s.descricao}
                    valor={brl(s.precos[tamanho])}
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
              placeholder="Ex: sem cebola, capricha no orégano..."
              className="min-h-20 resize-none bg-secondary"
            />
          </Secao>
        </div>

        <div className="flex items-center gap-3 border-t border-border bg-card p-4">
          <QuantityStepper valor={quantidade} onChange={setQuantidade} />
          <button
            type="button"
            disabled={!podeAdicionar}
            onClick={() => onConfirmar(item, itemEdicao?.uid)}
            className="gradiente-fogo flex flex-1 items-center justify-between rounded-full px-5 py-3 text-sm font-bold text-primary-foreground transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span>{itemEdicao ? "Salvar alterações" : "Adicionar ao pedido"}</span>
            <span className="tabular-nums">{brl(total)}</span>
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
    <section className="mt-5">
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-sm font-bold uppercase tracking-wide text-foreground">{titulo}</h4>
        {obrigatorio ? (
          <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase text-primary-foreground">
            Obrigatório
          </span>
        ) : opcional ? (
          <span className="text-[10px] uppercase text-muted-foreground">Opcional</span>
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
  subtitulo?: string;
  valor?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all active:scale-[0.99] ${
        ativo
          ? "border-primary bg-primary/10 sombra-glow"
          : "border-border bg-secondary/50 hover:border-primary/40"
      }`}
    >
      <span
        className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 transition-colors ${
          ativo ? "border-primary bg-primary" : "border-muted-foreground"
        }`}
      >
        {ativo ? <Check className="h-3 w-3 text-primary-foreground" /> : null}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-foreground">{titulo}</span>
        {subtitulo ? (
          <span className="block truncate text-xs text-muted-foreground">{subtitulo}</span>
        ) : null}
      </span>
      {valor ? (
        <span className="shrink-0 text-sm font-bold text-accent tabular-nums">{valor}</span>
      ) : (
        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
      )}
    </button>
  );
}
