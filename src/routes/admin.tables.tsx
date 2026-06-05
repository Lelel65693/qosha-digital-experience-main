import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo, useEffect } from "react";
import {
  Settings, Save, HelpCircle, SlidersHorizontal,
  FileImage, FileText, Copy
} from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { toast } from "sonner";
import { getMenuItems, getQrSettings, updateQrSettings } from "@/lib/restaurant.functions";
import { supabase } from "@/integrations/supabase/client";

// Helper: always gets the current valid access token from the Supabase session
async function getAuthToken(): Promise<string> {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token ?? "";
}

type QrSettings = {
  id: number;
  fg_color: string;
  bg_color: string;
  logo_url: string;
  logo_active: boolean;
  error_correction: "L" | "M" | "Q" | "H";
  size: number;
  menu_version: number;
};

const qrSettingsQuery = queryOptions({
  queryKey: ["admin-qr-settings-api"],
  queryFn: async (): Promise<QrSettings> => {
    return getQrSettings() as Promise<QrSettings>;
  },
});

const menuQuery = queryOptions({
  queryKey: ["admin-menu-sync-check"],
  queryFn: () => getMenuItems(),
});

function timeAgo(dateString: string) {
  const diff = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "İndi";
  if (minutes < 60) return `${minutes} dəq əvvəl`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} saat əvvəl`;
  return `${Math.floor(hours / 24)} gün əvvəl`;
}

function TablesAdmin() {
  const { data: qrSettings } = useSuspenseQuery(qrSettingsQuery);
  const { data: menuItems } = useSuspenseQuery(menuQuery);
  const qc = useQueryClient();

  // State
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Settings values (temporary local state before save)
  const [fgColor, setFgColor] = useState(qrSettings.fg_color);
  const [bgColor, setBgColor] = useState(qrSettings.bg_color);
  const [logoActive, setLogoActive] = useState(qrSettings.logo_active);
  const [logoUrl, setLogoUrl] = useState(qrSettings.logo_url);
  const [errorCorrection, setErrorCorrection] = useState<"L" | "M" | "Q" | "H">(qrSettings.error_correction);
  const [qrSize, setQrSize] = useState(qrSettings.size);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  // Sync settings local state with database data on load
  useEffect(() => {
    setFgColor(qrSettings.fg_color);
    setBgColor(qrSettings.bg_color);
    setLogoActive(qrSettings.logo_active);
    setLogoUrl(qrSettings.logo_url);
    setErrorCorrection(qrSettings.error_correction);
    setQrSize(qrSettings.size);
  }, [qrSettings]);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  // Last menu edit time sync
  const lastMenuEditTime = useMemo(() => {
    if (!menuItems.length) return "N/A";
    const times = menuItems.map(item => new Date(item.updated_at || item.created_at).getTime());
    const maxTime = Math.max(...times);
    return timeAgo(new Date(maxTime).toISOString());
  }, [menuItems]);

  // Save QR Settings Panel
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
          size: qrSize,
        }
      });
      toast.success("QR tənzimləmələri uğurla yeniləndi");
      setSettingsOpen(false);
      qc.invalidateQueries({ queryKey: ["admin-qr-settings-api"] });
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Logo upload
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `qr/logo-${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("menu-images").upload(path, file, {
        contentType: file.type,
        upsert: true,
      });
      if (error) throw error;
      const { data: pub } = supabase.storage.from("menu-images").getPublicUrl(path);
      setLogoUrl(pub.publicUrl);
      setLogoActive(true);
      toast.success("Loqo yükləndi və QR mərkəzinə əlavə olundu");
      qc.invalidateQueries({ queryKey: ["admin-qr-settings-api"] });
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setUploadingLogo(false);
    }
  };

  // Downloads PNG – reads from hidden high-res QRCodeCanvas, draws branded layout
  const downloadPngLocally = () => {
    const canvasId = "canvas-qr-general";
    const canvasEl = document.getElementById(canvasId) as HTMLCanvasElement | null;
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

    // Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, w, h);

    // Rounded border frame
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

    // QR Code (scaled from hidden canvas)
    ctx.drawImage(canvasEl, padding, padding, qrPx, qrPx);

    const textY = qrPx + padding + 14;

    // Decorative divider
    ctx.strokeStyle = fgColor;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.moveTo(w * 0.25, textY);
    ctx.lineTo(w * 0.75, textY);
    ctx.stroke();
    ctx.globalAlpha = 1;

    ctx.textAlign = "center";

    // Restaurant name
    ctx.fillStyle = fgColor;
    ctx.font = `bold ${Math.max(20, Math.round(qrPx / 15))}px Georgia, serif`;
    ctx.fillText("QOŞA QALA", w / 2, textY + 36);

    // Subtitle
    const subtitle = "Ümumi Menyu";
    ctx.fillStyle = "#4B5563";
    ctx.font = `600 ${Math.max(13, Math.round(qrPx / 22))}px Arial, sans-serif`;
    ctx.fillText(subtitle, w / 2, textY + 68);

    // Phone
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

  // Downloads SVG via server endpoint
  const downloadSvgLocally = () => {
    const filename = "qosha-qala-menyu.svg";
    const link = document.createElement("a");
    link.href = `/api/tables/general/qr?format=svg`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="p-6 bg-[#0A0A0A] min-h-screen text-[#F5F0E8] font-sans">
      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-6 border-b border-border/20 gap-4">
        <div>
          <h1 className="font-display text-4xl text-gradient-gold font-bold">QR Menyu İdarəetmə</h1>
          <p className="text-[#9E9E9E] mt-1 text-sm flex items-center gap-2">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Menyu sinxronizasiyası aktivdir ✓ (Son yenilənmə: {lastMenuEditTime})
            </span>
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-[#111111] hover:bg-[#1A1A1A] border border-border/10 rounded-lg text-sm text-[#C9A84C]"
          >
            <Settings className="h-4 w-4" />
            Nizamlamalar
          </button>
        </div>
      </header>

      {/* QR SETTINGS COLLAPSIBLE PANEL */}
      {settingsOpen && (
        <section className="mb-6 bg-[#111111] border border-border/10 rounded-xl p-5 grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
          <div className="space-y-4">
            <h3 className="font-display text-lg text-[#C9A84C] font-semibold flex items-center gap-2 border-b border-border/10 pb-2">
              <SlidersHorizontal className="h-4 w-4" /> Nizamlamalar
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-[#9E9E9E]">QR Ön Rəngi</label>
                <div className="flex gap-2 items-center mt-1">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="h-8 w-8 rounded border border-border/20 cursor-pointer bg-transparent"
                  />
                  <span className="text-xs font-mono">{fgColor}</span>
                </div>
              </div>
              <div>
                <label className="text-xs text-[#9E9E9E]">QR Arxa Rəngi</label>
                <div className="flex gap-2 items-center mt-1">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="h-8 w-8 rounded border border-border/20 cursor-pointer bg-transparent"
                  />
                  <span className="text-xs font-mono">{bgColor}</span>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-[#9E9E9E] flex justify-between">
                <span>QR Ölçüsü</span>
                <span>{qrSize}px</span>
              </label>
              <input
                type="range"
                min="200"
                max="600"
                value={qrSize}
                onChange={(e) => setQrSize(Number(e.target.value))}
                className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#C9A84C]"
              />
            </div>

            <div className="space-y-2 pt-2 border-t border-border/10">
              <label className="text-xs text-[#9E9E9E]">QR Şablon Dizaynları</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: "Premium Qızılı", fg: "#C9A84C", bg: "#111111" },
                  { name: "Klassik Qara/Ağ", fg: "#000000", bg: "#FFFFFF" },
                  { name: "Lüks Tünd", fg: "#F5F0E8", bg: "#0A0A0A" },
                  { name: "Kral Göyü", fg: "#D4AF37", bg: "#0F1E36" },
                  { name: "Zümrüd Yaşılı", fg: "#E2C799", bg: "#0F2922" },
                  { name: "Şokolad Braunun", fg: "#FDFBF7", bg: "#4A2E1B" },
                ].map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => {
                      setFgColor(preset.fg);
                      setBgColor(preset.bg);
                      toast.success(`"${preset.name}" şablonu tətbiq edildi`);
                    }}
                    type="button"
                    className="flex items-center gap-2 p-2 bg-neutral-900/55 hover:bg-neutral-900 border border-border/10 rounded-lg text-left text-xs transition"
                  >
                    <div
                      className="w-4 h-4 rounded border border-border/20 flex-shrink-0 flex"
                      style={{ backgroundColor: preset.bg }}
                    >
                      <div className="w-1.5 h-1.5 m-auto rounded-full" style={{ backgroundColor: preset.fg }}></div>
                    </div>
                    <span className="truncate text-xs text-[#F5F0E8]">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-display text-lg text-[#C9A84C] font-semibold flex items-center gap-2 border-b border-border/10 pb-2">
              Logo və Xəta Düzəltmə
            </h3>

            <div className="flex items-center justify-between p-2.5 bg-neutral-900/40 rounded-lg border border-border/5">
              <div>
                <div className="text-sm font-medium">QR mərkəzində logo</div>
                <div className="text-xs text-[#9E9E9E]">Overlay logo aktivləşdir</div>
              </div>
              <input
                type="checkbox"
                checked={logoActive}
                onChange={(e) => setLogoActive(e.target.checked)}
                className="w-9 h-5 bg-neutral-800 checked:bg-[#C9A84C] rounded-full appearance-none cursor-pointer relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#F5F0E8] after:rounded-full after:h-4 after:w-4 after:transition-all checked:after:translate-x-4 border border-border/10"
              />
            </div>

            {logoActive && (
              <div className="p-3 bg-neutral-900 rounded-lg border border-border/10 space-y-2">
                <label className="text-xs text-[#9E9E9E]">Logo Şəkli Yüklə (PNG)</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload"
                    disabled={uploadingLogo}
                  />
                  <label
                    htmlFor="logo-upload"
                    className="flex-1 text-center py-2 bg-[#1A1A1A] hover:bg-[#252525] border border-border/10 rounded-lg text-xs cursor-pointer text-[#C9A84C]"
                  >
                    {uploadingLogo ? "Yüklənir..." : "Fayl Seçin"}
                  </label>
                  {logoUrl && (
                    <div className="flex items-center gap-2">
                      <img src={logoUrl} alt="Logo" className="h-8 w-8 object-cover rounded border border-border/10" />
                      <button
                        onClick={() => {
                          setLogoUrl("");
                          setLogoActive(false);
                          toast.success("Logo müvəqqəti silindi, yadda saxla düyməsinə basaraq təsdiqləyin");
                        }}
                        type="button"
                        className="px-2.5 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 rounded-lg text-xs font-semibold transition"
                      >
                        Sil
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div>
              <label className="text-xs text-[#9E9E9E] flex items-center gap-1.5">
                <span>Xəta Düzəltmə Səviyyəsi</span>
                <span className="group relative">
                  <HelpCircle className="h-3.5 w-3.5 text-neutral-500 cursor-help" />
                  <span className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden group-hover:block bg-[#0A0A0A] border border-border/15 p-2 rounded text-[10px] w-48 text-[#F5F0E8] z-20 shadow-lg text-center leading-normal">
                    Logo əlavə etdikdə "H" səviyyəsini seçməyiniz məsləhətdir (maksimum oxunma).
                  </span>
                </span>
              </label>
              <div className="flex gap-4 mt-2">
                {(["L", "M", "Q", "H"] as const).map((level) => (
                  <label key={level} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="ec_level"
                      checked={errorCorrection === level}
                      onChange={() => setErrorCorrection(level)}
                      className="accent-[#C9A84C]"
                    />
                    {level}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="font-display text-lg text-[#C9A84C] font-semibold border-b border-border/10 pb-2 mb-3">
                Canlı Önizləmə (Demo)
              </h3>
              <div className="flex justify-center p-3 bg-white rounded-lg w-fit mx-auto border border-border/10">
                <QRCodeCanvas
                  value="https://qosaqala.az/menu"
                  size={140}
                  level={errorCorrection}
                  bgColor={bgColor}
                  fgColor={fgColor}
                  imageSettings={logoActive && logoUrl ? {
                    src: logoUrl,
                    x: undefined,
                    y: undefined,
                    height: 28,
                    width: 28,
                    excavate: true,
                  } : undefined}
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end mt-4">
              <button
                onClick={() => setSettingsOpen(false)}
                className="px-4 py-2 border border-border/10 rounded-lg text-sm"
              >
                Ləğv
              </button>
              <button
                onClick={handleSaveSettings}
                disabled={isSavingSettings}
                className="px-4 py-2 bg-gradient-gold text-primary-foreground font-semibold rounded-lg text-sm flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                💾 Yadda Saxla
              </button>
            </div>
          </div>
        </section>
      )}

      {/* GENERAL QR CODE BANNER */}
      <section className="mb-8 bg-[#111111] border-2 border-[#C9A84C]/40 rounded-2xl p-8 flex flex-col lg:flex-row items-center gap-10 shadow-lg animate-slideUp max-w-4xl mx-auto mt-6">
        {/* Hidden high-res QRCodeCanvas for PNG export */}
        <div className="hidden" aria-hidden="true">
          <QRCodeCanvas
            id="canvas-qr-general"
            value="https://qosaqala.az/menu"
            size={Math.max(qrSize, 400)}
            level={qrSettings.error_correction}
            bgColor={qrSettings.bg_color}
            fgColor={qrSettings.fg_color}
            imageSettings={qrSettings.logo_active && qrSettings.logo_url ? {
              src: qrSettings.logo_url, height: 40, width: 40, excavate: true,
            } : undefined}
          />
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-xl flex-shrink-0 border border-neutral-200">
          <QRCodeCanvas
            value="https://qosaqala.az/menu"
            size={220}
            level={qrSettings.error_correction}
            bgColor={qrSettings.bg_color}
            fgColor={qrSettings.fg_color}
            imageSettings={qrSettings.logo_active && qrSettings.logo_url ? {
              src: qrSettings.logo_url,
              x: undefined,
              y: undefined,
              height: 44,
              width: 44,
              excavate: true,
            } : undefined}
          />
        </div>

        <div className="flex-1 space-y-5 text-center lg:text-left">
          <div>
            <span className="text-xs bg-[#C9A84C]/15 text-[#C9A84C] px-3 py-1 rounded-full font-bold tracking-wide uppercase border border-[#C9A84C]/10">
              🔒 Daimi Restoran QR Kodu
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-[#F5F0E8] mt-4">Qoşa Qala Ümumi Menyu QR</h2>
            <p className="text-sm text-[#9E9E9E] mt-2 leading-relaxed max-w-xl">
              Bu, restoranınız üçün istifadə ediləcək vahid, sabit QR koddur. Bir dəfə çap edildikdən sonra menyuda etdiyiniz bütün dəyişikliklər avtomatik olaraq bu QR koda tətbiq olunur, lakin QR kodun özü heç vaxt dəyişmir.
            </p>
          </div>

          <div className="text-sm text-[#C9A84C] bg-[#0A0A0A] px-4 py-3 rounded-xl border border-border/10 font-mono break-all inline-block select-all">
            https://qosaqala.az/menu
          </div>

          <div className="flex flex-wrap gap-2.5 justify-center lg:justify-start">
            <button
              onClick={downloadPngLocally}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#1A1A1A] hover:bg-[#252525] border border-border/10 rounded-xl text-xs text-[#C9A84C] font-semibold transition"
            >
              <FileImage className="h-4 w-4" />
              PNG Yüklə
            </button>
            <button
              onClick={downloadSvgLocally}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#1A1A1A] hover:bg-[#252525] border border-border/10 rounded-xl text-xs text-[#C9A84C] font-semibold transition"
            >
              <FileImage className="h-4 w-4" />
              SVG Yüklə
            </button>
            <a
              href="/api/tables/general/qr/pdf"
              className="flex items-center gap-2 px-4 py-2.5 bg-[#1A1A1A] hover:bg-[#252525] border border-border/10 rounded-xl text-xs text-[#C9A84C] font-semibold text-center transition"
            >
              <FileText className="h-4 w-4" />
              PDF Poster (A4)
            </a>
            <button
              onClick={() => {
                navigator.clipboard.writeText("https://qosaqala.az/menu");
                toast.success("Mətn kopyalandı ✓");
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-gold text-primary-foreground font-semibold rounded-xl text-xs transition"
            >
              <Copy className="h-4 w-4" />
              Linki Kopyala
            </button>
          </div>
        </div>
      </section>

      {/* Embedded styles */}
      <style>{`
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
      `}</style>
    </div>
  );
}
