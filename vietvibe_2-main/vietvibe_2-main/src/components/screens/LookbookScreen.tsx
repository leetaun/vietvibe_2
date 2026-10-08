import React,{useState} from 'react';
import {Search,X,ArrowLeft,Images} from 'lucide-react';
import {LookbookAlbum} from '../../types/vietvibe';
import {ReferenceImage,CostumeImage} from '../common/CulturalVisual';
interface LookbookScreenProps {albums:LookbookAlbum[];onCreateAlbum:(album:LookbookAlbum)=>void;onUpdateAlbum?:(album:LookbookAlbum)=>void;isLoggedIn:boolean;onOpenAuth:()=>void;onBack?:()=>void;}
export const LookbookScreen:React.FC<LookbookScreenProps>=({albums,onCreateAlbum,onUpdateAlbum,isLoggedIn,onOpenAuth,onBack})=>{
 const [filter,setFilter]=useState('Tất cả');
 const [query,setQuery]=useState('');
 const [selected,setSelected]=useState<LookbookAlbum|null>(null);
 const [editing,setEditing]=useState<LookbookAlbum|null>(null);
 const [formOpen,setFormOpen]=useState(false);
 const [title,setTitle]=useState('');
 const [occasion,setOccasion]=useState('Tết Cổ Truyền');
 const [description,setDescription]=useState('');
 const [notice,setNotice]=useState('');
 const tabs=['Tất cả','Tết Cổ Truyền','Chụp Kỷ Yếu','Lễ Cưới Hỏi','Dạo Phố'];
 const shown=albums.filter(item=>(filter==='Tất cả'||item.occasion.toLowerCase()===filter.toLowerCase())&&item.title.toLocaleLowerCase('vi').includes(query.toLocaleLowerCase('vi')));
 const covers:Record<string,number>={'lb-1':43,'lb-2':280,'lb-3':530,'lb-4':778};
 const openForm=(album:LookbookAlbum|null=null)=>{if(!isLoggedIn){onOpenAuth();return;}setEditing(album);setTitle(album?.title||'');setDescription(album?.description||'');setOccasion(album?.occasion||tabs[1]);setFormOpen(true);};
 const save=(event:React.FormEvent)=>{event.preventDefault();if(!title.trim())return;const album:LookbookAlbum=editing?{...editing,title:title.trim(),description:description.trim(),occasion}:{id:'lb-'+Date.now(),title:title.trim(),description:description.trim(),occasion,outfitCount:0,coverImageTheme:'#16385C',tags:[occasion],outfits:[]};if(editing){onUpdateAlbum?.(album);setSelected(album);}else onCreateAlbum(album);setFormOpen(false);};
 const share=async(album:LookbookAlbum)=>{try{await navigator.clipboard.writeText(album.title+'\n'+album.description+'\n'+album.outfits.map(item=>item.name).join('\n'));setNotice('Đã sao chép thông tin album.');}catch{setNotice('Trình duyệt chưa cho phép sao chép.');}};
 return <div className="vv-screen">
  <div className="vv-topbar"><div><button className="vv-note flex items-center gap-1 mb-2" onClick={onBack}><ArrowLeft size={13}/>Trang chủ</button><h1 className="!font-sans !text-white">LOOKBOOK CỦA TÔI</h1></div><button className="vv-gold" onClick={()=>openForm()}>TẠO LOOKBOOK MỚI</button></div>
  <div className="flex flex-wrap justify-between gap-3 mb-4"><div className="flex flex-wrap gap-2">{tabs.map(tab=><button key={tab} className="vv-chip" aria-pressed={filter===tab} onClick={()=>setFilter(tab)}>{tab}</button>)}</div><label className="relative"><Search size={14} className="absolute left-2 top-2.5 text-[#B5B6AD]"/><input className="vv-field pl-7 !w-[190px]" aria-label="Tìm Lookbook" placeholder="Tìm album..." value={query} onChange={event=>setQuery(event.target.value)}/></label></div>
  <div className="vv-lookbook-grid">{shown.map(album=><article className="vv-album" key={album.id}>
   <button className="vv-album-cover" onClick={()=>setSelected(album)} aria-label={'Xem album '+album.title}>
    {album.outfits[0]?.image?<img src={album.outfits[0].image} alt={'Ảnh đã lưu trong '+album.title} className="w-full h-full object-cover"/>:covers[album.id]!==undefined?<ReferenceImage file="lookbook-reference.png" crop={[covers[album.id],201,204,138]} className="w-full h-full"/>:album.outfits.length?<CostumeImage costumeId="ao-tac" className="w-full h-full"/>:<span className="flex h-full items-center justify-center text-[#D8C18D] bg-[#2C302B]"><Images size={40}/></span>}
   </button>
   <h2>{album.title}</h2><p>Gồm {album.outfitCount} bộ phối</p>
   <div className="vv-album-thumbs">{[0,1,2].map(index=>album.outfits[index]?.image?<img key={index} src={album.outfits[index].image} alt={album.outfits[index].name} className="w-full h-full object-cover"/>:covers[album.id]!==undefined?<ReferenceImage key={index} file="lookbook-reference.png" crop={[covers[album.id]+index*68,389,65,72]} className="w-full h-full"/>:album.outfits[index]?<CostumeImage key={index} costumeId="ao-tac" className="w-full h-full"/>:<span key={index} className="bg-[#2C302B]"/>)}</div>
   <p className="line-clamp-2 min-h-8">{album.description||'Album chưa có mô tả.'}</p>
   <div className="flex gap-2 mt-auto"><button className="vv-gold flex-1 !text-[11px]" onClick={()=>setSelected(album)}>Xem album</button><button className="vv-outline !text-[11px]" onClick={()=>share(album)}>Chia sẻ</button></div>
  </article>)}</div>
  {!shown.length&&<p className="vv-note py-12 text-center">Không có album phù hợp. Bạn có thể tạo album mới hoặc đổi bộ lọc.</p>}
  {selected&&!formOpen&&<div className="vv-modal" onClick={()=>setSelected(null)}><div className="vv-modal-box" role="dialog" aria-modal="true" aria-label={selected.title} onClick={event=>event.stopPropagation()}>
   <div className="flex justify-between gap-3 mb-3"><h2 className="text-xl font-semibold text-[#D8C18D]">{selected.title}</h2><button aria-label="Đóng album" onClick={()=>setSelected(null)}><X/></button></div><p className="vv-note mb-4">{selected.description}</p>
   {selected.outfits.length?selected.outfits.map((item,index)=><div key={index} className="vv-panel mb-2"><h3 className="font-semibold">{item.name}</h3>{item.image&&<img src={item.image} alt={item.name} className="w-full max-h-96 object-contain my-2"/>}<p className="vv-note">{item.dynasty} · {item.details}</p></div>):<p className="vv-note py-5">Album chưa có bộ phối. Bạn có thể lưu bộ phối từ màn hình kết quả.</p>}
   <div className="flex gap-2 mt-4"><button className="vv-gold" onClick={()=>openForm(selected)}>Chỉnh sửa album</button><button className="vv-outline" onClick={()=>share(selected)}>Chia sẻ thông tin</button></div>
  </div></div>}
  {formOpen&&<div className="vv-modal"><form className="vv-modal-box space-y-4" role="dialog" aria-modal="true" aria-label={editing?'Chỉnh sửa album':'Tạo Lookbook mới'} onSubmit={save}><div className="flex justify-between"><h2 className="text-xl text-[#D8C18D]">{editing?'Chỉnh sửa album':'Tạo Lookbook mới'}</h2><button type="button" aria-label="Đóng biểu mẫu" onClick={()=>setFormOpen(false)}><X/></button></div><label className="block text-sm">Tên album<input autoFocus required className="vv-field mt-1" value={title} onChange={event=>setTitle(event.target.value)}/></label><label className="block text-sm">Dịp / Chủ đề<select className="vv-field mt-1" value={occasion} onChange={event=>setOccasion(event.target.value)}>{tabs.slice(1).map(item=><option key={item}>{item}</option>)}</select></label><label className="block text-sm">Mô tả<textarea className="vv-field mt-1" value={description} onChange={event=>setDescription(event.target.value)}/></label><button className="vv-gold w-full" type="submit">LƯU LOOKBOOK</button></form></div>}
  {notice&&<div className="vv-toast flex gap-3" role="status">{notice}<button aria-label="Đóng thông báo" onClick={()=>setNotice('')}><X size={14}/></button></div>}
 </div>;
};
