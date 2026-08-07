# KNV Order Hub

REFERÊNCIA VISUAL E FUNCIONAL

Quero que a interface seja praticamente igual ao site abaixo em termos de experiência do usuário (UX), organização dos elementos e fluxo de pedido:

https://app.cardapioweb.com/mao_na_massa

IMPORTANTE

Não copie o design exatamente, mas utilize o mesmo conceito de navegação, organização e experiência do usuário.

Quero que o cliente tenha a sensação de estar utilizando um Cardápio Web profissional.

EXPERIÊNCIA DO USUÁRIO

O cliente deve conseguir fazer todo o pedido sem trocar de página.

Tudo deve acontecer na mesma tela.

Fluxo:

 Abre o site.

 Visualiza banner principal.

 Escolhe Pizza ou Esfiha.

 Escolhe os sabores.

 Escolhe quantidade.

 Escolhe tamanho (somente pizzas).

 Adiciona ao pedido.

 Pode adicionar vários itens.

 O carrinho fica sempre visível (fixo no canto inferior no celular e lateral no desktop).

 Finaliza preenchendo seus dados.

 Clica em Enviar Pedido.

 O WhatsApp abre automaticamente com o pedido completamente organizado.

CARRINHO

Quero um carrinho igual ao Cardápio Web.

Cada item deve permitir:

 alterar quantidade

 remover

 editar

 visualizar observações

Mostrar sempre:

Subtotal

Entrega

Valor Total

Quantidade de itens

PIZZAS

Ao clicar em uma pizza abrir uma tela/modal igual ao Cardápio Web.

Ela deve conter:

Nome

Descrição

Preço

Escolha do tamanho

○ Pequena

○ Grande

Depois:

Escolha os sabores.

Caso a pizza permita mais de um sabor, mostrar:

Primeiro sabor

Segundo sabor

Terceiro sabor

(quando aplicável)

Depois:

Borda

Exemplo:

Sem borda

Catupiry

Cheddar

Chocolate

etc.

Depois:

Observações

Campo de texto.

Depois:

Adicionar ao pedido.

ESFIHAS

Ao clicar na esfiha abrir um modal.

Mostrar:

Nome

Descrição

Preço

Quantidade

Observações

Adicionar ao pedido.

Não possui tamanho.

DADOS DO CLIENTE

Antes de finalizar solicitar:

Nome

Telefone

Tipo do pedido

○ Entrega

○ Retirada

Caso seja entrega:

Rua

Número

Complemento

Bairro

Cidade

CEP

Gerar automaticamente um link do Google Maps utilizando o endereço informado.

PAGAMENTO

Permitir:

PIX

Cartão de Crédito

Cartão de Débito

Dinheiro

Caso escolha Dinheiro:

Mostrar:

Precisa de troco?

Se SIM:

Troco para R$

MENSAGEM DO WHATSAPP

O sistema deverá gerar automaticamente uma mensagem extremamente organizada.

Seguindo exatamente este padrão:

#### NOVO PEDIDO ####

#️⃣ Nº do Pedido: {{numero}}

🗓 Data: {{data}}

🕒 Horário: {{hora}}

👤 Cliente:
{{nome}}

📞 Telefone:
{{telefone}}

🛵 Tipo:
Entrega ou Retirada

📍 Endereço:

Rua:

Número:

Complemento:

Bairro:

Cidade:

CEP:

🌎 Link do endereço:
https://maps.google.com/?q={{endereco}}

------------------------------------

🍕 ITENS DO PEDIDO

{{para cada pizza}}

{{quantidade}} x Pizza

Tamanho:
{{Pequena ou Grande}}

Sabores:

- {{sabor1}}

- {{sabor2}}

- {{sabor3}}

Borda:

{{borda}}

Observações:

{{observacao}}

Valor:
R$ XX,XX

------------------------------------

🥟 ESFIHAS

{{quantidade}} x Esfiha

Sabor:
{{sabor}}

Observações:

{{observacao}}

Valor:
R$ XX,XX

------------------------------------

💰 RESUMO

Subtotal:

R$

Entrega:

R$

Valor Total:

R$

------------------------------------

💳 Pagamento

PIX

Cartão

Débito

Dinheiro

Troco para:

R$

------------------------------------

⏱ Prazo estimado

60 minutos

Obrigado por escolher o KNV Cozinha de Fogo ❤️

PAINEL ADMINISTRÁVEL

Estruture o projeto para que seja extremamente fácil alterar posteriormente:

 sabores

 preços

 bordas

 categorias

 imagens

 promoções

 horário de funcionamento

Essas informações devem ficar centralizadas em arquivos de configuração (JSON ou TypeScript), evitando alterações diretas nos componentes.

ANIMAÇÕES

Quero uma interface moderna.

Adicionar:

 animações suaves

 efeito ao adicionar ao carrinho

 efeito hover

 carregamento elegante

 transições fluidas

 botões animados

 cards com efeito de profundidade

RESPONSIVIDADE

O site deve funcionar perfeitamente em:

 Celulares (prioridade máxima)

 Tablets

 Desktop

O layout mobile deve lembrar aplicativos de delivery, com foco em rapidez, praticidade e facilidade de uso.

Objetivo Final

O resultado deve ser praticamente um Cardápio Web personalizado para a KNV Cozinha de Fogo, com visual premium em tema escuro, detalhes em vermelho, totalmente responsivo, intuitivo e otimizado para conversão, onde todo o processo de escolha do pedido acontece no site e a finalização é feita através do WhatsApp, enviando uma mensagem completa, organizada e profissional semelhante ao exemplo fornecido.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6037368b-523f-4a75-8402-64545ad17191).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
