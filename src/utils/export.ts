/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Tiện ích xuất dữ liệu JSON và CSV kèm nguyên vẹn nguồn trích dẫn học thuật (Yêu cầu 7)
 */

import { Festival, FestivalEdition, HeritageDataBundle, HeritageSource } from '../types/heritage';

/**
 * Tạo và tải xuống tệp văn bản từ trình duyệt
 */
function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Xuất toàn bộ gói dữ liệu di sản dưới dạng JSON
 */
export function exportBundleJSON(
  festivals: Festival[],
  editions: FestivalEdition[],
  sources: HeritageSource[]
) {
  const bundle: HeritageDataBundle = {
    version: '2.0.0',
    exportedAt: new Date().toISOString(),
    projectCode: 'D04',
    festivals,
    editions,
    sources,
  };

  const jsonStr = JSON.stringify(bundle, null, 2);
  const dateStr = new Date().toISOString().split('T')[0];
  downloadFile(jsonStr, `hoi_sac_viet_d04_bundle_${dateStr}.json`, 'application/json');
}

/**
 * Xuất riêng từng tệp JSON
 */
export function exportSingleJSON(
  data: unknown,
  name: 'festivals' | 'editions' | 'sources'
) {
  const jsonStr = JSON.stringify(data, null, 2);
  downloadFile(jsonStr, `${name}.json`, 'application/json');
}

/**
 * Chuyển đổi giá trị sang định dạng an toàn cho CSV (thoát dấu ngoặc kép và bao quanh nếu có dấu phẩy hoặc xuống dòng)
 */
function escapeCSV(val: unknown): string {
  if (val === null || val === undefined) return '""';
  if (Array.isArray(val)) {
    const joined = val.join('; ');
    return `"${joined.replace(/"/g, '""')}"`;
  }
  const str = String(val);
  return `"${str.replace(/"/g, '""')}"`;
}

/**
 * Xuất danh sách hồ sơ lễ hội sang CSV kèm thông tin nguồn trích dẫn chi tiết
 */
export function exportFestivalsCSV(festivals: Festival[], sources: HeritageSource[]) {
  const sourceMap = new Map(sources.map(s => [s.id, s]));

  const headers = [
    'Mã ID',
    'Tên chính thức',
    'Tên gọi khác',
    'Nhóm thực hành văn hoá',
    'Tỉnh / Thành phố',
    'Không gian tổ chức',
    'Cộng đồng chủ thể',
    'Bối cảnh văn hoá',
    'Nguồn gốc lịch sử',
    'Nghi thức chính',
    'Hoạt động hội',
    'Đặc trưng địa phương',
    'Tình trạng ghi danh',
    'Số lượng nguồn',
    'Chi tiết nguồn trích dẫn xác minh',
    'Trạng thái kiểm chứng',
    'Đã đối chiếu thực tế',
    'Ghi chú thẩm định',
    'Ngày cập nhật',
  ];

  const rows = festivals.map(f => {
    // Tổng hợp chi tiết các nguồn trích dẫn
    const citationDetails = (f.sourceIds || [])
      .map(sid => {
        const s = sourceMap.get(sid);
        if (!s) return `[Nguồn thiếu ID: ${sid}]`;
        return `[${s.type.toUpperCase()}] ${s.title} (${s.authorOrOrganization}, ${s.publicationDate || 'Không rõ năm'}${s.url ? ` - ${s.url}` : ''})`;
      })
      .join(' | ');

    return [
      escapeCSV(f.id),
      escapeCSV(f.officialName),
      escapeCSV(f.alternativeNames),
      escapeCSV(f.practiceGroup),
      escapeCSV(f.province),
      escapeCSV(f.location),
      escapeCSV(f.community),
      escapeCSV(f.culturalContext),
      escapeCSV(f.origin),
      escapeCSV(f.rituals),
      escapeCSV(f.activities),
      escapeCSV(f.characteristics),
      escapeCSV(f.heritageStatus),
      escapeCSV(f.sourceIds?.length || 0),
      escapeCSV(citationDetails),
      escapeCSV(f.verificationStatus),
      escapeCSV(f.contentCheckedAgainstOriginal ? 'ĐÃ ĐỐI CHIẾU' : 'CHƯA ĐỐI CHIẾU'),
      escapeCSV(f.adminReviewNotes || ''),
      escapeCSV(f.updatedAt),
    ].join(',');
  });

  // UTF-8 BOM (\uFEFF) giúp Excel hiển thị đúng tiếng Việt có dấu
  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const dateStr = new Date().toISOString().split('T')[0];
  downloadFile(csvContent, `hoi_sac_viet_festivals_${dateStr}.csv`, 'text/csv;charset=utf-8;');
}

/**
 * Xuất danh sách các kỳ tổ chức sang CSV
 */
export function exportEditionsCSV(editions: FestivalEdition[], festivals: Festival[]) {
  const festMap = new Map(festivals.map(f => [f.id, f.officialName]));

  const headers = [
    'Mã ID Kỳ hội',
    'Mã Lễ hội',
    'Tên Lễ hội',
    'Năm tổ chức',
    'Thời gian Âm lịch',
    'Ngày Dương lịch bắt đầu',
    'Ngày Dương lịch kết thúc',
    'Địa điểm / Đường đua',
    'Ghi chú kỳ hội',
    'Mã nguồn tham chiếu',
    'Trạng thái kiểm chứng',
  ];

  const rows = editions.map(e => [
    escapeCSV(e.id),
    escapeCSV(e.festivalId),
    escapeCSV(festMap.get(e.festivalId) || 'Không rõ lễ hội'),
    escapeCSV(e.year),
    escapeCSV(e.lunarDate),
    escapeCSV(e.solarStartDate),
    escapeCSV(e.solarEndDate),
    escapeCSV(e.venue),
    escapeCSV(e.notes),
    escapeCSV(e.sourceIds),
    escapeCSV(e.verificationStatus),
  ].join(','));

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const dateStr = new Date().toISOString().split('T')[0];
  downloadFile(csvContent, `hoi_sac_viet_editions_${dateStr}.csv`, 'text/csv;charset=utf-8;');
}

/**
 * Xuất danh mục nguồn tư liệu sang CSV
 */
export function exportSourcesCSV(sources: HeritageSource[]) {
  const headers = [
    'Mã ID Nguồn',
    'Tiêu đề tài liệu / Công trình',
    'Tác giả hoặc Cơ quan ban hành',
    'Phân loại nguồn',
    'Đường dẫn URL',
    'Năm / Ngày xuất bản',
    'Thời điểm tra cứu',
    'Mô tả nội dung',
    'Quyền sử dụng & Bản quyền',
  ];

  const rows = sources.map(s => [
    escapeCSV(s.id),
    escapeCSV(s.title),
    escapeCSV(s.authorOrOrganization),
    escapeCSV(s.type),
    escapeCSV(s.url),
    escapeCSV(s.publicationDate),
    escapeCSV(s.accessedAt),
    escapeCSV(s.description),
    escapeCSV(s.usageRights),
  ].join(','));

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const dateStr = new Date().toISOString().split('T')[0];
  downloadFile(csvContent, `hoi_sac_viet_sources_${dateStr}.csv`, 'text/csv;charset=utf-8;');
}
