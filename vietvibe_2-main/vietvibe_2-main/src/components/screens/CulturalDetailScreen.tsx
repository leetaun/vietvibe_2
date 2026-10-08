import React, { useState } from 'react';
import { ArrowLeft, ZoomIn, Compass, AlertCircle } from 'lucide-react';
import { CulturalCardData } from '../../types/vietvibe';
import { CulturalVisual } from '../common/CulturalVisual';

interface CulturalDetailScreenProps {
  costume: CulturalCardData;
  onBack: () => void;
  onStartStyling: (costume: CulturalCardData) => void;
}

const InformationBlock = ({
  title,
  text,
}: {
  title: string;
  text: string;
}) => (
  <section className="space-y-1.5">
    <h2 className="text-[14px] font-semibold text-[#D8C18D]">
      {title}
    </h2>
    <p className="text-[14px] leading-[1.4] text-[#E2E2DE]">
      {text}
    </p>
  </section>
);

export const CulturalDetailScreen: React.FC<CulturalDetailScreenProps> = ({
  costume,
  onBack,
  onStartStyling,
}) => {
  const [activeThumbnailIndex, setActiveThumbnailIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const imageViews = [
    {
      label: 'Ảnh chính',
      theme: 'gold_palace' as const,
      backgroundSize: '279.78% 148.19%',
      backgroundPosition: '5.17% 46.77%',
    },
    {
      label: 'Ảnh tham khảo 2',
      theme: 'hue' as const,
      backgroundSize: '1651.61% 937.70%',
      backgroundPosition: '10.91% 94.91%',
    },
    {
      label: 'Ảnh tham khảo 3',
      theme: 'hanoi' as const,
      backgroundSize: '1651.61% 937.70%',
      backgroundPosition: '18.09% 94.91%',
    },
    {
      label: 'Ảnh tham khảo 4',
      theme: 'studio' as const,
      backgroundSize: '1651.61% 937.70%',
      backgroundPosition: '25.47% 94.91%',
    },
  ];

  const renderImage = (index: number) => {
    if (costume.image) {
      return <img src={costume.imageGallery?.[index] || costume.image} alt={costume.name} className="h-full w-full object-contain" />;
    }
    const view = imageViews[index];

    if (costume.id === 'ao-nhat-binh') {
      return (
        <div
          aria-hidden="true"
          className="h-full w-full bg-no-repeat"
          style={{
            backgroundImage: "url('/detail-reference.png')",
            backgroundSize: view.backgroundSize,
            backgroundPosition: view.backgroundPosition,
          }}
        />
      );
    }

    return (
      <CulturalVisual
        costumeId={costume.id}
        color={costume.themeColor}
        backgroundTheme={view.theme}
        size="full"
        className="!h-full !w-full !rounded-none"
      />
    );
  };

  return (
    <div className="space-y-7 pb-6">
      {/* Thanh tiêu đề riêng */}
      <div className="flex h-14 items-center justify-between gap-3 border-b border-white/10">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-[#D8C18D] hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-[14px] font-semibold sm:text-[20px]">
            Việt Phục AI Stylist
          </span>
        </button>

        <span className="hidden text-[18px] font-medium text-white sm:block">
          Màn hình Chi tiết
        </span>

        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 rounded-xl border border-[#D8C18D] px-3 py-1.5 text-[13px] text-[#D8C18D] hover:bg-[#D8C18D]/10"
        >
          <Compass className="h-4 w-4" />
          Khám phá
        </button>
      </div>

      {/* Ảnh bên trái, thông tin bên phải */}
      <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-[0.66fr_1fr]">
        <div className="space-y-3">
          <div className="relative aspect-[366/386] overflow-hidden rounded-md bg-[#25221A]">
            <button
              type="button"
              onClick={() => setIsZoomed(!isZoomed)}
              aria-label={isZoomed ? 'Thu nhỏ ảnh' : 'Phóng to ảnh'}
              className={`block h-full w-full transition-transform duration-300 ${
                isZoomed
                  ? 'scale-125 cursor-zoom-out'
                  : 'cursor-zoom-in'
              }`}
            >
              {renderImage(activeThumbnailIndex)}
            </button>

            <button
              type="button"
              onClick={() => setIsZoomed(!isZoomed)}
              aria-label="Bật hoặc tắt phóng to ảnh"
              className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-md bg-black/70 text-[#D8C18D] hover:bg-black"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {(costume.imageGallery ? costume.imageGallery.map((_, index) => ({ label: 'Ảnh trang phục ' + (index + 1) })) : imageViews).map((view, index) => (
              <button
                key={view.label}
                type="button"
                aria-label={view.label}
                aria-pressed={activeThumbnailIndex === index}
                onClick={() => {
                  setActiveThumbnailIndex(index);
                  setIsZoomed(false);
                }}
                className={`h-16 overflow-hidden rounded-md border bg-[#25221A] transition-colors ${
                  activeThumbnailIndex === index
                    ? 'border-[#D8C18D]'
                    : 'border-transparent hover:border-[#D8C18D]/60'
                }`}
              >
                {renderImage(index)}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <h1 className="font-serif-culture text-[28px] font-bold uppercase leading-tight text-[#D8C18D] sm:text-[40px]">
              {costume.name.replace(' (Tay Chẽn)', '')}
            </h1>
            <p className="mt-1 text-[14px] italic text-[#E2E2DE]">
              {costume.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-5">
              <InformationBlock
                title="Nguồn gốc & Lịch sử"
                text={costume.originHistory}
              />
              <InformationBlock
                title="Đặc trưng nổi bật"
                text={costume.prominentFeatures}
              />
            </div>

            <div className="space-y-5">
              <InformationBlock
                title="Ý nghĩa hoa văn"
                text={costume.patternMeaning}
              />
              <InformationBlock
                title="Hoàn cảnh sử dụng"
                text={costume.usageContext}
              />

              <section className="space-y-2">
                <h2 className="text-[14px] font-semibold text-[#D8C18D]">
                  Lưu ý văn hóa (Cultural Guardrails)
                </h2>

                <div className="flex items-start gap-1.5">
                  <AlertCircle
                    aria-hidden="true"
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#D54B45]"
                  />
                  <ul className="space-y-1.5 text-[11px] leading-[1.4] text-[#E2E2DE]">
                    {costume.culturalGuardrails.map((text, index) => (
                      <li key={index}>{text}</li>
                    ))}
                  </ul>
                </div>
              </section>

              <button
                type="button"
                onClick={() => onStartStyling(costume)}
                className="min-h-10 w-full rounded-md border border-[#D8BC77] bg-[#D2B468] px-2 py-2 text-[11px] font-semibold text-[#151710] hover:bg-[#E0C681]"
              >
                PHỐI ĐỒ VỚI TRANG PHỤC NÀY
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
