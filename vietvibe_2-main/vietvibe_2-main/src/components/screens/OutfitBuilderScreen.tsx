import React, { useState } from 'react';
import { RotateCw, ZoomIn, Image, Check, Plus } from 'lucide-react';
import { CostumeImage, ReferenceImage } from '../common/CulturalVisual';
import { ScreenBrand } from '../common/Header';
import { AVAILABLE_ACCESSORIES, COLOR_PALETTES, CULTURAL_COSTUMES } from '../../data/mockData';
import { OutfitComponentSelection } from '../../types/vietvibe';
interface OutfitBuilderScreenProps {
  initialConfig?: { costumeId:string; colorHex:string; event?:string };
  initialOutfit?: OutfitComponentSelection;
  aiExplanation?: string;
  onProceedToCulturalCheck:(outfit:OutfitComponentSelection)=>void;
  onProceedToTryOn:(outfit:OutfitComponentSelection)=>void;
  onSaveOutfitToDraft:(outfit:OutfitComponentSelection)=>void;
  onBack?:()=>void;
}
export const OutfitBuilderScreen: React.FC<OutfitBuilderScreenProps> = ({ initialConfig, initialOutfit, aiExplanation, onProceedToCulturalCheck, onProceedToTryOn, onSaveOutfitToDraft, onBack }) => {
  const [costumeId,setCostumeId]=useState(CULTURAL_COSTUMES.find(item=>item.name===initialOutfit?.mainGarment)?.id||initialConfig?.costumeId||'ao-tac');
  const [color,setColor]=useState(initialOutfit?.colorTheme||initialConfig?.colorHex||'#16385C');
  const [inner,setInner]=useState(initialOutfit?.innerRobe||'Bạch y (Cổ trắng)');
  const [pants,setPants]=useState(initialOutfit?.pantsOrSkirt||'Quần lụa trắng');
  const [head,setHead]=useState(initialOutfit?.headwear||'Mấn xanh thời Nguyễn');
  const [shoes,setShoes]=useState(initialOutfit?.footwear||'Hài thêu hoa sen');
  const [accessories,setAccessories]=useState<string[]>(initialOutfit?.accessories||['acc-fan','acc-khanh']);
  const [zoom,setZoom]=useState(false);
  const [flipped,setFlipped]=useState(false);
  const [background,setBackground]=useState(0);
  const [saved,setSaved]=useState(false);
  const active=CULTURAL_COSTUMES.find(item=>item.id===costumeId)||CULTURAL_COSTUMES[1];
  const conflict=accessories.includes('acc-sneaker')||accessories.includes('acc-sunglasses')||shoes.includes('Sneaker');
  const outfit:OutfitComponentSelection={mainGarment:active.name,innerRobe:inner,pantsOrSkirt:pants,headwear:head,footwear:shoes,accessories,colorTheme:color};
  const toggle=(id:string)=>setAccessories(items=>items.includes(id)?items.filter(item=>item!==id):[...items,id]);
  const rows=[
    {label:'Áo chính',value:costumeId,set:setCostumeId,options:CULTURAL_COSTUMES.map(item=>({value:item.id,label:item.name})),y:141},
    {label:'Áo lót trong',value:inner,set:setInner,options:['Bạch y (Cổ trắng)','Áo lót kem','Áo lót xanh'].map(value=>({value,label:value})),y:221},
    {label:'Quần/Váy',value:pants,set:setPants,options:['Quần lụa trắng','Quần lụa đen','Váy lụa'].map(value=>({value,label:value})),y:301},
    {label:'Phụ kiện đầu',value:head,set:setHead,options:['Mấn xanh thời Nguyễn','Khăn đóng','Mấn đỏ','Không dùng'].map(value=>({value,label:value})),y:383},
    {label:'Hài / Giày',value:shoes,set:setShoes,options:['Hài thêu hoa sen','Guốc mộc','Giày thể thao Sneaker'].map(value=>({value,label:value})),y:462},
  ];
  const accessoryCrops:Record<string,[number,number,number,number]>={'acc-fan':[738,274,60,60],'acc-khanh':[827,274,60,60],'acc-tui-gam':[916,274,60,60],'acc-vong-co':[738,370,60,60],'acc-tram':[827,370,60,60]};
  return <div className="vv-screen vv-builder">
    <div className="vv-topbar"><ScreenBrand onClick={onBack}/><h1>AI GỢI Ý &amp; TÙY CHỈNH OUTFIT</h1></div>
    <div className="vv-builder-grid">
      <section className="vv-panel"><h2 className="vv-panel-title">Lựa chọn &amp; Thành phần</h2>
        {rows.map(row=><div key={row.label} className="vv-component">
          {row.label==='Áo chính'?<CostumeImage costumeId={costumeId} className="vv-component-thumb"/>:<ReferenceImage file="builder-reference.png" crop={[40,row.y,58,58]} className="vv-component-thumb"/>}
          <label className="vv-component-content">{row.label}:
            <select aria-label={row.label} value={row.value} onChange={event=>row.set(event.target.value)}>
              {row.options.map(option=><option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
        </div>)}
        <button type="button" className="vv-outline w-full" onClick={()=>{onSaveOutfitToDraft(outfit);setSaved(true);}}>{saved?'ĐÃ LƯU BẢN PHỐI':'LƯU BẢN PHỐI'}</button>
      </section>
      <section className="vv-panel"><h2 className="vv-panel-title">Hình ảnh bộ đồ Preview</h2>
        <div className="vv-preview" style={{background:['#20211B','#1F2925','#282223'][background]}}>
          <div className={costumeId==='ao-tac'&&!active.image?'vv-preview-art':'vv-preview-other'} style={{transform:`scale(${zoom?1.2:1}) scaleX(${flipped?-1:1})`}}>
            {costumeId==='ao-tac'&&!active.image
              ? <ReferenceImage file="builder-reference.png" crop={[434,129,184,415]} className="h-full w-full"/>
              : <CostumeImage costumeId={costumeId} fit="contain" className="h-full w-full"/>}
          </div>
          <div className="vv-tools">
            <button type="button" className="vv-tool" aria-label="Lật ảnh xem trước" onClick={()=>setFlipped(!flipped)}><RotateCw size={15}/></button>
            <button type="button" className="vv-tool" aria-label="Phóng to hoặc thu nhỏ" onClick={()=>setZoom(!zoom)}><ZoomIn size={15}/></button>
            <button type="button" className="vv-tool" aria-label="Đổi nền khung xem trước" onClick={()=>setBackground((background+1)%3)}><Image size={15}/></button>
          </div>
        </div>
        <p className="vv-note text-center">Ảnh tham khảo trang phục · bản phối được lưu theo lựa chọn của bạn</p>
        {aiExplanation && <p className="vv-note mt-2"><strong>Giải thích cho bản phối ban đầu: </strong>{aiExplanation}</p>}
      </section>
      <section className="vv-panel"><h2 className="vv-panel-title">Tùy chỉnh &amp; Phụ kiện</h2>
        <h3 className="text-sm font-semibold">Đổi màu vải</h3>
        <div className="vv-color-grid">{[COLOR_PALETTES[0],COLOR_PALETTES[1],COLOR_PALETTES[2],COLOR_PALETTES[5]].map(item=><button key={item.id} type="button" className="vv-color" style={{background:item.preview}} aria-label={item.name} aria-pressed={color===item.hex} onClick={()=>setColor(item.hex)}/>)}</div>
        <h3 className="text-sm font-semibold border-t border-[#4B4A3F] pt-3">Kho Phụ Kiện</h3>
        <div className="vv-accessories">{AVAILABLE_ACCESSORIES.map(item=><button key={item.id} type="button" className="vv-accessory" aria-pressed={accessories.includes(item.id)} onClick={()=>toggle(item.id)}>
          <div className="vv-accessory-art">
            {accessoryCrops[item.id]?<ReferenceImage file="builder-reference.png" crop={accessoryCrops[item.id]} className="h-full w-full"/>:<span className="flex h-full items-center justify-center text-3xl">{item.icon}</span>}
            <span className="vv-accessory-plus">{accessories.includes(item.id)?<Check size={14}/>:<Plus size={14}/>}</span>
          </div>{item.name}
        </button>)}</div>
        <div className="mt-3"><p className="vv-note">Đánh giá mức độ phù hợp văn hóa</p><div className="vv-indicator">{conflict?'Có phụ kiện cần kiểm tra':'Chọn kiểm tra văn hóa để AI nhận xét'}</div></div>
        <div className="mt-3 flex gap-2"><button type="button" className="vv-gold flex-1" onClick={()=>onProceedToCulturalCheck(outfit)}>TIẾP TỤC / KIỂM TRA VĂN HÓA</button><button type="button" className="vv-outline" onClick={()=>onProceedToTryOn(outfit)}>AI TRY-ON</button></div>
      </section>
    </div>
  </div>;
};
