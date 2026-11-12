/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Thanh tìm kiếm và bộ lọc thư viện lễ hội
 * Các lựa chọn địa phương và nhóm thực hành hoàn toàn sinh ra từ dữ liệu thực tế, không tạo giả.
 */

import React from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { useHeritage } from '../../context/HeritageContext';

export const FestivalFiltersBar: React.FC = () => {
  const { festivals, filters, setFilter, resetFilters } = useHeritage();

  // Trích xuất danh sách tỉnh/thành phố và nhóm thực hành duy nhất từ dữ liệu thực tế
  const provinces = Array.from(
    new Set(festivals.map(f => f.province).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b, 'vi'));

  const practiceGroups = Array.from(
    new Set(festivals.map(f => f.practiceGroup).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b, 'vi'));

  const hasActiveFilters = Boolean(
    filters.searchTerm ||
      filters.province ||
      filters.practiceGroup ||
      filters.verificationStatus
  );

  return (
    <div className="bg-white p-5 rounded-xl border border-[#E7DED0] shadow-xs mb-8 space-y-4">
      {/* Hàng 1: Ô tìm kiếm chính */}
      <div className="relative">
        <label htmlFor="festival-search" className="sr-only">
          Tìm kiếm lễ hội
        </label>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#746C61]" />
          <input
            id="festival-search"
            type="text"
            value={filters.searchTerm}
            onChange={e => setFilter('searchTerm', e.target.value)}
            placeholder="Tìm theo tên lễ hội, tên gọi khác, địa phương, cộng đồng..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#E7DED0] focus:border-[#8F2724] focus:ring-2 focus:ring-[#8F2724]/10 bg-[#F8F4EA]/30 text-sm placeholder-[#746C61]/70 transition-colors"
          />
        </div>
      </div>

      {/* Hàng 2: Các bộ lọc trích xuất từ dữ liệu thực tế */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
        {/* Lọc theo Tỉnh / Thành phố */}
        <div>
          <label htmlFor="filter-province" className="block text-xs font-medium text-[#746C61] mb-1">
            Tỉnh / Thành phố
          </label>
          <select
            id="filter-province"
            value={filters.province}
            onChange={e => setFilter('province', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-[#E7DED0] focus:border-[#8F2724] bg-white text-xs text-[#292623]"
          >
            <option value="">Tất cả địa phương</option>
            {provinces.map(prov => (
              <option key={prov} value={prov}>
                {prov}
              </option>
            ))}
          </select>
        </div>

        {/* Lọc theo Nhóm thực hành / Vùng miền */}
        <div>
          <label htmlFor="filter-group" className="block text-xs font-medium text-[#746C61] mb-1">
            Nhóm thực hành văn hoá
          </label>
          <select
            id="filter-group"
            value={filters.practiceGroup}
            onChange={e => setFilter('practiceGroup', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-[#E7DED0] focus:border-[#8F2724] bg-white text-xs text-[#292623]"
          >
            <option value="">Tất cả nhóm di sản</option>
            {practiceGroups.map(grp => (
              <option key={grp} value={grp}>
                {grp}
              </option>
            ))}
          </select>
        </div>

        {/* Lọc theo Trạng thái kiểm chứng */}
        <div>
          <label htmlFor="filter-status" className="block text-xs font-medium text-[#746C61] mb-1">
            Mức độ kiểm chứng
          </label>
          <select
            id="filter-status"
            value={filters.verificationStatus}
            onChange={e => setFilter('verificationStatus', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-[#E7DED0] focus:border-[#8F2724] bg-white text-xs text-[#292623]"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="verified">Đã xác minh (Verified - Có đủ 3+ nguồn)</option>
            <option value="pending">Đang thẩm định (Pending)</option>
            <option value="draft">Bản thảo tư liệu (Draft)</option>
          </select>
        </div>

        {/* Nút đặt lại bộ lọc */}
        <div className="flex items-end">
          <button
            type="button"
            onClick={resetFilters}
            disabled={!hasActiveFilters}
            className={`w-full px-3 py-2 rounded-lg text-xs font-medium border flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              hasActiveFilters
                ? 'border-[#8F2724] text-[#8F2724] bg-white hover:bg-[#8F2724]/5'
                : 'border-[#E7DED0] text-[#746C61]/50 bg-[#F8F4EA]/50 cursor-not-allowed'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Xoá tất cả bộ lọc</span>
          </button>
        </div>
      </div>
    </div>
  );
};
