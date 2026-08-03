export function formatPrice(price: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(price);
}

export function parseSizes(sizes: string) {
  return sizes
    .split(",")
    .map((size) => size.trim())
    .filter(Boolean);
}
