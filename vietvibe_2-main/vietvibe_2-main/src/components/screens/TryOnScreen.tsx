import React, {useRef,useState} from 'react';
import {UploadCloud,Image as ImageIcon,Upload,Lightbulb} from 'lucide-react';
import {ScreenBrand,AIConnectionNotice} from '../common/Header';
import {type AIStatus} from '../../types/vietvibe';
import {ReferenceImage} from '../common/CulturalVisual';
interface TryOnScreenProps { onExecuteTryOn:(image:string,customAccessoryName?:string,accessoryImage?:string)=>Promise<void>; onPreviewTryOn:(image:string,customAccessoryName?:string)=>void; onBack?:()=>void; aiStatus:AIStatus; onRefreshAI:()=>void; }
export const TryOnScreen:React.FC<TryOnScreenProps>=({onExecuteTryOn,onPreviewTryOn,onBack,aiStatus,onRefreshAI})=>{
 const [busy,setBusy]=useState(false);
 const [image,setImage]=useState<string|null>(null);
 const [demo,setDemo]=useState(0);
 const [accessory,setAccessory]=useState<string|null>(null);
 const [accessoryPreview,setAccessoryPreview]=useState<string|null>(null);
 const [error,setError]=useState('');
 const [dragging,setDragging]=useState(false);
 const imageInput=useRef<HTMLInputElement>(null);
 const accessoryInput=useRef<HTMLInputElement>(null);
 const execute=async()=>{
  setBusy(true);setError('');
  try{await onExecuteTryOn(image||'face-'+(demo+1),accessory||undefined,accessoryPreview||undefined);}
  catch(error){setError(error instanceof Error?error.message:'Chưa tạo được ảnh thử đồ.');}
  finally{setBusy(false);}
 };
 const readFile=(file:File|undefined,isAccessory=false)=>{
  if(!file)return;
  if(!['image/jpeg','image/png','image/webp'].includes(file.type)){setError('Chọn ảnh JPG, PNG hoặc WebP.');return;}
  if(file.size>10*1024*1024){setError('Ảnh cần nhỏ hơn 10 MB.');return;}
  setError('');
  const reader=new FileReader();
  reader.onload=()=>{if(isAccessory){setAccessory(file.name);setAccessoryPreview(String(reader.result));}else{setImage(String(reader.result));setDemo(-1);}};
  reader.onerror=()=>setError('Không đọc được ảnh. Bạn thử chọn lại ảnh nhé.');
  reader.readAsDataURL(file);
 };
 return <div className="vv-screen">
  <div className="vv-tryon">
   <div className="vv-tryon-header"><ScreenBrand onClick={onBack}/>
   <div className="vv-centered-title"><h1>THỬ ĐỒ ẢO AI <span className="whitespace-nowrap">(AI TRY-ON)</span></h1><p>Tải ảnh của bạn để AI mặc thử Việt phục trực quan nhất</p></div></div>
   <div className="vv-upload-grid">
    <section><h2 className="font-semibold mb-2">Upload ảnh bản thân</h2>
     <input ref={imageInput} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={event=>readFile(event.target.files?.[0])}/>
     <div className={'vv-dropzone'+(dragging?' dragging':'')} onDragOver={event=>{event.preventDefault();setDragging(true);}} onDragLeave={()=>setDragging(false)} onDrop={event=>{event.preventDefault();setDragging(false);readFile(event.dataTransfer.files[0]);}}>
      {image?<img src={image} alt="Ảnh của bạn đã chọn" className="vv-upload-preview"/>:<div className="vv-drop-content"><UploadCloud size={46} className="mx-auto mb-3"/><p>Kéo thả hoặc Click để tải ảnh toàn thân /<br/>chân dung của bạn</p><button type="button" className="vv-silver mt-3 inline-flex items-center gap-1" onClick={()=>imageInput.current?.click()}><ImageIcon size={14}/>CHỌN ẢNH TỪ MÁY</button></div>}
      {image&&<button className="vv-silver" onClick={()=>imageInput.current?.click()}>ĐỔI ẢNH</button>}
      {!image&&<ReferenceImage file="tryon-reference.png" crop={[454,236,51,153]} className="w-[51px] h-[153px] shrink-0"/>}
      {!image&&<p className="text-[11px] max-w-[115px]"><Lightbulb size={20}/>Mẹo chụp:<br/>Nên chụp chính diện, đủ sáng, không bị che khuất cơ thể.</p>}
     </div>
     {error&&<p role="alert" className="text-sm text-red-300 mt-2">{error}</p>}
     <h3 className="font-semibold text-sm mt-4">Hoặc chọn ảnh mẫu có sẵn</h3>
     <div className="flex gap-4 items-center flex-wrap"><div className="vv-demo-faces">{[89,139,189,239].map((x,index)=><button key={x} className="vv-demo-face" aria-label={'Chọn ảnh mẫu '+(index+1)} aria-pressed={demo===index} onClick={()=>{setDemo(index);setImage(null);setError('');}}><ReferenceImage file="tryon-reference.png" crop={[x,470,49,52]} className="w-full h-full"/></button>)}</div><p className="text-xs max-w-[220px] mt-2">Click nhanh nếu muốn dùng ảnh mẫu<br/>thay cho ảnh cá nhân.</p></div>
    </section>
    <section className="flex flex-col"><h2 className="font-semibold mb-2">Tải lên phụ kiện cá nhân</h2>
     <div className="vv-panel bg-[#252A2B] p-3"><h3 className="text-sm font-semibold">Bạn muốn phối thêm phụ kiện riêng? (Tùy chọn)</h3><p className="text-xs my-3">Tải ảnh phụ kiện cá nhân như kính, quạt, trang sức để ghép vào ảnh kết quả.</p>
      <input ref={accessoryInput} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={event=>readFile(event.target.files?.[0],true)}/>
      <button className="vv-silver w-full flex gap-1 items-center justify-center bg-[#454A4B] text-white border-[#5A5E5F]" onClick={()=>accessoryInput.current?.click()}><Upload size={14}/>CHỌN PHỤ KIỆN RIÊNG</button>
      {accessoryPreview&&<div className="mt-3"><img src={accessoryPreview} alt="Phụ kiện đã chọn" className="h-20 w-full object-contain"/><p className="vv-note truncate mt-1">{accessory}</p><button className="vv-outline mt-2 w-full" onClick={()=>{setAccessory(null);setAccessoryPreview(null);}}>Bỏ phụ kiện</button></div>}
     </div>
     <div className="vv-tryon-actions flex flex-col items-stretch gap-2 mt-auto pt-5"><button className="vv-silver" disabled={busy||!aiStatus.configured} onClick={execute}>{busy?'GEMINI ĐANG TẠO ẢNH…':'TIẾN HÀNH THỬ ĐỒ BẰNG AI ✨'}</button><p className="vv-note text-center">Khi bấm thử đồ, ảnh người, trang phục và phụ kiện đã chọn sẽ được gửi tới Google Gemini để tạo ảnh.</p><AIConnectionNotice status={aiStatus} onRefresh={onRefreshAI}/><button className="vv-outline" disabled={busy} onClick={()=>onPreviewTryOn(image||'face-'+(demo+1),accessory||undefined)}>XEM TRƯỚC GIAO DIỆN KẾT QUẢ</button></div>
    </section>
   </div>
  </div>
 </div>;
};
