# KNV Cozinha de Fogo — Cardápio Digital

Um cardápio online de página única (estilo Cardápio Web), tema escuro premium com detalhes em vermelho, onde o cliente monta o pedido inteiro sem trocar de tela e finaliza pelo WhatsApp (61998239529).

## Experiência

- **Topo**: banner/hero com logo, nome, status de aberto/fechado (com base no horário de funcionamento configurado) e prazo estimado.
- **Abas de categoria** fixas ao rolar: Pizzas, Esfihas (e futuras categorias vindas do config).
- **Cards de produto** com imagem, nome, descrição e preço "a partir de", com hover e profundidade.
- **Tudo em uma única tela**: nada de troca de página; modais e painel lateral.

## Modal de Pizza

Nome, descrição, preço → Tamanho (Pequena / Grande) → Sabores (1º, 2º, 3º conforme o tamanho permitir) → Borda (Sem borda, Catupiry, Cheddar, Chocolate…) → Quantidade → Observações → **Adicionar ao pedido**. Preço recalcula ao vivo (regra: maior valor entre os sabores + borda, × quantidade).

## Modal de Esfiha

Nome, descrição, preço, quantidade, observações → Adicionar ao pedido. Sem tamanho.

## Carrinho sempre visível

- Desktop: coluna lateral fixa à direita.
- Mobile: barra fixa no rodapé com quantidade e total, que abre em painel deslizante.
- Cada item: alterar quantidade (+/−), remover, **editar** (reabre o modal com as escolhas preenchidas) e ver observações.
- Rodapé do carrinho: Subtotal, Entrega, Valor Total e quantidade de itens.

## Checkout (no mesmo painel)

Nome, Telefone, Tipo do pedido (Entrega / Retirada). Se Entrega: Rua, Número, Complemento, Bairro, Cidade, CEP — e link do Google Maps gerado a partir do endereço.

Pagamento: PIX, Crédito, Débito, Dinheiro. Em Dinheiro: "Precisa de troco?" e, se sim, "Troco para R$".

Validação de campos obrigatórios antes de habilitar **Enviar Pedido**.

## Envio para o WhatsApp

Ao enviar, abre `wa.me/5561998239529` com a mensagem montada exatamente no formato pedido: cabeçalho com nº do pedido, data e hora, dados do cliente, endereço + link do Maps, itens de pizza (tamanho, sabores, borda, observações, valor), esfihas, resumo financeiro, pagamento/troco, prazo estimado e a assinatura final.

## Fácil de administrar

Todo o conteúdo editável fica centralizado em arquivos de configuração, sem tocar em componentes:

- `src/config/store.ts` — nome, WhatsApp, taxa de entrega fixa, prazo, horários de funcionamento, cores/imagens do banner.
- `src/config/menu.ts` — categorias, produtos, sabores, preços por tamanho, bordas, promoções, imagens.

Preenchido com dados de exemplo (sabores e preços fictícios) prontos para você substituir.

## Animações

Entrada suave dos cards, hover com elevação, modais com transição fluida, "voo" do item ao carrinho + badge pulsando ao adicionar, botões com feedback ao toque, skeleton de carregamento.

## Responsividade

Mobile-first com sensação de app de delivery; adapta para tablet e desktop (grid de produtos + carrinho lateral).

## Detalhes técnicos

- Rota única `src/routes/index.tsx` substituindo o placeholder, com head() de SEO próprio.
- Estado do carrinho em React context + `localStorage` (persiste ao recarregar); sem backend.
- Tokens de tema escuro/vermelho definidos em `src/styles.css` (oklch), componentes shadcn (Dialog, Sheet, Tabs, Input, RadioGroup, Textarea) e animações com Motion.
- Imagens dos produtos e banner geradas para o tema.
- Numeração de pedido sequencial local por dia.
