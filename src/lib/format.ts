export function formatPrice(price: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatLeadTime(minDays?: number | null, maxDays?: number | null) {
  if (!minDays && !maxDays) return "A pedido";
  if (minDays && maxDays && minDays !== maxDays) {
    return `A pedido · llega en ${minDays}-${maxDays} días`;
  }
  const days = minDays ?? maxDays;
  return `A pedido · llega en ${days} días`;
}
