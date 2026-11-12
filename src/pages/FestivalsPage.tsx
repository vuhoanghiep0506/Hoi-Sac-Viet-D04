/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Trang Thư viện Lễ hội (Route: /le-hoi)
 * Tìm kiếm tiếng Việt không dấu, bộ lọc động và lưới card hồ sơ di sản
 */

import React, { useMemo } from 'react';
import { useHeritage } from '../context/HeritageContext';
import { FestivalFiltersBar } from '../components/festivals/FestivalFiltersBar';
import { FestivalCard } from '../components/festivals/FestivalCard';
import { EmptyState } from '../components/common/EmptyState';
import { searchMatches } from '../utils/text';

export const FestivalsPage: React.FC = () => {
  const { festivals, filters, resetFilters } = useHeritage();

  // Áp dụng bộ lọc và tìm kiếm tiếng Việt không dấu
  const filteredFestivals = useMemo(() => {
    return festivals.filter(fest => {
      // 7.1. Tìm theo: Tên lễ hội, Tên gọi khác, Địa phương, Cộng đồng thực hành
      if (filters.searchTerm) {
        const matchesName = searchMatches(fest.officialName, filters.searchTerm);
        const matchesProvince = searchMatches(fest.province, filters.searchTerm);
        const matchesCommunity = searchMatches(fest.community, filters.searchTerm);
        const matchesLocation = searchMatches(fest.location, filters.searchTerm);
        const matchesAlt = fest.alternativeNames?.some(alt =>
          searchMatches(alt, filters.searchTerm)
        );

        if (!matchesName && !matchesProvince && !matchesCommunity && !matchesLocation && !matchesAlt) {
          return false;
        }
      }

      // 7.2. Lọc theo tỉnh/thành phố
      if (filters.province && fest.province !== filters.province) {
        return false;
      }

      // Lọc theo nhóm thực hành
      if (filters.practiceGroup && fest.practiceGroup !== filters.practiceGroup) {
        return false;
      }

      // Lọc theo trạng thái kiểm chứng
      if (filters.verificationStatus && fest.verificationStatus !== filters.verificationStatus) {
        return false;
      }

      return true;
    });
  }, [festivals, filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Tiêu đề & Giới thiệu thư viện */}
      <div className="border-b border-[#E7DED0] pb-6">
        <span className="text-xs font-semibold tracking-wider text-[#C5A36B] uppercase">
          Kho tư liệu di sản số
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#183E3A] mt-1">
          Thư viện Lễ hội Đua thuyền Truyền thống
        </h1>
        <p className="text-sm text-[#746C61] mt-2 max-w-2xl leading-relaxed">
          Tra cứu các hồ sơ thực hành lễ hội sông nước và biển đảo tại các địa phương Việt Nam. Mọi thông tin đều gắn với nguồn tư liệu đã qua kiểm chứng.
        </p>
      </div>

      {/* Thanh tìm kiếm & Bộ lọc động */}
      <FestivalFiltersBar />

      {/* Thông tin số lượng kết quả */}
      <div className="flex items-center justify-between text-xs text-[#746C61] px-1">
        <span>
          Hiển thị <strong className="text-[#183E3A] font-bold">{filteredFestivals.length}</strong> hồ sơ di sản
        </span>
      </div>

      {/* Lưới hiển thị các thẻ lễ hội */}
      {filteredFestivals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFestivals.map((fest, idx) => (
            <FestivalCard
              key={fest.id}
              festival={fest}
              variantColor={idx % 3 === 0 ? 'green' : idx % 3 === 1 ? 'red' : 'gold'}
            />
          ))}
        </div>
      ) : festivals.length === 0 ? (
        <EmptyState
          title="Dữ liệu di sản đang được thu thập và kiểm chứng"
          description="Kho lưu trữ chính thức đang trong quá trình thu thập và thẩm định tư liệu khoa học. Khi các hồ sơ đáp ứng đủ điều kiện kiểm chứng, thông tin sẽ được công bố chính thức."
        />
      ) : (
        <EmptyState
          title="Không tìm thấy hồ sơ lễ hội phù hợp"
          description="Không có kết quả nào trùng khớp với từ khoá hoặc tổ hợp bộ lọc bạn đã chọn. Vui lòng thử lại với từ khoá khác."
          actionText="Xoá tất cả bộ lọc"
          onActionClick={resetFilters}
        />
      )}
    </div>
  );
};
