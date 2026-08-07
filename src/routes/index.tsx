import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Clock, Flame, ShoppingBag, Star } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ProductCard } from "@/components/cardapio/ProductCard";
import { PizzaModal } from "@/components/cardapio/PizzaModal";
import { EsfihaModal } from "@/components/cardapio/EsfihaModal";
import { BebidaModal } from "@/components/cardapio/BebidaModal";
import { Cart } from "@/components/cardapio/Cart";
import { type Bebida, type Esfiha, type Sabor, categorias, promocoes, tamanhos } from "@/config/menu";
import { statusLoja, store } from "@/config/store";
import { brl } from "@/lib/format";
import {
  CartProvider,
  useCart,
  type CartItem,
  type EsfihaItem,
  type PizzaItem,
  type BebidaItem,
} from "@/lib/cart";
import heroBanner from "@/assets/hero-banner.jpg";
import logoAsset from "@/assets/logo.png.asset.json";

const titulo = `${store.nome} — Pizzas e Esfihas com entrega`;
const descricao =
  "Peça pizzas na brasa e esfihas artesanais do KNV Cozinha de Fogo. Monte seu pedido em segundos e finalize direto no WhatsApp.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: titulo },
      { name: "description", content: descricao },
      { property: "og:title", content: titulo },
      { property: "og:description", content: descricao },
      { property: "og:type", content: "restaurant.menu" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <CartProvider>
      <Cardapio />
    </CartProvider>
  ),
});

function Cardapio() {
  const { adicionar, atualizar, totalItens, subtotal } = useCart();
  const [pizzaAberta, setPizzaAberta] = useState(false);
  const [saborInicial, setSaborInicial] = useState<string | null>(null);
  const [pizzaEdicao, setPizzaEdicao] = useState<PizzaItem | null>(null);
  const [esfihaAberta, setEsfihaAberta] = useState(false);
  const [esfihaId, setEsfihaId] = useState<string | null>(null);
  const [esfihaEdicao, setEsfihaEdicao] = useState<EsfihaItem | null>(null);
  const [bebidaAberta, setBebidaAberta] = useState(false);
  const [bebidaId, setBebidaId] = useState<string | null>(null);
  const [bebidaEdicao, setBebidaEdicao] = useState<BebidaItem | null>(null);
  const [carrinhoMobile, setCarrinhoMobile] = useState(false);

  const status = statusLoja();

  const abrirPizza = (sabor: string) => {
    setPizzaEdicao(null);
    setSaborInicial(sabor);
    setPizzaAberta(true);
  };

  const abrirEsfiha = (id: string) => {
    setEsfihaEdicao(null);
    setEsfihaId(id);
    setEsfihaAberta(true);
  };
  
  const abrirBebida = (id: string) => {
    setBebidaEdicao(null);
    setBebidaId(id);
    setBebidaAberta(true);
  };

  const editarItem = (item: CartItem) => {
    setCarrinhoMobile(false);
    if (item.tipo === "pizza") {
      setPizzaEdicao(item);
      setSaborInicial(null);
      setPizzaAberta(true);
    } else if (item.tipo === "esfiha") {
      setEsfihaEdicao(item);
      setEsfihaId(item.esfihaId);
      setEsfihaAberta(true);
    } else if (item.tipo === "bebida") {
      setBebidaEdicao(item);
      setBebidaId(item.bebidaId);
      setBebidaAberta(true);
    }
  };

  const confirmar = (dados: Omit<CartItem, "uid">, uid?: string) => {
    if (uid) atualizar(uid, dados);
    else adicionar(dados);
    setPizzaAberta(false);
    setEsfihaAberta(false);
    setBebidaAberta(false);
    setPizzaEdicao(null);
    setEsfihaEdicao(null);
    setBebidaEdicao(null);
  };

  return (
    <div className="min-h-screen bg-background pb-32 lg:pb-0">
      <header className="relative h-64 w-full overflow-hidden sm:h-80 lg:h-96">
        <img
          src={heroBanner}
          alt="Pizza artesanal saindo do forno a lenha"
          width={1600}
          height={900}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-4 pb-6 sm:pb-8"
        >
          <div className="flex flex-col items-start gap-1">
            <motion.img
              src={logoAsset.url}
              alt="KNV Cozinha de Fogo Logo"
              className="h-20 w-auto sm:h-32"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
          </div>
          <h1 className="text-3xl font-black leading-tight text-foreground sm:text-5xl">
            {store.nome}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">{store.slogan}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <Badge
              className={
                status.aberta
                  ? "bg-emerald-500/15 text-emerald-400"
                  : "bg-destructive/15 text-destructive"
              }
            >
              <span
                className={`h-2 w-2 rounded-full ${status.aberta ? "bg-emerald-400" : "bg-destructive"}`}
              />
              {status.texto}
            </Badge>
            <Badge className="bg-secondary text-muted-foreground">
              <Clock className="h-3.5 w-3.5" /> {store.prazoEstimado}
            </Badge>
            <Badge className="bg-secondary text-muted-foreground">
              <Star className="h-3.5 w-3.5 text-accent" /> Entrega {brl(store.taxaEntrega)}
            </Badge>
          </div>
        </motion.div>
      </header>

      {store.avisoTopo ? (
        <div className="gradiente-fogo px-4 py-2 text-center text-xs font-semibold text-primary-foreground">
          {store.avisoTopo}
        </div>
      ) : null}

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[1fr_380px]">
        <main className="min-w-0">
          {promocoes.length ? (
            <section className="esconder-scroll -mx-4 mb-6 flex gap-3 overflow-x-auto px-4 pb-1">
              {promocoes.map((p) => (
                <button
                  key={p.id}
                  onClick={() => abrirPizza(p.id)}
                  className="sombra-card min-w-[240px] appearance-none rounded-2xl border border-primary/30 bg-card p-4 text-left transition-transform active:scale-[0.98]"
                >
                  <p className="text-sm font-bold text-primary">{p.titulo}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{p.descricao}</p>
                </button>
              ))}
            </section>
          ) : null}

          <nav className="esconder-scroll sticky top-0 z-30 -mx-4 mb-4 flex gap-2 overflow-x-auto border-b border-border bg-background/95 px-4 py-3.5 backdrop-blur-md">
            {categorias.map((c) => (
              <a
                key={c.id}
                href={`#${c.id}`}
                className="shrink-0 rounded-full border border-border px-4 py-2 text-xs font-bold text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
              >
                {c.nome}
              </a>
            ))}
          </nav>

          {categorias.map((categoria) => (
            <section key={categoria.id} id={categoria.id} className="mb-8 scroll-mt-20">
              <h2 className="mb-3 text-xl font-black text-foreground">{categoria.nome}</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {categoria.tipo === "pizza" && (categoria.itens as Sabor[]).map((sabor) => (
                  <ProductCard
                    key={sabor.id}
                    nome={sabor.nome}
                    descricao={sabor.descricao}
                    imagem={sabor.imagem}
                    selo={sabor.selo}
                    prefixoPreco="a partir de"
                    preco={Math.min(...tamanhos.map((t) => sabor.precos[t.id]))}
                    onClick={() => abrirPizza(sabor.id)}
                  />
                ))}
                {categoria.tipo === "esfiha" && (categoria.itens as Esfiha[]).map((esfiha) => (
                  <ProductCard
                    key={esfiha.id}
                    nome={esfiha.nome}
                    descricao={esfiha.descricao}
                    imagem={esfiha.imagem}
                    selo={esfiha.selo}
                    preco={esfiha.preco}
                    onClick={() => abrirEsfiha(esfiha.id)}
                  />
                ))}
                {categoria.tipo === "bebida" && (categoria.itens as Bebida[]).map((bebida) => (
                  <ProductCard
                    key={bebida.id}
                    nome={bebida.nome}
                    descricao={bebida.descricao}
                    imagem={bebida.imagem}
                    preco={Math.min(...bebida.opcoes.map(o => o.preco))}
                    prefixoPreco="a partir de"
                    onClick={() => abrirBebida(bebida.id)}
                  />
                ))}
              </div>
            </section>
          ))}

          <footer className="border-t border-border pt-6 text-center text-xs text-muted-foreground">
            <p className="font-bold text-foreground">{store.nome}</p>
            <p className="mt-1">Pedidos pelo WhatsApp • {store.prazoEstimado} de prazo estimado</p>
          </footer>
        </main>

        <aside className="hidden lg:block">
          <div className="sombra-card sticky top-4 flex h-[calc(100vh-2rem)] flex-col overflow-hidden rounded-3xl border border-border bg-card/60">
            <div className="flex items-center gap-2 border-b border-border p-4">
              <ShoppingBag className="h-5 w-5 text-primary" />
              <h2 className="text-sm font-black uppercase tracking-wide">Seu pedido</h2>
              {totalItens > 0 ? (
                <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
                  {totalItens}
                </span>
              ) : null}
            </div>
            <Cart onEditar={editarItem} />
          </div>
        </aside>
      </div>

      <Sheet open={carrinhoMobile} onOpenChange={setCarrinhoMobile}>
        {totalItens > 0 ? (
          <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 p-4 pb-6 backdrop-blur-md lg:hidden">
            <SheetTrigger asChild>
              <motion.button
                type="button"
                initial={{ y: 60 }}
                animate={{ y: 0 }}
                whileTap={{ scale: 0.98 }}
                className="gradiente-fogo flex w-full items-center justify-between rounded-full px-5 py-3.5 text-sm font-bold text-primary-foreground"
              >
                <span className="flex items-center gap-2">
                  <motion.span
                    key={totalItens}
                    initial={{ scale: 0.6 }}
                    animate={{ scale: 1 }}
                    className="grid h-6 min-w-6 place-items-center rounded-full bg-background/25 px-1.5 text-xs"
                  >
                    {totalItens}
                  </motion.span>
                  Ver pedido
                </span>
                <span className="tabular-nums">{brl(subtotal)}</span>
              </motion.button>
            </SheetTrigger>
          </div>
        ) : null}
        <SheetContent side="bottom" className="h-[92vh] gap-0 rounded-t-3xl p-0">
          <SheetHeader className="border-b border-border p-4">
            <SheetTitle className="flex items-center gap-2 text-sm font-black uppercase tracking-wide">
              <ShoppingBag className="h-5 w-5 text-primary" /> Seu pedido
            </SheetTitle>
          </SheetHeader>
          <div className="h-[calc(92vh-65px)]">
            <Cart onEditar={editarItem} onEnviado={() => setCarrinhoMobile(false)} />
          </div>
        </SheetContent>
      </Sheet>

      <PizzaModal
        aberto={pizzaAberta}
        onFechar={() => setPizzaAberta(false)}
        saborInicial={saborInicial}
        itemEdicao={pizzaEdicao}
        onConfirmar={confirmar}
      />
      <EsfihaModal
        aberto={esfihaAberta}
        onFechar={() => setEsfihaAberta(false)}
        esfihaId={esfihaId}
        itemEdicao={esfihaEdicao}
        onConfirmar={confirmar}
      />
      <BebidaModal
        aberto={bebidaAberta}
        onFechar={() => setBebidaAberta(false)}
        bebidaId={bebidaId}
        itemEdicao={bebidaEdicao}
        onConfirmar={confirmar}
      />
    </div>
  );
}

function Badge({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-semibold ${className ?? ""}`}
    >
      {children}
    </span>
  );
}
