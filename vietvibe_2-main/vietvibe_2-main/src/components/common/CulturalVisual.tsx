import React from 'react';
import { CULTURAL_COSTUMES } from '../../data/mockData';

export const ReferenceImage: React.FC<{
  file: string;
  crop: [number, number, number, number];
  className?: string;
  label?: string;
}> = ({ file, crop: [x, y, width, height], className = '', label }) => (
  <div
    role={label ? 'img' : undefined}
    aria-label={label}
    aria-hidden={label ? undefined : true}
    className={`bg-no-repeat ${className}`}
    style={{
      backgroundImage: `url('/${file}')`,
      backgroundSize: `${1024 / width * 100}% ${572 / height * 100}%`,
      backgroundPosition: `${x / (1024 - width) * 100}% ${y / (572 - height) * 100}%`,
    }}
  />
);

export const CostumeImage: React.FC<{ costumeId: string; className?: string; fit?: 'cover' | 'contain' }> = ({ costumeId, className = '', fit = 'cover' }) => {
  const costume = CULTURAL_COSTUMES.find(item => item.id === costumeId);
  const cropX: Record<string, number> = { 'ao-nhat-binh': 84, 'ao-tac': 229, 'ao-ngu-than-nam': 373, 'ao-giao-linh': 518, 'ao-ngu-than-nu': 663 };
  if (costume?.image) return <img src={costume.image} alt={costume.name} className={className} style={{ objectFit: fit, objectPosition: costume.imagePosition || 'center' }} />;
  if (cropX[costumeId] !== undefined) return <ReferenceImage file="explore-reference.png" crop={[cropX[costumeId], 200, 133, 137]} label={costume?.name} className={className} />;
  return <CulturalVisual costumeId={costumeId} color={costume?.themeColor} size="full" className={`!min-h-0 !rounded-none ${className}`} />;
};

interface CulturalVisualProps {
  costumeId: string;
  color?: string;
  selectedAccessories?: string[];
  showConflicts?: boolean;
  backgroundTheme?: 'hue' | 'hanoi' | 'studio' | 'gold_palace';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showDetails?: boolean;
}

export const CulturalVisual: React.FC<CulturalVisualProps> = ({
  costumeId,
  color,
  selectedAccessories = [],
  showConflicts = false,
  backgroundTheme = 'gold_palace',
  className = '',
  size = 'md',
  showDetails = true
}) => {
  // Determine garment base color
  const garmentColor = color || (
    costumeId === 'ao-nhat-binh' ? '#8B1E26' :
    costumeId === 'ao-tac' ? '#16385C' :
    costumeId === 'ao-ngu-than-nam' ? '#1B4D3E' :
    costumeId === 'ao-giao-linh' ? '#7C2D12' :
    costumeId === 'ao-vien-linh' ? '#3B184B' :
    '#9D174D'
  );

  const hasFan = selectedAccessories.includes('acc-fan');
  const hasKhanh = selectedAccessories.includes('acc-khanh');
  const hasTuiGam = selectedAccessories.includes('acc-tui-gam');
  const hasVongCo = selectedAccessories.includes('acc-vong-co');
  const hasTram = selectedAccessories.includes('acc-tram');
  const hasMan = selectedAccessories.includes('acc-man-xanh') || true;
  const hasSneakers = selectedAccessories.includes('acc-sneaker');
  const hasSunglasses = selectedAccessories.includes('acc-sunglasses');

  // Background styling
  const bgGradients = {
    gold_palace: 'radial-gradient(ellipse at 50% 30%, #1a2942 0%, #0d1726 60%, #080f1a 100%)',
    hue: 'radial-gradient(ellipse at 50% 30%, #2a1b24 0%, #150f16 60%, #0a080d 100%)',
    hanoi: 'radial-gradient(ellipse at 50% 30%, #172d24 0%, #0e1e17 60%, #08110d 100%)',
    studio: 'radial-gradient(ellipse at 50% 30%, #1e293b 0%, #0f172a 60%, #020617 100%)'
  };

  const sizeClasses = {
    sm: 'w-28 h-36',
    md: 'w-44 h-60',
    lg: 'w-64 h-84',
    xl: 'w-80 h-96',
    full: 'w-full h-full'
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl flex items-center justify-center select-none ${sizeClasses[size]} ${className}`}
      style={{ background: bgGradients[backgroundTheme] }}
    >
      {/* Subtle Vietnamese imperial cloud patterns in background */}
      <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <pattern id={`cloud-pat-${costumeId}`} width="60" height="40" patternUnits="userSpaceOnUse">
          <path d="M10 25 C10 15 25 15 30 25 C35 18 50 18 50 25 C55 25 58 30 55 35 C50 38 10 38 10 25 Z" fill="none" stroke="#E5B869" strokeWidth="0.8" />
          <path d="M25 22 Q30 16 35 22" fill="none" stroke="#E5B869" strokeWidth="0.5" />
        </pattern>
        <rect width="100%" height="100%" fill={`url(#cloud-pat-${costumeId})`} />
      </svg>

      {/* Decorative Golden Dragon / Lotus crest aura */}
      <div className="absolute top-4 w-48 h-48 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />

      {/* Main Figure SVG Illustration */}
      <svg
        viewBox="0 0 300 460"
        className="w-full h-full max-h-[460px] object-contain relative z-10 drop-shadow-[0_10px_25px_rgba(0,0,0,0.6)]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id={`silk-grad-${costumeId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={garmentColor} stopOpacity="1" />
            <stop offset="50%" stopColor={garmentColor} stopOpacity="0.88" />
            <stop offset="100%" stopColor="#0B131E" stopOpacity="0.4" />
          </linearGradient>

          <linearGradient id="gold-trim" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#CA8A04" />
            <stop offset="50%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#EAB308" />
          </linearGradient>

          {/* 5-Color Elements for Sleeve Trim (Ngũ Hành) */}
          <linearGradient id="ngu-hanh-trim" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="25%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="#3B82F6" />
            <stop offset="75%" stopColor="#F8FAFC" />
            <stop offset="100%" stopColor="#EF4444" />
          </linearGradient>
        </defs>

        {/* Headwrap / Mấn or Khăn đóng */}
        {hasMan && (
          <g id="headwear">
            <ellipse cx="150" cy="85" rx="36" ry="18" fill="#13243A" stroke="#E5B869" strokeWidth="1.2" />
            <path d="M116 85 C116 64, 184 64, 184 85 C184 96, 116 96, 116 85 Z" fill="#0F1F33" stroke="#2563EB" strokeWidth="0.8" />
            {/* Front knot / chevron for traditional Vietnamese khăn đóng */}
            <path d="M142 84 L150 78 L158 84" fill="none" stroke="#FDE047" strokeWidth="1.5" />
            {hasTram && (
              <path d="M178 72 L198 60 M182 72 Q188 66 194 62" stroke="#FDE047" strokeWidth="1.5" strokeLinecap="round" />
            )}
          </g>
        )}

        {/* Head & Face */}
        <g id="face">
          <ellipse cx="150" cy="112" rx="24" ry="29" fill="#F8D3B4" />
          {/* Eyebrows & Eyes */}
          <path d="M136 104 Q142 102 147 105 M153 105 Q158 102 164 104" stroke="#4A2810" strokeWidth="1.4" fill="none" strokeLinecap="round" />
          <ellipse cx="141" cy="110" rx="3.2" ry="2" fill="#1F2937" />
          <ellipse cx="159" cy="110" rx="3.2" ry="2" fill="#1F2937" />
          {/* Nose & Lips */}
          <path d="M150 110 L149 119 L152 120" stroke="#D97706" strokeWidth="0.8" fill="none" />
          <path d="M144 127 Q150 130 156 127" stroke="#BE123C" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          {/* Ears */}
          <ellipse cx="125" cy="113" rx="4" ry="7" fill="#F4C7A3" />
          <ellipse cx="175" cy="113" rx="4" ry="7" fill="#F4C7A3" />

          {/* Sunglasses (Conflict item) */}
          {hasSunglasses && (
            <g id="sunglasses-overlay">
              <rect x="133" y="105" width="15" height="11" rx="3" fill="#111827" stroke="#F59E0B" strokeWidth="1" />
              <rect x="152" y="105" width="15" height="11" rx="3" fill="#111827" stroke="#F59E0B" strokeWidth="1" />
              <line x1="148" y1="109" x2="152" y2="109" stroke="#F59E0B" strokeWidth="1.5" />
              <line x1="128" y1="108" x2="133" y2="109" stroke="#F59E0B" strokeWidth="1.2" />
              <line x1="167" y1="109" x2="172" y2="108" stroke="#F59E0B" strokeWidth="1.2" />
            </g>
          )}
        </g>

        {/* Neck & White Inner Robe (Bạch Y) */}
        <g id="inner-robe">
          <path d="M142 136 L150 148 L158 136 Z" fill="#F8FAFC" />
          <path d="M141 135 L141 143 C141 146, 159 146, 159 143 L159 135" fill="none" stroke="#FFFFFF" strokeWidth="3" />
        </g>

        {/* Costume Body rendering based on style */}
        {costumeId === 'ao-nhat-binh' ? (
          /* Áo Nhật Bình (Square Rectangular Collar + Phoenix Embroidered Collar + 5 Element Sleeve Stripes) */
          <g id="nhat-binh-body">
            {/* Wide Flowing Sleeves */}
            <path d="M125 152 L75 220 L95 240 L122 195 Z" fill={garmentColor} />
            <path d="M175 152 L225 220 L205 240 L178 195 Z" fill={garmentColor} />

            {/* Ngũ Hành 5-color cuffs at sleeve hem */}
            <rect x="74" y="218" width="22" height="6" fill="#10B981" transform="rotate(-30 85 220)" />
            <rect x="78" y="222" width="22" height="6" fill="#F59E0B" transform="rotate(-30 85 220)" />
            <rect x="82" y="226" width="22" height="6" fill="#3B82F6" transform="rotate(-30 85 220)" />
            <rect x="86" y="230" width="22" height="6" fill="#EF4444" transform="rotate(-30 85 220)" />

            <rect x="204" y="218" width="22" height="6" fill="#10B981" transform="rotate(30 215 220)" />
            <rect x="200" y="222" width="22" height="6" fill="#F59E0B" transform="rotate(30 215 220)" />
            <rect x="196" y="226" width="22" height="6" fill="#3B82F6" transform="rotate(30 215 220)" />
            <rect x="192" y="230" width="22" height="6" fill="#EF4444" transform="rotate(30 215 220)" />

            {/* Main Robe Body */}
            <path
              d="M125 146 Q150 148 175 146 L188 340 L112 340 Z"
              fill={`url(#silk-grad-${costumeId})`}
              stroke="#E5B869"
              strokeWidth="1.2"
            />

            {/* Prominent Rectangular Collar (Cổ áo Nhật Bình) */}
            <path
              d="M136 145 L136 240 L164 240 L164 145"
              fill="#261014"
              stroke="url(#gold-trim)"
              strokeWidth="2.5"
            />
            {/* Phoenix and Cloud Gold embroidery on collar */}
            <path d="M144 160 Q150 156 156 160 Q150 166 144 160" fill="none" stroke="#FDE047" strokeWidth="1.5" />
            <circle cx="150" cy="180" r="4" fill="#FDE047" />
            <path d="M144 200 Q150 196 156 200 Q150 206 144 200" fill="none" stroke="#FDE047" strokeWidth="1.5" />
            <circle cx="150" cy="220" r="3.5" fill="#FDE047" />

            {/* Medallion / Hoa văn ngực */}
            <circle cx="150" cy="265" r="14" fill="#78101C" stroke="url(#gold-trim)" strokeWidth="1.5" />
            <path d="M144 265 Q150 258 156 265 Q150 272 144 265" stroke="#FDE047" strokeWidth="1.2" fill="none" />
          </g>
        ) : (
          /* Áo Tấc / Ngũ Thân / Giao Lĩnh */
          <g id="ao-tac-body">
            {/* Wide Sleeves (Áo Tấc tay thụng rộng) */}
            <path
              d="M120 150 C90 170, 60 210, 68 280 C80 290, 110 270, 118 210 Z"
              fill={garmentColor}
              stroke="#D4AF37"
              strokeWidth="0.8"
            />
            <path
              d="M180 150 C210 170, 240 210, 232 280 C220 290, 190 270, 182 210 Z"
              fill={garmentColor}
              stroke="#D4AF37"
              strokeWidth="0.8"
            />

            {/* Main Robe Torso */}
            <path
              d="M122 146 Q150 148 178 146 L192 345 C170 350, 130 350, 108 345 Z"
              fill={`url(#silk-grad-${costumeId})`}
              stroke="#D4AF37"
              strokeWidth="1.2"
            />

            {/* Standing Mandarin Collar (Cổ Đứng Lập Lĩnh) & 5 Buttons (Ngũ Khuy) */}
            <path d="M141 143 C141 138, 159 138, 159 143" stroke="#FDE047" strokeWidth="2.5" fill="none" />
            {/* Button overlap line going to right breast */}
            <path d="M150 145 L159 160 L166 185 L166 345" stroke="#E5B869" strokeWidth="1.4" fill="none" />
            <circle cx="151" cy="147" r="2.5" fill="#FDE047" />
            <circle cx="156" cy="158" r="2.5" fill="#FDE047" />
            <circle cx="163" cy="172" r="2.5" fill="#FDE047" />
            <circle cx="166" cy="190" r="2.5" fill="#FDE047" />
            <circle cx="166" cy="210" r="2.5" fill="#FDE047" />
          </g>
        )}

        {/* White silk trousers (Quần lụa trắng) */}
        <g id="trousers">
          <path d="M124 344 L118 410 L144 410 L148 346 Z" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="0.8" />
          <path d="M152 346 L156 410 L182 410 L176 344 Z" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="0.8" />
        </g>

        {/* Shoes: Traditional Hài Thêu or Modern Sneaker */}
        <g id="footwear">
          {hasSneakers ? (
            /* Sneaker with bright sporty colors (causes warning) */
            <g id="sneaker-shoes">
              <path d="M110 410 L146 410 L144 424 L106 424 Z" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1.5" />
              <rect x="106" y="420" width="38" height="5" fill="#FFFFFF" rx="2" />
              <path d="M118 410 L126 420" stroke="#38BDF8" strokeWidth="2" />
              <path d="M154 410 L190 410 L194 424 L156 424 Z" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1.5" />
              <rect x="156" y="420" width="38" height="5" fill="#FFFFFF" rx="2" />
              <path d="M172 410 L180 420" stroke="#38BDF8" strokeWidth="2" />
            </g>
          ) : (
            /* Traditional Embroidered Hài / Guốc Mộc */
            <g id="traditional-shoes">
              <path d="M116 410 L144 410 C146 418, 138 424, 116 424 Z" fill="#1E293B" stroke="#E5B869" strokeWidth="1" />
              <path d="M122 418 Q130 415 138 418" stroke="#FDE047" strokeWidth="0.8" fill="none" />
              <path d="M156 410 L184 410 C184 424, 162 424, 156 424 Z" fill="#1E293B" stroke="#E5B869" strokeWidth="1" />
              <path d="M162 418 Q170 415 178 418" stroke="#FDE047" strokeWidth="0.8" fill="none" />
            </g>
          )}
        </g>

        {/* Accessories overlays */}
        {/* Khánh vàng (Imperial Golden Pectoral Medal) */}
        {hasKhanh && (
          <g id="khanh-vang">
            <path d="M138 185 Q150 195 162 185" stroke="#FDE047" strokeWidth="1.5" fill="none" />
            <polygon points="144,195 156,195 159,204 150,210 141,204" fill="#EAB308" stroke="#FDE047" strokeWidth="1" />
            <circle cx="150" cy="202" r="2" fill="#10B981" />
            <line x1="150" y1="210" x2="150" y2="222" stroke="#EF4444" strokeWidth="1.5" />
          </g>
        )}

        {/* Quạt giấy trầm (Holding Paper Fan in hands) */}
        {hasFan && (
          <g id="fan-hand">
            <path d="M142 245 L158 245 L154 260 L146 260 Z" fill="#F4C7A3" />
            {/* Unfurled paper fan */}
            <path d="M130 230 C136 215, 164 215, 170 230 L150 250 Z" fill="#FDE047" stroke="#78350F" strokeWidth="0.8" />
            <line x1="150" y1="250" x2="135" y2="225" stroke="#78350F" strokeWidth="0.6" />
            <line x1="150" y1="250" x2="150" y2="218" stroke="#78350F" strokeWidth="0.6" />
            <line x1="150" y1="250" x2="165" y2="225" stroke="#78350F" strokeWidth="0.6" />
          </g>
        )}

        {/* Túi gấm thêu (Brocode pouch at waist) */}
        {hasTuiGam && (
          <g id="tui-gam">
            <circle cx="182" cy="270" r="9" fill="#047857" stroke="#FDE047" strokeWidth="1.2" />
            <path d="M178 261 L186 261 L182 255 Z" fill="#EAB308" />
            <line x1="182" y1="279" x2="182" y2="290" stroke="#EF4444" strokeWidth="1.5" />
          </g>
        )}

        {/* Kiềng bạc / Vòng cổ (Necklace) */}
        {hasVongCo && (
          <ellipse cx="150" cy="148" rx="16" ry="7" fill="none" stroke="#E2E8F0" strokeWidth="2.5" />
        )}

        {/* Red Target Highlight Circles for Cultural Guardrail Incompatibilities */}
        {showConflicts && (
          <g id="conflict-highlights" className="animate-pulse">
            {/* Sneaker red target rings */}
            <circle cx="150" cy="417" r="32" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeDasharray="5 3" />
            <circle cx="150" cy="417" r="4" fill="#EF4444" />

            {/* Sunglasses red target rings */}
            {hasSunglasses && (
              <>
                <circle cx="150" cy="110" r="26" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeDasharray="5 3" />
                <circle cx="150" cy="110" r="4" fill="#EF4444" />
              </>
            )}

            {/* Upper chest sleeve callout indicator */}
            <circle cx="120" cy="190" r="14" fill="none" stroke="#EF4444" strokeWidth="2" strokeDasharray="4 2" />
          </g>
        )}
      </svg>
    </div>
  );
};
