import { useRef } from "react";
import { BioData } from "@/lib/biodata";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, User, X, Images } from "lucide-react";

interface Props {
  data: BioData;
  onChange: (data: BioData) => void;
}

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="font-display text-xl text-maroon font-bold mb-4 pb-2 border-b border-gold/40">
    {children}
  </h3>
);

const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-1.5">
    <Label className="text-sm font-medium text-ink">{label}</Label>
    {children}
  </div>
);

export const BioDataForm = ({ data, onChange }: Props) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const set = <K extends keyof BioData>(k: K, v: BioData[K]) =>
    onChange({ ...data, [k]: v });

  const compressImage = (file: File, maxDim = 1600, quality = 0.85): Promise<string> =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;
          if (width > height && width > maxDim) {
            height = (height * maxDim) / width;
            width = maxDim;
          } else if (height > maxDim) {
            width = (width * maxDim) / height;
            height = maxDim;
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) return resolve(reader.result as string);
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", quality));
        };
        img.onerror = () => resolve(reader.result as string);
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    });

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const compressed = await compressImage(file, 800, 0.85);
    set("photo", compressed);
  };

  const handleGallery = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const compressed = await Promise.all(files.map((f) => compressImage(f, 1600, 0.85)));
    set("gallery", [...(data.gallery || []), ...compressed]);
    if (galleryRef.current) galleryRef.current.value = "";
  };

  const removeGalleryImage = (idx: number) => {
    set("gallery", (data.gallery || []).filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-8">
      {/* Photo */}
      <section>
        <SectionTitle>Photograph</SectionTitle>
        <div className="flex items-center gap-6">
          <div className="w-32 h-40 rounded-md border-2 border-gold bg-cream flex items-center justify-center overflow-hidden shadow-soft">
            {data.photo ? (
              <img src={data.photo} alt="profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-12 h-12 text-maroon/30" />
            )}
          </div>
          <div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handlePhoto}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileRef.current?.click()}
              className="border-maroon text-maroon hover:bg-maroon hover:text-cream"
            >
              <Upload className="w-4 h-4 mr-2" />
              {data.photo ? "Change Photo" : "Upload Photo"}
            </Button>
            {data.photo && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => set("photo", "")}
                className="ml-2 text-maroon"
              >
                Remove
              </Button>
            )}
          </div>
        </div>
        <div className="mt-4 max-w-xs">
          <Field label="Photo Position (in PDF)">
            <Select value={data.photoPosition} onValueChange={(v) => set("photoPosition", v as "left" | "right")}>
              <SelectTrigger><SelectValue placeholder="Select position" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left of About Me</SelectItem>
                <SelectItem value="right">Right of About Me</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>
      </section>

      {/* Additional Photos */}
      <section>
        <SectionTitle>Additional Photos</SectionTitle>
        <p className="text-sm text-muted-foreground mb-3">
          Each uploaded image will appear on its own landscape page in the PDF.
        </p>
        <input
          ref={galleryRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleGallery}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => galleryRef.current?.click()}
          className="border-maroon text-maroon hover:bg-maroon hover:text-cream"
        >
          <Images className="w-4 h-4 mr-2" />
          Upload Images
        </Button>
        {data.gallery && data.gallery.length > 0 && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {data.gallery.map((src, i) => (
              <div key={i} className="relative group border-2 border-gold rounded-md overflow-hidden bg-cream aspect-[4/3]">
                <img src={src} alt={`upload-${i}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeGalleryImage(i)}
                  className="absolute top-1 right-1 bg-maroon text-cream rounded-full p-1 opacity-90 hover:opacity-100"
                  aria-label="Remove image"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>


      <section>
        <SectionTitle>Personal Details</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Full Name">
            <Input value={data.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Aanya Sharma" />
          </Field>
          <Field label="Date of Birth">
            <Input type="date" value={data.dateOfBirth} onChange={(e) => set("dateOfBirth", e.target.value)} />
          </Field>
          <Field label="Height">
            <Input value={data.height} onChange={(e) => set("height", e.target.value)} placeholder={`e.g. 5'6" / 168 cm`} />
          </Field>
          <Field label="Marital Status">
            <Select value={data.maritalStatus} onValueChange={(v) => set("maritalStatus", v)}>
              <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Never Married">Never Married</SelectItem>
                <SelectItem value="Divorced">Divorced</SelectItem>
                <SelectItem value="Widowed">Widowed</SelectItem>
                <SelectItem value="Separated">Separated</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Religion">
            <Input value={data.religion} onChange={(e) => set("religion", e.target.value)} placeholder="e.g. Hindu" />
          </Field>
          <Field label="Caste / Community">
            <Input value={data.caste} onChange={(e) => set("caste", e.target.value)} placeholder="e.g. Brahmin" />
          </Field>
          <Field label="Manglik">
            <Select value={data.manglik} onValueChange={(v) => set("manglik", v)}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
                <SelectItem value="Anshik (Partial)">Anshik (Partial)</SelectItem>
                <SelectItem value="Don't Know">Don't Know</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Place of Birth">
            <Input value={data.placeOfBirth} onChange={(e) => set("placeOfBirth", e.target.value)} placeholder="e.g. Pune, Maharashtra" />
          </Field>
          <Field label="Contact Number">
            <Input value={data.contact} onChange={(e) => set("contact", e.target.value)} placeholder="+91 ..." />
          </Field>
          <Field label="Email">
            <Input type="email" value={data.email} onChange={(e) => set("email", e.target.value)} placeholder="you@example.com" />
          </Field>
        </div>
      </section>

      {/* Education & Career */}
      <section>
        <SectionTitle>Education & Career</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Degrees / Qualifications">
            <Textarea value={data.degrees} onChange={(e) => set("degrees", e.target.value)} placeholder="e.g. B.Tech (Computer Science), MBA" rows={2} />
          </Field>
          <Field label="Current Employment / Designation">
            <Input value={data.currentEmployment} onChange={(e) => set("currentEmployment", e.target.value)} placeholder="e.g. Software Engineer" />
          </Field>
          <Field label="Employer / Company Details">
            <Input value={data.employmentDetails} onChange={(e) => set("employmentDetails", e.target.value)} placeholder="e.g. Infosys, Bengaluru" />
          </Field>
          <Field label="Annual Income (optional)">
            <Input value={data.income} onChange={(e) => set("income", e.target.value)} placeholder="e.g. ₹ 12 LPA" />
          </Field>
        </div>
      </section>

      {/* Family */}
      <section>
        <SectionTitle>Family Details</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Father's Name">
            <Input value={data.fatherName} onChange={(e) => set("fatherName", e.target.value)} />
          </Field>
          <Field label="Father's Occupation">
            <Input value={data.fatherOccupation} onChange={(e) => set("fatherOccupation", e.target.value)} placeholder="e.g. Retired Banker" />
          </Field>
          <Field label="Mother's Name">
            <Input value={data.motherName} onChange={(e) => set("motherName", e.target.value)} />
          </Field>
          <Field label="Mother's Occupation">
            <Input value={data.motherOccupation} onChange={(e) => set("motherOccupation", e.target.value)} placeholder="e.g. Homemaker" />
          </Field>
          <Field label="Siblings & Their Occupation">
            <Textarea value={data.siblings} onChange={(e) => set("siblings", e.target.value)} placeholder="e.g. One younger brother — Doctor" rows={2} />
          </Field>
          <Field label="Native City">
            <Input value={data.nativeCity} onChange={(e) => set("nativeCity", e.target.value)} placeholder="e.g. Jaipur, Rajasthan" />
          </Field>
          <div className="md:col-span-2">
            <Field label="Current Address">
              <Textarea value={data.currentAddress} onChange={(e) => set("currentAddress", e.target.value)} rows={2} />
            </Field>
          </div>
        </div>
      </section>

      {/* About */}
      <section>
        <SectionTitle>About Me</SectionTitle>
        <Textarea
          value={data.aboutMe}
          onChange={(e) => set("aboutMe", e.target.value)}
          rows={5}
          placeholder="A few lines about your personality, interests and what you are looking for in a partner..."
        />
      </section>
    </div>
  );
};
