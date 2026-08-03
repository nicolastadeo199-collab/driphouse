export function buildWhatsAppLink(productName?: string) {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  const baseMessage = productName
    ? `Hola! Quiero consultar por "${productName}"`
    : "Hola! Quiero hacer una consulta";
  const message = encodeURIComponent(baseMessage);
  return `https://wa.me/${number}?text=${message}`;
}

export function buildInstagramLink() {
  const user = process.env.NEXT_PUBLIC_INSTAGRAM_USER ?? "driphouse_store_";
  return `https://instagram.com/${user}`;
}
