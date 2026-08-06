/**
 * CONFIGURAÇÃO DA LOJA
 * Altere aqui: nome, WhatsApp, taxa de entrega, prazo, horários e promoções.
 * Nenhum componente precisa ser modificado.
 */

export const store = {
  nome: "KNV Cozinha de Fogo",
  slogan: "Pizzas na brasa & esfihas artesanais",
  /** Somente números, com DDI 55 + DDD */
  whatsapp: "5561998239529",
  /** Taxa de entrega fixa em reais */
  taxaEntrega: 8,
  /** Pedido mínimo (0 = sem mínimo) */
  pedidoMinimo: 0,
  /** Prazo estimado exibido e enviado na mensagem */
  prazoEstimado: "60 minutos",
  /** Mensagem de destaque no topo (deixe "" para ocultar) */
  avisoTopo: "Frete fixo de R$ 8,00 em toda a região • Peça pelo WhatsApp",
  /**
   * Horário de funcionamento por dia da semana (0 = domingo ... 6 = sábado).
   * null = fechado. Use formato "HH:MM".
   */
  horarios: {
    0: { abre: "18:00", fecha: "23:00" },
    1: null,
    2: { abre: "18:00", fecha: "23:00" },
    3: { abre: "18:00", fecha: "23:00" },
    4: { abre: "18:00", fecha: "23:00" },
    5: { abre: "18:00", fecha: "23:59" },
    6: { abre: "18:00", fecha: "23:59" },
  } as Record<number, { abre: string; fecha: string } | null>,
  /** Permitir pedidos mesmo com a loja fechada */
  aceitarPedidosFechado: true,
  /** Formas de pagamento aceitas */
  pagamentos: ["PIX", "Cartão de Crédito", "Cartão de Débito", "Dinheiro"] as const,
} as const;

export type FormaPagamento = (typeof store.pagamentos)[number];

const DIAS = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

function minutos(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function statusLoja(agora = new Date()) {
  const dia = agora.getDay();
  const faixa = store.horarios[dia];
  if (!faixa) return { aberta: false, texto: `Fechado hoje (${DIAS[dia]})` };
  const atual = agora.getHours() * 60 + agora.getMinutes();
  const aberta = atual >= minutos(faixa.abre) && atual <= minutos(faixa.fecha);
  return {
    aberta,
    texto: aberta ? `Aberto até ${faixa.fecha}` : `Abre às ${faixa.abre}`,
  };
}

export function horariosFormatados() {
  return Object.entries(store.horarios).map(([dia, faixa]) => ({
    dia: DIAS[Number(dia)],
    texto: faixa ? `${faixa.abre} às ${faixa.fecha}` : "Fechado",
  }));
}
