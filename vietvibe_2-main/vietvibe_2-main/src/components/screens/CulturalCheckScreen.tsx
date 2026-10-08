import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { ScreenBrand, AIConnectionNotice } from '../common/Header';
import { CostumeImage, ReferenceImage } from '../common/CulturalVisual';
import { CULTURAL_COSTUMES } from '../../data/mockData';
import { type OutfitComponentSelection, type AIStatus, type CulturalAssessment } from '../../types/vietvibe';
interface CulturalCheckScreenProps {
  outfit: OutfitComponentSelection;
  aiStatus: AIStatus;
  onRefreshAI: () => void;
  onAnalyze: (signal?: AbortSignal) => Promise<CulturalAssessment>;
  onAutoFix: (outfit?: OutfitComponentSelection) => void;
  onProceedAnyway: () => void;
  onBackToBuilder: () => void;
}
export const CulturalCheckScreen: React.FC<CulturalCheckScreenProps> = ({ outfit, aiStatus, onRefreshAI, onAnalyze, onAutoFix, onProceedAnyway, onBackToBuilder }) => {
  const [assessment, setAssessment] = useState<CulturalAssessment | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const controller = useRef<AbortController | null>(null);
  useEffect(() => {
    setAssessment(null); setError(''); setBusy(false);
    return () => controller.current?.abort();
  }, [outfit]);
  const sneakers = outfit.footwear.toLowerCase().includes('sneaker') || outfit.accessories.includes('acc-sneaker');
  const sunglasses = outfit.accessories.includes('acc-sunglasses');
  const sampleConflict = sneakers || sunglasses;
  const conflict = assessment ? assessment.warnings.length > 0 : sampleConflict;
  const costume = CULTURAL_COSTUMES.find(item => item.name === outfit.mainGarment) || CULTURAL_COSTUMES[1];
  const analyze = async () => {
    const request = new AbortController();
    controller.current?.abort(); controller.current = request;
    const timer = window.setTimeout(() => request.abort(), 160_000);
    setBusy(true); setError('');
    try { const result = await onAnalyze(request.signal); if (!request.signal.aborted) setAssessment(result); }
    catch (error) { if (!request.signal.aborted) setError(error instanceof Error ? error.message : 'Không nhận được nhận xét.'); else if (controller.current === request) setError('Yêu cầu đã dừng hoặc quá thời gian chờ.'); }
    finally { window.clearTimeout(timer); if (controller.current === request) setBusy(false); }
  };
  return <div className="vv-screen">
    <div className="vv-topbar"><ScreenBrand onClick={onBackToBuilder}/><button className="vv-outline flex gap-1 items-center" onClick={onBackToBuilder}><ArrowLeft size={14}/>Tùy chỉnh bộ phối</button></div>
    <h1 className="text-center text-xl font-bold text-[#E9C66B] mb-6">● KIỂM TRA ĐỘ PHÙ HỢP VĂN HÓA (CULTURAL CHECK)</h1>
    <div className="vv-check-grid">
      <div className="vv-check-picture">
        {!assessment && sampleConflict && costume.id === 'ao-tac'
          ? <ReferenceImage file="check-reference.png" crop={[86,178,417,366]} className="w-full h-full min-h-[365px]" label="Ảnh mẫu đánh dấu các phụ kiện cần kiểm tra"/>
          : <CostumeImage costumeId={costume.id} fit="contain" className="w-full h-full min-h-[365px]"/>}
      </div>
      <section className="vv-check-content">
        <h2 className={conflict ? 'vv-warning' : 'vv-success'}>{assessment ? 'GEMINI NHẬN XÉT: ' + assessment.score + '/100' : sampleConflict ? 'CÓ PHỤ KIỆN CẦN XEM XÉT' : 'BỘ PHỐI SẴN SÀNG ĐỂ NHẬN XÉT'}</h2>
        {assessment ? <>
          <p>{assessment.summary}</p>
          {assessment.warnings.length > 0 && <ul className="text-sm list-disc pl-4 space-y-2">{assessment.warnings.map((warning, index) => <li key={index}>{warning}</li>)}</ul>}
          {assessment.suggestions.length > 0 && <div className="border-t border-[#4B4A3F] pt-3"><h3 className="text-[#E9C66B] font-semibold mb-2">Gợi ý điều chỉnh</h3><ul className="text-sm list-disc pl-4 space-y-2">{assessment.suggestions.map((suggestion, index) => <li key={index}>{suggestion}</li>)}</ul></div>}
          <p className="vv-note">Nhận xét được tạo bằng Gemini, có thể cần đối chiếu thêm tư liệu lịch sử.</p>
          <button className="vv-gold w-full" disabled={busy} onClick={() => onAutoFix(assessment.suggestedOutfit)}>ÁP DỤNG BỘ PHỐI AI GỢI Ý</button>
        </> : <>
          <p>Bản phối <strong>{outfit.mainGarment}</strong>{sampleConflict ? ' đang kết hợp với ' + [sneakers ? 'giày thể thao' : null, sunglasses ? 'kính mát' : null].filter(Boolean).join(' và ') : ' đang dùng các phụ kiện trong thư viện'}.</p>
          <p className="vv-note">Thông tin ban đầu dựa trên quy tắc mẫu. Bấm nút dưới để nhận nhận xét từ Gemini.</p>
          {sampleConflict && <button className="vv-outline w-full" disabled={busy} onClick={() => onAutoFix()}>THAY PHỤ KIỆN THEO QUY TẮC MẪU</button>}
        </>}
        {error && <p role="alert" className="text-xs text-red-300">{error}</p>}
        <button className="vv-gold w-full" disabled={busy || !aiStatus.configured} onClick={analyze}>{busy ? 'GEMINI ĐANG NHẬN XÉT…' : assessment ? 'NHẬN XÉT LẠI BẰNG AI' : 'AI NHẬN XÉT BỘ PHỐI'}</button>
        <AIConnectionNotice status={aiStatus} onRefresh={onRefreshAI}/>
        <button className="vv-outline w-full" disabled={busy} onClick={onProceedAnyway}>{conflict ? 'TIẾP TỤC VỚI BỘ PHỐI HIỆN TẠI' : 'TIẾP TỤC THỬ ĐỒ'}</button>
      </section>
    </div>
  </div>;
};
