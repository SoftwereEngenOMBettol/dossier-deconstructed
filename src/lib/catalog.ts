import dx001 from "@/assets/dx001-cover.jpg";
import dx002 from "@/assets/dx002-cover.jpg";
import dx003Asset from "@/assets/dx003-cover.webp.asset.json";
import dx004 from "@/assets/dx004-cover.jpg";
import dx005 from "@/assets/dx005-cover.jpg";

export type Difficulty = 1 | 2 | 3 | 4 | 5;

export interface CaseEntry {
  id: string; // routing id, e.g. "dx-001"
  code: string; // display code "DX-001"
  packId: string; // normalized casepack manifest id "DX001"
  title: string;
  titleAr?: string;
  tagline: string;
  description: string;
  cover: string;
  difficulty: Difficulty;
  playMinutes: [number, number];
  evidenceCount: number;
  witnessCount: number;
  documentsCount: number;
  photosCount: number;
  gumroadUrl: string;
  status: "locked" | "coming-soon"; // baseline; overridden to "owned" when the casepack is imported
}

export const CATALOG: CaseEntry[] = [
  {
    id: "dx-001",
    code: "DX-001",
    packId: "DX001",
    title: "Room 308",
    titleAr: "الغرفة ٣٠٨",
    tagline: "A hotel guest is found dead in a locked room. Everyone claims innocence… one witness is lying.",
    description:
      "A hotel guest is found dead in a locked room. Everyone claims innocence… one witness is lying.",
    cover: dx001,
    difficulty: 3,
    playMinutes: [75, 100],
    evidenceCount: 24,
    witnessCount: 6,
    documentsCount: 30,
    photosCount: 36,
    gumroadUrl: "https://gumroad.com/l/dx001",
    status: "locked",
  },
  {
    id: "dx-002",
    code: "DX-002",
    packId: "DX002",
    title: "The Last Train",
    tagline: "A conductor vanishes between two stations on the midnight express.",
    description: "A conductor vanishes between two stations on the midnight express.",
    cover: dx002,
    difficulty: 4,
    playMinutes: [90, 120],
    evidenceCount: 28,
    witnessCount: 7,
    documentsCount: 36,
    photosCount: 42,
    gumroadUrl: "https://gumroad.com/l/dx002",
    status: "locked",
  },
  {
    id: "dx-003",
    code: "DX-003",
    packId: "DX003",
    title: "The Ishtar Diadem",
    titleAr: "تاج عشتار",
    tagline: "A priceless diadem vanishes at a black-tie gala — and the curator is dead.",
    description:
      "During a black-tie gala, a priceless ancient diadem vanishes and the museum's head curator is found dead in his office. What was actually stolen isn't what it appears to be.",
    cover: dx003Asset.url,
    difficulty: 4,
    playMinutes: [100, 130],
    evidenceCount: 36,
    witnessCount: 9,
    documentsCount: 32,
    photosCount: 48,
    gumroadUrl: "https://gumroad.com/l/dx003",
    status: "locked",
  },
  {
    id: "dx-004",
    code: "DX-004",
    packId: "DX004",
    title: "Silent Witness",
    tagline: "The only witness cannot speak — but the walls remember.",
    description: "The only witness cannot speak — but the walls remember.",
    cover: dx004,
    difficulty: 3,
    playMinutes: [60, 90],
    evidenceCount: 22,
    witnessCount: 6,
    documentsCount: 28,
    photosCount: 30,
    gumroadUrl: "https://gumroad.com/l/dx004",
    status: "locked",
  },
  {
    id: "dx-005",
    code: "DX-005",
    packId: "DX005",
    title: "Black Swan",
    tagline: "A prima ballerina drowns on opening night. The audience saw nothing.",
    description: "A prima ballerina drowns on opening night. The audience saw nothing.",
    cover: dx005,
    difficulty: 4,
    playMinutes: [90, 120],
    evidenceCount: 30,
    witnessCount: 8,
    documentsCount: 34,
    photosCount: 38,
    gumroadUrl: "https://gumroad.com/l/dx005",
    status: "locked",
  },
  {
    id: "dx-006",
    code: "DX-006",
    packId: "DX006",
    title: "Coming Soon",
    tagline: "New case coming soon.",
    description: "A new investigation is being assembled.",
    cover: "",
    difficulty: 3,
    playMinutes: [60, 90],
    evidenceCount: 0,
    witnessCount: 0,
    documentsCount: 0,
    photosCount: 0,
    gumroadUrl: "",
    status: "coming-soon",
  },
];

export const getCase = (id: string) => CATALOG.find((c) => c.id === id);
export const getCaseByPackId = (packId: string) =>
  CATALOG.find((c) => c.packId.toUpperCase() === packId.toUpperCase());
