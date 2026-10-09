import React, { useEffect, useState } from 'react';
import { RotateCw, ZoomIn, Image, Check, Plus } from 'lucide-react';
import { CostumeImage, ReferenceImage } from '../common/CulturalVisual';
import { ScreenNavigation } from '../common/Header';
import { OutfitPreview } from '../common/OutfitPreview';
import { AVAILABLE_ACCESSORIES, COLOR_PALETTES, CULTURAL_COSTUMES } from '../../data/mockData';
import { OUTFIT_CHOICES, OutfitComponentSelection } from '../../types/vietvibe';
const FOOTWEAR_ACCESSORIES: Record<string, string> = {
  'acc-hai-theu': 'Hài thêu hoa sen',
  'acc-guoc-moc': 'Guốc mộc',
  'acc-sneaker': 'Giày thể thao Sneaker',
};
const isWardrobeAccessory = (id: string) => id === 'acc-man-xanh' || id in FOOTWEAR_ACCESSORIES;
interface OutfitBuilderScreenProps {
  initialConfig?: { costumeId:string; colorHex:string; event?:string };
  initialOutfit?: OutfitComponentSelection;
  aiExplanation?: string;
  onProceedToCulturalCheck:(outfit:OutfitComponentSelection)=>void;
  onProceedToTryOn:(outfit:OutfitComponentSelection)=>void;
  onSaveOutfitToDraft:(outfit:OutfitComponentSelection)=>void;
  onBack:()=>void;
}
export const OutfitBuilderScreen: React.FC<OutfitBuilderScreenProps> = ({ initialConfig, initialOutfit, aiExplanation, onProceedToCulturalCheck, onProceedToTryOn, onSaveOutfitToDraft, onBack }) => {
  const [costumeId,setCostumeId]=useState(CULTURAL_COSTUMES.find(item=>item.name===initialOutfit?.mainGarment)?.id||initialConfig?.costumeId||'ao-tac');
  const [color,setColor]=useState(initialOutfit?.colorTheme||initialConfig?.colorHex||'#16385C');
  const [inner,setInner]=useState(initialOutfit?.innerRobe||'Bạch y (Cổ trắng)');
  const [pants,setPants]=useState(initialOutfit?.pantsOrSkirt||'Quần lụa trắng');
  const [head,setHead]=useState(initialOutfit?.accessories.includes('acc-man-xanh')?'Mấn xanh thời Nguyễn':initialOutfit?.headwear||'Mấn xanh thời Nguyễn');
  const [shoes,setShoes]=useState(() => {
    const selected = initialOutfit?.accessories.find(id => id in FOOTWEAR_ACCESSORIES);
    return selected ? FOOTWEAR_ACCESSORIES[selected] : initialOutfit?.footwear || 'Hài thêu hoa sen';
  });
  const [accessories,setAccessories]=useState<string[]>(() => (initialOutfit?.accessories||['acc-fan','acc-khanh']).filter(id => !isWardrobeAccessory(id)));
  const [zoom,setZoom]=useState(false);
  const [flipped,setFlipped]=useState(false);
  const [background,setBackground]=useState(0);
  const [saved,setSaved]=useState(false);
  useEffect(() => { setSaved(false); }, [costumeId, color, inner, pants, head, shoes, accessories]);
  const active=CULTURAL_COSTUMES.find(item=>item.id===costumeId)||CULTURAL_COSTUMES[1];
  const selectedAccessories = [
    ...accessories,
    ...(head === 'Mấn xanh thời Nguyễn' ? ['acc-man-xanh'] : []),
    ...Object.keys(FOOTWEAR_ACCESSORIES).filter(id => FOOTWEAR_ACCESSORIES[id] === shoes),
  ];
  const conflict=accessories.includes('acc-sneaker')||accessories.includes('acc-sunglasses')||shoes.includes('Sneaker');
  const outfit:OutfitComponentSelection={mainGarment:active.name,innerRobe:inner,pantsOrSkirt:pants,headwear:head,footwear:shoes,accessories:selectedAccessories,colorTheme:color};
  const toggle=(id:string)=> {
    if (id === 'acc-man-xanh') {
      setHead(value => value === 'Mấn xanh thời Nguyễn' ? 'Không dùng' : 'Mấn xanh thời Nguyễn');
    } else if (id in FOOTWEAR_ACCESSORIES) {
      setShoes(value => value === FOOTWEAR_ACCESSORIES[id] ? 'Không dùng' : FOOTWEAR_ACCESSORIES[id]);
    } else {
      setAccessories(items=>items.includes(id)?items.filter(item=>item!==id):[...items,id]);
    }
  };
  const rows=[
    {label:'Áo chính',value:costumeId,set:setCostumeId,options:CULTURAL_COSTUMES.map(item=>({value:item.id,label:item.name})),y:141},
    {label:'Áo lót trong',value:inner,set:setInner,options:OUTFIT_CHOICES.innerRobe.map(value=>({value,label:value})),y:221},
    {label:'Quần/Váy',value:pants,set:setPants,options:OUTFIT_CHOICES.pantsOrSkirt.map(value=>({value,label:value})),y:301},
    {label:'Phụ kiện đầu',value:head,set:setHead,options:OUTFIT_CHOICES.headwear.map(value=>({value,label:value})),y:383},
    {label:'Hài / Giày',value:shoes,set:setShoes,options:OUTFIT_CHOICES.footwear.map(value=>({value,label:value})),y:462},
  ];
  const accessoryCrops:Record<string,[number,number,number,number]>={'acc-fan':[738,274,60,60],'acc-khanh':[827,274,60,60],'acc-tui-gam':[916,274,60,60],'acc-vong-co':[738,370,60,60],'acc-tram':[827,370,60,60]};
  return <div className="vv-screen vv-builder">
    <div className="vv-topbar"><ScreenNavigation onBack={() => { onSaveOutfitToDraft(outfit); onBack(); }}/><h1>AI GỢI Ý &amp; TÙY CHỈNH OUTFIT</h1></div>
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
      <section className="vv-panel"><h2 className="vv-panel-title">Xem trước bản phối</h2>
        <div className="vv-preview" style={{backgroundColor:['#252A25','#20302D','#30272B'][background]}}>
          <span className="vv-preview-label">VIETVIBE STUDIO</span>
          <div className="vv-preview-figure" style={{transform:`scale(${zoom?1.25:1}) scaleX(${flipped?-1:1})`}}>
            <OutfitPreview costumeId={costumeId} outfit={outfit}/>
          </div>
          <div className="vv-tools">
            <button type="button" className="vv-tool" aria-label="Lật ảnh xem trước" onClick={()=>setFlipped(!flipped)}><RotateCw size={15}/></button>
            <button type="button" className="vv-tool" aria-label="Phóng to hoặc thu nhỏ" onClick={()=>setZoom(!zoom)}><ZoomIn size={15}/></button>
            <button type="button" className="vv-tool" aria-label="Đổi nền khung xem trước" onClick={()=>setBackground((background+1)%3)}><Image size={15}/></button>
          </div>
        </div>
        <p className="vv-note text-center">Bản phối minh họa · cập nhật ngay theo lựa chọn của bạn</p>
        {aiExplanation && <p className="vv-note mt-2"><strong>Giải thích cho bản phối ban đầu: </strong>{aiExplanation}</p>}
      </section>
      <section className="vv-panel"><h2 className="vv-panel-title">Tùy chỉnh &amp; Phụ kiện</h2>
        <h3 className="text-sm font-semibold">Đổi màu vải</h3>
        <div className="vv-color-grid">{[COLOR_PALETTES[0],COLOR_PALETTES[1],COLOR_PALETTES[2],COLOR_PALETTES[5]].map(item=><button key={item.id} type="button" className="vv-color" style={{background:item.preview}} aria-label={item.name} aria-pressed={color===item.hex} onClick={()=>setColor(item.hex)}/>)}</div>
        <h3 className="text-sm font-semibold border-t border-[#4B4A3F] pt-3">Kho Phụ Kiện</h3>
        <p className="vv-note">Chọn để thêm, bấm lại để bỏ phụ kiện.</p>
        <div className="vv-accessories">{AVAILABLE_ACCESSORIES.map(item=><button key={item.id} type="button" className="vv-accessory" aria-pressed={selectedAccessories.includes(item.id)} onClick={()=>toggle(item.id)}>
          <div className="vv-accessory-art">
            {accessoryCrops[item.id]?<ReferenceImage file="builder-reference.png" crop={accessoryCrops[item.id]} className="h-full w-full"/>:<span className="flex h-full items-center justify-center text-3xl">{item.icon}</span>}
            <span className="vv-accessory-plus">{selectedAccessories.includes(item.id)?<Check size={14}/>:<Plus size={14}/>}</span>
          </div>{item.name}
        </button>)}</div>
        <div className="mt-3"><p className="vv-note">Đánh giá mức độ phù hợp văn hóa</p><div className="vv-indicator">{conflict?'Có phụ kiện cần kiểm tra':'Chọn kiểm tra văn hóa để AI nhận xét'}</div></div>
        <div className="mt-3 flex gap-2"><button type="button" className="vv-gold flex-1" onClick={()=>onProceedToCulturalCheck(outfit)}>TIẾP TỤC / KIỂM TRA VĂN HÓA</button><button type="button" className="vv-outline" onClick={()=>onProceedToTryOn(outfit)}>AI TRY-ON</button></div>
      </section>
    </div>
  </div>;
};
