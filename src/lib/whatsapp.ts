export function buildWhatsAppLink(productName?: string, size?: string | null) {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  let baseMessage = "Hola! Quiero hacer una consulta";
  if (productName) {
    baseMessage = `Hola! Quiero consultar por "${productName}"`;
    if (size) baseMessage += ` (talle ${size})`;
  }
  const message = encodeURIComponent(baseMessage);
  return `https://wa.me/${number}?text=${message}`;
}

export function buildInstagramLink() {
  const user = process.env.NEXT_PUBLIC_INSTAGRAM_USER ?? "driphouse_store_";
  return `https://instagram.com/${user}`;
}
