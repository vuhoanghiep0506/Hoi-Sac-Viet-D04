/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Trang Quản trị & Thẩm định Dữ liệu Di sản (Route: /quan-tri)
 * Giai đoạn 2: Nhập JSON, Kiểm tra toàn vẹn ID, Báo cáo chất lượng dữ liệu,
 * Quy trình thẩm định 3 nguồn + đối chiếu thực tế, Xuất dữ liệu JSON & CSV.
 */

import React, { useState } from 'react';
import {
  ShieldAlert,
  FileText,
  Upload,
  Download,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Unlock,
  Layers,
  Database,
  CalendarDays,
  BookOpen,
  Plus,
  Trash2,
  RefreshCw,
  ExternalLink,
  Info,
} from 'lucide-react';
import { useHeritage } from '../context/HeritageContext';
import { Festival, FestivalEdition, HeritageSource, SourceType } from '../types/heritage';
import { exportBundleJSON, exportEditionsCSV, exportFestivalsCSV, exportSingleJSON, exportSourcesCSV } from '../utils/export';
import { isValidUrl } from '../utils/validation';

export const AdminPage: React.FC = () => {
  const {
    festivals,
    editions,
    sources,
    detailedQualityReport,
    importDataBundle,
    importFestivals,
    importEditions,
    importSources,
    addFestival,
    deleteFestival,
    addEdition,
    deleteEdition,
    addSource,
    deleteSource,
    verifyFestival,
    resetToEmptyOfficial,
    hasCustomData,
  } = useHeritage();

  // Khung bảo mật truy cập nội bộ (Admin Access Gate)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('hoi_sac_viet_admin_auth') === 'true';
  });
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');

  // Quản lý tab giao diện quản trị
  const [activeTab, setActiveTab] = useState<'audit' | 'importer' | 'verify' | 'festivals' | 'editions' | 'sources' | 'export'>('audit');

  // Trạng thái nhập liệu JSON
  const [importMode, setImportMode] = useState<'bundle' | 'festivals' | 'editions' | 'sources'>('bundle');
  const [jsonInput, setJsonInput] = useState('');
  const [importFeedback, setImportFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Trạng thái thẩm định
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [contentCheckedMap, setContentCheckedMap] = useState<Record<string, boolean>>({});
  const [reviewNotesMap, setReviewNotesMap] = useState<Record<string, string>>({});
  const [verifyMessage, setVerifyMessage] = useState<{ id: string; success: boolean; text: string } | null>(null);

  // Form tạo nhanh hồ sơ lễ hội mới (với nguyên tắc mặc định "Chưa có tư liệu kiểm chứng")
  const [newFestName, setNewFestName] = useState('');
  const [newFestProvince, setNewFestProvince] = useState('');
  const [newFestGroup, setNewFestGroup] = useState('Đồng bằng Bắc Bộ');
  const [newFestContext, setNewFestContext] = useState('');
  const [newFestSelectedSources, setNewFestSelectedSources] = useState<string[]>([]);

  // Xử lý đăng nhập quản trị
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mật mã nội bộ đề tài D04: D04-HOISACVIET
    if (passcode.trim().toUpperCase() === 'D04-HOISACVIET' || passcode.trim() === 'hoisacviet2026') {
      setIsAuthenticated(true);
      sessionStorage.setItem('hoi_sac_viet_admin_auth', 'true');
      setAuthError('');
    } else {
      setAuthError('Mật mã quản trị không chính xác. Mật mã mặc định nghiên cứu: D04-HOISACVIET');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('hoi_sac_viet_admin_auth');
  };

  // Xử lý nạp tệp JSON từ máy tính
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = ev => {
      const text = ev.target?.result as string;
      setJsonInput(text);
      setImportFeedback(null);
    };
    reader.readAsText(file);
  };

  // Thực thi nhập dữ liệu JSON
  const handleExecuteImport = () => {
    setImportFeedback(null);
    if (!jsonInput.trim()) {
      setImportFeedback({ type: 'error', message: 'Vui lòng dán nội dung JSON hoặc chọn tệp tải lên.' });
      return;
    }

    try {
      const parsed = JSON.parse(jsonInput);

      if (importMode === 'bundle') {
        const res = importDataBundle(parsed);
        setImportFeedback({
          type: res.success ? 'success' : 'error',
          message: res.message,
        });
      } else if (importMode === 'festivals') {
        const res = importFestivals(parsed);
        setImportFeedback({
          type: res.success ? 'success' : 'error',
          message: res.message,
        });
      } else if (importMode === 'editions') {
        const res = importEditions(parsed);
        setImportFeedback({
          type: res.success ? 'success' : 'error',
          message: res.message,
        });
      } else if (importMode === 'sources') {
        const res = importSources(parsed);
        setImportFeedback({
          type: res.success ? 'success' : 'error',
          message: res.message,
        });
      }
    } catch (err) {
      setImportFeedback({
        type: 'error',
        message: `Lỗi cú pháp JSON: ${err instanceof Error ? err.message : String(err)}`,
      });
    }
  };

  // Xử lý thẩm định hồ sơ (Yêu cầu 4)
  const handleVerifySubmit = (festId: string) => {
    const checked = contentCheckedMap[festId] || false;
    const notes = reviewNotesMap[festId] || '';
    const res = verifyFestival(festId, checked, notes);
    setVerifyMessage({ id: festId, success: res.success, text: res.message });
  };

  // Tạo lễ hội mới
  const handleCreateFestival = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFestName.trim() || !newFestProvince.trim()) {
      alert('Vui lòng điền tên lễ hội và tỉnh/thành phố.');
      return;
    }

    const newFest: Festival = {
      id: `fest-${Date.now()}`,
      officialName: newFestName.trim(),
      alternativeNames: [],
      practiceGroup: newFestGroup,
      province: newFestProvince.trim(),
      location: 'Chưa có tư liệu kiểm chứng',
      community: 'Chưa có tư liệu kiểm chứng',
      culturalContext: newFestContext.trim() || 'Chưa có tư liệu kiểm chứng',
      origin: 'Chưa có tư liệu kiểm chứng',
      rituals: [],
      activities: [],
      characteristics: [],
      heritageStatus: null,
      sourceIds: newFestSelectedSources,
      verificationStatus: 'draft',
      imageIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      contentCheckedAgainstOriginal: false,
    };

    addFestival(newFest);
    setNewFestName('');
    setNewFestProvince('');
    setNewFestContext('');
    setNewFestSelectedSources([]);
    alert(`Đã thêm hồ sơ "${newFest.officialName}" ở trạng thái bản thảo (draft). Cần tối thiểu 3 nguồn trước khi thẩm định.`);
  };

  // MÀN HÌNH KHÓA TRUY CẬP QUẢN TRỊ
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 rounded-2xl bg-white border border-[#E7DED0] shadow-md space-y-6">
        <div className="w-14 h-14 mx-auto rounded-full bg-[#8F2724]/10 text-[#8F2724] flex items-center justify-center">
          <Lock className="w-7 h-7" />
        </div>

        <div className="text-center space-y-1">
          <h1 className="font-serif text-2xl font-bold text-[#183E3A]">
            Khu vực Quản trị Di sản D04
          </h1>
          <p className="text-xs text-[#746C61]">
            Dành cho nhóm nghiên cứu và ban thẩm định học thuật dự án HỘI SẮC VIỆT.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="admin-passcode" className="block text-xs font-semibold text-[#183E3A] mb-1">
              Mã bảo mật quản trị:
            </label>
            <input
              id="admin-passcode"
              type="password"
              value={passcode}
              onChange={e => setPasscode(e.target.value)}
              placeholder="Nhập mã truy cập..."
              className="w-full px-4 py-2.5 rounded-lg border border-[#E7DED0] text-sm focus:border-[#8F2724] focus:ring-2 focus:ring-[#8F2724]/10"
            />
          </div>

          {authError && (
            <p className="text-xs text-[#8F2724] bg-red-50 p-2.5 rounded border border-red-200">
              {authError}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg text-sm font-semibold bg-[#8F2724] text-white hover:bg-[#751F1C] transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <Unlock className="w-4 h-4" />
            <span>Mở khoá quản trị</span>
          </button>
        </form>

        <div className="p-3 rounded-lg bg-[#F8F4EA] border border-[#E7DED0] text-[11px] text-[#746C61] flex items-start gap-2">
          <Info className="w-4 h-4 shrink-0 text-[#183E3A] mt-0.5" />
          <span>
            Gợi ý thẩm định viên: Mã truy cập mặc định là <code className="font-mono font-bold text-[#8F2724]">D04-HOISACVIET</code>.
          </span>
        </div>
      </div>
    );
  }

  // GIAO DIỆN QUẢN TRỊ VIÊN ĐÃ XÁC THỰC
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* HEADER QUẢN TRỊ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E7DED0] pb-6">
        <div>
          <span className="text-xs font-semibold tracking-wider text-[#8F2724] uppercase">
            HỘI SẮC VIỆT · GIAI ĐOẠN 2
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#183E3A] mt-1">
            Trung tâm Nhập liệu & Thẩm định Di sản
          </h1>
          <p className="text-xs text-[#746C61] mt-1">
            Kiểm tra quan hệ ID, thẩm định 3 nguồn xác thực và xuất dữ liệu JSON/CSV có nguồn.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {hasCustomData && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Bạn có chắc muốn xoá toàn bộ dữ liệu tự nhập và trở về kho ban đầu?')) {
                  resetToEmptyOfficial();
                  alert('Đã xoá bộ dữ liệu tuỳ chỉnh trong trình duyệt.');
                }
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border border-red-300 text-red-700 bg-red-50 hover:bg-red-100 transition-colors cursor-pointer"
            >
              Đặt lại về kho rỗng
            </button>
          )}

          <button
            type="button"
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border border-[#E7DED0] bg-white text-[#746C61] hover:text-[#8F2724] transition-colors cursor-pointer"
          >
            Đăng xuất
          </button>
        </div>
      </div>

      {/* THANH ĐIỀU HƯỚNG CÁC PHÂN HỆ QUẢN TRỊ */}
      <div className="flex items-center gap-1.5 overflow-x-auto border-b border-[#E7DED0] pb-1">
        {[
          { key: 'audit', label: 'Báo cáo chất lượng', icon: ShieldAlert },
          { key: 'importer', label: 'Nhập dữ liệu JSON', icon: Upload },
          { key: 'verify', label: 'Thẩm định hồ sơ', icon: CheckCircle2 },
          { key: 'festivals', label: `Hồ sơ di sản (${festivals.length})`, icon: Database },
          { key: 'editions', label: `Kỳ tổ chức (${editions.length})`, icon: CalendarDays },
          { key: 'sources', label: `Nguồn tư liệu (${sources.length})`, icon: BookOpen },
          { key: 'export', label: 'Xuất dữ liệu (JSON/CSV)', icon: Download },
        ].map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setActiveTab(t.key as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'bg-[#183E3A] text-white shadow-xs'
                  : 'bg-white text-[#746C61] hover:text-[#183E3A] hover:bg-[#F8F4EA]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: BÁO CÁO CHẤT LƯỢNG DỮ LIỆU (YÊU CẦU 6) */}
      {/* ========================================================================= */}
      {activeTab === 'audit' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* 6 Thẻ KPI tổng quan */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white p-4 rounded-xl border border-[#E7DED0]">
              <span className="block text-[11px] text-[#746C61] uppercase tracking-wider">Hồ sơ lễ hội</span>
              <span className="font-serif text-2xl font-bold text-[#183E3A] tabular-nums">
                {detailedQualityReport.totalFestivals}
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#E7DED0]">
              <span className="block text-[11px] text-[#746C61] uppercase tracking-wider">Đã xác minh</span>
              <span className="font-serif text-2xl font-bold text-emerald-700 tabular-nums">
                {detailedQualityReport.verifiedFestivals}
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#E7DED0]">
              <span className="block text-[11px] text-[#746C61] uppercase tracking-wider">Đang chờ thẩm định</span>
              <span className="font-serif text-2xl font-bold text-amber-700 tabular-nums">
                {detailedQualityReport.pendingFestivals + detailedQualityReport.draftFestivals}
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#E7DED0]">
              <span className="block text-[11px] text-[#746C61] uppercase tracking-wider">Tổng nguồn tư liệu</span>
              <span className="font-serif text-2xl font-bold text-[#183E3A] tabular-nums">
                {detailedQualityReport.totalSources}
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#E7DED0]">
              <span className="block text-[11px] text-[#746C61] uppercase tracking-wider">Nguồn chính thống</span>
              <span className="font-serif text-2xl font-bold text-[#8F2724] tabular-nums">
                {detailedQualityReport.officialSourcesCount}
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#E7DED0]">
              <span className="block text-[11px] text-[#746C61] uppercase tracking-wider">Kỳ tổ chức (Năm)</span>
              <span className="font-serif text-2xl font-bold text-[#C5A36B] tabular-nums">
                {detailedQualityReport.totalEditions}
              </span>
            </div>
          </div>

          {/* Phân biệt Hồ sơ lễ hội vs Kỳ tổ chức (Yêu cầu 5) */}
          <div className="p-4 rounded-xl bg-[#F8F4EA] border border-[#E7DED0] text-xs text-[#292623] flex items-start gap-3">
            <Info className="w-5 h-5 shrink-0 text-[#183E3A] mt-0.5" />
            <div className="leading-relaxed">
              <strong className="text-[#183E3A]">Quy tắc phân định bản thể di sản:</strong> Hệ thống đếm chính xác{' '}
              <strong className="text-[#8F2724]">{detailedQualityReport.totalFestivals}</strong> hồ sơ di sản phi vật thể độc lập và{' '}
              <strong className="text-[#183E3A]">{detailedQualityReport.totalEditions}</strong> kỳ tổ chức theo từng năm. Các kỳ hội lặp lại không bao giờ bị đếm trùng thành các di sản riêng biệt.
            </div>
          </div>

          {/* DANH SÁCH BẢN GHI THIẾU NGUỒN (< 3 nguồn) */}
          <div className="bg-white rounded-xl border border-[#E7DED0] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-base font-bold text-[#183E3A] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Danh sách bản ghi thiếu nguồn tham khảo ({detailedQualityReport.festivalsMissingSources.length})</span>
              </h3>
              <span className="text-xs text-[#746C61]">Quy chuẩn: Tối thiểu 3 nguồn khoa học</span>
            </div>

            {detailedQualityReport.festivalsMissingSources.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#F8F4EA] text-[#183E3A] border-b border-[#E7DED0]">
                      <th className="py-2.5 px-3">Mã ID</th>
                      <th className="py-2.5 px-3">Tên lễ hội</th>
                      <th className="py-2.5 px-3">Địa phương</th>
                      <th className="py-2.5 px-3">Nguồn hiện có</th>
                      <th className="py-2.5 px-3">Lý do chưa đạt</th>
                      <th className="py-2.5 px-3 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E7DED0]">
                    {detailedQualityReport.festivalsMissingSources.map(item => (
                      <tr key={item.festival.id} className="hover:bg-amber-50/40">
                        <td className="py-2 px-3 font-mono text-[11px] text-[#746C61]">{item.festival.id}</td>
                        <td className="py-2 px-3 font-semibold text-[#183E3A]">{item.festival.officialName}</td>
                        <td className="py-2 px-3 text-[#292623]">{item.festival.province}</td>
                        <td className="py-2 px-3">
                          <span className="text-red-700 font-bold">{item.currentSourceCount}/3 nguồn</span>
                        </td>
                        <td className="py-2 px-3 text-[#746C61]">{item.reason}</td>
                        <td className="py-2 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => setActiveTab('verify')}
                            className="text-[#8F2724] hover:underline font-medium text-[11px] cursor-pointer"
                          >
                            Bổ sung nguồn &rarr;
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-emerald-700 bg-emerald-50 p-3 rounded border border-emerald-200">
                ✓ Tất cả các hồ sơ hiện tại đều đáp ứng tối thiểu 3 nguồn tư liệu hoặc kho đang trống chuẩn bị nhập.
              </p>
            )}
          </div>

          {/* DANH SÁCH BẢN GHI CHƯA ĐỦ ĐIỀU KIỆN CÔNG BỐ */}
          <div className="bg-white rounded-xl border border-[#E7DED0] p-6 space-y-4">
            <h3 className="font-serif text-base font-bold text-[#183E3A] flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#8F2724]" />
              <span>Danh sách bản ghi chưa đủ điều kiện công bố ({detailedQualityReport.unpublishableRecords.length})</span>
            </h3>

            {detailedQualityReport.unpublishableRecords.length > 0 ? (
              <div className="space-y-3">
                {detailedQualityReport.unpublishableRecords.map(item => (
                  <div key={item.festival.id} className="p-3.5 rounded-lg border border-[#E7DED0] bg-[#F8F4EA]/30 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#183E3A]">
                        {item.festival.officialName} ({item.festival.province})
                      </span>
                      <span className="text-[10px] uppercase font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                        {item.festival.verificationStatus}
                      </span>
                    </div>

                    <ul className="list-disc pl-4 space-y-0.5 text-[#746C61]">
                      {item.reasons.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-emerald-700 bg-emerald-50 p-3 rounded border border-emerald-200">
                ✓ Không có hồ sơ nào bị đình chỉ hoặc toàn bộ hồ sơ đã qua phê duyệt xác minh.
              </p>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: NHẬP DỮ LIỆU JSON (YÊU CẦU 1 & 2) */}
      {/* ========================================================================= */}
      {activeTab === 'importer' && (
        <div className="bg-white p-6 rounded-xl border border-[#E7DED0] shadow-xs space-y-6">
          <div className="border-b border-[#E7DED0] pb-4">
            <h2 className="font-serif text-xl font-bold text-[#183E3A]">
              Công cụ nhập dữ liệu JSON & Kiểm tra tính toàn vẹn
            </h2>
            <p className="text-xs text-[#746C61] mt-1">
              Hỗ trợ nhập trọn gói (Bundle) hoặc từng tệp festivals, editions, sources. Hệ thống sẽ tự động kiểm tra quan hệ khoá ngoại trước khi lưu trữ.
            </p>
          </div>

          {/* Chọn chế độ nhập */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold text-[#183E3A]">Chế độ nhập:</span>
            {[
              { id: 'bundle', label: 'Toàn bộ gói (Bundle: 3 tệp)' },
              { id: 'festivals', label: 'Chỉ Hồ sơ Lễ hội (festivals.json)' },
              { id: 'editions', label: 'Chỉ Kỳ tổ chức (editions.json)' },
              { id: 'sources', label: 'Chỉ Nguồn tư liệu (sources.json)' },
            ].map(m => (
              <button
                key={m.id}
                type="button"
                onClick={() => setImportMode(m.id as any)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
                  importMode === m.id
                    ? 'bg-[#8F2724] text-white border-[#8F2724]'
                    : 'bg-white text-[#746C61] border-[#E7DED0] hover:border-[#8F2724]'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Tải tệp lên */}
          <div className="p-4 rounded-xl border border-dashed border-[#C5A36B] bg-[#F8F4EA]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Upload className="w-6 h-6 text-[#8F2724]" />
              <div>
                <p className="text-xs font-semibold text-[#183E3A]">Tải tệp JSON từ máy tính</p>
                <p className="text-[11px] text-[#746C61]">Chọn tệp .json hợp lệ đã biên soạn</p>
              </div>
            </div>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="text-xs text-[#746C61] file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border file:border-[#E7DED0] file:text-xs file:bg-white file:text-[#183E3A] hover:file:bg-[#F8F4EA] cursor-pointer"
            />
          </div>

          {/* Ô dán JSON trực tiếp */}
          <div>
            <label htmlFor="json-paste-box" className="block text-xs font-semibold text-[#183E3A] mb-1">
              Hoặc dán nội dung JSON vào khung dưới đây:
            </label>
            <textarea
              id="json-paste-box"
              rows={12}
              value={jsonInput}
              onChange={e => setJsonInput(e.target.value)}
              placeholder='[ { "id": "fest-01", "officialName": "Lễ hội...", ... } ]'
              className="w-full font-mono text-xs p-3 rounded-lg border border-[#E7DED0] bg-[#F8F4EA]/20 focus:border-[#8F2724] focus:ring-1 focus:ring-[#8F2724]"
            />
          </div>

          {/* Phản hồi sau khi kiểm tra nhập */}
          {importFeedback && (
            <div
              className={`p-4 rounded-xl text-xs flex items-start gap-2.5 whitespace-pre-wrap leading-relaxed ${
                importFeedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                  : 'bg-red-50 text-red-900 border border-red-200'
              }`}
            >
              {importFeedback.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-700 shrink-0 mt-0.5" />
              )}
              <div className="font-medium">{importFeedback.message}</div>
            </div>
          )}

          {/* Nút thực thi */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setJsonInput('');
                setImportFeedback(null);
              }}
              className="px-4 py-2 rounded-lg text-xs font-medium text-[#746C61] hover:bg-[#F8F4EA]"
            >
              Xoá khung
            </button>

            <button
              type="button"
              onClick={handleExecuteImport}
              className="px-6 py-2.5 rounded-lg text-xs font-semibold bg-[#8F2724] text-white hover:bg-[#751F1C] transition-colors shadow-xs cursor-pointer flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span>Kiểm tra & Nhập dữ liệu</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: THẨM ĐỊNH & XÁC MINH HỒ SƠ (YÊU CẦU 3 & 4) */}
      {/* ========================================================================= */}
      {activeTab === 'verify' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-[#E7DED0]">
            <h2 className="font-serif text-xl font-bold text-[#183E3A]">
              Trung tâm Thẩm định & Phê duyệt Xác minh
            </h2>
            <p className="text-xs text-[#746C61] mt-1 leading-relaxed">
              Theo quy chuẩn học thuật: Một hồ sơ chỉ được phê duyệt xác minh khi đáp ứng đủ{' '}
              <strong>tối thiểu 3 nguồn tham khảo hợp lệ</strong> VÀ quản trị viên đã trực tiếp xác nhận{' '}
              <strong>đối chiếu nội dung thực tế từ tài liệu gốc</strong>.
            </p>
          </div>

          <div className="space-y-4">
            {festivals.map(fest => {
              const linkedSources = sources.filter(s => fest.sourceIds?.includes(s.id));
              const sCount = linkedSources.length;
              const hasMinSources = sCount >= 3;
              const isVerified = fest.verificationStatus === 'verified';
              const isChecked = contentCheckedMap[fest.id] ?? fest.contentCheckedAgainstOriginal ?? false;

              return (
                <div
                  key={fest.id}
                  className={`p-6 rounded-xl bg-white border transition-all ${
                    isVerified
                      ? 'border-emerald-300'
                      : hasMinSources
                      ? 'border-[#C5A36B]'
                      : 'border-red-200'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#E7DED0] pb-3 mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif text-lg font-bold text-[#183E3A]">
                          {fest.officialName}
                        </h3>
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                            isVerified
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {isVerified ? 'ĐÃ XÁC MINH' : 'CHỜ THẨM ĐỊNH'}
                        </span>
                      </div>
                      <p className="text-xs text-[#746C61]">
                        Địa phương: {fest.province} · Nhóm: {fest.practiceGroup}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                          hasMinSources ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {sCount}/3 nguồn tối thiểu
                      </span>
                    </div>
                  </div>

                  {/* Danh sách các nguồn đã liên kết kèm kiểm tra URL */}
                  <div className="space-y-2 mb-4">
                    <span className="text-xs font-semibold text-[#183E3A] block">
                      Danh mục nguồn tư liệu ({sCount}):
                    </span>
                    {linkedSources.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        {linkedSources.map(s => {
                          const hasUrl = Boolean(s.url);
                          const urlValid = isValidUrl(s.url);
                          return (
                            <div key={s.id} className="p-2.5 rounded border border-[#E7DED0] bg-[#F8F4EA]/40 text-xs space-y-1">
                              <span className="font-semibold text-[#183E3A] line-clamp-1">{s.title}</span>
                              <span className="text-[11px] text-[#746C61] block">
                                {s.authorOrOrganization} ({s.publicationDate || 'Không rõ năm'})
                              </span>
                              {hasUrl ? (
                                <a
                                  href={s.url!}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 text-[10px] text-[#8F2724] hover:underline"
                                >
                                  <span>Đường dẫn ({urlValid ? 'URL hợp lệ' : 'URL cần kiểm tra'})</span>
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              ) : (
                                <span className="text-[10px] text-[#746C61] italic">
                                  Tài liệu vật lý / Sách lưu trữ
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-red-600 italic">Chưa có nguồn tư liệu nào được liên kết.</p>
                    )}
                  </div>

                  {/* Khung thao tác xác nhận thẩm định của Quản trị viên */}
                  <div className="p-4 rounded-lg bg-[#F8F4EA] border border-[#E7DED0] space-y-3">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={e => {
                          setContentCheckedMap({
                            ...contentCheckedMap,
                            [fest.id]: e.target.checked,
                          });
                        }}
                        className="mt-1 w-4 h-4 rounded text-[#8F2724] focus:ring-[#8F2724]"
                      />
                      <span className="text-xs text-[#292623] leading-relaxed">
                        <strong className="text-[#8F2724]">Cam kết thẩm định:</strong> Tôi xác nhận đã trực tiếp đối chiếu nội dung thực tế từ tài liệu gốc (sách/hồ sơ khoa học/tư liệu lưu trữ), không chỉ dựa vào đường dẫn URL để suy đoán nội dung đúng.
                      </span>
                    </label>

                    <div>
                      <input
                        type="text"
                        value={reviewNotesMap[fest.id] || fest.adminReviewNotes || ''}
                        onChange={e => {
                          setReviewNotesMap({
                            ...reviewNotesMap,
                            [fest.id]: e.target.value,
                          });
                        }}
                        placeholder="Ghi chú thẩm định (Ví dụ: Đã đối chiếu với Hồ sơ khoa học Cục Di sản số 24/DSVH...)"
                        className="w-full px-3 py-1.5 rounded border border-[#E7DED0] bg-white text-xs text-[#292623]"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      {verifyMessage && verifyMessage.id === fest.id && (
                        <span
                          className={`text-xs font-medium ${
                            verifyMessage.success ? 'text-emerald-700' : 'text-red-700'
                          }`}
                        >
                          {verifyMessage.text}
                        </span>
                      )}

                      <div className="ml-auto">
                        <button
                          type="button"
                          onClick={() => handleVerifySubmit(fest.id)}
                          className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#8F2724] text-white hover:bg-[#751F1C] transition-colors cursor-pointer"
                        >
                          {isVerified ? 'Cập nhật lại thẩm định' : 'Phê duyệt xác minh (Verify)'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: QUẢN LÝ HỒ SƠ LỄ HỘI (FESTIVALS) */}
      {/* ========================================================================= */}
      {activeTab === 'festivals' && (
        <div className="space-y-8">
          {/* Form thêm mới hồ sơ lễ hội */}
          <div className="bg-white p-6 rounded-xl border border-[#E7DED0] shadow-xs space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#183E3A] flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#8F2724]" />
              <span>Tạo hồ sơ lễ hội mới (Bản thảo)</span>
            </h3>

            <form onSubmit={handleCreateFestival} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-medium text-[#183E3A] mb-1">Tên lễ hội chính thức *</label>
                <input
                  type="text"
                  required
                  value={newFestName}
                  onChange={e => setNewFestName(e.target.value)}
                  placeholder="Ví dụ: Lễ hội Bơi Đua thuyền truyền thống..."
                  className="w-full px-3 py-2 rounded border border-[#E7DED0] bg-white"
                />
              </div>

              <div>
                <label className="block font-medium text-[#183E3A] mb-1">Tỉnh / Thành phố *</label>
                <input
                  type="text"
                  required
                  value={newFestProvince}
                  onChange={e => setNewFestProvince(e.target.value)}
                  placeholder="Ví dụ: Quảng Ngãi, Huế, Sóc Trăng..."
                  className="w-full px-3 py-2 rounded border border-[#E7DED0] bg-white"
                />
              </div>

              <div>
                <label className="block font-medium text-[#183E3A] mb-1">Nhóm vùng miền / Thực hành văn hoá</label>
                <select
                  value={newFestGroup}
                  onChange={e => setNewFestGroup(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-[#E7DED0] bg-white"
                >
                  <option value="Đồng bằng Bắc Bộ">Đồng bằng Bắc Bộ</option>
                  <option value="Duyên hải Bắc Trung Bộ">Duyên hải Bắc Trung Bộ</option>
                  <option value="Duyên hải Nam Trung Bộ & Đảo biển">Duyên hải Nam Trung Bộ & Đảo biển</option>
                  <option value="Đồng bằng sông Cửu Long">Đồng bằng sông Cửu Long</option>
                  <option value="Tây Nguyên">Tây Nguyên</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-[#183E3A] mb-1">Chọn nguồn tư liệu liên kết (Đã có trong kho)</label>
                <select
                  multiple
                  value={newFestSelectedSources}
                  onChange={e => {
                    const selected = Array.from(e.target.selectedOptions, opt => opt.value);
                    setNewFestSelectedSources(selected);
                  }}
                  className="w-full px-3 py-2 rounded border border-[#E7DED0] bg-white h-20"
                >
                  {sources.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.title} ({s.authorOrOrganization})
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-[#746C61]">Giữ phím Ctrl/Cmd để chọn nhiều nguồn</span>
              </div>

              <div className="md:col-span-2">
                <label className="block font-medium text-[#183E3A] mb-1">Tóm tắt bối cảnh văn hoá & tín ngưỡng</label>
                <textarea
                  rows={2}
                  value={newFestContext}
                  onChange={e => setNewFestContext(e.target.value)}
                  placeholder="Mô tả bối cảnh văn hoá (nếu chưa rõ, hệ thống tự điền 'Chưa có tư liệu kiểm chứng')..."
                  className="w-full px-3 py-2 rounded border border-[#E7DED0] bg-white"
                />
              </div>

              <div className="md:col-span-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-xs font-semibold bg-[#8F2724] text-white hover:bg-[#751F1C] cursor-pointer"
                >
                  Lưu hồ sơ mới
                </button>
              </div>
            </form>
          </div>

          {/* Danh sách hồ sơ hiện tại */}
          <div className="bg-white rounded-xl border border-[#E7DED0] overflow-hidden">
            <div className="p-4 bg-[#F8F4EA] border-b border-[#E7DED0] flex items-center justify-between">
              <h3 className="font-serif text-sm font-bold text-[#183E3A]">
                Danh sách hồ sơ lễ hội trong hệ thống ({festivals.length})
              </h3>
            </div>

            <div className="divide-y divide-[#E7DED0]">
              {festivals.map(fest => (
                <div key={fest.id} className="p-4 flex items-center justify-between gap-4 text-xs">
                  <div>
                    <h4 className="font-bold text-[#183E3A]">{fest.officialName}</h4>
                    <p className="text-[#746C61]">
                      Mã: <code className="font-mono">{fest.id}</code> · {fest.province} · {fest.practiceGroup} · {fest.sourceIds?.length || 0} nguồn
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        fest.verificationStatus === 'verified'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {fest.verificationStatus}
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Xoá hồ sơ "${fest.officialName}"?`)) {
                          deleteFestival(fest.id);
                        }
                      }}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded cursor-pointer"
                      title="Xoá hồ sơ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: QUẢN LÝ KỲ TỔ CHỨC (EDITIONS) */}
      {/* ========================================================================= */}
      {activeTab === 'editions' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-[#E7DED0]">
            <h2 className="font-serif text-lg font-bold text-[#183E3A]">
              Quản lý các kỳ tổ chức lễ hội theo năm (Festival Editions)
            </h2>
            <p className="text-xs text-[#746C61] mt-1">
              Phân định các kỳ hội theo năm (2024, 2025, 2026...). Mỗi kỳ tổ chức phải liên kết với một hồ sơ di sản chính thức.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-[#E7DED0] overflow-hidden">
            <div className="divide-y divide-[#E7DED0]">
              {editions.map(ed => {
                const fest = festivals.find(f => f.id === ed.festivalId);
                return (
                  <div key={ed.id} className="p-4 flex items-center justify-between gap-4 text-xs">
                    <div>
                      <h4 className="font-bold text-[#183E3A]">
                        {fest ? fest.officialName : `Lễ hội (Mã: ${ed.festivalId})`} – Năm {ed.year}
                      </h4>
                      <p className="text-[#746C61]">
                        Âm lịch: {ed.lunarDate || 'Chưa có'} · Dương lịch: {ed.solarStartDate || 'Chưa có'} · Địa điểm: {ed.venue || 'Chưa có'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Xoá kỳ tổ chức năm ${ed.year}?`)) {
                          deleteEdition(ed.id);
                        }
                      }}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded cursor-pointer"
                      title="Xoá kỳ tổ chức"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: QUẢN LÝ NGUỒN TƯ LIỆU (SOURCES) */}
      {/* ========================================================================= */}
      {activeTab === 'sources' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-[#E7DED0]">
            <h2 className="font-serif text-lg font-bold text-[#183E3A]">
              Danh mục nguồn tư liệu học thuật & xác thực ({sources.length})
            </h2>
            <p className="text-xs text-[#746C61] mt-1">
              Các nguồn tài liệu được phân loại: chính thống, nghiên cứu, cộng đồng, tham khảo.
            </p>
          </div>

          <div className="space-y-3">
            {sources.map(s => (
              <div key={s.id} className="p-4 bg-white rounded-xl border border-[#E7DED0] text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#183E3A]">{s.title}</span>
                  <span className="text-[10px] font-bold uppercase text-[#8F2724] bg-red-50 px-2 py-0.5 rounded">
                    {s.type}
                  </span>
                </div>
                <p className="text-[#746C61]">
                  Tác giả/Cơ quan: {s.authorOrOrganization} · Năm: {s.publicationDate || 'Không rõ'} · Tra cứu: {s.accessedAt}
                </p>
                {s.url && (
                  <p className="text-[#8F2724] truncate">
                    URL: <a href={s.url} target="_blank" rel="noreferrer" className="hover:underline">{s.url}</a>
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 7: XUẤT DỮ LIỆU JSON & CSV (YÊU CẦU 7) */}
      {/* ========================================================================= */}
      {activeTab === 'export' && (
        <div className="bg-white p-6 rounded-xl border border-[#E7DED0] shadow-xs space-y-8">
          <div>
            <h2 className="font-serif text-xl font-bold text-[#183E3A]">
              Xuất dữ liệu chuẩn hoá kèm nguồn trích dẫn
            </h2>
            <p className="text-xs text-[#746C61] mt-1">
              Hỗ trợ xuất định dạng JSON (dùng cho tích hợp hệ thống) và CSV (mở trực tiếp bằng Microsoft Excel với bảng mã UTF-8 BOM giữ nguyên dấu tiếng Việt).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Xuất định dạng JSON */}
            <div className="p-5 rounded-xl border border-[#E7DED0] bg-[#F8F4EA]/40 space-y-3">
              <h3 className="font-serif text-sm font-bold text-[#183E3A] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#8F2724]" />
                <span>Xuất tệp JSON</span>
              </h3>
              <p className="text-xs text-[#746C61] leading-relaxed">
                Xuất trọn gói cấu trúc bundle (bao gồm cả 3 tệp) hoặc xuất riêng lẻ từng tệp dữ liệu JSON.
              </p>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => exportBundleJSON(festivals, editions, sources)}
                  className="w-full py-2 px-3 rounded-lg bg-[#8F2724] text-white text-xs font-semibold hover:bg-[#751F1C] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Xuất gói toàn bộ (HeritageDataBundle.json)</span>
                </button>

                <div className="grid grid-cols-3 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => exportSingleJSON(festivals, 'festivals')}
                    className="py-1.5 px-2 rounded border border-[#E7DED0] bg-white text-xs text-[#292623] hover:border-[#8F2724]"
                  >
                    festivals.json
                  </button>
                  <button
                    type="button"
                    onClick={() => exportSingleJSON(editions, 'editions')}
                    className="py-1.5 px-2 rounded border border-[#E7DED0] bg-white text-xs text-[#292623] hover:border-[#8F2724]"
                  >
                    editions.json
                  </button>
                  <button
                    type="button"
                    onClick={() => exportSingleJSON(sources, 'sources')}
                    className="py-1.5 px-2 rounded border border-[#E7DED0] bg-white text-xs text-[#292623] hover:border-[#8F2724]"
                  >
                    sources.json
                  </button>
                </div>
              </div>
            </div>

            {/* Xuất định dạng CSV */}
            <div className="p-5 rounded-xl border border-[#E7DED0] bg-[#F8F4EA]/40 space-y-3">
              <h3 className="font-serif text-sm font-bold text-[#183E3A] flex items-center gap-2">
                <Download className="w-4 h-4 text-[#183E3A]" />
                <span>Xuất tệp CSV (Excel UTF-8)</span>
              </h3>
              <p className="text-xs text-[#746C61] leading-relaxed">
                Tệp CSV được nhúng nguyên vẹn chuỗi trích dẫn nguồn xác minh, sử dụng mã UTF-8 BOM chuẩn.
              </p>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => exportFestivalsCSV(festivals, sources)}
                  className="w-full py-2 px-3 rounded-lg bg-[#183E3A] text-white text-xs font-semibold hover:bg-[#235550] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Xuất Hồ sơ Lễ hội (festivals.csv)</span>
                </button>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => exportEditionsCSV(editions, festivals)}
                    className="py-1.5 px-2 rounded border border-[#E7DED0] bg-white text-xs text-[#292623] hover:border-[#183E3A]"
                  >
                    Kỳ tổ chức (editions.csv)
                  </button>

                  <button
                    type="button"
                    onClick={() => exportSourcesCSV(sources)}
                    className="py-1.5 px-2 rounded border border-[#E7DED0] bg-white text-xs text-[#292623] hover:border-[#183E3A]"
                  >
                    Nguồn tư liệu (sources.csv)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
