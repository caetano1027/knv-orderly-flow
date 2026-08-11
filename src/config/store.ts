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
    0: { abre: "18:00", fecha: "23:00" },
    1: null,
    2: { abre: "18:00", fecha: "23:00" },
    3: { abre: "18:00", fecha: "23:00" },
    4: { abre: "18:00", fecha: "23:00" },
    5: { abre: "18:00", fecha: "23:00" },
    6: { abre: "18:00", fecha: "23:00" },
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
      texto: "🔴 ESTAMOS FECHADOS HOJE",
      subtexto: "A KNV não funciona às segundas-feiras.",
      proximaAbertura: "Voltamos amanhã às 18h.",
      botaoTexto: "📅 PEDIR PARA TERÇA-FEIRA"
    };
  }

  if (!faixa) return { aberta: false, texto: "🔴 ESTAMOS FECHADOS", subtexto: "", proximaAbertura: "Voltamos em breve.", botaoTexto: "📅 PEDIR PARA DEPOIS" };

  const abreMin = minutos(faixa.abre);
  const fechaMin = minutos(faixa.fecha);

  if (totalMinutos >= abreMin && totalMinutos < fechaMin) {
    return {
      aberta: true,
      texto: "🟢 ESTAMOS ABERTOS",
      subtexto: `Pizza: ${faixa.abre.replace(":", "h")} às ${faixa.fecha.replace(":", "h")}`,
      botaoTexto: "ENVIAR PEDIDO PELO WHATSAPP"
    };
  }

  // Antes das 18h
  if (totalMinutos < abreMin) {
    return {
      aberta: false,
      texto: "🔴 ESTAMOS FECHADOS",
      subtexto: `Abrimos hoje às ${faixa.abre.split(":")[0]}h.`,
      proximaAbertura: `Abriremos hoje às ${faixa.abre.split(":")[0]}h.`,
      botaoTexto: `📅 PEDIR PARA HOJE ÀS ${faixa.abre.split(":")[0]}H`
    };
  }

  // Depois das 23h
  const proximoDiaEhSegunda = (dia + 1) % 7 === 1;
  return {
    aberta: false,
    texto: "🔴 ESTAMOS FECHADOS",
    subtexto: "Voltamos amanhã às 18h.",
    proximaAbertura: "Voltamos amanhã às 18h.",
    botaoTexto: proximoDiaEhSegunda ? "📅 PEDIR PARA TERÇA-FEIRA" : "📅 PEDIR PARA AMANHÃ"
  };
}

export function horariosFormatados() {
  return Object.entries(store.horarios).map(([dia, faixa]) => ({
    dia: DIAS[Number(dia)],
    texto: faixa ? `${faixa.abre} às ${faixa.fecha}` : "Fechado",
  }));
}

