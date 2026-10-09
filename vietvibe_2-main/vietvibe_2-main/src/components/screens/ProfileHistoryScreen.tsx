import React, { useState } from 'react';
import { ArrowUpRight, Award, Bell, BookOpen, Clock3, LogOut, Pencil, ShieldCheck, Shirt, Sparkles, Trash2, UserRound, X } from 'lucide-react';
import { ScreenNavigation } from '../common/Header';
import { UserProfile, UserHistoryItem } from '../../types/vietvibe';
import { CULTURAL_COSTUMES } from '../../data/mockData';
import { CostumeImage, ReferenceImage } from '../common/CulturalVisual';

interface ProfileHistoryScreenProps {
  user: UserProfile;
  history: UserHistoryItem[];
  onDeleteHistory: (id: string) => void;
  onReopenHistory: (item: UserHistoryItem) => void;
  onLogout: () => void;
  onUpdateProfile: (name: string, email: string) => void;
  onBack: () => void;
  onOpenAdmin?: () => void;
}

const actionLabels = { create_outfit: 'Phối đồ', try_on: 'Thử đồ ảo', save_lookbook: 'Lookbook', view_culture: 'Khám phá' };
const tabs = [
  { id: 'history', label: 'Lịch sử hoạt động', icon: Clock3 },
  { id: 'security', label: 'Bảo mật', icon: ShieldCheck },
  { id: 'notifications', label: 'Thông báo', icon: Bell },
];

export const ProfileHistoryScreen: React.FC<ProfileHistoryScreenProps> = ({ user, history, onDeleteHistory, onReopenHistory, onLogout, onUpdateProfile, onBack, onOpenAdmin }) => {
  const [tab, setTab] = useState('history');
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [notice, setNotice] = useState('');
  const startEditing = () => { setName(user.name); setEmail(user.email); setEditing(true); };

  return <div className="vv-screen vv-profile">
    <ScreenNavigation onBack={onBack} />
    <header className="vv-page-heading">
      <span className="vv-eyebrow"><UserRound size={14} aria-hidden="true" /> KHÔNG GIAN CÁ NHÂN</span>
      <h1>Hồ sơ &amp; Lịch sử</h1>
      <p>Những bản phối, trải nghiệm và dấu ấn của bạn cùng VietVibe.</p>
    </header>
    <div className="vv-profile-grid">
      <aside className="vv-profile-card">
        <div className="vv-profile-identity">
          <div className="vv-avatar"><ReferenceImage file="profile-reference.png" crop={[159, 151, 101, 100]} className="h-full w-full" label="Ảnh đại diện mẫu" /></div>
          <h2>{user.name}</h2><p>{user.email}</p>
          <span className="vv-profile-tier"><Award size={15} aria-hidden="true" />{user.tier}</span>
        </div>
        <div className="vv-profile-stats">
          <div><Shirt size={17} aria-hidden="true" /><strong>{user.outfitCount}</strong><span>Bản phối</span></div>
          <div><Sparkles size={17} aria-hidden="true" /><strong>{user.tryOnCount}</strong><span>Lần thử đồ</span></div>
          <div><BookOpen size={17} aria-hidden="true" /><strong>{user.lookbookCount}</strong><span>Lookbook</span></div>
        </div>
        <div className="vv-profile-actions">
          <button type="button" className="vv-gold" onClick={startEditing}><Pencil size={15} aria-hidden="true" /> Chỉnh sửa thông tin</button>
          <button type="button" className="vv-profile-logout" onClick={onLogout}><LogOut size={15} aria-hidden="true" /> Đăng xuất</button>
        </div>
      </aside>
      <section className="vv-profile-content">
        <div className="vv-profile-tabs" role="group" aria-label="Nội dung hồ sơ">
          {tabs.map(({ id, label, icon: Icon }) => <button type="button" key={id} aria-pressed={tab === id} onClick={() => setTab(id)}><Icon size={16} aria-hidden="true" />{label}</button>)}
        </div>
        {tab === 'history' && <>
          <div className="vv-history-heading"><h2>Hành trình phong cách</h2><span>{history.length} hoạt động</span></div>
          <div className="vv-timeline">
            {history.map(item => <article className="vv-history-item" key={item.id}>
              <p className="vv-history-time"><Clock3 size={12} aria-hidden="true" />{item.timeString}</p>
              <div className="vv-history-card">
                {item.resultImage ? <img src={item.resultImage} alt={'Kết quả ' + item.costumeName} className="vv-history-art" /> : <CostumeImage costumeId={CULTURAL_COSTUMES.find(costume => item.costumeName.includes(costume.name) || costume.name.includes(item.costumeName))?.id || 'ao-tac'} className="vv-history-art" />}
                <div className="vv-history-info"><span className="vv-history-kind">{actionLabels[item.actionType]}</span><h3>{item.title}</h3><p>{item.detail}</p>
                  <button type="button" className="vv-history-reopen" onClick={() => onReopenHistory(item)}>Xem lại <ArrowUpRight size={15} aria-hidden="true" /></button>
                </div>
                <button type="button" className="vv-history-delete" onClick={() => onDeleteHistory(item.id)} aria-label={'Xóa hoạt động: ' + item.title} title="Xóa hoạt động"><Trash2 size={16} aria-hidden="true" /></button>
              </div>
            </article>)}
            {!history.length && <div className="vv-profile-empty"><Clock3 size={36} aria-hidden="true" /><h3>Hành trình của bạn bắt đầu từ đây</h3><p>Các bản phối và lần thử đồ sẽ xuất hiện tại đây khi bạn trải nghiệm VietVibe.</p></div>}
          </div>
        </>}
        {tab === 'security' && <div className="vv-profile-settings">
          <span className="vv-eyebrow"><ShieldCheck size={14} /> BẢO MẬT TÀI KHOẢN</span><h2>Đổi mật khẩu</h2><p>Tính năng tài khoản sẽ hoạt động khi kết nối hệ thống đăng nhập.</p>
          <label>Mật khẩu hiện tại<input type="password" autoComplete="current-password" className="vv-field" /></label>
          <label>Mật khẩu mới<input type="password" autoComplete="new-password" className="vv-field" /></label>
          <button type="button" className="vv-gold" disabled>Cập nhật mật khẩu</button>
          {onOpenAdmin && <button type="button" className="vv-outline" onClick={onOpenAdmin}>Mở giao diện quản trị</button>}
        </div>}
        {tab === 'notifications' && <div className="vv-profile-settings">
          <span className="vv-eyebrow"><Bell size={14} /> TÙY CHỈNH THÔNG BÁO</span><h2>Cảm hứng dành cho bạn</h2>
          <label className="vv-notification-row"><span>Bộ sưu tập mới<small>Cập nhật khi có thêm bộ sưu tập.</small></span><input type="checkbox" defaultChecked className="accent-[#D8C18D]" /></label>
          <label className="vv-notification-row"><span>Gợi ý phối đồ hàng tuần<small>Thêm cảm hứng cho những dịp sắp tới.</small></span><input type="checkbox" defaultChecked className="accent-[#D8C18D]" /></label>
          <p>Lựa chọn đang áp dụng cho phiên xem giao diện này.</p>
        </div>}
      </section>
    </div>
    {editing && <div className="vv-modal"><form className="vv-modal-box vv-profile-edit" role="dialog" aria-modal="true" aria-label="Chỉnh sửa thông tin" onSubmit={event => {
      event.preventDefault(); if (!name.trim()) return;
      onUpdateProfile(name.trim(), email.trim()); setEditing(false); setNotice('Đã cập nhật thông tin hồ sơ.');
    }}>
      <div className="vv-dialog-heading"><div><span className="vv-eyebrow">HỒ SƠ CỦA BẠN</span><h2>Chỉnh sửa thông tin</h2></div><button type="button" className="vv-dialog-close" aria-label="Đóng biểu mẫu" onClick={() => setEditing(false)}><X size={20} /></button></div>
      <label>Họ và tên<input autoFocus required className="vv-field" value={name} onChange={event => setName(event.target.value)} /></label>
      <label>Email<input required type="email" className="vv-field" value={email} onChange={event => setEmail(event.target.value)} /></label>
      <div className="vv-dialog-actions"><button type="button" className="vv-outline" onClick={() => setEditing(false)}>Hủy</button><button className="vv-gold" type="submit">Lưu thông tin</button></div>
    </form></div>}
    {notice && <div className="vv-toast flex gap-3" role="status">{notice}<button type="button" aria-label="Đóng thông báo" onClick={() => setNotice('')}><X size={14} /></button></div>}
  </div>;
};
