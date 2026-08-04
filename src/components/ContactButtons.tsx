import { buildInstagramLink, buildWhatsAppLink } from "@/lib/whatsapp";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";

export default function ContactButtons({
  productName,
  size,
}: {
  productName: string;
  size?: string | null;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <a
        href={buildWhatsAppLink(productName, size)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 font-semibold text-accent-ink transition-transform hover:scale-[1.02]"
      >
        <WhatsAppIcon className="h-5 w-5" />
        Consultar por WhatsApp
      </a>
      <a
        href={buildInstagramLink()}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border px-5 py-3 font-semibold text-foreground transition-colors hover:border-accent hover:text-accent"
      >
        Consultar por Instagram
      </a>
    </div>
  );
}
