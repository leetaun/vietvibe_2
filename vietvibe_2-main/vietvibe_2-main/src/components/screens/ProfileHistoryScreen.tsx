import React,{useState} from 'react';
import {X} from 'lucide-react';
import {BackButton} from '../common/Header';
import {UserProfile,UserHistoryItem} from '../../types/vietvibe';
import {CULTURAL_COSTUMES} from '../../data/mockData';
import {CostumeImage,ReferenceImage} from '../common/CulturalVisual';
interface ProfileHistoryScreenProps {user:UserProfile;history:UserHistoryItem[];onDeleteHistory:(id:string)=>void;onReopenHistory:(item:UserHistoryItem)=>void;onLogout:()=>void;onUpdateProfile:(name:string,email:string)=>void;onBack:()=>void;onOpenAdmin?:()=>void;}
export const ProfileHistoryScreen:React.FC<ProfileHistoryScreenProps>=({user,history,onDeleteHistory,onReopenHistory,onLogout,onUpdateProfile,onBack,onOpenAdmin})=>{
 const [tab,setTab]=useState('history');
 const [editing,setEditing]=useState(false);
 const [name,setName]=useState(user.name);
 const [email,setEmail]=useState(user.email);
 const [notice,setNotice]=useState('');
 return <div className="vv-screen">
  <div className="vv-topbar"><BackButton onBack={onBack}/><h1>Màn hình Hồ sơ &amp; Lịch sử</h1><span className="text-sm">VietVibe</span></div>
  <div className="vv-profile-grid">
   <section><h2 className="text-lg font-semibold mb-3">HỒ SƠ CỦA TÔI</h2><div className="vv-profile-card">
    <div className="vv-avatar"><ReferenceImage file="profile-reference.png" crop={[159,151,101,100]} className="h-full w-full" label="Ảnh đại diện mẫu"/></div>
    <h3 className="text-base font-semibold mt-3">{user.name}</h3><p className="vv-note">{user.email}</p>
    <div className="text-xs text-[#D8C18D] border-t border-[#454640] pt-3 mt-3">🏅 {user.tier}</div>
    <div className="vv-profile-stats"><div><strong>{user.outfitCount}</strong>Outfit<br/>đã phối</div><div className="border-x border-[#454640]"><strong>{user.tryOnCount}</strong>Lần thử đồ<br/>(Try-on)</div><div><strong>{user.lookbookCount}</strong>Lookbook<br/>công khai</div></div>
    <button className="vv-gold w-full mb-2" onClick={()=>{setName(user.name);setEmail(user.email);setEditing(true);}}>CHỈNH SỬA THÔNG TIN</button><button className="vv-outline w-full" onClick={onLogout}>ĐĂNG XUẤT</button>
   </div></section>
   <section><div className="flex flex-wrap gap-4"><button className={'text-sm font-semibold '+(tab==='history'?'text-[#D8C18D]':'text-[#888]')} onClick={()=>setTab('history')}>LỊCH SỬ HOẠT ĐỘNG</button><button className="vv-note" onClick={()=>setTab('security')}>Bảo mật</button><button className="vv-note" onClick={()=>setTab('notifications')}>Thông báo</button></div>
    {tab==='history'&&<div className="vv-timeline">{history.map(item=><article className="vv-history-item" key={item.id}><p className="vv-history-time">{item.timeString}</p><div className="vv-history-card"><div className="flex-1"><h3 className="text-sm mb-2">{item.title}</h3><div className="flex gap-2"><button className="vv-gold !min-h-0 !py-1 !px-3 !text-[11px]" onClick={()=>onReopenHistory(item)}>Xem lại</button><button className="vv-outline !min-h-0 !py-1 !px-3 !text-[11px] !border-[#815650] !text-[#CB8580]" onClick={()=>onDeleteHistory(item.id)}>Xóa</button></div></div><CostumeImage costumeId={CULTURAL_COSTUMES.find(costume=>item.costumeName.includes(costume.name)||costume.name.includes(item.costumeName))?.id||'ao-tac'} className="vv-history-art"/></div></article>)}{!history.length&&<p className="vv-note py-6">Chưa có hoạt động nào.</p>}</div>}
    {tab==='security'&&<div className="vv-panel mt-4"><h3 className="font-semibold mb-3">Đổi mật khẩu</h3><p className="vv-note mb-3">Tính năng tài khoản sẽ hoạt động khi kết nối hệ thống đăng nhập.</p><label className="block text-xs mb-3">Mật khẩu hiện tại<input type="password" autoComplete="current-password" className="vv-field mt-1"/></label><label className="block text-xs">Mật khẩu mới<input type="password" autoComplete="new-password" className="vv-field mt-1"/></label><button className="vv-gold mt-3" disabled>CẬP NHẬT MẬT KHẨU</button></div>}
    {tab==='notifications'&&<div className="vv-panel mt-4 space-y-4 text-sm"><label className="flex justify-between gap-3">Thông báo bộ sưu tập mới<input type="checkbox" defaultChecked className="accent-[#D8C18D]"/></label><label className="flex justify-between gap-3">Gợi ý phối đồ hàng tuần<input type="checkbox" defaultChecked className="accent-[#D8C18D]"/></label><p className="vv-note">Lựa chọn đang áp dụng cho phiên xem giao diện này.</p></div>}
    {tab==='security'&&onOpenAdmin&&<button className="vv-outline mt-4" onClick={onOpenAdmin}>MỞ GIAO DIỆN QUẢN TRỊ</button>}
   </section>
  </div>
  {editing&&<div className="vv-modal"><form className="vv-modal-box space-y-4" role="dialog" aria-modal="true" aria-label="Chỉnh sửa thông tin" onSubmit={event=>{event.preventDefault();onUpdateProfile(name.trim(),email.trim());setEditing(false);setNotice('Đã cập nhật thông tin hồ sơ.');}}><div className="flex justify-between"><h2 className="text-xl text-[#D8C18D]">Chỉnh sửa thông tin</h2><button type="button" aria-label="Đóng biểu mẫu" onClick={()=>setEditing(false)}><X/></button></div><label className="block text-sm">Họ và tên<input required className="vv-field mt-1" value={name} onChange={event=>setName(event.target.value)}/></label><label className="block text-sm">Email<input required type="email" className="vv-field mt-1" value={email} onChange={event=>setEmail(event.target.value)}/></label><button className="vv-gold w-full" type="submit">LƯU THÔNG TIN</button></form></div>}
  {notice&&<div className="vv-toast flex gap-3" role="status">{notice}<button aria-label="Đóng thông báo" onClick={()=>setNotice('')}><X size={14}/></button></div>}
 </div>;
};
