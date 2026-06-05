import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Instagram, Phone, MapPin, Facebook } from "lucide-react";
import { useSiteSettings } from "@/lib/useSiteSettings";

export function SiteFooter() {
  const { t } = useTranslation();
  const { contact, social } = useSiteSettings();

  const phone   = contact.phone   || t("contact.phone");
  const phone2  = contact.phone2  || null;
  const address = contact.address || t("contact.address");

  const instagramUrl = social.instagram || "https://instagram.com";
  const facebookUrl  = social.facebook  || null;
  const whatsapp     = social.whatsapp  || null;

  return (
    <footer className="border-t border-border/40 bg-card/40 pattern-azeri">
      <div className="container mx-auto px-4 sm:px-6 py-12 grid md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-display text-2xl text-gradient-gold mb-2">Qoşa Qala</h3>
          <p className="text-sm text-muted-foreground">{t("footer.tagline")}</p>
        </div>

        <div className="space-y-2 text-sm">
          <Link to="/menu"        className="block text-foreground/80 hover:text-primary">{t("nav.menu")}</Link>
          <Link to="/gallery"     className="block text-foreground/80 hover:text-primary">{t("nav.gallery")}</Link>
          <Link to="/reservation" className="block text-foreground/80 hover:text-primary">{t("nav.reservation")}</Link>
          <Link to="/contact"     className="block text-foreground/80 hover:text-primary">{t("nav.contact")}</Link>
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <p className="flex items-start gap-2">
            <MapPin className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
            {address}
          </p>

          <a href={`tel:${phone.replace(/\s/g,"")}`} className="flex items-center gap-2 hover:text-primary transition">
            <Phone className="h-4 w-4 text-primary" />{phone}
          </a>

          {phone2 && (
            <a href={`tel:${phone2.replace(/\s/g,"")}`} className="flex items-center gap-2 hover:text-primary transition">
              <Phone className="h-4 w-4 text-primary/70" />{phone2}
            </a>
          )}

          <a href={instagramUrl} target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 hover:text-primary transition">
            <Instagram className="h-4 w-4" /> Instagram
          </a>

          {facebookUrl && (
            <a href={facebookUrl} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 hover:text-primary transition">
              <Facebook className="h-4 w-4" /> Facebook
            </a>
          )}

          {whatsapp && (
            <a href={`https://wa.me/${whatsapp.replace(/[^\d]/g,"")}`} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 hover:text-primary transition">
              <Phone className="h-4 w-4 text-green-500" /> WhatsApp
            </a>
          )}
        </div>
      </div>

      <div className="border-t border-border/40 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Qoşa Qala — {t("footer.rights")}
      </div>
    </footer>
  );
}
