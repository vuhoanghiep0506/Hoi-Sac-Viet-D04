/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Thẻ hiển thị hồ sơ lễ hội đua thuyền (Festival Card)
 * Tuân thủ quy định: Zero-pill cho metadata, hiển thị nguồn xác minh, nút so sánh
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, BookOpen, Scale, Check, ChevronRight } from 'lucide-react';
import { Festival } from '../../types/heritage';
import { HeritagePatternPlaceholder } from '../common/HeritagePatternPlaceholder';
import { useHeritage } from '../../context/HeritageContext';

interface Props {
  festival: Festival;
  variantColor?: 'green' | 'red' | 'gold';
}

export const FestivalCard: React.FC<Props> = ({ festival, variantColor = 'green' }) => {
  const navigate = useNavigate();
  const {
    comparisonSlots,
    addToComparison,
    removeFestivalFromComparison,
    isFestivalSelected,
  } = useHeritage();

  const isSelected = isFestivalSelected(festival.id);
  const slotsFull = Boolean(comparisonSlots[0] && comparisonSlots[1]);

  const handleComparisonToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isSelected) {
      removeFestivalFromComparison(festival.id);
    } else {
      const added = addToComparison(festival.id);
      if (added && comparisonSlots[0] && comparisonSlots[0] !== festival.id) {
        // Nếu đã đủ 2 lễ hội, có thể gợi ý chuyển sang trang so sánh
      }
    }
  };

  const sourceCount = festival.sourceIds?.length || 0;

  return (
    <article className="group bg-white rounded-xl border border-[#E7DED0] hover:border-[#C5A36B] transition-all duration-300 shadow-xs hover:shadow-md flex flex-col overflow-hidden">
      {/* Khối hình ảnh tư liệu hoặc placeholder đồ hoạ truyền thống */}
      <div className="relative">
        <HeritagePatternPlaceholder
          title={festival.officialName}
          aspectRatio="landscape"
          variant={variantColor}
        />

        {/* Nút chọn so sánh nhanh đặt nổi bật trên góc */}
        <button
          type="button"
          onClick={handleComparisonToggle}
          title={
            isSelected
              ? 'Bỏ chọn khỏi bộ so sánh'
              : slotsFull
              ? 'Bộ so sánh đã đủ 2 lễ hội (nhấn để thay thế)'
              : 'Thêm vào bộ so sánh đối chiếu'
          }
          className={`absolute top-3 right-3 p-2 rounded-lg text-xs font-medium transition-all shadow-sm flex items-center gap-1.5 cursor-pointer ${
            isSelected
              ? 'bg-[#8F2724] text-white ring-2 ring-white'
              : 'bg-white/90 backdrop-blur-sm text-[#292623] hover:bg-white hover:text-[#8F2724]'
          }`}
          aria-pressed={isSelected}
        >
          {isSelected ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span className="text-[11px] font-semibold">Đang chọn</span>
            </>
          ) : (
            <>
              <Scale className="w-3.5 h-3.5" />
              <span className="text-[11px]">{slotsFull ? 'Đổi so sánh' : 'So sánh'}</span>
            </>
          )}
        </button>
      </div>

      {/* Nội dung thông tin học thuật */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata không đóng khung (Zero-Pill Discipline) */}
          <div className="flex items-center gap-2 text-xs text-[#746C61] mb-2 flex-wrap">
            <span className="font-medium text-[#183E3A]">{festival.practiceGroup}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#C5A36B]" />
              <span>{festival.province}</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-[#746C61]" />
              <span>{sourceCount} nguồn</span>
            </span>
          </div>

          {/* Tên lễ hội */}
          <h3 className="font-serif text-lg font-bold text-[#183E3A] group-hover:text-[#8F2724] transition-colors line-clamp-1 mb-2">
            {festival.officialName}
          </h3>

          {/* Bối cảnh văn hoá tóm tắt */}
          <p className="text-xs text-[#746C61] line-clamp-3 leading-relaxed mb-4">
            {festival.culturalContext || 'Chưa có bản ghi tóm tắt bối cảnh văn hoá.'}
          </p>

          {/* Tình trạng ghi danh nếu có */}
          {festival.heritageStatus && (
            <div className="text-[11px] text-[#8F2724] font-medium mb-4 flex items-center gap-1.5 border-t border-[#E7DED0]/60 pt-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8F2724]" />
              <span className="line-clamp-1">{festival.heritageStatus}</span>
            </div>
          )}
        </div>

        {/* Thanh hành động chân thẻ */}
        <div className="pt-3 border-t border-[#E7DED0] flex items-center justify-between gap-2 mt-auto">
          <Link
            to={`/le-hoi/${festival.id}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#8F2724] hover:text-[#751F1C] transition-colors py-1"
          >
            <span>Xem hồ sơ chi tiết</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>

          {isSelected && (
            <button
              type="button"
              onClick={() => navigate('/so-sanh')}
              className="text-[11px] font-medium text-[#183E3A] hover:underline cursor-pointer"
            >
              Mở trang so sánh &rarr;
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
