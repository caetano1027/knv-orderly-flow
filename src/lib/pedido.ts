import { getBebida, getBorda, getEsfiha, getSabor, getTamanho } from "@/config/menu";
import { store } from "@/config/store";
import { brlNum } from "@/lib/format";
import { precoItem, type CartItem } from "@/lib/cart";

export type Endereco = {
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  cep: string;
};

export type DadosCliente = {
  nome: string;
  telefone: string;
  tipo: "entrega" | "retirada";
  endereco: Endereco;
  pagamento: string;
  precisaTroco: boolean;
  trocoPara: string;
};

export const enderecoVazio: Endereco = {
  rua: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  cep: "",
};

export function enderecoTexto(e: Endereco) {
  return [
    `${e.rua}${e.numero ? `, ${e.numero}` : ""}`,
    e.bairro,
    e.cidade,
    e.cep,
  ]
    .filter(Boolean)
    .join(" - ");
}

export function linkMaps(e: Endereco) {
  return `https://maps.google.com/?q=${encodeURIComponent(enderecoTexto(e))}`;
}

/** Número sequencial simples por dia, guardado no navegador */
export function proximoNumeroPedido() {
  const hoje = new Date().toISOString().slice(0, 10);
  let seq = 1;
  try {
    const raw = localStorage.getItem("knv-numero-pedido");
    if (raw) {
      const dados = JSON.parse(raw) as { dia: string; seq: number };
      if (dados.dia === hoje) seq = dados.seq + 1;
    }
    localStorage.setItem("knv-numero-pedido", JSON.stringify({ dia: hoje, seq }));
  } catch {
    /* ignora */
  }
  return String(seq).padStart(3, "0");
}

const LINHA = "------------------------------------";

export function montarMensagem(
  itens: CartItem[],
  cliente: DadosCliente,
  totais: { subtotal: number; entrega: number; total: number },
  numero: string,
) {
  const agora = new Date();
  const data = agora.toLocaleDateString("pt-BR");
  const hora = agora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  const L: string[] = [];

  L.push("#### NOVO PEDIDO ####", "");
  L.push(`#️⃣   Nº pedido: ${numero}`);
  L.push(`feito em ${data} ${hora}`, "");
  
  L.push(`👤   ${cliente.nome}`);
  L.push(`📞   ${cliente.telefone}`, "");

  if (cliente.tipo === "entrega") {
    const e = cliente.endereco;
    L.push("🛵   Endereço de entrega");
    L.push(`${e.rua}, ${e.numero}`);
    L.push("", "Complemento:");
    L.push(e.complemento || "-");
    L.push("", "Bairro:");
    L.push(e.bairro, "");
    
    // O campo "referencia" não existe explicitamente no tipo DadosCliente, 
    // mas o cliente pode usar o complemento ou o link. 
    // Vou omitir a linha vazia de referência se não houver campo específico.
    
    L.push("Link do endereço:");
    L.push(linkMaps(e), "");
  } else {
    L.push("🏪   Retirada no local", "");
  }

  L.push("------- ITENS DO PEDIDO -------", "");

  for (const item of itens) {
    if (item.tipo === "pizza") {
      const isPizzaDia = item.sabores.includes("pizza-dia");
      if (isPizzaDia) {
        L.push(`*${item.quantidade} x Pizza do Dia*`);
      } else {
        L.push(`*${item.quantidade} x Pizza ${getTamanho(item.tamanho).nome}*`);
        L.push("Sabores:");
        for (const s of item.sabores) L.push(`• ${getSabor(s)?.nome ?? s}`);
      }
      L.push(`Borda: ${getBorda(item.borda)?.nome ?? "Sem borda"}`);
    } else if (item.tipo === "esfiha") {
      L.push(`*${item.quantidade} x Esfiha*`);
      L.push(`Sabor: ${getEsfiha(item.esfihaId)?.nome ?? item.esfihaId}`);
    } else {
      const bebida = getBebida(item.bebidaId);
      const opcao = bebida?.opcoes.find(o => o.id === item.opcaoId);
      L.push(`*${item.quantidade} x ${bebida?.nome ?? "Bebida"}*`);
      L.push(`• ${opcao?.nome ?? "Sabor não selecionado"}`);
    }
    
    if (item.observacao) L.push(`Obs: ${item.observacao}`);
    L.push(`💵 R$ ${brlNum(precoItem(item))}`, "");
  }

  L.push("-------------------------------", "");
  L.push(`SUBTOTAL: R$ ${brlNum(totais.subtotal)}`);
  L.push(`ENTREGA: R$ ${brlNum(totais.entrega)}`);
  L.push(`VALOR FINAL: R$ ${brlNum(totais.total)}`, "");

  L.push("PAGAMENTO");
  L.push(cliente.pagamento);
  if (cliente.pagamento === "Dinheiro" && cliente.precisaTroco) {
    L.push(`Troco para: R$ ${cliente.trocoPara}`);
  }
  L.push("");

  L.push(`🕐   Prazo para entrega: ${store.prazoEstimado}`);
  L.push("", `Obrigado por escolher o *${store.nome}* ❤️`);

  return L.join("\n");
}

export function linkWhatsApp(mensagem: string) {
  return `https://wa.me/${store.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}
