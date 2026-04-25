import { forwardRef } from "react";
import { BioData } from "@/lib/biodata";

interface Props {
  data: BioData;
}

const Row = ({ label, value }: { label: string; value?: string }) => {
  if (!value) return null;
  return (
    <div className="field-row">
      <div className="field-label">{label}</div>
      <div className="field-value whitespace-pre-line">{value}</div>
    </div>
  );
};

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <div className="section-heading">
    <span>❀ {children} ❀</span>
  </div>
);

const formatDate = (iso: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
};

export const BioDataPreview = forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
  return (
    <div ref={ref} className="bg-cream p-3">
      <div className="ornate-border p-7 relative" style={{ minHeight: "1080px" }}>
        {/* corner decorations */}
        <div className="corner-deco border-r-0 border-b-0 top-2 left-2" />
        <div className="corner-deco border-l-0 border-b-0 top-2 right-2" />
        <div className="corner-deco border-r-0 border-t-0 bottom-2 left-2" />
        <div className="corner-deco border-l-0 border-t-0 bottom-2 right-2" />

        {/* Header */}
        <div className="text-center mb-3">
          <div className="text-gold text-xl">॥ ॐ ॥</div>
          <h1 className="font-display text-3xl font-bold text-maroon tracking-wide">
            Bio-Data
          </h1>
          <div className="flex items-center justify-center gap-3 mt-1">
            <span className="h-px w-14 bg-gold" />
            <span className="text-gold text-xs">✦</span>
            <span className="h-px w-14 bg-gold" />
          </div>
        </div>

        {/* Name + Photo */}
        <div className={`flex gap-6 items-center mb-2 ${data.photoPosition === "left" ? "flex-row-reverse" : ""}`}>
          <div className="flex-1 text-center">
            <div className="font-display text-3xl text-maroon font-bold leading-tight">
              {data.name || "—"}
            </div>
            {data.aboutMe && (
              <p className="mt-2 text-[13px] leading-snug text-ink/80 italic">
                "{data.aboutMe}"
              </p>
            )}
          </div>
          <div className="w-32 h-40 border-2 border-maroon p-1 bg-cream shrink-0">
            <div className="w-full h-full border border-gold overflow-hidden bg-secondary flex items-center justify-center">
              {data.photo ? (
                <img src={data.photo} alt={data.name} className="w-full h-full object-cover" crossOrigin="anonymous" />
              ) : (
                <span className="text-maroon/30 text-xs">Photo</span>
              )}
            </div>
          </div>
        </div>

        {/* Personal */}
        <SectionHeading>Personal Details</SectionHeading>
        <div>
          <Row label="Date of Birth" value={formatDate(data.dateOfBirth)} />
          <Row label="Place of Birth" value={data.placeOfBirth} />
          <Row label="Height" value={data.height} />
          <Row label="Marital Status" value={data.maritalStatus} />
          <Row label="Religion" value={data.religion} />
          <Row label="Caste / Community" value={data.caste} />
          <Row label="Manglik" value={data.manglik} />
        </div>

        {/* Education & Career */}
        <SectionHeading>Education & Career</SectionHeading>
        <div>
          <Row label="Qualifications" value={data.degrees} />
          <Row label="Designation" value={data.currentEmployment} />
          <Row label="Employer" value={data.employmentDetails} />
          <Row label="Annual Income" value={data.income} />
        </div>

        {/* Family */}
        <SectionHeading>Family Details</SectionHeading>
        <div>
          <Row label="Father" value={[data.fatherName, data.fatherOccupation].filter(Boolean).join(" — ")} />
          <Row label="Mother" value={[data.motherName, data.motherOccupation].filter(Boolean).join(" — ")} />
          <Row label="Siblings" value={data.siblings} />
          <Row label="Native City" value={data.nativeCity} />
          <Row label="Current Address" value={data.currentAddress} />
        </div>

        {/* Contact */}
        <SectionHeading>Contact Details</SectionHeading>
        <div>
          <Row label="Mobile" value={data.contact} />
          <Row label="Email" value={data.email} />
        </div>

        {/* Footer */}
        <div className="text-center mt-4 pt-2 border-t border-gold/40">
          <div className="text-gold text-base">✦ ✦ ✦</div>
        </div>
      </div>
    </div>
  );
});

BioDataPreview.displayName = "BioDataPreview";
