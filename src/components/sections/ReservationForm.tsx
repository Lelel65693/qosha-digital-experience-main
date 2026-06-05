import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { createReservation } from "@/lib/restaurant.functions";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { CheckCircle2, Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";

// UI Components
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const schema = z.object({
  name: z.string().trim().min(2, "Ad ən azı 2 hərfdən ibarət olmalıdır").max(100),
  phone: z.string().trim().refine((val) => {
    const digitsOnly = val.replace(/\D/g, "");
    return digitsOnly.length === 12; // +994 (3 digits) + 9 digits = 12 digits
  }, {
    message: "Telefon nömrəsi tam yazılmalıdır (məs: +994 50 790 88 88)",
  }),
  reservation_date: z.string().min(1, "Rezervasiya tarixi seçilməlidir"),
  reservation_time: z.string().min(1, "Rezervasiya saatı seçilməlidir"),
  guests: z.coerce.number().int().min(1, "Qonaq sayısı ən azı 1 olmalıdır").max(50),
  note: z.string().max(500).optional(),
});

type FormData = z.infer<typeof schema>;

const TIME_SLOTS = [
  "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
  "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30", "00:00", "00:30"
];

const GUEST_OPTIONS = Array.from({ length: 15 }, (_, i) => String(i + 1));

const inputClasses = "w-full h-11 px-4 py-2 bg-card/65 border border-border/30 rounded-xl text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all hover:border-primary/50 text-left flex items-center justify-between";
const textareaClasses = "w-full min-h-[6rem] px-4 py-3 bg-card/65 border border-border/30 rounded-xl text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none resize-none transition-all hover:border-primary/50";

export function ReservationForm() {
  const { t } = useTranslation();
  const [success, setSuccess] = useState(false);
  const fn = useServerFn(createReservation);
  const { register, handleSubmit, formState: { errors }, reset, control } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { guests: 2, note: "", phone: "+994" },
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => {
      // Remove spaces for database storage (e.g. +994507908888)
      const cleanPhone = data.phone.replace(/\s/g, "");
      return fn({ data: { ...data, phone: cleanPhone, note: data.note ?? "" } });
    },
    onSuccess: () => {
      toast.success(t("reservation.success"));
      setSuccess(true);
      reset();
      setTimeout(() => setSuccess(false), 5000);
    },
    onError: () => toast.error(t("reservation.error")),
  });

  const formatPhoneInput = (value: string) => {
    if (!value.startsWith("+994")) {
      const digits = value.replace(/\D/g, "");
      const restDigits = digits.startsWith("994") ? digits.slice(3) : digits;
      return "+994" + (restDigits ? " " + restDigits : "");
    }
    const prefix = "+994";
    const rest = value.slice(prefix.length);
    const digits = rest.replace(/\D/g, "");

    let formatted = "";
    if (digits.length > 0) {
      formatted += " " + digits.slice(0, 2);
    }
    if (digits.length > 2) {
      formatted += " " + digits.slice(2, 5);
    }
    if (digits.length > 5) {
      formatted += " " + digits.slice(5, 7);
    }
    if (digits.length > 7) {
      formatted += " " + digits.slice(7, 9);
    }
    return prefix + formatted;
  };

  return (
    <section className="py-12 sm:py-20">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl sm:text-4xl mb-2 text-gradient-gold">{t("reservation.title")}</h2>
          <p className="text-muted-foreground">{t("reservation.subtitle")}</p>
        </div>

        {success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center p-10 bg-card/40 backdrop-blur border border-primary/45 rounded-2xl shadow-elegant"
          >
            <CheckCircle2 className="h-14 w-14 text-primary mx-auto mb-4" />
            <p className="text-lg font-medium text-foreground">{t("reservation.success")}</p>
          </motion.div>
        ) : (
          <form
            onSubmit={handleSubmit((d) => mutation.mutate(d))}
            className="space-y-6 bg-card/25 backdrop-blur-md p-6 sm:p-10 rounded-2xl border border-border/20 shadow-elegant"
          >
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label={t("reservation.name")} error={errors.name?.message}>
                <input
                  {...register("name")}
                  placeholder="Ad və Soyad"
                  className={inputClasses}
                />
              </Field>

              <Field label={t("reservation.phone")} error={errors.phone?.message}>
                <input
                  type="tel"
                  {...register("phone", {
                    onChange: (e) => {
                      let val = e.target.value;
                      if (val.length < 4) {
                        e.target.value = "+994";
                        return;
                      }
                      e.target.value = formatPhoneInput(val);
                    }
                  })}
                  placeholder="+994 50 790 88 88"
                  className={inputClasses}
                />
              </Field>

              <Field label={t("reservation.date")} error={errors.reservation_date?.message}>
                <Controller
                  control={control}
                  name="reservation_date"
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className={`${inputClasses} cursor-pointer`}
                        >
                          <span className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4 text-primary/70" />
                            <span>
                              {field.value
                                ? format(new Date(field.value), "dd.MM.yyyy")
                                : "Tarix seçin"}
                            </span>
                          </span>
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-popover border-border/40" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                          initialFocus
                          className="bg-popover text-foreground"
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
              </Field>

              <Field label={t("reservation.time")} error={errors.reservation_time?.message}>
                <Controller
                  control={control}
                  name="reservation_time"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className={inputClasses}>
                        <SelectValue placeholder="Saat seçin" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border/40 text-foreground max-h-60 overflow-y-auto">
                        {TIME_SLOTS.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>

              <Field label={t("reservation.guests")} error={errors.guests?.message}>
                <Controller
                  control={control}
                  name="guests"
                  render={({ field }) => (
                    <Select onValueChange={(val) => field.onChange(Number(val))} value={String(field.value)}>
                      <SelectTrigger className={inputClasses}>
                        <SelectValue placeholder="Qonaq sayısı" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border/40 text-foreground max-h-60 overflow-y-auto">
                        {GUEST_OPTIONS.map((g) => (
                          <SelectItem key={g} value={g}>
                            {g} nəfər
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>
            </div>

            <Field label={t("reservation.note")}>
              <textarea
                {...register("note")}
                rows={3}
                placeholder="Əlavə qeydləriniz (məsələn: sakit masa, pəncərə kənarı...)"
                className={textareaClasses}
              />
            </Field>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full py-3 bg-gradient-gold text-primary-foreground font-medium rounded-xl hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 disabled:opacity-50 shadow-glow shimmer-gold cursor-pointer"
            >
              {mutation.isPending ? t("reservation.submitting") : t("reservation.submit")}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs text-muted-foreground/90 mb-1.5 block font-medium">{label}</span>
      {children}
      {error && <span className="text-xs text-destructive mt-1.5 block font-medium">{error}</span>}
    </label>
  );
}
