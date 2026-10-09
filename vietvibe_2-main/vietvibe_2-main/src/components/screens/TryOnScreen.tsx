import React, { useRef, useState } from 'react';
import { Check, Image as ImageIcon, Lightbulb, Plus, Sparkles, UploadCloud, X } from 'lucide-react';
import { ScreenNavigation } from '../common/Header';
import { type AIStatus } from '../../types/vietvibe';
import { ReferenceImage } from '../common/CulturalVisual';

interface TryOnScreenProps {
  onExecuteTryOn: (image: string, customAccessoryName?: string, accessoryImage?: string) => Promise<void>;
  onPreviewTryOn: (image: string, customAccessoryName?: string) => void;
  onBack: () => void;
  aiStatus: AIStatus;
}

export const TryOnScreen: React.FC<TryOnScreenProps> = ({ onExecuteTryOn, onPreviewTryOn, onBack, aiStatus }) => {
  const [busy, setBusy] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [demo, setDemo] = useState(0);
  const [accessory, setAccessory] = useState<string | null>(null);
  const [accessoryPreview, setAccessoryPreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const imageInput = useRef<HTMLInputElement>(null);
  const accessoryInput = useRef<HTMLInputElement>(null);
  const execute = async () => {
    setBusy(true); setError('');
    try { await onExecuteTryOn(image || 'face-' + (demo + 1), accessory || undefined, accessoryPreview || undefined); }
    catch (error) { setError(error instanceof Error ? error.message : 'Chưa tạo được ảnh thử đồ.'); }
    finally { setBusy(false); }
  };
  const readFile = (file: File | undefined, isAccessory = false) => {
    if (!file || busy) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) { setError('Chọn ảnh JPG, PNG hoặc WebP.'); return; }
    if (file.size > 10 * 1024 * 1024) { setError('Ảnh cần nhỏ hơn 10 MB.'); return; }
    setError('');
    const reader = new FileReader();
    reader.onload = () => {
      if (isAccessory) { setAccessory(file.name); setAccessoryPreview(String(reader.result)); }
      else { setImage(String(reader.result)); setDemo(-1); }
    };
    reader.onerror = () => setError('Không đọc được ảnh. Bạn thử chọn lại ảnh nhé.');
    reader.readAsDataURL(file);
  };

  return <div className="vv-screen vv-tryon-page">
    <ScreenNavigation onBack={onBack} />
    <header className="vv-page-heading">
      <span className="vv-eyebrow"><Sparkles size={14} aria-hidden="true" /> VIỆT PHỤC TRÊN CHÍNH BẠN</span>
      <h1>Thử đồ ảo</h1>
      <p>Thêm ảnh của bạn, chọn phụ kiện yêu thích và khám phá diện mạo mới cùng VietVibe.</p>
    </header>
    <div className="vv-upload-grid">
      <div className="vv-tryon-photo-column">
        <section className="vv-tryon-photo-panel">
          <div className="vv-upload-heading"><h2><span className="vv-step-number">01</span> Ảnh của bạn</h2><span>JPG, PNG, WebP · Tối đa 10 MB</span></div>
          <input ref={imageInput} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" disabled={busy} onChange={event => readFile(event.target.files?.[0])} />
          <div className={'vv-dropzone' + (dragging ? ' dragging' : '')} onDragOver={event => { event.preventDefault(); if (!busy) setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={event => { event.preventDefault(); setDragging(false); readFile(event.dataTransfer.files[0]); }}>
            {image ? <>
              <img src={image} alt="Ảnh của bạn đã chọn" className="vv-upload-preview" />
              <span className="vv-upload-success"><Check size={14} /> Ảnh đã sẵn sàng</span>
              <button type="button" className="vv-outline vv-change-photo" disabled={busy} onClick={() => imageInput.current?.click()}><ImageIcon size={15} /> Đổi ảnh</button>
            </> : <div className="vv-drop-content">
              <span className="vv-upload-icon"><UploadCloud size={34} aria-hidden="true" /></span>
              <h3>Đưa phong cách của bạn vào khung hình</h3>
              <p>Kéo thả ảnh toàn thân hoặc chân dung vào đây</p>
              <button type="button" className="vv-gold" disabled={busy} onClick={() => imageInput.current?.click()}><ImageIcon size={16} /> Chọn ảnh từ máy</button>
              <span className="vv-upload-hint">Hoặc dùng một trong các ảnh mẫu bên dưới</span>
            </div>}
          </div>
          <div className="vv-photo-tips"><Lightbulb size={18} aria-hidden="true" /><div><strong>Một bức ảnh đẹp giúp bản phối rõ hơn</strong><p>Chụp chính diện, đủ sáng và tránh che khuất cơ thể.</p></div></div>
        </section>
        <section className="vv-tryon-samples">
          <div><h2>Thử nhanh với ảnh mẫu</h2><p>Chọn một gương mặt để trải nghiệm trước.</p></div>
          <div className="vv-demo-faces">{[89, 139, 189, 239].map((x, index) => <button type="button" key={x} className="vv-demo-face" disabled={busy} aria-label={'Chọn ảnh mẫu ' + (index + 1)} aria-pressed={demo === index} onClick={() => { setDemo(index); setImage(null); setError(''); }}>
            <ReferenceImage file="tryon-reference.png" crop={[x, 470, 49, 52]} className="h-full w-full" />
            {demo === index && <span className="vv-demo-check"><Check size={10} aria-hidden="true" /></span>}
          </button>)}</div>
        </section>
        {error && <p role="alert" className="vv-tryon-error">{error}</p>}
      </div>
      <aside className="vv-tryon-sidebar">
        <section className="vv-accessory-panel">
          <div className="vv-upload-heading"><h2><span className="vv-step-number">02</span> Thêm phụ kiện</h2><span>Tùy chọn</span></div>
          <p>Quạt, trang sức hoặc món phụ kiện riêng để bản phối mang dấu ấn của bạn.</p>
          <input ref={accessoryInput} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" disabled={busy} onChange={event => readFile(event.target.files?.[0], true)} />
          {accessoryPreview ? <div className="vv-accessory-preview"><img src={accessoryPreview} alt="Phụ kiện đã chọn" /><span>{accessory}</span><button type="button" disabled={busy} aria-label="Bỏ phụ kiện" onClick={() => { setAccessory(null); setAccessoryPreview(null); }}><X size={16} /></button></div> : <div className="vv-accessory-empty"><Plus size={25} aria-hidden="true" /><span>Thêm một chi tiết của riêng bạn</span></div>}
          <button type="button" className="vv-outline" disabled={busy} onClick={() => accessoryInput.current?.click()}><Plus size={16} />{accessoryPreview ? 'Đổi phụ kiện' : 'Chọn ảnh phụ kiện'}</button>
        </section>
        <section className="vv-tryon-actions">
          <h2><span className="vv-step-number">03</span> Khám phá diện mạo mới</h2>
          <div className="vv-tryon-selection"><Check size={15} aria-hidden="true" />{image ? 'Đã chọn ảnh của bạn' : 'Đang dùng ảnh mẫu ' + (demo + 1)}</div>
          {accessoryPreview && <div className="vv-tryon-selection"><Check size={15} aria-hidden="true" />Đã thêm phụ kiện cá nhân</div>}
          <button type="button" className="vv-gold" disabled={busy || !aiStatus.configured} onClick={execute}><Sparkles size={17} />{busy ? 'Gemini đang tạo ảnh…' : 'Thử đồ bằng AI'}</button>
          <button type="button" className="vv-outline" disabled={busy} onClick={() => onPreviewTryOn(image || 'face-' + (demo + 1), accessory || undefined)}>Xem trước giao diện kết quả</button>
          <p className="vv-tryon-privacy">Khi bấm thử đồ, ảnh người, trang phục và phụ kiện đã chọn sẽ được gửi tới Google Gemini để tạo ảnh.</p>
        </section>
      </aside>
    </div>
  </div>;
};
