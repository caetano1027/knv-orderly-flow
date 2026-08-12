/**
 * CONFIGURAÇÃO DA LOJA
 * Altere aqui: nome, WhatsApp, taxa de entrega, prazo, horários e promoções.
 * Nenhum componente precisa ser modificado.
 */

export const store = {
  nome: "KNV Cozinha de Fogo",
  slogan: "Pizzas & esfihas artesanais",
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
    0: null,
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
    6: null,
  } as Record<number, { abre: string; fecha: string } | null>,
  /** Permitir pedidos mesmo com a loja fechada */
  aceitarPedidosFechado: false,
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
  const [h = 0, m = 0] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function statusLoja(agora = new Date()) {
  const dia = agora.getDay();
  const faixa = store.horarios[dia];
  
  const h = agora.getHours();
  const m = agora.getMinutes();
  const totalMinutos = h * 60 + m;

  // Segunda-feira (1)
  if (dia === 1) {
    return { 
      aberta: false, 
      dia: 1,
      texto: "🔴 A KNV está FECHADA",
      subtexto: "Abrirá na terça às 18:00",
      proximaAbertura: null,
      botaoTexto: "LOJA FECHADA"
    };
  }

  if (!faixa) return { aberta: false, dia, texto: "🔴 A KNV está FECHADA", subtexto: "Abrirá às 18:00", proximaAbertura: null, botaoTexto: "LOJA FECHADA" };

  const abreMin = minutos(faixa.abre);
  const fechaMin = minutos(faixa.fecha);

  if (totalMinutos >= abreMin && totalMinutos < fechaMin) {
    return {
      aberta: true,
      dia,
      texto: "🟢 ESTAMOS ABERTOS",
      subtexto: `Abertos das ${faixa.abre} até às ${faixa.fecha}`,
      botaoTexto: "ENVIAR PEDIDO PELO WHATSAPP"
    };
  }

  // Antes das 18h
  if (totalMinutos < abreMin) {
    return {
      aberta: false,
      dia,
      texto: "🔴 A KNV está FECHADA",
      subtexto: "Abrirá hoje às 18:00",
      proximaAbertura: null,
      botaoTexto: "LOJA FECHADA"
    };
  }

  // Depois das 23h
  const proximoDiaEhSegunda = (dia + 1) % 7 === 1;
  return {
    aberta: false,
    dia,
    texto: "🔴 A KNV está FECHADA",
    subtexto: proximoDiaEhSegunda ? "Abrirá na terça às 18:00" : "Abrirá amanhã às 18:00",
    proximaAbertura: null,
    botaoTexto: "LOJA FECHADA"
  };
}

export function horariosFormatados() {
  return Object.entries(store.horarios).map(([dia, faixa]) => ({
    dia: DIAS[Number(dia)],
    texto: faixa ? `${faixa.abre} às ${faixa.fecha}` : "Fechado",
  }));
}
