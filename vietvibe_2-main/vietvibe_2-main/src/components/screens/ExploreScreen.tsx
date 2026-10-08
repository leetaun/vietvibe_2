import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { CULTURAL_COSTUMES } from '../../data/mockData';
import { CostumeImage } from '../common/CulturalVisual';
import { CulturalCardData } from '../../types/vietvibe';

interface ExploreScreenProps {
  onSelectCostume: (costume: CulturalCardData) => void;
  onStartStylingWithCostume: (costume: CulturalCardData) => void;
}

export const ExploreScreen: React.FC<ExploreScreenProps> = ({
  onSelectCostume,
  onStartStylingWithCostume
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDynasty, setSelectedDynasty] = useState<string>('Tất cả');
  const [selectedStyle, setSelectedStyle] = useState<string>('Tất cả');
  const [selectedGender, setSelectedGender] = useState<string>('Tất cả');

  const dynasties = ['Tất cả', 'Lý', 'Trần', 'Lê', 'Nguyễn'];
  const styles = ['Tất cả', ...new Set(CULTURAL_COSTUMES.map(item => item.style))];
  const genders = ['Tất cả', 'Nam', 'Nữ', 'Unisex'];

  const filteredCostumes = useMemo(() => {
    return CULTURAL_COSTUMES.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.originHistory.toLowerCase().includes(searchQuery.toLowerCase());

      const matchDynasty =
        selectedDynasty === 'Tất cả' || item.dynasty === selectedDynasty;

      const matchStyle =
        selectedStyle === 'Tất cả' || item.style.toLowerCase() === selectedStyle.toLowerCase();

      const matchGender =
        selectedGender === 'Tất cả' || item.gender === selectedGender || item.gender === 'Unisex';

      return matchSearch && matchDynasty && matchStyle && matchGender;
    });
  }, [searchQuery, selectedDynasty, selectedStyle, selectedGender]);
  const costumeImagePositions: Record<string, string> = {
    'ao-nhat-binh': '9.43% 45.98%',
    'ao-tac': '25.70% 45.98%',
    'ao-ngu-than-nam': '41.86% 45.98%',
    'ao-giao-linh': '58.14% 45.98%',
    'ao-ngu-than-nu': '74.41% 45.98%',
  };
  return (
    <div className="mx-auto w-full max-w-[856px] space-y-5 pb-8">
      {/* 1. SEARCH BAR - Faithfully matching PDF Page 2 */}
      <div className="relative mx-auto w-full max-w-[500px]">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm Việt phục, thời kỳ, phụ kiện..."
            className="h-9 w-full rounded-md border border-[#47515E] bg-[#2C3541] pl-9 pr-14 text-[12px] text-slate-100 placeholder:text-[#A8ADB5] focus:border-[#D8C18D] focus:outline-none"
          />
          <Search
            aria-hidden="true"
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A8ADB5]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              Xóa
            </button>
          )}
        </div>
      </div>

      {/* 2. Filters */}
      <div className="grid grid-cols-1 gap-4 md:ml-auto md:max-w-[670px] md:grid-cols-[1.2fr_1.3fr_0.8fr]">
        {[
          {
            label: 'Thời kỳ',
            options: dynasties,
            value: selectedDynasty,
            setValue: setSelectedDynasty,
          },
          {
            label: 'Kiểu dáng',
            options: styles,
            value: selectedStyle,
            setValue: setSelectedStyle,
          },
          {
            label: 'Giới tính',
            options: genders,
            value: selectedGender,
            setValue: setSelectedGender,
          },
        ].map((group) => (
          <div key={group.label} className="min-w-0 space-y-2">
            <h2 className="text-[14px] font-semibold text-white">
              {group.label}
            </h2>
        
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {group.options.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => group.setValue(option)}
                  aria-pressed={group.value === option}
                  className={`shrink-0 whitespace-nowrap rounded-full border px-2 py-1 text-[11px] leading-none transition-colors ${ 
                    group.value === option
                      ? 'border-[#D8BC77] bg-[#D8BC77] text-[#101722]'
                      : 'border-[#354353] bg-transparent text-[#E2E4E8] hover:border-[#D8BC77]'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 3. COSTUMES GRID VIEW - Matching PDF Page 2 */}
      <div>
        <div className={(selectedDynasty !== 'Tất cả' || selectedStyle !== 'Tất cả' || selectedGender !== 'Tất cả' || searchQuery) ? 'flex items-center justify-between mb-3' : ''}>
          <h2 className="sr-only">
            Danh mục Việt phục ({filteredCostumes.length} kết quả)
          </h2>
          {(selectedDynasty !== 'Tất cả' || selectedStyle !== 'Tất cả' || selectedGender !== 'Tất cả' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedDynasty('Tất cả');
                setSelectedStyle('Tất cả');
                setSelectedGender('Tất cả');
                setSearchQuery('');
              }}
              className="text-xs text-amber-400 hover:underline"
            >
              Đặt lại bộ lọc
            </button>
          )}
        </div>

        {filteredCostumes.length === 0 ? (
          <div className="text-center py-16 bg-[#0E1724] rounded-2xl border border-slate-800 p-8">
            <p className="text-slate-400 text-sm">Không tìm thấy trang phục phù hợp với bộ lọc hiện tại.</p>
            <button
              onClick={() => {
                setSelectedDynasty('Tất cả');
                setSelectedStyle('Tất cả');
                setSelectedGender('Tất cả');
                setSearchQuery('');
              }}
              className="mt-3 px-4 py-2 text-xs font-semibold bg-amber-500 text-slate-950 rounded-lg"
            >
              Xem tất cả trang phục
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {filteredCostumes.map((costume) => (
              <div
                key={costume.id}
                className="group flex flex-col overflow-hidden rounded-lg border border-[#354353] bg-[#0C1624] transition-colors hover:border-[#D8C18D]"
              >
                <button
                  type="button"
                  onClick={() => onSelectCostume(costume)}
                  aria-label={`Xem chi tiết ${costume.name}`}
                  className="relative block aspect-[133/137] w-full overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#D8C18D]"
                >
                  {costume.image ? (
                    <CostumeImage costumeId={costume.id} className="absolute inset-0 h-full w-full" />
                  ) : costumeImagePositions[costume.id] ? (
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-no-repeat"
                      style={{
                        backgroundImage: "url('/explore-reference.png')",
                        backgroundSize: '769.92% 417.52%',
                        backgroundPosition: costumeImagePositions[costume.id],
                      }}
                    />
                  ) : (
                    <CostumeImage
                      costumeId={costume.id}
                      className="!h-full !w-full !rounded-none"
                    />
                  )}
                </button>
                
                <div className="flex flex-1 flex-col gap-1 p-2">
                  <button
                    type="button"
                    onClick={() => onSelectCostume(costume)}
                    className="truncate text-left text-[13px] font-semibold uppercase leading-tight text-[#D8C18D] hover:text-white"
                  >
                    {costume.name.replace(' (Tay Chẽn)', '')}
                  </button>
                
                  <div className="flex flex-wrap items-center gap-1 text-[9px] text-[#C3C6CC]">
                    <span>{costume.dynasty === 'Chưa xác định' ? 'Đang bổ sung tư liệu' : 'Triều ' + costume.dynasty}</span>
                    <span className="rounded-sm bg-[#D8C18D]/15 px-1 py-0.5 text-[7px] text-[#E7D6AF]">
                      Cultural Card
                    </span>
                  </div>
                
                  <div className="mt-auto grid grid-cols-2 gap-1 pt-1">
                    <button
                      type="button"
                      onClick={() => onSelectCostume(costume)}
                      className="whitespace-nowrap rounded-full border border-[#D8BC77] bg-[#D8BC77] px-1 py-1 text-[9px] leading-none text-[#101722] hover:bg-[#E7D6AF]"
                    >
                      Xem chi tiết
                    </button>
                
                    <button
                      type="button"
                      onClick={() => onStartStylingWithCostume(costume)}
                      className="whitespace-nowrap rounded-full border border-[#D8BC77] bg-transparent px-1 py-1 text-[9px] leading-none text-[#E7D6AF] hover:bg-[#D8BC77]/15"
                    >
                      Phối đồ
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
