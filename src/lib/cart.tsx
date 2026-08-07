import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getBebida, getBorda, getEsfiha, getSabor, type TamanhoId } from "@/config/menu";
import { store } from "@/config/store";

export type PizzaItem = {
  uid: string;
  tipo: "pizza";
  tamanho: TamanhoId;
  sabores: string[];
  borda: string;
  quantidade: number;
  observacao: string;
};

export type EsfihaItem = {
  uid: string;
  tipo: "esfiha";
  esfihaId: string;
  quantidade: number;
  observacao: string;
};

export type BebidaItem = {
  uid: string;
  tipo: "bebida";
  bebidaId: string;
  opcaoId: string;
  quantidade: number;
  observacao: string;
};

export type CartItem = PizzaItem | EsfihaItem | BebidaItem;

export function precoUnitario(item: CartItem): number {
  if (item.tipo === "bebida") {
    const bebida = getBebida(item.bebidaId);
    return bebida?.opcoes.find((o) => o.id === item.opcaoId)?.preco ?? 0;
  }
  if (item.tipo === "esfiha") {
    return getEsfiha(item.esfihaId)?.preco ?? 0;
  }
  if (item.sabores.includes("pizza-dia")) {
    return 29.90 + (getBorda(item.borda)?.preco ?? 0);
  }
  const precos = item.sabores.map((id) => getSabor(id)?.precos[item.tamanho] ?? 0);
  const base = precos.length ? Math.max(...precos) : 0;
  return base + (getBorda(item.borda)?.preco ?? 0);
}

export const precoItem = (item: CartItem) => precoUnitario(item) * item.quantidade;

type CartContextValue = {
  itens: CartItem[];
  adicionar: (item: Omit<CartItem, "uid">) => void;
  atualizar: (uid: string, item: Omit<CartItem, "uid">) => void;
  mudarQuantidade: (uid: string, delta: number) => void;
  remover: (uid: string) => void;
  limpar: () => void;
  subtotal: number;
  totalItens: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "knv-carrinho";

export function CartProvider({ children }: { children: ReactNode }) {
  const [itens, setItens] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItens(JSON.parse(raw) as CartItem[]);
    } catch {
      /* ignora */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(itens));
    } catch {
      /* ignora */
    }
  }, [itens]);

  const adicionar = useCallback((item: Omit<CartItem, "uid">) => {
    setItens((atual) => [...atual, { ...item, uid: crypto.randomUUID() } as CartItem]);
  }, []);

  const atualizar = useCallback((uid: string, item: Omit<CartItem, "uid">) => {
    setItens((atual) => atual.map((i) => (i.uid === uid ? ({ ...item, uid } as CartItem) : i)));
  }, []);

  const mudarQuantidade = useCallback((uid: string, delta: number) => {
    setItens((atual) =>
      atual
        .map((i) => (i.uid === uid ? { ...i, quantidade: i.quantidade + delta } : i))
        .filter((i) => i.quantidade > 0),
    );
  }, []);

  const remover = useCallback((uid: string) => {
    setItens((atual) => atual.filter((i) => i.uid !== uid));
  }, []);

  const limpar = useCallback(() => setItens([]), []);

  const subtotal = useMemo(() => itens.reduce((t, i) => t + precoItem(i), 0), [itens]);
  const totalItens = useMemo(() => itens.reduce((t, i) => t + i.quantidade, 0), [itens]);

  const value = useMemo(
    () => ({ itens, adicionar, atualizar, mudarQuantidade, remover, limpar, subtotal, totalItens }),
    [itens, adicionar, atualizar, mudarQuantidade, remover, limpar, subtotal, totalItens],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart precisa estar dentro de <CartProvider>");
  return ctx;
}

export const taxaEntrega = store.taxaEntrega;
