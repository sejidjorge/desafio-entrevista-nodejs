export function formatCurrencyBr(value: number) {
  return value?.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}

export function formatDate(value: Date) {
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  };

  return new Date(value)?.toLocaleDateString("pt-br", options).replace(",", "");
}
