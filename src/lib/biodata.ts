export interface BioData {
  // Personal
  name: string;
  dateOfBirth: string;
  height: string;
  maritalStatus: string;
  religion: string;
  caste: string;
  manglik: string;
  placeOfBirth: string;
  contact: string;
  email: string;
  photo: string; // base64

  // Education & Career
  degrees: string;
  currentEmployment: string;
  employmentDetails: string;
  income: string;

  // Family
  fatherName: string;
  fatherOccupation: string;
  motherName: string;
  motherOccupation: string;
  siblings: string;
  nativeCity: string;
  currentAddress: string;

  // About
  aboutMe: string;

  // Layout
  photoPosition: "left" | "right";
}

export const emptyBioData: BioData = {
  name: "",
  dateOfBirth: "",
  height: "",
  maritalStatus: "",
  religion: "",
  caste: "",
  manglik: "",
  placeOfBirth: "",
  contact: "",
  email: "",
  photo: "",
  degrees: "",
  currentEmployment: "",
  employmentDetails: "",
  income: "",
  fatherName: "",
  fatherOccupation: "",
  motherName: "",
  motherOccupation: "",
  siblings: "",
  nativeCity: "",
  currentAddress: "",
  aboutMe: "",
  photoPosition: "right",
};

const STORAGE_KEY = "marriage-biodata-v1";

export const loadBioData = (): BioData => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyBioData;
    return { ...emptyBioData, ...JSON.parse(raw) };
  } catch {
    return emptyBioData;
  }
};

export const saveBioData = (data: BioData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save bio-data", e);
  }
};

export const clearBioData = () => {
  localStorage.removeItem(STORAGE_KEY);
};
