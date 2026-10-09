import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { EVENT_OPTIONS, STYLE_OPTIONS, COLOR_PALETTES, CULTURAL_COSTUMES } from '../../data/mockData';
import { CulturalCardData, AIStatus } from '../../types/vietvibe';
import { ReferenceImage } from '../common/CulturalVisual';
import { ScreenNavigation, AIConnectionNotice } from '../common/Header';

interface SetupStylistScreenProps {
  initialCostume?: CulturalCardData | null;
  onBack: () => void;
  aiStatus: AIStatus;
  onRefreshAI: () => void;
  onGenerateOutfit: (config: { event: string; style: string; colorHex: string; colorName: string; notes: string; costumeId: string }) => Promise<void>;
  onPreviewOutfit: (config: { event: string; style: string; colorHex: string; colorName: string; notes: string; costumeId: string }) => void;
}
export const SetupStylistScreen: React.FC<SetupStylistScreenProps> = ({ initialCostume, onBack, onGenerateOutfit, onPreviewOutfit, aiStatus, onRefreshAI }) => {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(EVENT_OPTIONS[0].id);
  const [selectedStyle, setSelectedStyle] = useState(STYLE_OPTIONS[0].id);
  const [selectedColor, setSelectedColor] = useState(COLOR_PALETTES[0].hex);
  const [userNotes, setUserNotes] = useState('');
  const [selectedCostumeId, setSelectedCostumeId] = useState(initialCostume?.id || 'ao-tac');
  const imageX: Record<string, number> = { tet:410, 'ky-yeu':529, 'cuoi-hoi':647, 'le-hoi':766, 'dao-pho':884 };
  const bands: Record<string,string> = {
    'c-red':'linear-gradient(90deg,#58140F 0% 30%,#74201A 30% 65%,#943027 65%)',
    'c-blue':'linear-gradient(90deg,#093B50 0% 30%,#0F4D68 30% 65%,#1C7695 65%)',
    'c-gold':'linear-gradient(90deg,#C9A548 0% 30%,#E7CB69 30% 65%,#C5A13D 65%)',
    'c-earth':'linear-gradient(90deg,#45643C 0% 30%,#B59C81 30% 65%,#705039 65%)',
    'c-bright':'linear-gradient(90deg,#ED3097 0% 33%,#F4CE43 33% 66%,#3695E4 66%)',
  };
  const generate = async (preview = false) => {
    const color = COLOR_PALETTES.find(item => item.hex === selectedColor)!;
    const config = { event:selectedEvent, style:selectedStyle, colorHex:selectedColor, colorName:color.name, notes:userNotes, costumeId:selectedCostumeId };
    if (preview) { onPreviewOutfit(config); return; }
    setBusy(true); setError('');
    try { await onGenerateOutfit(config); } catch (error) { setError(error instanceof Error ? error.message : 'Chưa tạo được gợi ý.'); }
    finally { setBusy(false); }
  };
  return <div className="vv-screen vv-setup">
    <div>
      <ScreenNavigation onBack={onBack} />
      <div className="vv-setup-intro">
        <h1>VietVibe</h1>
        <p>Thiết lập bối cảnh và sở thích để AI đề xuất outfit phù hợp nhất cho bạn</p>
        <details className="mt-6 text-[11px] text-[#A4A69C]">
          <summary>Trang phục cơ sở: {CULTURAL_COSTUMES.find(item=>item.id===selectedCostumeId)?.name}</summary>
          <select aria-label="Trang phục cơ sở" className="vv-field mt-2" value={selectedCostumeId} onChange={event=>setSelectedCostumeId(event.target.value)}>
            {CULTURAL_COSTUMES.map(item=><option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
        </details>
      </div>
    </div>
    <div className="vv-setup-form">
      <h2>Màn hình Thiết lập phối đồ / <span className="font-normal text-[#D8C18D]">AI Stylist Setup Screen</span></h2>
      <section className="vv-step"><h3>+ Bước 1: Chọn sự kiện / Bối cảnh</h3>
        <div className="vv-events">{EVENT_OPTIONS.map(item=><button key={item.id} type="button" className="vv-event" aria-pressed={selectedEvent===item.id} onClick={()=>setSelectedEvent(item.id)}>
          <ReferenceImage file="setup-reference.png" crop={[imageX[item.id],94,89,84]} className="vv-event-art" />
          {item.label}
        </button>)}</div>
      </section>
      <section className="vv-step"><h3>+ Bước 2: Chọn phong cách của bạn</h3>
        <div className="vv-styles">{[STYLE_OPTIONS[0],STYLE_OPTIONS[2],STYLE_OPTIONS[1],STYLE_OPTIONS[3]].map(item=><button key={item.id} type="button" className="vv-style" aria-pressed={selectedStyle===item.id} onClick={()=>setSelectedStyle(item.id)}>{item.label}</button>)}</div>
      </section>
      <section className="vv-step"><h3>+ Bước 3: Chọn tông màu ưa thích</h3>
        <p className="vv-note mb-2">Color palette để người dùng click nhanh:</p>
        <div className="vv-palettes">{COLOR_PALETTES.slice(0,5).map(item=><button key={item.id} type="button" aria-pressed={selectedColor===item.hex} onClick={()=>setSelectedColor(item.hex)}>
          <span className="vv-palette" style={{background:bands[item.id]}} />{item.name}
        </button>)}</div>
      </section>
      <section className="vv-step">
        <label htmlFor="stylist-notes" className="block text-sm mb-2">+ Bước 4 (Tùy chọn): Thêm ghi chú hoặc yêu cầu đặc biệt</label>
        <textarea id="stylist-notes" rows={2} className="vv-field resize-y bg-transparent" value={userNotes} onChange={event=>setUserNotes(event.target.value)} placeholder="Ví dụ: Em muốn phối thêm mấn và quạt cầm tay..." />
      </section>
      {error && <p role="alert" className="text-xs text-red-300">{error}</p>}
      <div className="flex justify-end gap-2 flex-wrap"><button type="button" className="vv-outline" disabled={busy} onClick={() => generate(true)}>XEM BẢN PHỐI MẪU</button><button type="button" className="vv-gold flex items-center gap-1" disabled={busy || !aiStatus.configured} onClick={() => generate()}>{busy ? 'GEMINI ĐANG GỢI Ý…' : 'AI TẠO GỢI Ý PHỐI ĐỒ'} <Sparkles size={15}/></button></div>
      <AIConnectionNotice status={aiStatus} onRefresh={onRefreshAI}/>
    </div>
  </div>;
};
