import React, { useState } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { EVENT_OPTIONS, STYLE_OPTIONS, COLOR_PALETTES, CULTURAL_COSTUMES } from '../../data/mockData';
import { CulturalCardData, AIStatus } from '../../types/vietvibe';
import { CostumeImage, ReferenceImage } from '../common/CulturalVisual';
import { ScreenNavigation } from '../common/Header';

interface SetupStylistScreenProps {
  initialCostume?: CulturalCardData | null;
  onBack: () => void;
  aiStatus: AIStatus;
  onGenerateOutfit: (config: { event: string; style: string; colorHex: string; colorName: string; notes: string; costumeId: string }) => Promise<void>;
  onPreviewOutfit: (config: { event: string; style: string; colorHex: string; colorName: string; notes: string; costumeId: string }) => void;
}
export const SetupStylistScreen: React.FC<SetupStylistScreenProps> = ({ initialCostume, onBack, onGenerateOutfit, onPreviewOutfit, aiStatus }) => {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(EVENT_OPTIONS[0].id);
  const [selectedStyle, setSelectedStyle] = useState(STYLE_OPTIONS[0].id);
  const [selectedColor, setSelectedColor] = useState(COLOR_PALETTES[0].hex);
  const [userNotes, setUserNotes] = useState('');
  const [selectedCostumeId, setSelectedCostumeId] = useState(initialCostume?.id || 'ao-tac');
  const activeCostume = CULTURAL_COSTUMES.find(item => item.id === selectedCostumeId) || CULTURAL_COSTUMES[0];
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
    <ScreenNavigation onBack={onBack} />
    <header className="vv-page-heading">
      <span className="vv-eyebrow"><Sparkles size={14} aria-hidden="true" /> PHONG CÁCH CỦA BẠN</span>
      <h1>AI Stylist</h1>
      <p>Chọn bối cảnh, phong cách và sắc màu. VietVibe giúp bạn tạo một bản phối mang dấu ấn riêng.</p>
    </header>
    <div className="vv-setup-layout">
      <aside className="vv-setup-intro">
        <div className="vv-setup-costume-art">
          <CostumeImage costumeId={activeCostume.id} fit="contain" className="h-full w-full" />
          <span className="vv-setup-costume-badge">TRANG PHỤC CƠ SỞ</span>
        </div>
        <div className="vv-setup-costume-info">
          <h2>{activeCostume.name}</h2>
          <p>{activeCostume.dynasty === 'Chưa xác định' ? 'Cảm hứng từ trang phục Việt' : 'Trang phục triều ' + activeCostume.dynasty}</p>
          <label className="block mt-5 text-xs text-[#B5B6AD]">
            Chọn trang phục để phối
            <select className="vv-field mt-2" value={selectedCostumeId} onChange={event=>setSelectedCostumeId(event.target.value)}>
              {CULTURAL_COSTUMES.map(item=><option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </label>
          <div className="vv-setup-tip"><Sparkles size={18} aria-hidden="true" /><p>Một chút cảm hứng truyền thống, một chút cá tính của bạn.</p></div>
        </div>
      </aside>
      <div className="vv-setup-form">
      <section className="vv-step"><h2><span className="vv-step-number">01</span> Bạn sẽ mặc trong dịp nào?</h2>
        <div className="vv-events">{EVENT_OPTIONS.map(item=><button key={item.id} type="button" className="vv-event" aria-pressed={selectedEvent===item.id} onClick={()=>setSelectedEvent(item.id)}>
          <ReferenceImage file="setup-reference.png" crop={[imageX[item.id],94,89,84]} className="vv-event-art" />
          <span>{item.label}</span>
          {selectedEvent===item.id && <span className="vv-event-check"><Check size={13} aria-hidden="true" /></span>}
        </button>)}</div>
      </section>
      <section className="vv-step"><h2><span className="vv-step-number">02</span> Phong cách bạn yêu thích</h2>
        <div className="vv-styles">{[STYLE_OPTIONS[0],STYLE_OPTIONS[2],STYLE_OPTIONS[1],STYLE_OPTIONS[3]].map(item=><button key={item.id} type="button" className="vv-style" aria-pressed={selectedStyle===item.id} onClick={()=>setSelectedStyle(item.id)}>{item.label}</button>)}</div>
      </section>
      <section className="vv-step"><h2><span className="vv-step-number">03</span> Sắc màu của bản phối</h2>
        <div className="vv-palettes">{COLOR_PALETTES.slice(0,5).map(item=><button key={item.id} type="button" aria-pressed={selectedColor===item.hex} onClick={()=>setSelectedColor(item.hex)}>
          <span className="vv-palette" style={{background:bands[item.id]}}>{selectedColor===item.hex && <span className="vv-palette-check"><Check size={13} aria-hidden="true" /></span>}</span><span>{item.name}</span>
        </button>)}</div>
      </section>
      <section className="vv-step">
        <label htmlFor="stylist-notes" className="vv-notes-label"><span className="vv-step-number">04</span> Thêm mong muốn của bạn <span className="vv-optional">Tùy chọn</span></label>
        <textarea id="stylist-notes" rows={3} className="vv-field resize-y" value={userNotes} onChange={event=>setUserNotes(event.target.value)} placeholder="Ví dụ: Mình muốn phối thêm mấn và quạt cầm tay…" />
      </section>
      {error && <p role="alert" className="text-xs text-red-300">{error}</p>}
      <div className="vv-setup-actions"><button type="button" className="vv-outline" disabled={busy} onClick={() => generate(true)}>Xem bản phối mẫu</button><button type="button" className="vv-gold flex items-center justify-center gap-2" disabled={busy || !aiStatus.configured} onClick={() => generate()}><Sparkles size={17} aria-hidden="true" />{busy ? 'Gemini đang gợi ý…' : 'Tạo gợi ý phối đồ'}</button></div>
      </div>
    </div>
  </div>;
};
