import { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { BioData, clearBioData, emptyBioData, loadBioData, saveBioData } from "@/lib/biodata";
import { BioDataForm } from "@/components/BioDataForm";
import { BioDataPreview } from "@/components/BioDataPreview";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Eye, FileText, RotateCcw, Save, Heart } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [data, setData] = useState<BioData>(emptyBioData);
  const [tab, setTab] = useState("edit");
  const [downloading, setDownloading] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Load on mount
  useEffect(() => {
    setData(loadBioData());
  }, []);

  // Auto-save
  useEffect(() => {
    const t = setTimeout(() => saveBioData(data), 400);
    return () => clearTimeout(t);
  }, [data]);

  const handleReset = () => {
    if (confirm("Clear all saved bio-data? This cannot be undone.")) {
      clearBioData();
      setData(emptyBioData);
      toast.success("Bio-data cleared");
    }
  };

  const handleSave = () => {
    saveBioData(data);
    toast.success("Saved locally");
  };

  const handleDownload = async () => {
    if (!previewRef.current) return;
    setDownloading(true);
    try {
      // ensure preview is rendered
      const node = previewRef.current;
      const canvas = await html2canvas(node, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#fdf8f0",
      });
      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const canvasRatio = canvas.width / canvas.height; // w/h
      const pageRatio = pageWidth / pageHeight;
      let imgWidth: number;
      let imgHeight: number;
      if (canvasRatio > pageRatio) {
        // limited by width
        imgWidth = pageWidth;
        imgHeight = pageWidth / canvasRatio;
      } else {
        // limited by height — fit fully on one page
        imgHeight = pageHeight;
        imgWidth = pageHeight * canvasRatio;
      }
      const x = (pageWidth - imgWidth) / 2;
      const y = (pageHeight - imgHeight) / 2;
      pdf.addImage(imgData, "JPEG", x, y, imgWidth, imgHeight);
      const filename = `${(data.name || "bio-data").replace(/\s+/g, "_")}_BioData.pdf`;
      pdf.save(filename);
      toast.success("PDF downloaded");
    } catch (e) {
      console.error(e);
      toast.error("Failed to generate PDF");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-royal text-cream shadow-royal">
        <div className="container max-w-6xl py-8 px-4 text-center relative">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-gold">✦</span>
            <Heart className="w-5 h-5 text-gold fill-gold" />
            <span className="text-gold">✦</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-wide">
            Marriage Bio-Data Maker
          </h1>
          <p className="mt-2 text-cream/80 text-sm md:text-base">
            Create a beautiful, traditional bio-data and download it as PDF
          </p>
          <div className="flex items-center justify-center gap-3 mt-3">
            <span className="h-px w-20 bg-gold/60" />
            <span className="text-gold text-xs">❦</span>
            <span className="h-px w-20 bg-gold/60" />
          </div>
        </div>
      </header>

      <main className="container max-w-6xl py-8 px-4">
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <TabsList className="bg-secondary border border-gold/40">
              <TabsTrigger value="edit" className="data-[state=active]:bg-maroon data-[state=active]:text-cream">
                <FileText className="w-4 h-4 mr-2" /> Edit Details
              </TabsTrigger>
              <TabsTrigger value="preview" className="data-[state=active]:bg-maroon data-[state=active]:text-cream">
                <Eye className="w-4 h-4 mr-2" /> Preview
              </TabsTrigger>
            </TabsList>

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={handleSave} className="border-maroon text-maroon hover:bg-maroon hover:text-cream">
                <Save className="w-4 h-4 mr-2" /> Save
              </Button>
              <Button variant="outline" onClick={handleReset} className="border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground">
                <RotateCcw className="w-4 h-4 mr-2" /> Reset
              </Button>
              <Button onClick={handleDownload} disabled={downloading} className="bg-gradient-gold text-ink hover:opacity-90 font-semibold shadow-soft">
                <Download className="w-4 h-4 mr-2" />
                {downloading ? "Generating..." : "Download PDF"}
              </Button>
            </div>
          </div>

          <TabsContent value="edit" className="mt-0">
            <div className="bg-card rounded-lg shadow-soft border border-gold/30 p-6 md:p-8">
              <BioDataForm data={data} onChange={setData} />
            </div>
          </TabsContent>

          <TabsContent value="preview" className="mt-0">
            <div className="overflow-auto rounded-lg shadow-royal border border-gold/30 bg-cream">
              <div className="mx-auto" style={{ maxWidth: "800px" }}>
                <BioDataPreview ref={previewRef} data={data} />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Off-screen preview render so PDF works even from edit tab */}
        {tab === "edit" && (
          <div style={{ position: "fixed", left: "-10000px", top: 0, width: "800px" }} aria-hidden>
            <BioDataPreview ref={previewRef} data={data} />
          </div>
        )}

        <p className="text-center text-xs text-muted-foreground mt-8">
          Your data is saved locally in your browser — nothing is uploaded.
        </p>
      </main>
    </div>
  );
};

export default Index;
