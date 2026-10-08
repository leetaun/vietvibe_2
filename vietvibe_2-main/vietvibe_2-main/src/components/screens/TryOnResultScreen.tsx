import React,{useRef,useState} from 'react';
import {Bookmark,Share2,Download} from 'lucide-react';
import {ScreenBrand} from '../common/Header';
import {ReferenceImage} from '../common/CulturalVisual';
import {OutfitComponentSelection} from '../../types/vietvibe';
interface TryOnResultScreenProps {outfit:OutfitComponentSelection;userImage?:string|null;generatedImage?:string|null;resultNote?:string;onSaveToLookbook:()=>void;onTryAgain:()=>void;isLoggedIn:boolean;}
const SamplePortrait:React.FC<{className?:string;label:string}>=({className='',label})=><div className={'relative '+className} role="img" aria-label={label}><ReferenceImage file="result-reference.png" crop={[51,149,327,315]} className="absolute left-0 top-0 h-full w-[54.14%]"/><ReferenceImage file="result-reference.png" crop={[381,149,277,315]} className="absolute right-0 top-0 h-full w-[45.86%]"/></div>;
export const TryOnResultScreen:React.FC<TryOnResultScreenProps>=({outfit,userImage,generatedImage,resultNote,onSaveToLookbook,onTryAgain,isLoggedIn})=>{
 const [position,setPosition]=useState(50);
 const [notice,setNotice]=useState('');
 const frame=useRef<HTMLDivElement>(null);
 const uploaded=userImage?.startsWith('data:image/')?userImage:null;
 const downloadResult=()=>{if(!generatedImage)return;const link=document.createElement('a');link.download='VietVibe_Gemini_try_on.'+(generatedImage.startsWith('data:image/jpeg')?'jpg':generatedImage.startsWith('data:image/webp')?'webp':'png');link.href=generatedImage;link.click();};
 const downloadSample=()=>{
  const source=new window.Image();source.onload=()=>{const canvas=document.createElement('canvas');canvas.width=604;canvas.height=315;const context=canvas.getContext('2d');context?.drawImage(source,51,149,327,315,0,0,327,315);context?.drawImage(source,381,149,277,315,327,0,277,315);const link=document.createElement('a');link.download='VietVibe_anh_mau.png';link.href=canvas.toDataURL('image/png');link.click();};source.onerror=()=>setNotice('Không tải được ảnh mẫu.');source.src='/result-reference.png';
 };
 const share=async()=>{try{await navigator.clipboard.writeText('Bản phối ViệtVibe: '+outfit.mainGarment+' · '+outfit.headwear+' · '+outfit.footwear);setNotice('Đã sao chép thông tin bộ phối.');}catch{setNotice('Trình duyệt chưa cho phép sao chép.');}};
 return <div className="vv-screen vv-result">
  <ScreenBrand onClick={onTryAgain}/>
  <div className="vv-centered-title"><h1>KẾT QUẢ MẶC THỬ ẢO</h1><p>Hình ảnh sau khi phối {outfit.mainGarment} &amp; phụ kiện</p><p className="text-[11px] text-[#777]">{generatedImage?resultNote||'Ảnh được tạo bằng Gemini.':'Bản minh họa giao diện · chưa có kết quả từ API try-on'}</p></div>
  <div className="vv-result-grid">
   <div>
    <div className="vv-comparison" style={generatedImage?{aspectRatio:'3/4'}:undefined} ref={frame} onPointerDown={event=>{if(event.target instanceof HTMLInputElement)return; const rect=event.currentTarget.getBoundingClientRect();setPosition(Math.max(0,Math.min(100,(event.clientX-rect.left)/rect.width*100)));}} onPointerMove={event=>{if(!event.buttons||event.target instanceof HTMLInputElement)return;const rect=event.currentTarget.getBoundingClientRect();setPosition(Math.max(0,Math.min(100,(event.clientX-rect.left)/rect.width*100)));}}>
     {generatedImage?<img src={generatedImage} alt="Ảnh thử đồ do Gemini tạo" className="vv-comparison-layer w-full h-full object-contain"/>:<SamplePortrait className="vv-comparison-layer" label="Ảnh kết quả mẫu"/>}
     <div className="vv-comparison-layer" style={{clipPath:`inset(0 ${100-position}% 0 0)`}}>
      {uploaded?<img src={uploaded} alt="Ảnh gốc của bạn" className={'w-full h-full '+(generatedImage?'object-contain':'object-cover')}/>:<SamplePortrait className="w-full h-full grayscale" label="Ảnh trước mẫu"/>}
     </div>
     <div className="vv-slider-line" style={{left:position+'%'}}/>
     <div className="vv-slider-handle" style={{left:position+'%'}}>BEFORE ‹› AFTER</div>
     <input aria-label="So sánh trước và sau" type="range" min="0" max="100" value={position} onChange={event=>setPosition(Number(event.target.value))} className="absolute bottom-0 left-0 w-full h-16 opacity-0 cursor-ew-resize"/>
    </div>
    <p className="text-xs text-[#777] mt-2">Kéo thanh so sánh hoặc dùng phím mũi tên.</p>
   </div>
   <div className="vv-result-actions">
    <div className="vv-panel"><p>Đơn hàng / Chi tiết bộ đồ</p><strong className="block mt-1">{outfit.mainGarment}<br/>+ {outfit.headwear} + {outfit.footwear}</strong></div>
    <button className="vv-gold" disabled={!generatedImage} onClick={downloadResult} title={generatedImage?'Tải ảnh Gemini ở độ phân giải gốc':'Chưa có ảnh từ Gemini'}>TẢI ẢNH VỀ MÁY</button>
    {!generatedImage&&<button className="text-xs underline text-[#666]" onClick={downloadSample}><Download size={13} className="inline mr-1"/>Tải ảnh minh họa</button>}
    <button className="vv-outline flex items-center justify-center gap-2" onClick={()=>{onSaveToLookbook();if(isLoggedIn)setNotice('Đã lưu bản phối vào Lookbook.');}}><Bookmark size={20}/>LƯU VÀO LOOKBOOK</button>
    <button className="vv-outline flex items-center justify-center gap-2" onClick={share}><Share2 size={19}/>CHIA SẺ THÔNG TIN BỘ PHỐI</button>
    <button className="vv-outline !bg-[#222] !text-white" onClick={onTryAgain}>THỬ LẠI / ĐỔI ĐỒ KHÁC</button>
    {notice&&<p role="status" className="text-xs text-[#65502C]">{notice}</p>}
   </div>
  </div>
 </div>;
};
