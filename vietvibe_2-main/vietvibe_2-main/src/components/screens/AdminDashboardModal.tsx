import React, { useState } from 'react';
import { X, ShieldAlert, BarChart3, Shirt, BookOpen, Users, AlertOctagon, RotateCcw, Check, Plus, Trash2 } from 'lucide-react';
import { CULTURAL_COSTUMES, AVAILABLE_ACCESSORIES } from '../../data/mockData';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({ isOpen, onClose }) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'dashboard' | 'costumes' | 'rules' | 'users'>('dashboard');
  const [costumesList, setCostumesList] = useState(CULTURAL_COSTUMES);
  const [undoToast, setUndoToast] = useState<{ message: string; costume: any } | null>(null);

  if (!isOpen) return null;

  const handleDeleteCostume = (costume: any) => {
    setCostumesList(prev => prev.filter(c => c.id !== costume.id));
    setUndoToast({ message: `Đã chuyển "${costume.name}" vào thùng rác.`, costume });
    setTimeout(() => {
      setUndoToast(null);
    }, 5000);
  };

  const handleUndo = () => {
    if (undoToast) {
      setCostumesList(prev => [undoToast.costume, ...prev]);
      setUndoToast(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="bg-[#0C1522] border border-amber-500/30 rounded-3xl max-w-4xl w-full h-[85vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Admin Header */}
        <div className="px-6 py-4 bg-[#101D30] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Bảng Điều Khiển Quản Trị (Admin Dashboard)</h2>
              <p className="text-[11px] text-slate-400">VietVibe Hệ thống quản lý di sản & quy tắc văn hóa</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Admin Nav Tabs */}
        <div className="flex items-center gap-2 px-6 py-2.5 bg-[#090F18] border-b border-slate-800 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveAdminTab('dashboard')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
              activeAdminTab === 'dashboard' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Tổng quan (Analytics)</span>
          </button>
          <button
            onClick={() => setActiveAdminTab('costumes')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
              activeAdminTab === 'costumes' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shirt className="w-3.5 h-3.5" />
            <span>Quản lý Việt phục & Phụ kiện</span>
          </button>
          <button
            onClick={() => setActiveAdminTab('rules')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
              activeAdminTab === 'rules' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>Quy tắc Văn hóa (Guardrails)</span>
          </button>
          <button
            onClick={() => setActiveAdminTab('users')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
              activeAdminTab === 'users' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Người dùng ({costumesList.length * 142})</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: Dashboard Overview */}
          {activeAdminTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <div className="text-xs text-slate-400">Tổng người dùng</div>
                  <div className="text-2xl font-extrabold text-white mt-1 tabular-nums">1,248</div>
                  <div className="text-[10px] text-emerald-400 mt-1">↑ +14% tháng này</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <div className="text-xs text-slate-400">Outfit AI đã tạo</div>
                  <div className="text-2xl font-extrabold text-amber-400 mt-1 tabular-nums">4,892</div>
                  <div className="text-[10px] text-emerald-400 mt-1">↑ 280 lượt/tuần</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <div className="text-xs text-slate-400">Lượt thử đồ (Try-on)</div>
                  <div className="text-2xl font-extrabold text-blue-400 mt-1 tabular-nums">2,105</div>
                  <div className="text-[10px] text-slate-400 mt-1">Độ chính xác 98.4%</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <div className="text-xs text-slate-400">Cảnh báo Red-flag</div>
                  <div className="text-2xl font-extrabold text-red-400 mt-1 tabular-nums">342</div>
                  <div className="text-[10px] text-amber-400 mt-1">89% đã sửa theo gợi ý</div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  Top Việt phục được yêu thích nhất
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-200">1. Áo Tấc (Thời Nguyễn)</span>
                    <span className="text-amber-400 font-bold">42% tổng lượt phối</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5">
                    <div className="bg-amber-400 h-full rounded-full" style={{ width: '42%' }} />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-slate-200">2. Áo Nhật Bình (Thời Nguyễn)</span>
                    <span className="text-amber-400 font-bold">35% tổng lượt phối</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5">
                    <div className="bg-amber-400 h-full rounded-full" style={{ width: '35%' }} />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-slate-200">3. Áo Ngũ Thân (Thời Nguyễn & Lê)</span>
                    <span className="text-amber-400 font-bold">18% tổng lượt phối</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5">
                    <div className="bg-amber-400 h-full rounded-full" style={{ width: '18%' }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Quản lý Việt phục với Xóa Mềm & Toast Hoàn tác */}
          {activeAdminTab === 'costumes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-300 uppercase">
                  Danh mục trang phục trong cơ sở dữ liệu ({costumesList.length})
                </h3>
                <button
                  onClick={() => alert('Chức năng thêm mới Việt phục sẽ mở biểu mẫu nhập liệu di sản.')}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 text-slate-950 flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm Việt phục</span>
                </button>
              </div>

              <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-900/60">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Tên Việt phục</th>
                      <th className="p-3">Triều đại</th>
                      <th className="p-3">Kiểu dáng</th>
                      <th className="p-3">Giới tính</th>
                      <th className="p-3 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-200">
                    {costumesList.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-800/40">
                        <td className="p-3 font-semibold text-white">{c.name}</td>
                        <td className="p-3">Triều {c.dynasty}</td>
                        <td className="p-3">{c.style}</td>
                        <td className="p-3">{c.gender}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleDeleteCostume(c)}
                            className="text-red-400 hover:text-red-300 p-1 hover:bg-red-950/30 rounded"
                            title="Xóa mềm (vào thùng rác)"
                          >
                            <Trash2 className="w-4 h-4 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: Quy tắc Văn hóa (Guardrails) */}
          {activeAdminTab === 'rules' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-amber-300 uppercase">
                Quy tắc kiểm tra văn hóa (AI Cultural Guardrails)
              </h3>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-red-500/30 space-y-1">
                  <div className="font-bold text-red-300 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-400" />
                    <span>Red-flag 01: Áo Lễ Phục cung đình không phối Giày Sneaker hiện đại</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Áp dụng cho Áo Tấc, Áo Nhật Bình. Đề xuất tự động thay thế bằng Hài Thêu hoặc Guốc Mộc.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-red-500/30 space-y-1">
                  <div className="font-bold text-red-300 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-400" />
                    <span>Red-flag 02: Kính râm hiện đại không đội kèm Mấn hoặc Khăn Đóng triều đình</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Đề xuất thay thế bằng Quạt giấy hoặc Trâm cài tóc di sản.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-amber-500/30 space-y-1">
                  <div className="font-bold text-amber-300 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>Quy tắc vạt áo: Áo Giao Lĩnh bắt buộc vạt trái đè vạt phải (Hữu nhậm)</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Cảnh báo nghiêm khắc nếu người dùng đảo chiều vạt áo theo lối Tả nhậm.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Quản lý người dùng */}
          {activeAdminTab === 'users' && (
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Nguyễn Văn A (nguyenvana@email.com)</div>
                  <div className="text-slate-400 text-[11px]">Cấp độ: Người yêu di sản cấp 3 · Đã tạo 12 outfit</div>
                </div>
                <span className="text-emerald-400 font-semibold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                  Hoạt động
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Trần Thị B (tranthib@email.com)</div>
                  <div className="text-slate-400 text-[11px]">Cấp độ: Nhà nghiên cứu cổ phong · Đã tạo 28 outfit</div>
                </div>
                <span className="text-emerald-400 font-semibold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                  Hoạt động
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Undo Toast Notification (Xóa mềm kèm Toast Undo trong 5 giây) */}
        {undoToast && (
          <div className="bg-amber-400 text-slate-950 p-3.5 flex items-center justify-between text-xs font-bold shadow-2xl animate-in slide-in-from-bottom">
            <span>{undoToast.message}</span>
            <button
              onClick={handleUndo}
              className="px-3 py-1 bg-slate-950 text-amber-300 rounded-lg hover:bg-slate-900 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Hoàn tác (Undo)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
