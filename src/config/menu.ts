/**
 * CARDÁPIO
 * Altere aqui: categorias, sabores, preços, bordas, tamanhos e imagens.
 * Os valores abaixo são exemplos — substitua pelos reais.
 */
import pizzaSalgada from "@/assets/pizza-salgada.jpg";
import pizzaDoce from "@/assets/pizza-doce.jpg";
import esfihaImg from "@/assets/esfiha.jpg";
import bebidaImg from "@/assets/esfiha.jpg"; // Placeholder para bebidas

export type TamanhoId = "pequena" | "grande";

export type Tamanho = {
  id: TamanhoId;
  nome: string;
  descricao: string;
  /** Quantidade máxima de sabores permitida neste tamanho */
  maxSabores: number;
};

export type Borda = { id: string; nome: string; preco: number };

export type Sabor = {
  id: string;
  nome: string;
  descricao: string;
  imagem: string;
  /** Preço por tamanho */
  precos: Record<TamanhoId, number>;
  /** Categoria do sabor: salgado ou doce */
  categoriaId: "pizzas-salgadas" | "pizzas-doces";
  /** Selo opcional: "Mais vendida", "Promoção"... */
  selo?: string;
};

export type Esfiha = {
  id: string;
  nome: string;
  descricao: string;
  imagem: string;
  preco: number;
  selo?: string;
};

export type Bebida = {
  id: string;
  nome: string;
  descricao: string;
  imagem: string;
  opcoes: { id: string; nome: string; preco: number }[];
};

export type Categoria =
  | { id: "pizzas-salgadas" | "pizzas-doces"; nome: string; tipo: "pizza"; itens: Sabor[] }
  | { id: "esfihas"; nome: string; tipo: "esfiha"; itens: Esfiha[] }
  | { id: "bebidas"; nome: string; tipo: "bebida"; itens: Bebida[] };

export const tamanhos: Tamanho[] = [
  { id: "pequena", nome: "Pequena", descricao: "25 cm • 4 fatias • até 2 sabores", maxSabores: 2 },
  { id: "grande", nome: "Grande", descricao: "35 cm • 8 fatias • até 3 sabores", maxSabores: 3 },
];

export const bordas: Borda[] = [
  { id: "sem", nome: "Sem borda", preco: 0 },
  { id: "catupiry", nome: "Catupiry", preco: 8 },
  { id: "cheddar", nome: "Cheddar", preco: 8 },
  { id: "chocolate", nome: "Chocolate", preco: 10 },
  { id: "cream-cheese", nome: "Cream cheese", preco: 9 },
];

export const categorias: Categoria[] = [
  {
    id: "pizzas-salgadas",
    nome: "Pizzas Salgadas",
    tipo: "pizza",
    itens: [
      {
        id: "calabresa",
        nome: "Calabresa",
        descricao: "Molho artesanal, mussarela, calabresa fatiada e cebola",
        imagem: pizzaSalgada,
        precos: { pequena: 39.9, grande: 59.9 },
        categoriaId: "pizzas-salgadas",
        selo: "Mais vendida",
      },
      {
        id: "mussarela",
        nome: "Mussarela",
        descricao: "Molho artesanal, mussarela e orégano",
        imagem: pizzaSalgada,
        precos: { pequena: 36.9, grande: 54.9 },
        categoriaId: "pizzas-salgadas",
      },
      {
        id: "portuguesa",
        nome: "Portuguesa",
        descricao: "Presunto, mussarela, ovo, cebola, ervilha e azeitona",
        imagem: pizzaSalgada,
        precos: { pequena: 42.9, grande: 64.9 },
        categoriaId: "pizzas-salgadas",
      },
      {
        id: "frango-catupiry",
        nome: "Frango com Catupiry",
        descricao: "Frango desfiado temperado com catupiry cremoso",
        imagem: pizzaSalgada,
        precos: { pequena: 44.9, grande: 66.9 },
        categoriaId: "pizzas-salgadas",
      },
      {
        id: "quatro-queijos",
        nome: "Quatro Queijos",
        descricao: "Mussarela, provolone, parmesão e gorgonzola",
        imagem: pizzaSalgada,
        precos: { pequena: 45.9, grande: 68.9 },
        categoriaId: "pizzas-salgadas",
      },
      {
        id: "pepperoni",
        nome: "Pepperoni",
        descricao: "Mussarela e pepperoni levemente apimentado",
        imagem: pizzaSalgada,
        precos: { pequena: 46.9, grande: 69.9 },
        categoriaId: "pizzas-salgadas",
        selo: "Novidade",
      },
    ],
  },
  {
    id: "pizzas-doces",
    nome: "Pizzas Doces",
    tipo: "pizza",
    itens: [
      {
        id: "chocolate-morango",
        nome: "Chocolate com Morango",
        descricao: "Chocolate ao leite derretido com morangos frescos",
        imagem: pizzaDoce,
        precos: { pequena: 42.9, grande: 62.9 },
        categoriaId: "pizzas-doces",
        selo: "Favorita",
      },
      {
        id: "brigadeiro",
        nome: "Brigadeiro",
        descricao: "Brigadeiro cremoso com granulado belga",
        imagem: pizzaDoce,
        precos: { pequena: 39.9, grande: 58.9 },
        categoriaId: "pizzas-doces",
      },
      {
        id: "romeu-julieta",
        nome: "Romeu e Julieta",
        descricao: "Mussarela with guava paste",
        imagem: pizzaDoce,
        precos: { pequena: 39.9, grande: 58.9 },
        categoriaId: "pizzas-doces",
      },
    ],
  },
  {
    id: "esfihas",
    nome: "Esfihas",
    tipo: "esfiha",
    itens: [
      {
        id: "esfiha-carne",
        nome: "Esfiha de Carne",
        descricao: "Carne bovina temperada com limão e especiarias",
        imagem: esfihaImg,
        preco: 7.5,
        selo: "Mais vendida",
      },
      {
        id: "esfiha-queijo",
        nome: "Esfiha de Queijo",
        descricao: "Mussarela derretida com orégano",
        imagem: esfihaImg,
        preco: 7.5,
      },
      {
        id: "esfiha-frango",
        nome: "Esfiha de Frango",
        descricao: "Frango desfiado com catupiry",
        imagem: esfihaImg,
        preco: 8.5,
      },
      {
        id: "esfiha-calabresa",
        nome: "Esfiha de Calabresa",
        descricao: "Calabresa moída com cebola e mussarela",
        imagem: esfihaImg,
        preco: 8.5,
      },
      {
        id: "esfiha-chocolate",
        nome: "Esfiha de Chocolate",
        descricao: "Recheio cremoso de chocolate meio amargo",
        imagem: esfihaImg,
        preco: 8.9,
      },
    ],
  },
  {
    id: "bebidas",
    nome: "Bebidas",
    tipo: "bebida",
    itens: [
      {
        id: "refri-lata",
        nome: "🥤 Refrigerante Lata",
        descricao: "350ml • Escolha o sabor",
        imagem: bebidaImg,
        opcoes: [
          { id: "coca", nome: "Coca-Cola", preco: 6.5 },
          { id: "coca-zero", nome: "Coca-Cola Zero", preco: 6.5 },
          { id: "guarana", nome: "Guaraná Antarctica", preco: 6.0 },
          { id: "guarana-zero", nome: "Guaraná Antarctica Zero", preco: 6.0 },
          { id: "fanta-laranja", nome: "Fanta Laranja", preco: 6.0 },
          { id: "fanta-uva", nome: "Fanta Uva", preco: 6.0 },
          { id: "sprite", nome: "Sprite", preco: 6.0 },
          { id: "sprite-zero", nome: "Sprite Zero", preco: 6.0 },
          { id: "pepsi", nome: "Pepsi", preco: 6.0 },
          { id: "pepsi-black", nome: "Pepsi Black", preco: 6.0 },
          { id: "sukita-laranja", nome: "Sukita Laranja", preco: 6.0 },
          { id: "suco-laranja", nome: "Suco de Laranja", preco: 8.0 },
          { id: "suco-uva", nome: "Suco de Uva", preco: 8.0 },
          { id: "suco-limao", nome: "Suco de Limão", preco: 8.0 },
        ],
      },
      {
        id: "refri-1l",
        nome: "🥤 Refrigerante 1 Litro",
        descricao: "Garrafa 1L • Escolha o sabor",
        imagem: bebidaImg,
        opcoes: [
          { id: "coca", nome: "Coca-Cola", preco: 10.9 },
          { id: "guarana", nome: "Guaraná Antarctica", preco: 9.9 },
          { id: "fanta-laranja", nome: "Fanta Laranja", preco: 9.9 },
          { id: "sprite", nome: "Sprite", preco: 9.9 },
        ],
      },
      {
        id: "refri-2l",
        nome: "🥤 Refrigerante 2 Litros",
        descricao: "Garrafa 2L • Escolha o sabor",
        imagem: bebidaImg,
        opcoes: [
          { id: "coca", nome: "Coca-Cola", preco: 14.9 },
          { id: "coca-zero", nome: "Coca-Cola Zero", preco: 14.9 },
          { id: "guarana", nome: "Guaraná Antarctica", preco: 12.9 },
          { id: "fanta-laranja", nome: "Fanta Laranja", preco: 12.9 },
          { id: "pepsi", nome: "Pepsi", preco: 12.9 },
          { id: "sukita-laranja", nome: "Sukita Laranja", preco: 12.9 },
        ],
      },
    ],
  },
];

/** Promoções exibidas no topo (deixe a lista vazia para ocultar) */
export const promocoes = [
  { 
    id: "pizza-dia", 
    titulo: "Pizza do Dia", 
    descricao: "Confira o sabor em destaque hoje com preço especial!",
    categoriaId: "pizza-dia" // Flag for special modal behavior
  },
];

export const todosSabores = categorias
  .filter((c): c is Extract<Categoria, { tipo: "pizza" }> => c.tipo === "pizza")
  .flatMap((c) => c.itens);

export const todasEsfihas = categorias
  .filter((c): c is Extract<Categoria, { tipo: "esfiha" }> => c.tipo === "esfiha")
  .flatMap((c) => c.itens);

export const todasBebidas = categorias
  .filter((c): c is Extract<Categoria, { tipo: "bebida" }> => c.tipo === "bebida")
  .flatMap((c) => c.itens);

export const getSabor = (id: string) => todosSabores.find((s) => s.id === id);
export const getEsfiha = (id: string) => todasEsfihas.find((s) => s.id === id);
export const getBebida = (id: string) => todasBebidas.find((s) => s.id === id);
export const getTamanho = (id: TamanhoId) => tamanhos.find((t) => t.id === id)!;
export const getBorda = (id: string) => bordas.find((b) => b.id === id)!;
