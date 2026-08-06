export const brl = (valor: number) => {
  const formatado = valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  // Se o valor for muito grande (ex: R$ 1.000,00), removemos o R$ em contextos apertados se necessário,
  // mas aqui manteremos o padrão e usaremos classes CSS para evitar quebra.
  return formatado;
};

export const brlNum = (valor: number) =>
  valor.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
