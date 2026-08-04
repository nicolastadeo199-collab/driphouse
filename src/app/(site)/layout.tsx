import BenefitsBar from "@/components/BenefitsBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloatButton from "@/components/WhatsAppFloatButton";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="sticky top-0 z-40">
        <BenefitsBar />
        <Header />
      </div>
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppFloatButton />
    </>
  );
}
