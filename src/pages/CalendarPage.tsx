
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * HỘI SẮC VIỆT - D04
 * Trang Lịch Lễ hội (Route: /lich-le-hoi)
 *
 * Phân biệt lịch đã xác minh và lịch nghiên cứu sơ bộ.
 * Không tự suy đoán hoặc quy đổi ngày Âm lịch.
 */

import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  MapPin,
  CalendarDays,
  ExternalLink,
  Info,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

import { useHeritage } from '../context/HeritageContext';
import { EmptyState } from '../components/common/EmptyState';
import { formatSolarDate } from '../utils/text';

export const CalendarPage: React.FC = () => {
  const { editions, festivals } = useHeritage();

  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedMonth, setSelectedMonth] = useState<number>(2);
  const [selectedProvince, setSelectedProvince] = useState<string>('');

  const provinces = useMemo(() => {
    return Array.from(
      new Set(
        festivals
          .map(festival => festival.province)
          .filter(Boolean)
      )
    ).sort();
  }, [festivals]);

  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear(prev => prev - 1);
    } else {
      setSelectedMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear(prev => prev + 1);
    } else {
      setSelectedMonth(prev => prev + 1);
    }
  };

  // Chỉ hiển thị kỳ có ngày Dương lịch đủ để
  // xác định tháng, không tự phân bổ kỳ thiếu ngày.
  const monthlyEditions = useMemo(() => {
    return editions.filter(edition => {
      if (edition.year !== selectedYear) {
        return false;
      }

      if (!edition.solarStartDate) {
        return false;
      }

      const dateParts =
        /^(\d{4})-(\d{2})-(\d{2})$/.exec(
          edition.solarStartDate
        );

      if (!dateParts) {
        return false;
      }

      const year = Number(dateParts[1]);
      const month = Number(dateParts[2]);
      const day = Number(dateParts[3]);

      const date = new Date(Date.UTC(year, month - 1, day));

      if (
        date.getUTCFullYear() !== year ||
        date.getUTCMonth() + 1 !== month ||
        date.getUTCDate() !== day
      ) {
        return false;
      }

      if (
        year !== selectedYear ||
        month !== selectedMonth
      ) {
        return false;
      }

      const festival = festivals.find(
        item => item.id === edition.festivalId
      );

      if (!festival) {
        return false;
      }

      if (
        selectedProvince &&
        festival.province !== selectedProvince
      ) {
        return false;
      }

      return true;
    });
  }, [
    editions,
    festivals,
    selectedYear,
    selectedMonth,
    selectedProvince,
  ]);

  const verifiedCount = monthlyEditions.filter(
    edition => edition.verificationStatus === 'verified'
  ).length;

  const pendingCount =
    monthlyEditions.length - verifiedCount;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* TIÊU ĐỀ */}
      <div className="border-b border-[#E7DED0] pb-6">
        <span className="text-xs font-semibold tracking-wider text-[#C5A36B] uppercase">
          Thời gian & Không gian di sản
        </span>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#183E3A] mt-1">
          Lịch Lễ hội Đua thuyền Truyền thống
        </h1>

        <p className="text-sm text-[#746C61] mt-2 max-w-2xl leading-relaxed">
          Tra cứu niên lịch các kỳ hội sông nước theo
          tháng và địa phương. Thông tin phân định rõ
          giữa mốc thời gian Âm lịch truyền thống và
          Dương lịch được ghi nhận.
        </p>
      </div>

      {/* BỘ ĐIỀU HƯỚNG */}
      <div className="bg-white p-5 rounded-xl border border-[#E7DED0] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-2 rounded-lg border border-[#E7DED0] hover:bg-[#F8F4EA] transition-colors cursor-pointer"
            aria-label="Tháng trước"
          >
            <ChevronLeft className="w-5 h-5 text-[#183E3A]" />
          </button>

          <div className="text-center min-w-[140px]">
            <span className="block font-serif text-lg font-bold text-[#183E3A]">
              Tháng {selectedMonth}
            </span>

            <span className="text-xs text-[#746C61] font-medium">
              Năm {selectedYear}
            </span>
          </div>

          <button
            type="button"
            onClick={handleNextMonth}
            className="p-2 rounded-lg border border-[#E7DED0] hover:bg-[#F8F4EA] transition-colors cursor-pointer"
            aria-label="Tháng sau"
          >
            <ChevronRight className="w-5 h-5 text-[#183E3A]" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div>
            <label htmlFor="select-year" className="sr-only">
              Năm
            </label>

            <select
              id="select-year"
              value={selectedYear}
              onChange={event =>
                setSelectedYear(Number(event.target.value))
              }
              className="px-3 py-2 rounded-lg border border-[#E7DED0] bg-white text-xs font-medium text-[#292623] focus:border-[#8F2724]"
            >
              <option value={2025}>Năm 2025</option>
              <option value={2026}>Năm 2026</option>
              <option value={2027}>Năm 2027</option>
            </select>
          </div>

          <div>
            <label htmlFor="select-month" className="sr-only">
              Tháng
            </label>

            <select
              id="select-month"
              value={selectedMonth}
              onChange={event =>
                setSelectedMonth(Number(event.target.value))
              }
              className="px-3 py-2 rounded-lg border border-[#E7DED0] bg-white text-xs font-medium text-[#292623] focus:border-[#8F2724]"
            >
              {Array.from(
                { length: 12 },
                (_, index) => index + 1
              ).map(month => (
                <option key={month} value={month}>
                  Tháng {month}
                </option>
              ))}
            </select>
          </div>

          {provinces.length > 0 && (
            <div>
              <label
                htmlFor="select-province"
                className="sr-only"
              >
                Tỉnh / Thành
              </label>

              <select
                id="select-province"
                value={selectedProvince}
                onChange={event =>
                  setSelectedProvince(event.target.value)
                }
                className="px-3 py-2 rounded-lg border border-[#E7DED0] bg-white text-xs font-medium text-[#292623] focus:border-[#8F2724]"
              >
                <option value="">
                  Tất cả địa phương
                </option>

                {provinces.map(province => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* NGUYÊN TẮC NGÀY THÁNG */}
      <div className="flex items-start gap-2 text-xs text-[#746C61] bg-[#F8F4EA] p-3 rounded-lg border border-[#E7DED0]">
        <Info className="w-4 h-4 text-[#8F2724] shrink-0 mt-0.5" />

        <span>
          Ngày Âm lịch và Dương lịch được trình bày
          riêng biệt. Ngày Dương lịch của hồ sơ đang
          thẩm định chỉ là mốc được ghi nhận trong dữ
          liệu nghiên cứu, không phải lịch tổ chức đã
          xác nhận. Hệ thống không tự quy đổi hoặc
          suy đoán ngày.
        </span>
      </div>

      {/* THỐNG KÊ KỲ HỘI */}
      {monthlyEditions.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="font-semibold text-[#183E3A]">
            {monthlyEditions.length} kỳ hội được ghi nhận
          </span>

          <span className="inline-flex items-center gap-1 text-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {verifiedCount} đã ghi nhận xác minh
          </span>

          <span className="inline-flex items-center gap-1 text-amber-700">
            <AlertCircle className="w-3.5 h-3.5" />
            {pendingCount} chưa xác minh
          </span>
        </div>
      )}

      {/* DANH SÁCH KỲ HỘI */}
      {monthlyEditions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {monthlyEditions.map(edition => {
            const festival = festivals.find(
              item => item.id === edition.festivalId
            );

            const isVerified =
              edition.verificationStatus === 'verified';

            return (
              <div
                key={edition.id}
                className="bg-white p-6 rounded-xl border border-[#E7DED0] hover:border-[#C5A36B] transition-all shadow-xs flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#746C61] mb-3">
                    <span className="font-semibold text-[#8F2724]">
                      Kỳ hội năm {edition.year}
                    </span>

                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#C5A36B]" />
                      {festival?.province || 'Chưa rõ tỉnh'}
                    </span>
                  </div>

                  {/* TRẠNG THÁI THẨM ĐỊNH */}
                  <div className="mb-3">
                    {isVerified ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Đã ghi nhận xác minh
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Đang thẩm định
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif text-lg font-bold text-[#183E3A] mb-3">
                    {festival
                      ? festival.officialName
                      : 'Lễ hội đua thuyền'}
                  </h3>

                  <div className="space-y-2 text-xs text-[#292623] bg-[#F8F4EA]/50 p-3.5 rounded-lg border border-[#E7DED0]">
                    <div className="flex items-start gap-2">
                      <CalendarDays className="w-4 h-4 text-[#8F2724] shrink-0 mt-0.5" />

                      <div>
                        <strong className="text-[#183E3A]">
                          Thời gian Âm lịch:
                        </strong>{' '}
                        <span>
                          {edition.lunarDate ||
                            'Chưa có tư liệu kiểm chứng'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <CalendarIcon className="w-4 h-4 text-[#183E3A] shrink-0 mt-0.5" />

                      <div>
                        <strong className="text-[#183E3A]">
                          Thời gian Dương lịch:
                        </strong>{' '}

                        <span>
                          {edition.solarStartDate
                            ? `${formatSolarDate(
                                edition.solarStartDate
                              )}${
                                edition.solarEndDate &&
                                edition.solarEndDate !==
                                  edition.solarStartDate
                                  ? ` đến ${formatSolarDate(
                                      edition.solarEndDate
                                    )}`
                                  : ''
                              }`
                            : 'Chưa có ngày Dương lịch'}
                        </span>
                      </div>
                    </div>

                    {edition.venue && (
                      <div className="text-[#746C61] pt-1 border-t border-[#E7DED0]/50">
                        <strong>Địa điểm:</strong>{' '}
                        {edition.venue}
                      </div>
                    )}
                  </div>

                  {!isVerified && (
                    <div className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />

                      <span>
                        Mốc thời gian đang được thẩm
                        định. Vui lòng đối chiếu thông
                        báo của đơn vị tổ chức trước
                        khi sử dụng làm lịch chính thức.
                      </span>
                    </div>
                  )}
                </div>

                {festival && (
                  <div className="pt-2 border-t border-[#E7DED0] flex items-center justify-end">
                    <Link
                      to={`/le-hoi/${festival.id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#8F2724] hover:underline"
                    >
                      <span>Xem hồ sơ chi tiết</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="Dữ liệu di sản đang được thu thập và kiểm chứng"
          description={`Chưa có kỳ hội nào có ngày Dương lịch được ghi nhận trong tháng ${selectedMonth}/${selectedYear}${
            selectedProvince
              ? ` tại ${selectedProvince}`
              : ''
          }. Các kỳ hội thiếu ngày cụ thể chưa được phân bổ vào tháng.`}
          actionText="Xem danh mục lễ hội"
          actionTo="/le-hoi"
        />
      )}
    </div>
  );
};
