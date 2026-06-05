import { jsxs, jsx } from "react/jsx-runtime";
import { q as qrSettingsQuery, n as menuQuery, o as updateQrSettings } from "./router-elzLnl4O.js";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useMemo } from "react";
import { Settings, SlidersHorizontal, HelpCircle, Save, FileImage, FileText, Copy } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { toast } from "sonner";
import { supabase } from "./client-Cg-358lU.js";
import "@tanstack/react-router";
import "../server.js";
import "node:async_hooks";
import "h3-v2";
import "@tanstack/router-core";
import "seroval";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core/ssr/server";
import "@tanstack/react-router/ssr/server";
import "zod";
import "./auth-middleware-C27HKC4i.js";
import "@supabase/supabase-js";
function timeAgo(dateString) {
  const diff = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diff / 6e4);
  if (minutes < 1) return "İndi";
  if (minutes < 60) return `${minutes} dəq əvvəl`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} saat əvvəl`;
  return `${Math.floor(hours / 24)} gün əvvəl`;
}
function TablesAdmin() {
  const {
    data: qrSettings
  } = useSuspenseQuery(qrSettingsQuery);
  const {
    data: menuItems
  } = useSuspenseQuery(menuQuery);
  const qc = useQueryClient();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [fgColor, setFgColor] = useState(qrSettings.fg_color);
  const [bgColor, setBgColor] = useState(qrSettings.bg_color);
  const [logoActive, setLogoActive] = useState(qrSettings.logo_active);
  const [logoUrl, setLogoUrl] = useState(qrSettings.logo_url);
  const [errorCorrection, setErrorCorrection] = useState(qrSettings.error_correction);
  const [qrSize, setQrSize] = useState(qrSettings.size);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  useEffect(() => {
    setFgColor(qrSettings.fg_color);
    setBgColor(qrSettings.bg_color);
    setLogoActive(qrSettings.logo_active);
    setLogoUrl(qrSettings.logo_url);
    setErrorCorrection(qrSettings.error_correction);
    setQrSize(qrSettings.size);
  }, [qrSettings]);
  const lastMenuEditTime = useMemo(() => {
    if (!menuItems.length) return "N/A";
    const times = menuItems.map((item) => new Date(item.updated_at || item.created_at).getTime());
    const maxTime = Math.max(...times);
    return timeAgo(new Date(maxTime).toISOString());
  }, [menuItems]);
  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    try {
      await updateQrSettings({
        data: {
          fg_color: fgColor,
          bg_color: bgColor,
          logo_url: logoUrl || null,
          logo_active: logoActive,
          error_correction: errorCorrection,
          size: qrSize
        }
      });
      toast.success("QR tənzimləmələri uğurla yeniləndi");
      setSettingsOpen(false);
      qc.invalidateQueries({
        queryKey: ["admin-qr-settings-api"]
      });
    } catch (e) {
      toast.error(e.message);
    } finally {
      setIsSavingSettings(false);
    }
  };
  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `qr/logo-${Date.now()}.${ext}`;
      const {
        error
      } = await supabase.storage.from("menu-images").upload(path, file, {
        contentType: file.type,
        upsert: true
      });
      if (error) throw error;
      const {
        data: pub
      } = supabase.storage.from("menu-images").getPublicUrl(path);
      setLogoUrl(pub.publicUrl);
      setLogoActive(true);
      toast.success("Loqo yükləndi və QR mərkəzinə əlavə olundu");
      qc.invalidateQueries({
        queryKey: ["admin-qr-settings-api"]
      });
    } catch (e2) {
      toast.error(e2.message);
    } finally {
      setUploadingLogo(false);
    }
  };
  const downloadPngLocally = () => {
    const canvasId = "canvas-qr-general";
    const canvasEl = document.getElementById(canvasId);
    if (!canvasEl) {
      toast.error("QR canvas tapılmadı. Səhifəni yeniləyin.");
      return;
    }
    const qrPx = Math.max(200, qrSize);
    const padding = 48;
    const textH = 130;
    const w = qrPx + padding * 2;
    const h = qrPx + padding + textH;
    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = w;
    exportCanvas.height = h;
    const ctx = exportCanvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = fgColor;
    ctx.lineWidth = 4;
    const rd = 16;
    ctx.beginPath();
    ctx.moveTo(10 + rd, 10);
    ctx.lineTo(w - 10 - rd, 10);
    ctx.arcTo(w - 10, 10, w - 10, 10 + rd, rd);
    ctx.lineTo(w - 10, h - 10 - rd);
    ctx.arcTo(w - 10, h - 10, w - 10 - rd, h - 10, rd);
    ctx.lineTo(10 + rd, h - 10);
    ctx.arcTo(10, h - 10, 10, h - 10 - rd, rd);
    ctx.lineTo(10, 10 + rd);
    ctx.arcTo(10, 10, 10 + rd, 10, rd);
    ctx.closePath();
    ctx.stroke();
    ctx.drawImage(canvasEl, padding, padding, qrPx, qrPx);
    const textY = qrPx + padding + 14;
    ctx.strokeStyle = fgColor;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.moveTo(w * 0.25, textY);
    ctx.lineTo(w * 0.75, textY);
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.textAlign = "center";
    ctx.fillStyle = fgColor;
    ctx.font = `bold ${Math.max(20, Math.round(qrPx / 15))}px Georgia, serif`;
    ctx.fillText("QOŞA QALA", w / 2, textY + 36);
    const subtitle = "Ümumi Menyu";
    ctx.fillStyle = "#4B5563";
    ctx.font = `600 ${Math.max(13, Math.round(qrPx / 22))}px Arial, sans-serif`;
    ctx.fillText(subtitle, w / 2, textY + 68);
    ctx.fillStyle = "#9CA3AF";
    ctx.font = `${Math.max(11, Math.round(qrPx / 32))}px Arial, sans-serif`;
    ctx.fillText("+994 50 615 88 88", w / 2, textY + 96);
    exportCanvas.toBlob((blob) => {
      if (!blob) return;
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "qosha-qala-menyu.png";
      document.body.appendChild(link);
      link.click();
      link.remove();
    }, "image/png");
  };
  const downloadSvgLocally = () => {
    const filename = "qosha-qala-menyu.svg";
    const link = document.createElement("a");
    link.href = `/api/tables/general/qr?format=svg`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };
  return /* @__PURE__ */ jsxs("div", { className: "p-6 bg-[#0A0A0A] min-h-screen text-[#F5F0E8] font-sans", children: [
    /* @__PURE__ */ jsxs("header", { className: "flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-6 border-b border-border/20 gap-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "font-display text-4xl text-gradient-gold font-bold", children: "QR Menyu İdarəetmə" }),
        /* @__PURE__ */ jsx("p", { className: "text-[#9E9E9E] mt-1 text-sm flex items-center gap-2", children: /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsx("span", { className: "h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" }),
          "Menyu sinxronizasiyası aktivdir ✓ (Son yenilənmə: ",
          lastMenuEditTime,
          ")"
        ] }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: /* @__PURE__ */ jsxs("button", { onClick: () => setSettingsOpen(!settingsOpen), className: "flex items-center gap-2 px-4 py-2 bg-[#111111] hover:bg-[#1A1A1A] border border-border/10 rounded-lg text-sm text-[#C9A84C]", children: [
        /* @__PURE__ */ jsx(Settings, { className: "h-4 w-4" }),
        "Nizamlamalar"
      ] }) })
    ] }),
    settingsOpen && /* @__PURE__ */ jsxs("section", { className: "mb-6 bg-[#111111] border border-border/10 rounded-xl p-5 grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("h3", { className: "font-display text-lg text-[#C9A84C] font-semibold flex items-center gap-2 border-b border-border/10 pb-2", children: [
          /* @__PURE__ */ jsx(SlidersHorizontal, { className: "h-4 w-4" }),
          " Nizamlamalar"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs text-[#9E9E9E]", children: "QR Ön Rəngi" }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-2 items-center mt-1", children: [
              /* @__PURE__ */ jsx("input", { type: "color", value: fgColor, onChange: (e) => setFgColor(e.target.value), className: "h-8 w-8 rounded border border-border/20 cursor-pointer bg-transparent" }),
              /* @__PURE__ */ jsx("span", { className: "text-xs font-mono", children: fgColor })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs text-[#9E9E9E]", children: "QR Arxa Rəngi" }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-2 items-center mt-1", children: [
              /* @__PURE__ */ jsx("input", { type: "color", value: bgColor, onChange: (e) => setBgColor(e.target.value), className: "h-8 w-8 rounded border border-border/20 cursor-pointer bg-transparent" }),
              /* @__PURE__ */ jsx("span", { className: "text-xs font-mono", children: bgColor })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxs("label", { className: "text-xs text-[#9E9E9E] flex justify-between", children: [
            /* @__PURE__ */ jsx("span", { children: "QR Ölçüsü" }),
            /* @__PURE__ */ jsxs("span", { children: [
              qrSize,
              "px"
            ] })
          ] }),
          /* @__PURE__ */ jsx("input", { type: "range", min: "200", max: "600", value: qrSize, onChange: (e) => setQrSize(Number(e.target.value)), className: "w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#C9A84C]" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2 pt-2 border-t border-border/10", children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs text-[#9E9E9E]", children: "QR Şablon Dizaynları" }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-2", children: [{
            name: "Premium Qızılı",
            fg: "#C9A84C",
            bg: "#111111"
          }, {
            name: "Klassik Qara/Ağ",
            fg: "#000000",
            bg: "#FFFFFF"
          }, {
            name: "Lüks Tünd",
            fg: "#F5F0E8",
            bg: "#0A0A0A"
          }, {
            name: "Kral Göyü",
            fg: "#D4AF37",
            bg: "#0F1E36"
          }, {
            name: "Zümrüd Yaşılı",
            fg: "#E2C799",
            bg: "#0F2922"
          }, {
            name: "Şokolad Braunun",
            fg: "#FDFBF7",
            bg: "#4A2E1B"
          }].map((preset) => /* @__PURE__ */ jsxs("button", { onClick: () => {
            setFgColor(preset.fg);
            setBgColor(preset.bg);
            toast.success(`"${preset.name}" şablonu tətbiq edildi`);
          }, type: "button", className: "flex items-center gap-2 p-2 bg-neutral-900/55 hover:bg-neutral-900 border border-border/10 rounded-lg text-left text-xs transition", children: [
            /* @__PURE__ */ jsx("div", { className: "w-4 h-4 rounded border border-border/20 flex-shrink-0 flex", style: {
              backgroundColor: preset.bg
            }, children: /* @__PURE__ */ jsx("div", { className: "w-1.5 h-1.5 m-auto rounded-full", style: {
              backgroundColor: preset.fg
            } }) }),
            /* @__PURE__ */ jsx("span", { className: "truncate text-xs text-[#F5F0E8]", children: preset.name })
          ] }, preset.name)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-display text-lg text-[#C9A84C] font-semibold flex items-center gap-2 border-b border-border/10 pb-2", children: "Logo və Xəta Düzəltmə" }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-2.5 bg-neutral-900/40 rounded-lg border border-border/5", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-sm font-medium", children: "QR mərkəzində logo" }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-[#9E9E9E]", children: "Overlay logo aktivləşdir" })
          ] }),
          /* @__PURE__ */ jsx("input", { type: "checkbox", checked: logoActive, onChange: (e) => setLogoActive(e.target.checked), className: "w-9 h-5 bg-neutral-800 checked:bg-[#C9A84C] rounded-full appearance-none cursor-pointer relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#F5F0E8] after:rounded-full after:h-4 after:w-4 after:transition-all checked:after:translate-x-4 border border-border/10" })
        ] }),
        logoActive && /* @__PURE__ */ jsxs("div", { className: "p-3 bg-neutral-900 rounded-lg border border-border/10 space-y-2", children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs text-[#9E9E9E]", children: "Logo Şəkli Yüklə (PNG)" }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2 items-center", children: [
            /* @__PURE__ */ jsx("input", { type: "file", accept: "image/*", onChange: handleLogoUpload, className: "hidden", id: "logo-upload", disabled: uploadingLogo }),
            /* @__PURE__ */ jsx("label", { htmlFor: "logo-upload", className: "flex-1 text-center py-2 bg-[#1A1A1A] hover:bg-[#252525] border border-border/10 rounded-lg text-xs cursor-pointer text-[#C9A84C]", children: uploadingLogo ? "Yüklənir..." : "Fayl Seçin" }),
            logoUrl && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("img", { src: logoUrl, alt: "Logo", className: "h-8 w-8 object-cover rounded border border-border/10" }),
              /* @__PURE__ */ jsx("button", { onClick: () => {
                setLogoUrl("");
                setLogoActive(false);
                toast.success("Logo müvəqqəti silindi, yadda saxla düyməsinə basaraq təsdiqləyin");
              }, type: "button", className: "px-2.5 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 rounded-lg text-xs font-semibold transition", children: "Sil" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("label", { className: "text-xs text-[#9E9E9E] flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx("span", { children: "Xəta Düzəltmə Səviyyəsi" }),
            /* @__PURE__ */ jsxs("span", { className: "group relative", children: [
              /* @__PURE__ */ jsx(HelpCircle, { className: "h-3.5 w-3.5 text-neutral-500 cursor-help" }),
              /* @__PURE__ */ jsx("span", { className: "absolute bottom-6 left-1/2 -translate-x-1/2 hidden group-hover:block bg-[#0A0A0A] border border-border/15 p-2 rounded text-[10px] w-48 text-[#F5F0E8] z-20 shadow-lg text-center leading-normal", children: 'Logo əlavə etdikdə "H" səviyyəsini seçməyiniz məsləhətdir (maksimum oxunma).' })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex gap-4 mt-2", children: ["L", "M", "Q", "H"].map((level) => /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 text-sm cursor-pointer", children: [
            /* @__PURE__ */ jsx("input", { type: "radio", name: "ec_level", checked: errorCorrection === level, onChange: () => setErrorCorrection(level), className: "accent-[#C9A84C]" }),
            level
          ] }, level)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4 flex flex-col justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "font-display text-lg text-[#C9A84C] font-semibold border-b border-border/10 pb-2 mb-3", children: "Canlı Önizləmə (Demo)" }),
          /* @__PURE__ */ jsx("div", { className: "flex justify-center p-3 bg-white rounded-lg w-fit mx-auto border border-border/10", children: /* @__PURE__ */ jsx(QRCodeCanvas, { value: "https://qosaqala.az/menu", size: 140, level: errorCorrection, bgColor, fgColor, imageSettings: logoActive && logoUrl ? {
            src: logoUrl,
            x: void 0,
            y: void 0,
            height: 28,
            width: 28,
            excavate: true
          } : void 0 }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2 justify-end mt-4", children: [
          /* @__PURE__ */ jsx("button", { onClick: () => setSettingsOpen(false), className: "px-4 py-2 border border-border/10 rounded-lg text-sm", children: "Ləğv" }),
          /* @__PURE__ */ jsxs("button", { onClick: handleSaveSettings, disabled: isSavingSettings, className: "px-4 py-2 bg-gradient-gold text-primary-foreground font-semibold rounded-lg text-sm flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }),
            "💾 Yadda Saxla"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "mb-8 bg-[#111111] border-2 border-[#C9A84C]/40 rounded-2xl p-8 flex flex-col lg:flex-row items-center gap-10 shadow-lg animate-slideUp max-w-4xl mx-auto mt-6", children: [
      /* @__PURE__ */ jsx("div", { className: "hidden", "aria-hidden": "true", children: /* @__PURE__ */ jsx(QRCodeCanvas, { id: "canvas-qr-general", value: "https://qosaqala.az/menu", size: Math.max(qrSize, 400), level: qrSettings.error_correction, bgColor: qrSettings.bg_color, fgColor: qrSettings.fg_color, imageSettings: qrSettings.logo_active && qrSettings.logo_url ? {
        src: qrSettings.logo_url,
        height: 40,
        width: 40,
        excavate: true
      } : void 0 }) }),
      /* @__PURE__ */ jsx("div", { className: "bg-white p-5 rounded-2xl shadow-xl flex-shrink-0 border border-neutral-200", children: /* @__PURE__ */ jsx(QRCodeCanvas, { value: "https://qosaqala.az/menu", size: 220, level: qrSettings.error_correction, bgColor: qrSettings.bg_color, fgColor: qrSettings.fg_color, imageSettings: qrSettings.logo_active && qrSettings.logo_url ? {
        src: qrSettings.logo_url,
        x: void 0,
        y: void 0,
        height: 44,
        width: 44,
        excavate: true
      } : void 0 }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-5 text-center lg:text-left", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "text-xs bg-[#C9A84C]/15 text-[#C9A84C] px-3 py-1 rounded-full font-bold tracking-wide uppercase border border-[#C9A84C]/10", children: "🔒 Daimi Restoran QR Kodu" }),
          /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl md:text-4xl font-bold text-[#F5F0E8] mt-4", children: "Qoşa Qala Ümumi Menyu QR" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-[#9E9E9E] mt-2 leading-relaxed max-w-xl", children: "Bu, restoranınız üçün istifadə ediləcək vahid, sabit QR koddur. Bir dəfə çap edildikdən sonra menyuda etdiyiniz bütün dəyişikliklər avtomatik olaraq bu QR koda tətbiq olunur, lakin QR kodun özü heç vaxt dəyişmir." })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "text-sm text-[#C9A84C] bg-[#0A0A0A] px-4 py-3 rounded-xl border border-border/10 font-mono break-all inline-block select-all", children: "https://qosaqala.az/menu" }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2.5 justify-center lg:justify-start", children: [
          /* @__PURE__ */ jsxs("button", { onClick: downloadPngLocally, className: "flex items-center gap-2 px-4 py-2.5 bg-[#1A1A1A] hover:bg-[#252525] border border-border/10 rounded-xl text-xs text-[#C9A84C] font-semibold transition", children: [
            /* @__PURE__ */ jsx(FileImage, { className: "h-4 w-4" }),
            "PNG Yüklə"
          ] }),
          /* @__PURE__ */ jsxs("button", { onClick: downloadSvgLocally, className: "flex items-center gap-2 px-4 py-2.5 bg-[#1A1A1A] hover:bg-[#252525] border border-border/10 rounded-xl text-xs text-[#C9A84C] font-semibold transition", children: [
            /* @__PURE__ */ jsx(FileImage, { className: "h-4 w-4" }),
            "SVG Yüklə"
          ] }),
          /* @__PURE__ */ jsxs("a", { href: "/api/tables/general/qr/pdf", className: "flex items-center gap-2 px-4 py-2.5 bg-[#1A1A1A] hover:bg-[#252525] border border-border/10 rounded-xl text-xs text-[#C9A84C] font-semibold text-center transition", children: [
            /* @__PURE__ */ jsx(FileText, { className: "h-4 w-4" }),
            "PDF Poster (A4)"
          ] }),
          /* @__PURE__ */ jsxs("button", { onClick: () => {
            navigator.clipboard.writeText("https://qosaqala.az/menu");
            toast.success("Mətn kopyalandı ✓");
          }, className: "flex items-center gap-2 px-4 py-2.5 bg-gradient-gold text-primary-foreground font-semibold rounded-xl text-xs transition", children: [
            /* @__PURE__ */ jsx(Copy, { className: "h-4 w-4" }),
            "Linki Kopyala"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("style", { children: `
        .bg-gradient-gold {
          background: linear-gradient(135deg, #C9A84C 0%, #8B6914 100%);
          color: #0A0A0A;
        }
        .bg-gradient-gold:hover {
          background: linear-gradient(135deg, #DFBF64 0%, #A0802B 100%);
        }
        .text-gradient-gold {
          background: linear-gradient(135deg, #C9A84C 0%, #F5F0E8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out forwards;
        }
        .animate-slideUp {
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      ` })
  ] });
}
export {
  TablesAdmin as component
};
