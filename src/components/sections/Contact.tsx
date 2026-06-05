import { useTranslation } from "react-i18next";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { useSiteSettings } from "@/lib/useSiteSettings";

const DAYS: Record<string, string> = {
  mon: "B.e.", tue: "Ç.a.", wed: "Çər.", thu: "C.a.",
  fri: "Cümə", sat: "Şən.", sun: "Bz.",
};

export function Contact() {
  const { t, i18n } = useTranslation();
  const { contact, hours, social } = useSiteSettings();

  // Build hours string from DB or fall back to i18n
  const hoursText = Object.keys(DAYS)
    .filter((k) => hours[k])
    .map((k) => `${DAYS[k]}: ${hours[k]}`)
    .join("  |  ");

  const phone   = contact.phone   || t("contact.phone");
  const email   = contact.email   || t("contact.email");
  const address = contact.address || t("contact.address");
  const phone2  = contact.phone2  || null;

  const mapLat = contact.map_lat ?? 40.5118;
  const mapLng = contact.map_lng ?? 50.1382;
  const mapSrc = `https://www.google.com/maps?q=${mapLat},${mapLng}&z=15&output=embed`;

  const instagramUrl = social.instagram || "https://instagram.com";

  return (
    <section className="py-20 sm:py-28">
      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-10">
        <div>
          <h2 className="font-display text-3xl sm:text-4xl mb-8">{t("contact.title")}</h2>
          <div className="space-y-5 text-foreground/90">

            {/* Primary phone */}
            <a href={`tel:${phone.replace(/\s/g, "")}`}
              className="flex items-start gap-4 hover:text-primary transition-colors">
              <Phone className="h-5 w-5 text-primary mt-0.5" />
              <span>{phone}</span>
            </a>

            {/* Second phone (if set) */}
            {phone2 && (
              <a href={`tel:${phone2.replace(/\s/g, "")}`}
                className="flex items-start gap-4 hover:text-primary transition-colors">
                <Phone className="h-5 w-5 text-primary/70 mt-0.5" />
                <span>{phone2}</span>
              </a>
            )}

            {/* Email */}
            <a href={`mailto:${email}`}
              className="flex items-start gap-4 hover:text-primary transition-colors">
              <Mail className="h-5 w-5 text-primary mt-0.5" />
              <span>{email}</span>
            </a>

            {/* Address */}
            <div className="flex items-start gap-4">
              <MapPin className="h-5 w-5 text-primary mt-0.5" />
              <span>{address}</span>
            </div>

            {/* Working hours */}
            {hoursText ? (
              <div className="flex items-start gap-4">
                <Clock className="h-5 w-5 text-primary mt-0.5" />
                <span className="text-sm leading-relaxed">{hoursText}</span>
              </div>
            ) : (
              <div className="flex items-start gap-4">
                <Clock className="h-5 w-5 text-primary mt-0.5" />
                <span>{t("contact.hours")}</span>
              </div>
            )}
          </div>
        </div>

        {/* Map */}
        <div className="rounded-lg overflow-hidden border border-border/40 min-h-[320px]">
          <iframe
            title="Qoşa Qala Map"
            src={mapSrc}
            className="w-full h-full min-h-[320px] border-0"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
