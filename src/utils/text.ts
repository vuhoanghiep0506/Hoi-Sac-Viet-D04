/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Xử lý chuỗi tiếng Việt, tìm kiếm không dấu và định dạng ngày tháng
 */

/**
 * Chuẩn hoá tiếng Việt, loại bỏ dấu thanh để phục vụ tìm kiếm không phân biệt dấu và chữ hoa/thường
 */
export function normalizeVietnamese(text: string | null | undefined): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .trim();
}

/**
 * Kiểm tra xem chuỗi văn bản mục tiêu có chứa từ khoá tìm kiếm không (hỗ trợ không dấu)
 */
export function searchMatches(target: string | null | undefined, query: string): boolean {
  if (!query) return true;
  if (!target) return false;
  const normalizedTarget = normalizeVietnamese(target);
  const normalizedQuery = normalizeVietnamese(query);
  return normalizedTarget.includes(normalizedQuery);
}

/**
 * Định dạng ngày tháng dương lịch
 */
export function formatSolarDate(dateString: string | null | undefined): string {
  if (!dateString) return 'Chưa có tư liệu kiểm chứng';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}
