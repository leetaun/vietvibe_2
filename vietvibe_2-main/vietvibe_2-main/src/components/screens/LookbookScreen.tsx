import React, { useState } from 'react';
import { ArrowUpRight, BookOpen, Images, Plus, Search, Share2, X } from 'lucide-react';
import { ScreenNavigation } from '../common/Header';
import { LookbookAlbum } from '../../types/vietvibe';
import { CULTURAL_COSTUMES } from '../../data/mockData';
import { ReferenceImage, CostumeImage } from '../common/CulturalVisual';

interface LookbookScreenProps {
  albums: LookbookAlbum[];
  onCreateAlbum: (album: LookbookAlbum) => void;
  onUpdateAlbum?: (album: LookbookAlbum) => void;
  isLoggedIn: boolean;
  onOpenAuth: () => void;
  onBack: () => void;
}

const covers: Record<string, number> = { 'lb-1': 43, 'lb-2': 280, 'lb-3': 530, 'lb-4': 778 };
const defaultOccasions = ['Tết Cổ Truyền', 'Chụp Kỷ Yếu', 'Lễ Cưới Hỏi', 'Dạo Phố'];

function AlbumImage({ album, index = 0, cover = false }: { album: LookbookAlbum; index?: number; cover?: boolean }) {
  const outfit = album.outfits[index];
  if (outfit?.image) return <img src={outfit.image} alt={outfit.name} className="h-full w-full object-cover" />;
  if (covers[album.id] !== undefined) {
    return <ReferenceImage file="lookbook-reference.png" crop={cover ? [covers[album.id], 201, 204, 138] : [covers[album.id] + (index % 3) * 68, 389, 65, 72]} className="h-full w-full" label={cover ? 'Ảnh bìa ' + album.title : outfit?.name} />;
  }
  const costume = outfit && CULTURAL_COSTUMES.find(item => outfit.name.toLocaleLowerCase('vi').includes(item.name.toLocaleLowerCase('vi')));
  if (costume) return <CostumeImage costumeId={costume.id} fit="contain" className="h-full w-full" />;
  return <div className="vv-album-placeholder"><Images size={36} aria-hidden="true" /><span>{outfit ? outfit.name : 'Bản phối mới đang chờ bạn'}</span></div>;
}

export const LookbookScreen: React.FC<LookbookScreenProps> = ({ albums, onCreateAlbum, onUpdateAlbum, isLoggedIn, onOpenAuth, onBack }) => {
  const [filter, setFilter] = useState('Tất cả');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editing, setEditing] = useState<LookbookAlbum | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [occasion, setOccasion] = useState(defaultOccasions[0]);
  const [description, setDescription] = useState('');
  const [notice, setNotice] = useState('');
  const occasions = [...new Set([...defaultOccasions, ...albums.map(album => album.occasion)])];
  const tabs = ['Tất cả', ...occasions];
  const shown = albums.filter(album => (filter === 'Tất cả' || album.occasion === filter) && album.title.toLocaleLowerCase('vi').includes(query.trim().toLocaleLowerCase('vi')));
  const selected = albums.find(album => album.id === selectedId);

  const openForm = (album: LookbookAlbum | null = null) => {
    if (!isLoggedIn) { onOpenAuth(); return; }
    setEditing(album);
    setTitle(album?.title || '');
    setDescription(album?.description || '');
    setOccasion(album?.occasion || defaultOccasions[0]);
    setFormOpen(true);
  };
  const save = (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return;
    const album: LookbookAlbum = editing
      ? { ...editing, title: title.trim(), description: description.trim(), occasion }
      : { id: 'lb-' + Date.now(), title: title.trim(), description: description.trim(), occasion, outfitCount: 0, coverImageTheme: '#16385C', tags: [occasion], outfits: [] };
    if (editing) onUpdateAlbum?.(album);
    else { onCreateAlbum(album); setFilter('Tất cả'); setQuery(''); }
    setSelectedId(album.id);
    setFormOpen(false);
  };
  const share = async (album: LookbookAlbum) => {
    try {
      await navigator.clipboard.writeText(album.title + '\n' + album.description + '\n' + album.outfits.map(item => item.name).join('\n'));
      setNotice('Đã sao chép thông tin album.');
    } catch { setNotice('Trình duyệt chưa cho phép sao chép.'); }
  };

  return <div className="vv-screen vv-lookbook">
    <ScreenNavigation onBack={onBack} />
    <header className="vv-lookbook-heading">
      <div className="vv-page-heading">
        <span className="vv-eyebrow"><BookOpen size={14} aria-hidden="true" /> BỘ SƯU TẬP CỦA BẠN</span>
        <h1>Lookbook</h1>
        <p>Lưu giữ những bản phối yêu thích và cảm hứng cho mỗi dịp đặc biệt.</p>
        <span className="vv-lookbook-total">{albums.length} album trong bộ sưu tập</span>
      </div>
      <button type="button" className="vv-gold vv-create-album" onClick={() => openForm()}><Plus size={18} aria-hidden="true" /> Tạo Lookbook mới</button>
    </header>

    <div className="vv-lookbook-toolbar">
      <div className="vv-lookbook-filters" role="group" aria-label="Lọc album theo dịp">
        {tabs.map(tab => <button key={tab} type="button" className="vv-chip" aria-pressed={filter === tab} onClick={() => setFilter(tab)}>{tab}</button>)}
      </div>
      <label className="vv-lookbook-search"><Search size={18} aria-hidden="true" /><input aria-label="Tìm Lookbook" placeholder="Tìm album của bạn…" value={query} onChange={event => setQuery(event.target.value)} /></label>
    </div>

    <div className="vv-lookbook-grid">
      {shown.map(album => <article className="vv-album" key={album.id}>
        <button type="button" className="vv-album-cover" onClick={() => setSelectedId(album.id)} aria-label={'Xem album ' + album.title}>
          <AlbumImage album={album} cover />
          <span className="vv-album-cover-shade" aria-hidden="true" />
          <span className="vv-album-occasion">{album.occasion}</span>
          <span className="vv-album-count"><Images size={14} aria-hidden="true" /> {album.outfitCount} bộ phối</span>
          <span className="vv-album-open" aria-hidden="true"><ArrowUpRight size={19} /></span>
        </button>
        <div className="vv-album-body">
          <h2><button type="button" onClick={() => setSelectedId(album.id)}>{album.title}</button></h2>
          <p className="vv-album-description">{album.description || 'Một không gian dành riêng cho những bản phối mang dấu ấn của bạn.'}</p>
          <div className="vv-album-tags">{album.tags.slice(0, 3).map((tag, index) => <span key={index}>{tag}</span>)}</div>
          <div className="vv-album-actions">
            <button type="button" className="vv-album-view" onClick={() => setSelectedId(album.id)}>Khám phá album <ArrowUpRight size={16} aria-hidden="true" /></button>
            <button type="button" className="vv-album-share" onClick={() => share(album)} aria-label={'Chia sẻ album ' + album.title} title="Sao chép thông tin album"><Share2 size={16} aria-hidden="true" /></button>
          </div>
        </div>
      </article>)}
    </div>

    {!shown.length && <div className="vv-lookbook-empty">
      <Images size={42} aria-hidden="true" /><h2>{albums.length ? 'Chưa tìm thấy album phù hợp' : 'Bắt đầu bộ sưu tập của bạn'}</h2>
      <p>{albums.length ? 'Thử một từ khóa khác hoặc xem tất cả album của bạn.' : 'Tạo một album để lưu những bản phối yêu thích cho từng dịp.'}</p>
      <button type="button" className="vv-gold" onClick={() => { if (albums.length) { setFilter('Tất cả'); setQuery(''); } else openForm(); }}>{albums.length ? 'Xem tất cả album' : 'Tạo album đầu tiên'}</button>
    </div>}

    {selected && !formOpen && <div className="vv-modal" onClick={() => setSelectedId(null)}>
      <div className="vv-modal-box vv-lookbook-dialog" role="dialog" aria-modal="true" aria-label={selected.title} onClick={event => event.stopPropagation()}>
        <div className="vv-dialog-heading"><div><span className="vv-eyebrow">{selected.occasion}</span><h2>{selected.title}</h2></div><button type="button" className="vv-dialog-close" aria-label="Đóng album" onClick={() => setSelectedId(null)}><X size={20} /></button></div>
        <p className="vv-dialog-description">{selected.description}</p>
        {selected.outfits.length ? <div className="vv-album-outfit-grid">{selected.outfits.map((item, index) => <article className="vv-album-outfit" key={index}>
          <div className="vv-album-outfit-art"><AlbumImage album={selected} index={index} /></div>
          <div><span className="vv-note">{item.dynasty}</span><h3>{item.name}</h3><p>{item.details}</p></div>
        </article>)}</div> : <div className="vv-lookbook-empty"><Images size={36} /><h3>Album đang chờ bản phối đầu tiên</h3><p>Bạn có thể lưu bộ phối từ màn hình kết quả thử đồ.</p></div>}
        <div className="vv-dialog-actions"><button type="button" className="vv-outline" onClick={() => share(selected)}><Share2 size={15} /> Sao chép thông tin</button><button type="button" className="vv-gold" onClick={() => openForm(selected)}>Chỉnh sửa album</button></div>
      </div>
    </div>}

    {formOpen && <div className="vv-modal"><form className="vv-modal-box vv-lookbook-form" role="dialog" aria-modal="true" aria-label={editing ? 'Chỉnh sửa album' : 'Tạo Lookbook mới'} onSubmit={save}>
      <div className="vv-dialog-heading"><div><span className="vv-eyebrow">LOOKBOOK CỦA BẠN</span><h2>{editing ? 'Chỉnh sửa album' : 'Tạo Lookbook mới'}</h2></div><button type="button" className="vv-dialog-close" aria-label="Đóng biểu mẫu" onClick={() => setFormOpen(false)}><X size={20} /></button></div>
      <label>Tên album<input autoFocus required maxLength={100} className="vv-field" placeholder="Ví dụ: Những ngày Tết cùng gia đình" value={title} onChange={event => setTitle(event.target.value)} /></label>
      <label>Dịp / Chủ đề<select className="vv-field" value={occasion} onChange={event => setOccasion(event.target.value)}>{occasions.map(item => <option key={item}>{item}</option>)}</select></label>
      <label>Mô tả<textarea rows={4} className="vv-field resize-y" placeholder="Cảm hứng hoặc câu chuyện phía sau bộ sưu tập…" value={description} onChange={event => setDescription(event.target.value)} /></label>
      <div className="vv-dialog-actions"><button type="button" className="vv-outline" onClick={() => setFormOpen(false)}>Hủy</button><button className="vv-gold" type="submit">Lưu Lookbook</button></div>
    </form></div>}
    {notice && <div className="vv-toast flex gap-3" role="status">{notice}<button type="button" aria-label="Đóng thông báo" onClick={() => setNotice('')}><X size={14} /></button></div>}
  </div>;
};
