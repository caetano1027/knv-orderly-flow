import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MapPin, Pencil, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { QuantityStepper } from "./QuantityStepper";
import { getBorda, getEsfiha, getSabor, getTamanho } from "@/config/menu";
import { store } from "@/config/store";
import { brl } from "@/lib/format";
import { precoItem, useCart, type CartItem } from "@/lib/cart";
import {
  enderecoVazio,
  linkMaps,
  linkWhatsApp,
  montarMensagem,
  proximoNumeroPedido,
  type DadosCliente,
} from "@/lib/pedido";

export function Cart({
  onEditar,
  onEnviado,
}: {
  onEditar: (item: CartItem) => void;
  onEnviado?: () => void;
}) {
  const { itens, subtotal, totalItens, mudarQuantidade, remover, limpar } = useCart();
  const [cliente, setCliente] = useState<DadosCliente>({
    nome: "",
    telefone: "",
    tipo: "entrega",
    endereco: enderecoVazio,
    pagamento: "PIX",
    precisaTroco: false,
    trocoPara: "",
  });

  const entrega = cliente.tipo === "entrega" && itens.length ? store.taxaEntrega : 0;
  const total = subtotal + entrega;

  const enderecoOk =
    cliente.tipo === "retirada" ||
    (cliente.endereco.rua.trim() &&
      cliente.endereco.numero.trim() &&
      cliente.endereco.bairro.trim() &&
      cliente.endereco.cidade.trim());

  const podeEnviar = Boolean(
    itens.length &&
      cliente.nome.trim().length >= 2 &&
      cliente.telefone.replace(/\D/g, "").length >= 10 &&
      enderecoOk &&
      (cliente.pagamento !== "Dinheiro" || !cliente.precisaTroco || cliente.trocoPara.trim()),
  );

  const mapsUrl = useMemo(
    () => (cliente.tipo === "entrega" && enderecoOk ? linkMaps(cliente.endereco) : null),
    [cliente.tipo, cliente.endereco, enderecoOk],
  );

  const enviar = () => {
    if (!podeEnviar) return;
    const numero = proximoNumeroPedido();
    const mensagem = montarMensagem(itens, cliente, { subtotal, entrega, total }, numero);
    window.open(linkWhatsApp(mensagem), "_blank", "noopener,noreferrer");
    toast.success(`Pedido nº ${numero} enviado para o WhatsApp!`);
    limpar();
    onEnviado?.();
  };

  const setEndereco = (campo: keyof typeof enderecoVazio, valor: string) =>
    setCliente((c) => ({ ...c, endereco: { ...c.endereco, [campo]: valor } }));

  return (
    <div className="flex h-full flex-col">
      <div className="esconder-scroll flex-1 overflow-y-auto p-4">
        {itens.length === 0 ? (
          <div className="flex h-full min-h-48 flex-col items-center justify-center gap-3 text-center">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Seu pedido está vazio.
              <br />
              Escolha uma pizza ou esfiha para começar.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            <AnimatePresence initial={false}>
              {itens.map((item) => (
                <motion.li
                  key={item.uid}
                  layout
                  initial={{ opacity: 0, y: 12, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 24 }}
                  transition={{ duration: 0.22 }}
                  className="rounded-2xl border border-border bg-card p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold">{tituloItem(item)}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                        {detalheItem(item)}
                      </p>
                      {item.observacao ? (
                        <p className="mt-1 rounded-lg bg-secondary px-2 py-1 text-[11px] italic text-muted-foreground">
                          Obs: {item.observacao}
                        </p>
                      ) : null}
                    </div>
                    <span className="shrink-0 text-sm font-extrabold text-accent tabular-nums">
                      {brl(precoItem(item))}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <QuantityStepper
                      valor={item.quantidade}
                      onChange={(v) => mudarQuantidade(item.uid, v - item.quantidade)}
                    />
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onEditar(item)}
                        className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                        aria-label="Editar item"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => remover(item.uid)}
                        className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive"
                        aria-label="Remover item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}

        {itens.length > 0 ? (
          <div className="mt-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wide">Seus dados</h3>
            <Campo label="Nome">
              <Input
                value={cliente.nome}
                maxLength={80}
                onChange={(e) => setCliente((c) => ({ ...c, nome: e.target.value }))}
                placeholder="Seu nome completo"
                className="bg-secondary"
              />
            </Campo>
            <Campo label="Telefone / WhatsApp">
              <Input
                value={cliente.telefone}
                maxLength={20}
                inputMode="tel"
                onChange={(e) => setCliente((c) => ({ ...c, telefone: e.target.value }))}
                placeholder="(61) 90000-0000"
                className="bg-secondary"
              />
            </Campo>

            <Campo label="Tipo do pedido">
              <div className="grid grid-cols-2 gap-2">
                {(["entrega", "retirada"] as const).map((t) => (
                  <Pill
                    key={t}
                    ativo={cliente.tipo === t}
                    onClick={() => setCliente((c) => ({ ...c, tipo: t }))}
                  >
                    {t === "entrega" ? "Entrega" : "Retirada"}
                  </Pill>
                ))}
              </div>
            </Campo>

            <AnimatePresence initial={false}>
              {cliente.tipo === "entrega" ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3 overflow-hidden"
                >
                  <div className="grid grid-cols-[1fr_100px] gap-2">
                    <Campo label="Rua">
                      <Input
                        value={cliente.endereco.rua}
                        maxLength={120}
                        onChange={(e) => setEndereco("rua", e.target.value)}
                        className="bg-secondary"
                      />
                    </Campo>
                    <Campo label="Número">
                      <Input
                        value={cliente.endereco.numero}
                        maxLength={10}
                        onChange={(e) => setEndereco("numero", e.target.value)}
                        className="bg-secondary"
                      />
                    </Campo>
                  </div>
                  <Campo label="Complemento">
                    <Input
                      value={cliente.endereco.complemento}
                      maxLength={80}
                      onChange={(e) => setEndereco("complemento", e.target.value)}
                      placeholder="Apto, bloco, referência"
                      className="bg-secondary"
                    />
                  </Campo>
                  <div className="grid grid-cols-2 gap-2">
                    <Campo label="Bairro">
                      <Input
                        value={cliente.endereco.bairro}
                        maxLength={60}
                        onChange={(e) => setEndereco("bairro", e.target.value)}
                        className="bg-secondary"
                      />
                    </Campo>
                    <Campo label="Cidade">
                      <Input
                        value={cliente.endereco.cidade}
                        maxLength={60}
                        onChange={(e) => setEndereco("cidade", e.target.value)}
                        className="bg-secondary"
                      />
                    </Campo>
                  </div>
                  <Campo label="CEP">
                    <Input
                      value={cliente.endereco.cep}
                      maxLength={9}
                      inputMode="numeric"
                      onChange={(e) => setEndereco("cep", e.target.value)}
                      placeholder="00000-000"
                      className="bg-secondary"
                    />
                  </Campo>
                  {mapsUrl ? (
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline"
                    >
                      <MapPin className="h-3.5 w-3.5" /> Conferir endereço no Google Maps
                    </a>
                  ) : null}
                </motion.div>
              ) : null}
            </AnimatePresence>

            <Campo label="Forma de pagamento">
              <div className="grid grid-cols-2 gap-2">
                {store.pagamentos.map((p) => (
                  <Pill
                    key={p}
                    ativo={cliente.pagamento === p}
                    onClick={() => setCliente((c) => ({ ...c, pagamento: p }))}
                  >
                    {p}
                  </Pill>
                ))}
              </div>
            </Campo>

            <AnimatePresence initial={false}>
              {cliente.pagamento === "Dinheiro" ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3 overflow-hidden"
                >
                  <Campo label="Precisa de troco?">
                    <div className="grid grid-cols-2 gap-2">
                      <Pill
                        ativo={cliente.precisaTroco}
                        onClick={() => setCliente((c) => ({ ...c, precisaTroco: true }))}
                      >
                        Sim
                      </Pill>
                      <Pill
                        ativo={!cliente.precisaTroco}
                        onClick={() =>
                          setCliente((c) => ({ ...c, precisaTroco: false, trocoPara: "" }))
                        }
                      >
                        Não
                      </Pill>
                    </div>
                  </Campo>
                  {cliente.precisaTroco ? (
                    <Campo label="Troco para R$">
                      <Input
                        value={cliente.trocoPara}
                        maxLength={10}
                        inputMode="decimal"
                        onChange={(e) => setCliente((c) => ({ ...c, trocoPara: e.target.value }))}
                        placeholder="100,00"
                        className="bg-secondary"
                      />
                    </Campo>
                  ) : null}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        ) : null}
      </div>

      <div className="shrink-0 border-t border-border bg-card p-4">
        <div className="space-y-1 text-sm">
          <Linha label={`Subtotal (${totalItens} ${totalItens === 1 ? "item" : "itens"})`} valor={brl(subtotal)} />
          <Linha label="Entrega" valor={cliente.tipo === "retirada" ? "Retirada" : brl(entrega)} />
          <div className="flex items-center justify-between pt-1 text-base font-extrabold">
            <span>Valor Total</span>
            <span className="text-accent tabular-nums">{brl(total)}</span>
          </div>
        </div>
        <motion.button
          type="button"
          onClick={enviar}
          disabled={!podeEnviar}
          whileTap={{ scale: 0.98 }}
          className="gradiente-fogo mt-3 flex w-full items-center justify-center rounded-xl px-5 py-4 text-base font-bold text-primary-foreground shadow-lg transition-all active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Enviar Pedido pelo WhatsApp
        </motion.button>
        <p className="mt-2 text-center text-[11px] text-muted-foreground">
          Prazo estimado: {store.prazoEstimado}
        </p>
      </div>
    </div>
  );
}

function tituloItem(item: CartItem) {
  if (item.tipo === "esfiha") {
    return `${item.quantidade}x ${getEsfiha(item.esfihaId)?.nome ?? "Esfiha"}`;
  }
  const nomes = item.sabores.map((s) => getSabor(s)?.nome ?? s).join(" / ");
  return `${item.quantidade}x Pizza ${nomes}`;
}

function detalheItem(item: CartItem) {
  if (item.tipo === "esfiha") return "Esfiha assada na hora";
  const borda = getBorda(item.borda);
  return `${getTamanho(item.tamanho).nome} • Borda: ${borda?.nome ?? "Sem borda"}`;
}

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-semibold text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function Pill({
  ativo,
  onClick,
  children,
}: {
  ativo: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-3 py-2.5 text-xs font-semibold transition-all active:scale-[0.98] ${
        ativo
          ? "border-primary bg-primary/15 text-foreground sombra-glow"
          : "border-border bg-secondary/50 text-muted-foreground hover:border-primary/40"
      }`}
    >
      {children}
    </button>
  );
}

function Linha({ label, valor }: { label: string; valor: string }) {
  return (
    <div className="flex items-center justify-between text-muted-foreground">
      <span>{label}</span>
      <span className="tabular-nums">{valor}</span>
    </div>
  );
}
