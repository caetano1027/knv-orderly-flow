import { getBorda, getEsfiha, getSabor, getTamanho } from "@/config/menu";
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

  L.push("🔥 #### NOVO PEDIDO #### 🔥", "");
  L.push(`#️⃣ Nº do Pedido: ${numero}`, "");
  L.push(`🗓 Data: ${data}`, "");
  L.push(`🕒 Horário: ${hora}`, "");
  L.push("👤 Cliente:", cliente.nome, "");
  L.push("📞 Telefone:", cliente.telefone, "");
  L.push("🛵 Tipo:", cliente.tipo === "entrega" ? "Entrega 🛵" : "Retirada 🏪", "");

  if (cliente.tipo === "entrega") {
    const e = cliente.endereco;
    L.push("📍 Endereço:", "");
    L.push(`🏘 Rua: ${e.rua}`);
    L.push(`🔢 Número: ${e.numero}`);
    L.push(`🏢 Complemento: ${e.complemento || "-"}`);
    L.push(`🏘 Bairro: ${e.bairro}`);
    L.push(`🏙 Cidade: ${e.cidade}`);
    L.push(`📫 CEP: ${e.cep}`, "");
    L.push("🌎 Link do endereço:", linkMaps(e), "");
  }

  const pizzas = itens.filter((i) => i.tipo === "pizza");
  const esfihas = itens.filter((i) => i.tipo === "esfiha");

  if (pizzas.length) {
    L.push(LINHA, "", "🍕 ITENS DO PEDIDO (PIZZAS)", "");
    for (const item of pizzas) {
      if (item.tipo !== "pizza") continue;
      const isPizzaDia = item.sabores.includes("pizza-dia");
      if (isPizzaDia) {
        L.push("🍕 *Pizza do Dia*", "");
      } else {
        L.push(`🍕 *${item.quantidade} x Pizza*`, "");
        L.push("📐 Tamanho:", getTamanho(item.tamanho).nome, "");
        L.push("✨ Sabores:");
        for (const s of item.sabores) L.push(`  • ${getSabor(s)?.nome ?? s}`);
        L.push("");
      }
      L.push("🥖 Borda:", getBorda(item.borda)?.nome ?? "Sem borda", "");
      L.push("📝 Observações:", item.observacao || "-", "");
      L.push("💵 Valor:", `R$ ${brlNum(precoItem(item))}`, "");
    }
  }

  if (esfihas.length) {
    L.push(LINHA, "", "🥟 ITENS DO PEDIDO (ESFIHAS)", "");
    for (const item of esfihas) {
      if (item.tipo !== "esfiha") continue;
      L.push(`🥟 *${item.quantidade} x Esfiha*`, "");
      L.push("✨ Sabor:", getEsfiha(item.esfihaId)?.nome ?? item.esfihaId, "");
      L.push("📝 Observações:", item.observacao || "-", "");
      L.push("💵 Valor:", `R$ ${brlNum(precoItem(item))}`, "");
    }
  }

  L.push(LINHA, "", "💰 RESUMO", "");
  L.push("🔹 Subtotal:", `R$ ${brlNum(totais.subtotal)}`, "");
  L.push("🔹 Entrega:", `R$ ${brlNum(totais.entrega)}`, "");
  L.push("✅ *Valor Total:*", `*R$ ${brlNum(totais.total)}*`, "");

  L.push(LINHA, "", "💳 Pagamento", "", `*${cliente.pagamento}*`, "");
  if (cliente.pagamento === "Dinheiro") {
    L.push("💵 Troco para:", cliente.precisaTroco ? `R$ ${cliente.trocoPara}` : "Não precisa de troco", "");
  }

  L.push(LINHA, "", "⏱ Prazo estimado", "", `*${store.prazoEstimado}*`, "");
  L.push(`Obrigado por escolher o *${store.nome}* ❤️`);

  return L.join("\n");
}

export function linkWhatsApp(mensagem: string) {
  return `https://wa.me/${store.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}
