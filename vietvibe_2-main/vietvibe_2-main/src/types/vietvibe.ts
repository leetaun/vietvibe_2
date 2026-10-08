export type Dynasty = 'Lý' | 'Trần' | 'Lê' | 'Nguyễn' | 'Chưa xác định';
export type CostumeStyle = 'Áo dài' | 'Áo tấc' | 'Nhật bình' | 'Ngũ thân' | 'Giao lĩnh' | 'Viên lĩnh' | 'Tứ thân' | 'Lê Phổ' | 'Cổ thuyền' | 'Raglan';
export type GenderCategory = 'Tất cả' | 'Nam' | 'Nữ' | 'Unisex';

export interface CulturalCardData {
  id: string;
  name: string;
  dynasty: Dynasty;
  style: CostumeStyle;
  gender: 'Nam' | 'Nữ' | 'Unisex';
  subtitle: string;
  originHistory: string;
  prominentFeatures: string;
  patternMeaning: string;
  usageContext: string;
  culturalGuardrails: string[];
  themeColor: string;
  accentColor: string;
  suitableOccasions: string[];
  image?: string;
  imageGallery?: string[];
  imagePosition?: string;
}

export interface AccessoryItem {
  id: string;
  name: string;
  category: 'head' | 'hand' | 'neck' | 'waist' | 'feet' | 'modern';
  icon: string;
  isTraditional: boolean;
  warningNote?: string;
}

export interface OutfitComponentSelection {
  mainGarment: string;
  innerRobe: string;
  pantsOrSkirt: string;
  headwear: string;
  footwear: string;
  accessories: string[];
  colorTheme: string;
}

export const OUTFIT_CHOICES = {
  innerRobe: ['Bạch y (Cổ trắng)', 'Áo lót kem', 'Áo lót xanh'],
  pantsOrSkirt: ['Quần lụa trắng', 'Quần lụa đen', 'Váy lụa'],
  headwear: ['Mấn xanh thời Nguyễn', 'Khăn đóng', 'Mấn đỏ', 'Không dùng'],
  footwear: ['Hài thêu hoa sen', 'Guốc mộc', 'Giày thể thao Sneaker'],
} as const;
export const ACCESSORY_IDS = ['acc-fan', 'acc-khanh', 'acc-tui-gam', 'acc-vong-co', 'acc-tram', 'acc-man-xanh', 'acc-hai-theu', 'acc-guoc-moc', 'acc-sneaker', 'acc-sunglasses'] as const;
export interface CulturalAssessment {
  score: number;
  summary: string;
  warnings: string[];
  suggestions: string[];
  suggestedOutfit: OutfitComponentSelection;
}
export interface AIStatus {
  configured: boolean;
  backendAvailable: boolean;
  checking: boolean;
}

export interface LookbookAlbum {
  id: string;
  title: string;
  occasion: string;
  outfitCount: number;
  description: string;
  coverImageTheme: string;
  tags: string[];
  outfits: {
    image?: string;
    name: string;
    dynasty: string;
    details: string;
  }[];
}

export interface UserHistoryItem {
  outfit?: OutfitComponentSelection;
  originalImage?: string;
  resultImage?: string;
  resultNote?: string;
  id: string;
  timeString: string;
  actionType: 'create_outfit' | 'try_on' | 'save_lookbook' | 'view_culture';
  title: string;
  detail: string;
  thumbnailColor: string;
  costumeName: string;
}

export interface UserProfile {
  name: string;
  email: string;
  tier: string;
  outfitCount: number;
  tryOnCount: number;
  lookbookCount: number;
}
