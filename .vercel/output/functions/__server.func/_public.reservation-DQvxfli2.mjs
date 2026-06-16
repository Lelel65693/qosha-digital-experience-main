import { j as jsxRuntimeExports, r as reactExports } from "./_libs/react.mjs";
import { u as useForm, C as Controller } from "./_libs/react-hook-form.mjs";
import { u } from "./_libs/hookform__resolvers.mjs";
import { c as useMutation } from "./_libs/tanstack__react-query.mjs";
import { u as useRouter } from "./_libs/tanstack__react-router.mjs";
import { m as isRedirect } from "./_libs/tanstack__router-core.mjs";
import { Q as createReservation } from "./_ssr/router-Cyx6-Q3j.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import { R as Root2, T as Trigger, P as Portal, C as Content2 } from "./_libs/radix-ui__react-popover.mjs";
import { c as cn } from "./_ssr/utils-H80jjgLf.mjs";
import { S as Slot } from "./_libs/radix-ui__react-slot.mjs";
import { c as cva } from "./_libs/class-variance-authority.mjs";
import { R as Root2$1, V as Value, T as Trigger$1, I as Icon, P as Portal$1, C as Content2$1, a as Viewport, b as Item, c as ItemIndicator, d as ItemText, S as ScrollUpButton, e as ScrollDownButton, L as Label, f as Separator } from "./_libs/radix-ui__react-select.mjs";
import { V as VideoBackground } from "./_ssr/VideoBackground-3DNY5J9s.mjs";
import "./_ssr/index.mjs";
import "./_libs/seroval.mjs";
import { u as useTranslation } from "./_libs/react-i18next.mjs";
import { m as motion } from "./_libs/framer-motion.mjs";
import { V as CircleCheck, Y as Calendar$1, a as ChevronLeft, C as ChevronRight, Z as ChevronDown, w as Check, _ as ChevronUp } from "./_libs/lucide-react.mjs";
import { f as format } from "./_libs/date-fns.mjs";
import { g as getDefaultClassNames, D as DayPicker } from "./_libs/react-day-picker.mjs";
import { o as objectType, s as stringType, d as coerce } from "./_libs/zod.mjs";
import "./_libs/tanstack__query-core.mjs";
import "./_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "node:stream";
import "./_libs/isbot.mjs";
import "./_libs/tanstack__history.mjs";
import "./_libs/cookie-es.mjs";
import "./_libs/seroval-plugins.mjs";
import "node:stream/web";
import "./_ssr/client-Cg-358lU.mjs";
import "./_libs/supabase__supabase-js.mjs";
import "./_libs/supabase__postgrest-js.mjs";
import "./_libs/supabase__realtime-js.mjs";
import "./_libs/supabase__phoenix.mjs";
import "./_libs/supabase__storage-js.mjs";
import "./_libs/iceberg-js.mjs";
import "./_libs/supabase__auth-js.mjs";
import "tslib";
import "./_libs/supabase__functions-js.mjs";
import "./_ssr/auth-middleware-B_zzLJ1T.mjs";
import "node:async_hooks";
import "./_libs/h3-v2.mjs";
import "./_libs/rou3.mjs";
import "./_libs/srvx.mjs";
import "./_libs/radix-ui__primitive.mjs";
import "./_libs/radix-ui__react-compose-refs.mjs";
import "./_libs/radix-ui__react-context.mjs";
import "./_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "./_libs/radix-ui__react-primitive.mjs";
import "./_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "./_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "./_libs/radix-ui__react-focus-guards.mjs";
import "./_libs/radix-ui__react-focus-scope.mjs";
import "./_libs/radix-ui__react-id.mjs";
import "./_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "./_libs/radix-ui__react-popper.mjs";
import "./_libs/floating-ui__react-dom.mjs";
import "./_libs/floating-ui__dom.mjs";
import "./_libs/floating-ui__core.mjs";
import "./_libs/floating-ui__utils.mjs";
import "./_libs/radix-ui__react-arrow.mjs";
import "./_libs/radix-ui__react-use-size.mjs";
import "./_libs/radix-ui__react-portal.mjs";
import "./_libs/radix-ui__react-presence.mjs";
import "./_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "./_libs/aria-hidden.mjs";
import "./_libs/react-remove-scroll.mjs";
import "./_libs/react-remove-scroll-bar.mjs";
import "./_libs/react-style-singleton.mjs";
import "./_libs/get-nonce.mjs";
import "./_libs/use-sidecar.mjs";
import "./_libs/use-callback-ref.mjs";
import "./_libs/clsx.mjs";
import "./_libs/tailwind-merge.mjs";
import "./_libs/radix-ui__number.mjs";
import "./_libs/radix-ui__react-collection.mjs";
import "./_libs/radix-ui__react-direction.mjs";
import "./_libs/radix-ui__react-use-previous.mjs";
import "./_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "./_ssr/image-src-Blq9uxfN.mjs";
import "./_libs/use-sync-external-store.mjs";
import "./_libs/motion-dom.mjs";
import "./_libs/motion-utils.mjs";
import "./_libs/date-fns__tz.mjs";
function useServerFn(serverFn) {
  const router = useRouter();
  return reactExports.useCallback(async (...args) => {
    try {
      const res = await serverFn(...args);
      if (isRedirect(res)) throw res;
      return res;
    } catch (err) {
      if (isRedirect(err)) {
        err.options._fromLocation = router.stores.location.get();
        return router.navigate(router.resolveRedirect(err).options);
      }
      throw err;
    }
  }, [router, serverFn]);
}
const Popover = Root2;
const PopoverTrigger = Trigger;
const PopoverContent = reactExports.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
  Content2,
  {
    ref,
    align,
    sideOffset,
    className: cn(
      "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-popover-content-transform-origin)",
      className
    ),
    ...props
  }
) }));
PopoverContent.displayName = Content2.displayName;
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = reactExports.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Comp, { className: cn(buttonVariants({ variant, size, className })), ref, ...props });
  }
);
Button.displayName = "Button";
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}) {
  const defaultClassNames = getDefaultClassNames();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    DayPicker,
    {
      showOutsideDays,
      className: cn(
        "bg-background group/calendar p-3 [--cell-size:2rem] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      ),
      captionLayout,
      formatters: {
        formatMonthDropdown: (date) => date.toLocaleString("default", { month: "short" }),
        ...formatters
      },
      classNames: {
        root: cn("w-fit", defaultClassNames.root),
        months: cn("relative flex flex-col gap-4 md:flex-row", defaultClassNames.months),
        month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-(--cell-size) w-(--cell-size) select-none p-0 aria-disabled:opacity-50",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-(--cell-size) w-(--cell-size) select-none p-0 aria-disabled:opacity-50",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-sm font-medium",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "has-focus:border-ring border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] relative rounded-md border",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn("bg-popover absolute inset-0 opacity-0", defaultClassNames.dropdown),
        caption_label: cn(
          "select-none font-medium",
          captionLayout === "label" ? "text-sm" : "[&>svg]:text-muted-foreground flex h-8 items-center gap-1 rounded-md pl-2 pr-1 text-sm [&>svg]:size-3.5",
          defaultClassNames.caption_label
        ),
        table: "w-full border-collapse",
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "text-muted-foreground flex-1 select-none rounded-md text-[0.8rem] font-normal",
          defaultClassNames.weekday
        ),
        week: cn("mt-2 flex w-full", defaultClassNames.week),
        week_number_header: cn("w-(--cell-size) select-none", defaultClassNames.week_number_header),
        week_number: cn(
          "text-muted-foreground select-none text-[0.8rem]",
          defaultClassNames.week_number
        ),
        day: cn(
          "group/day relative aspect-square h-full w-full select-none p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md",
          defaultClassNames.day
        ),
        range_start: cn("bg-accent rounded-l-md", defaultClassNames.range_start),
        range_middle: cn("rounded-none", defaultClassNames.range_middle),
        range_end: cn("bg-accent rounded-r-md", defaultClassNames.range_end),
        today: cn(
          "bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-none",
          defaultClassNames.today
        ),
        outside: cn(
          "text-muted-foreground aria-selected:text-muted-foreground",
          defaultClassNames.outside
        ),
        disabled: cn("text-muted-foreground opacity-50", defaultClassNames.disabled),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames
      },
      components: {
        Root: ({ className: className2, rootRef, ...props2 }) => {
          return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-slot": "calendar", ref: rootRef, className: cn(className2), ...props2 });
        },
        Chevron: ({ className: className2, orientation, ...props2 }) => {
          if (orientation === "left") {
            return /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: cn("size-4", className2), ...props2 });
          }
          if (orientation === "right") {
            return /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: cn("size-4", className2), ...props2 });
          }
          return /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: cn("size-4", className2), ...props2 });
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props2 }) => {
          return /* @__PURE__ */ jsxRuntimeExports.jsx("td", { ...props2, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex size-(--cell-size) items-center justify-center text-center", children }) });
        },
        ...components
      },
      ...props
    }
  );
}
function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}) {
  const defaultClassNames = getDefaultClassNames();
  const ref = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Button,
    {
      ref,
      variant: "ghost",
      size: "icon",
      "data-day": day.date.toLocaleDateString(),
      "data-selected-single": modifiers.selected && !modifiers.range_start && !modifiers.range_end && !modifiers.range_middle,
      "data-range-start": modifiers.range_start,
      "data-range-end": modifiers.range_end,
      "data-range-middle": modifiers.range_middle,
      className: cn(
        "data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 flex aspect-square h-auto w-full min-w-(--cell-size) flex-col gap-1 font-normal leading-none data-[range-end=true]:rounded-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] [&>span]:text-xs [&>span]:opacity-70",
        defaultClassNames.day,
        className
      ),
      ...props
    }
  );
}
const Select = Root2$1;
const SelectValue = Value;
const SelectTrigger = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  Trigger$1,
  {
    ref,
    className: cn(
      "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background cursor-pointer data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4 opacity-50" }) })
    ]
  }
));
SelectTrigger.displayName = Trigger$1.displayName;
const SelectScrollUpButton = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  ScrollUpButton,
  {
    ref,
    className: cn("flex cursor-default items-center justify-center py-1", className),
    ...props,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-4 w-4" })
  }
));
SelectScrollUpButton.displayName = ScrollUpButton.displayName;
const SelectScrollDownButton = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  ScrollDownButton,
  {
    ref,
    className: cn("flex cursor-default items-center justify-center py-1", className),
    ...props,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4" })
  }
));
SelectScrollDownButton.displayName = ScrollDownButton.displayName;
const SelectContent = reactExports.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Portal$1, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
  Content2$1,
  {
    ref,
    className: cn(
      "relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-select-content-transform-origin)",
      position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
      className
    ),
    position,
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectScrollUpButton, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Viewport,
        {
          className: cn(
            "p-1",
            position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
          ),
          children
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectScrollDownButton, {})
    ]
  }
) }));
SelectContent.displayName = Content2$1.displayName;
const SelectLabel = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Label,
  {
    ref,
    className: cn("px-2 py-1.5 text-sm font-semibold", className),
    ...props
  }
));
SelectLabel.displayName = Label.displayName;
const SelectItem = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  Item,
  {
    ref,
    className: cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ItemIndicator, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ItemText, { children })
    ]
  }
));
SelectItem.displayName = Item.displayName;
const SelectSeparator = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Separator,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
SelectSeparator.displayName = Separator.displayName;
const schema = objectType({
  name: stringType().trim().min(2, "Ad ən azı 2 hərfdən ibarət olmalıdır").max(100),
  phone: stringType().trim().refine((val) => {
    const digitsOnly = val.replace(/\D/g, "");
    return digitsOnly.length === 12;
  }, {
    message: "Telefon nömrəsi tam yazılmalıdır (məs: +994 50 790 88 88)"
  }),
  reservation_date: stringType().min(1, "Rezervasiya tarixi seçilməlidir"),
  reservation_time: stringType().min(1, "Rezervasiya saatı seçilməlidir"),
  guests: coerce.number().int().min(1, "Qonaq sayısı ən azı 1 olmalıdır").max(50),
  note: stringType().max(500).optional()
});
const TIME_SLOTS = [
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
  "22:00",
  "22:30",
  "23:00",
  "23:30",
  "00:00",
  "00:30"
];
const GUEST_OPTIONS = Array.from({ length: 15 }, (_, i) => String(i + 1));
const inputClasses = "w-full h-11 px-4 py-2 bg-card/65 border border-border/30 rounded-xl text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all hover:border-primary/50 text-left flex items-center justify-between";
const textareaClasses = "w-full min-h-[6rem] px-4 py-3 bg-card/65 border border-border/30 rounded-xl text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none resize-none transition-all hover:border-primary/50";
function ReservationForm() {
  const { t } = useTranslation();
  const [success, setSuccess] = reactExports.useState(false);
  const fn = useServerFn(createReservation);
  const { register, handleSubmit, formState: { errors }, reset, control } = useForm({
    resolver: u(schema),
    defaultValues: { guests: 2, note: "", phone: "+994" }
  });
  const mutation = useMutation({
    mutationFn: (data) => {
      const cleanPhone = data.phone.replace(/\s/g, "");
      return fn({ data: { ...data, phone: cleanPhone, note: data.note ?? "" } });
    },
    onSuccess: () => {
      toast.success(t("reservation.success"));
      setSuccess(true);
      reset();
      setTimeout(() => setSuccess(false), 5e3);
    },
    onError: () => toast.error(t("reservation.error"))
  });
  const formatPhoneInput = (value) => {
    if (!value.startsWith("+994")) {
      const digits2 = value.replace(/\D/g, "");
      const restDigits = digits2.startsWith("994") ? digits2.slice(3) : digits2;
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
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-12 sm:py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 max-w-2xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-3xl sm:text-4xl mb-2 text-gradient-gold", children: t("reservation.title") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: t("reservation.subtitle") })
    ] }),
    success ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        className: "text-center p-10 bg-card/40 backdrop-blur border border-primary/45 rounded-2xl shadow-elegant",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-14 w-14 text-primary mx-auto mb-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-medium text-foreground", children: t("reservation.success") })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "form",
      {
        onSubmit: handleSubmit((d) => mutation.mutate(d)),
        className: "space-y-6 bg-card/25 backdrop-blur-md p-6 sm:p-10 rounded-2xl border border-border/20 shadow-elegant",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: t("reservation.name"), error: errors.name?.message, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                ...register("name"),
                placeholder: "Ad və Soyad",
                className: inputClasses
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: t("reservation.phone"), error: errors.phone?.message, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "tel",
                ...register("phone", {
                  onChange: (e) => {
                    let val = e.target.value;
                    if (val.length < 4) {
                      e.target.value = "+994";
                      return;
                    }
                    e.target.value = formatPhoneInput(val);
                  }
                }),
                placeholder: "+994 50 790 88 88",
                className: inputClasses
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: t("reservation.date"), error: errors.reservation_date?.message, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Controller,
              {
                control,
                name: "reservation_date",
                render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Popover, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      className: `${inputClasses} cursor-pointer`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar$1, { className: "h-4 w-4 text-primary/70" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: field.value ? format(new Date(field.value), "dd.MM.yyyy") : "Tarix seçin" })
                      ] })
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverContent, { className: "w-auto p-0 bg-popover border-border/40", align: "start", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Calendar,
                    {
                      mode: "single",
                      selected: field.value ? new Date(field.value) : void 0,
                      onSelect: (date) => field.onChange(date ? format(date, "yyyy-MM-dd") : ""),
                      disabled: (date) => date < new Date((/* @__PURE__ */ new Date()).setHours(0, 0, 0, 0)),
                      initialFocus: true,
                      className: "bg-popover text-foreground"
                    }
                  ) })
                ] })
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: t("reservation.time"), error: errors.reservation_time?.message, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Controller,
              {
                control,
                name: "reservation_time",
                render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { onValueChange: field.onChange, value: field.value, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: inputClasses, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Saat seçin" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "bg-popover border-border/40 text-foreground max-h-60 overflow-y-auto", children: TIME_SLOTS.map((t2) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: t2, children: t2 }, t2)) })
                ] })
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: t("reservation.guests"), error: errors.guests?.message, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Controller,
              {
                control,
                name: "guests",
                render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { onValueChange: (val) => field.onChange(Number(val)), value: String(field.value), children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: inputClasses, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Qonaq sayısı" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "bg-popover border-border/40 text-foreground max-h-60 overflow-y-auto", children: GUEST_OPTIONS.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: g, children: [
                    g,
                    " nəfər"
                  ] }, g)) })
                ] })
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: t("reservation.note"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              ...register("note"),
              rows: 3,
              placeholder: "Əlavə qeydləriniz (məsələn: sakit masa, pəncərə kənarı...)",
              className: textareaClasses
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "submit",
              disabled: mutation.isPending,
              className: "w-full py-3 bg-gradient-gold text-primary-foreground font-medium rounded-xl hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 disabled:opacity-50 shadow-glow shimmer-gold cursor-pointer",
              children: mutation.isPending ? t("reservation.submitting") : t("reservation.submit")
            }
          )
        ]
      }
    )
  ] }) });
}
function Field({ label, error, children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground/90 mb-1.5 block font-medium", children: label }),
    children,
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-destructive mt-1.5 block font-medium", children: error })
  ] });
}
function ReservationPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(VideoBackground, { position: "fixed", preload: "auto", overlayOpacityClass: "bg-background/25" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-20 sm:py-28 relative z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4 max-w-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ReservationForm, {}) }) })
  ] });
}
export {
  ReservationPage as component
};
