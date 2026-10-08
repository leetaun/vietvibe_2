import React from 'react';
import { Sparkles, Shirt, BookOpen, ChevronRight, Compass, ArrowRight } from 'lucide-react';
import { CULTURAL_COSTUMES } from '../../data/mockData';
import { CostumeImage } from '../common/CulturalVisual';
import { CulturalCardData } from '../../types/vietvibe';

interface HomeScreenProps {
  onNavigate: (tab: string, costumeId?: string) => void;
  onSelectCostume: (costume: CulturalCardData) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate, onSelectCostume }) => {
  const featuredCardPositions: Record<string, string> = {
    'ao-tac': '14.30% 74.12%',
    'ao-nhat-binh': '50.92% 74.12%',
    'ao-ngu-than-nam': '87.27% 74.12%',
  };

  return (
    <div className="space-y-4 pb-6">
      {/* 1. HERO BANNER - Faithfully matching PDF Page 1 */}
      <section className="relative isolate overflow-hidden rounded-lg bg-[#102635] sm:aspect-[924/221]">
        {/* Vùng tranh được lấy từ ảnh tham chiếu */}
        <div
          aria-hidden="true"
          className="absolute inset-y-0 right-0 w-full bg-no-repeat opacity-20 sm:w-[54%] sm:opacity-100"
          style={{
            backgroundImage: "url('/home-reference.png')",
            backgroundSize: '205.21% 258.82%',
            backgroundPosition: '90.48% 19.94%',
          }}
        />

        {/* Nội dung và nút thao tác */}
        <div className="relative z-10 flex min-h-[220px] h-full w-full flex-col justify-center px-6 pt-9 pb-7 sm:w-[60%] sm:px-8 lg:px-14">
          <h1 className="font-brand text-[24px] font-bold leading-[1.2] tracking-tight text-white sm:text-[26px] lg:text-[32px]">
            KHÁM PHÁ DI SẢN -
            <br />
            SÁNG TẠO PHONG CÁCH
          </h1>
        
          <button
            onClick={() => onNavigate('stylist_setup')}
            className="mt-5 self-start rounded-md border border-[#D8BC70] bg-[#C9A64E] px-5 py-2 text-[12px] font-semibold text-[#171710] transition-colors hover:bg-[#D8B965] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E7D6AF]"
          >
            BẮT ĐẦU PHỐI ĐỒ
          </button>
        </div>
      </section>

      {/* 2. VIỆT PHỤC TIÊU BIỂU (FEATURED COSTUMES) - Matching PDF Page 1 */}
      <section className="space-y-3 sm:pl-[6.3%]">
        <div className="flex items-center justify-between">
          <h2 className="font-brand text-[16px] font-semibold leading-tight text-white">
            VIỆT PHỤC TIÊU BIỂU
          </h2>

          <button
            onClick={() => onNavigate('explore')}
            className="flex items-center gap-1 text-xs text-[#D8C18D] hover:text-white"
          >
            Xem tất cả
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto">
          {[
            CULTURAL_COSTUMES[1],
            CULTURAL_COSTUMES[0],
            CULTURAL_COSTUMES[2],
            CULTURAL_COSTUMES[3],
            CULTURAL_COSTUMES[4],
          ].map((costume) => (
            <button
              key={costume.id}
              onClick={() => onSelectCostume(costume)}
              className="group relative aspect-[262/116] w-[260px] shrink-0 snap-start overflow-hidden rounded-lg bg-[#152333] text-left sm:w-[262px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D8C18D]"
            >
              {costume.image ? (
                <CostumeImage costumeId={costume.id} className="absolute inset-0 h-full w-full" />
              ) : featuredCardPositions[costume.id] ? (
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-no-repeat"
                  style={{
                    backgroundImage: "url('/home-reference.png')",
                    backgroundSize: '390.84% 493.10%',
                    backgroundPosition: featuredCardPositions[costume.id],
                  }}
                />
              ) : (
                <CostumeImage
                  costumeId={costume.id}
                  className="!h-full !w-full !rounded-none"
                />
              )}

              <div
                className="absolute inset-0"
                style={{
                  background:
                    costume.image ? 'linear-gradient(to bottom, transparent 30%, rgba(9, 19, 33, 0.5) 60%, #091321 100%)' : 'linear-gradient(to bottom, transparent 45%, rgba(9, 19, 33, 0.7) 55%, #091321 61%)',
                }}
              />
          
              <div className="absolute bottom-3 left-3 right-3">
                <h3 className="text-[15px] font-semibold leading-tight text-white">
                  {costume.name.replace(' (Tay Chẽn)', '')}
                </h3>
          
                <p className="mt-1 text-[11px] text-white/80">
                  Thời {costume.dynasty}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 3. KHỐI TRUY CẬP NHANH (QUICK ACCESS) - Matching PDF Page 1 */}
      <section className="space-y-3 sm:px-[6.3%]">
        <h2 className="font-brand text-[16px] font-semibold leading-tight text-white">
          KHỐI TRUY CẬP NHANH
        </h2>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {[
            {
              title: 'AI Stylist',
              description: '- Gợi ý trang phục',
              tab: 'stylist_setup',
              icon: Sparkles,
            },
            {
              title: 'AI Try-on',
              description: '- Mặc thử đồ ảo',
              tab: 'tryon',
              icon: Shirt,
            },
            {
              title: 'Khám phá',
              description: '- Thẻ văn hóa',
              tab: 'explore',
              icon: Compass,
            },
          ].map(({ title, description, tab, icon: Icon }) => (
            <button
              key={tab}
              onClick={() => onNavigate(tab)}
              className="flex min-h-[62px] items-center gap-3 rounded-lg border border-[#9B8B62] bg-[#1C2838] px-3 py-2 text-left transition-colors hover:border-[#D8C18D] hover:bg-[#253346] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D8C18D]"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#D8C18D]/15 text-[#D8C18D]">
                <Icon className="h-6 w-6" strokeWidth={1.5} />
              </span>
          
              <span>
                <span className="block text-[14px] font-semibold text-white">
                  {title}
                </span>
          
                <span className="mt-0.5 block text-[11px] text-[#BEC1C7]">
                  {description}
                </span>
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
