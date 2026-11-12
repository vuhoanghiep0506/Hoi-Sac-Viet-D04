/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Trang chi tiết hồ sơ lễ hội (Route: /le-hoi/:id)
 * Hiển thị đầy đủ 14 trường thông tin học thuật theo mục 7.4.
 * Các trường thiếu hiển thị: "Chưa có tư liệu kiểm chứng". Không tự suy đoán.
 */

import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Users,
  Scale,
  Check,
  BookOpen,
  CalendarDays,
  ExternalLink,
} from 'lucide-react';
import { useHeritage } from '../context/HeritageContext';
import { HeritagePatternPlaceholder } from '../components/common/HeritagePatternPlaceholder';
import { EmptyState } from '../components/common/EmptyState';
import { formatSolarDate } from '../utils/text';

export const FestivalDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    festivals,
    editions,
    sources,
    addToComparison,
    removeFestivalFromComparison,
    isFestivalSelected,
  } = useHeritage();

  const festival = festivals.find(f => f.id === id);

  // Xử lý khi ID không tồn tại
  if (!festival) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <EmptyState
          title="Không tìm thấy hồ sơ lễ hội"
          description={`Không tìm thấy bản ghi lễ hội có mã định danh "${id}" trong hệ thống dữ liệu số.`}
          actionText="Quay lại thư viện lễ hội"
          actionTo="/le-hoi"
        />
      </div>
    );
  }

  const isSelected = isFestivalSelected(festival.id);

  // Lấy các kỳ tổ chức của lễ hội này
  const festivalEditions = editions.filter(e => e.festivalId === festival.id);

  // Lấy danh sách nguồn tư liệu đã liên kết
  const linkedSources = sources.filter(s => festival.sourceIds?.includes(s.id));

  const handleComparisonToggle = () => {
    if (isSelected) {
      removeFestivalFromComparison(festival.id);
    } else {
      addToComparison(festival.id);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Thanh điều hướng quay lại & Nút so sánh */}
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/le-hoi"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#746C61] hover:text-[#8F2724] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Thư viện lễ hội</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleComparisonToggle}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer ${
              isSelected
                ? 'bg-[#8F2724] text-white ring-2 ring-[#8F2724]/20'
                : 'bg-white border border-[#E7DED0] text-[#183E3A] hover:border-[#8F2724] hover:text-[#8F2724]'
            }`}
          >
            {isSelected ? (
              <>
                <Check className="w-4 h-4" />
                <span>Đã chọn so sánh</span>
              </>
            ) : (
              <>
                <Scale className="w-4 h-4" />
                <span>Thêm vào so sánh</span>
              </>
            )}
          </button>

          {isSelected && (
            <button
              type="button"
              onClick={() => navigate('/so-sanh')}
              className="text-xs font-semibold text-[#8F2724] hover:underline"
            >
              Mở trang so sánh &rarr;
            </button>
          )}
        </div>
      </div>

      {/* KHỐI TIÊU ĐỀ & HÌNH ẢNH */}
      <div className="bg-white rounded-2xl border border-[#E7DED0] shadow-xs overflow-hidden">
        {/* Placeholder đồ hoạ mỹ thuật bảo tàng */}
        <div className="relative">
          <HeritagePatternPlaceholder
            title={festival.officialName}
            aspectRatio="landscape"
            variant="green"
            className="max-h-[340px]"
          />
        </div>

        {/* Thông tin đầu trang */}
        <div className="p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3 text-xs text-[#746C61] flex-wrap">
            <span className="font-semibold text-[#8F2724]">{festival.practiceGroup}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#C5A36B]" />
              <span>{festival.province}</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-[#746C61]" />
              <span>{festival.community || 'Cộng đồng cư dân địa phương'}</span>
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#183E3A]">
            {festival.officialName}
          </h1>

          {/* Tên gọi khác */}
          {festival.alternativeNames && festival.alternativeNames.length > 0 && (
            <p className="text-xs text-[#746C61]">
              <strong className="text-[#292623]">Tên gọi khác / Tên dân gian:</strong>{' '}
              {festival.alternativeNames.join(', ')}
            </p>
          )}

          {/* Tình trạng ghi danh di sản */}
          {festival.heritageStatus ? (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#8F2724]/10 text-[#8F2724] text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#8F2724]" />
              <span>{festival.heritageStatus}</span>
            </div>
          ) : (
            <p className="text-xs text-[#746C61] italic">
              Tình trạng ghi danh: Chưa có tư liệu kiểm chứng
            </p>
          )}
        </div>
      </div>

      {/* NỘI DUNG CHI TIẾT 14 TRƯỜNG DỮ LIỆU DI SẢN */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Cột chính (2/3): Bối cảnh, nguồn gốc, nghi thức, hoạt động */}
        <div className="md:col-span-2 space-y-8">
          {/* Bối cảnh văn hoá */}
          <section className="bg-white p-6 rounded-xl border border-[#E7DED0] space-y-3">
            <h2 className="font-serif text-lg font-bold text-[#183E3A] border-b border-[#E7DED0] pb-2">
              Bối cảnh văn hoá & Ý nghĩa tâm linh
            </h2>
            <p className="text-sm text-[#292623] leading-relaxed">
              {festival.culturalContext || 'Chưa có tư liệu kiểm chứng.'}
            </p>
          </section>

          {/* Nguồn gốc lịch sử */}
          <section className="bg-white p-6 rounded-xl border border-[#E7DED0] space-y-3">
            <h2 className="font-serif text-lg font-bold text-[#183E3A] border-b border-[#E7DED0] pb-2">
              Nguồn gốc lịch sử
            </h2>
            <p className="text-sm text-[#292623] leading-relaxed">
              {festival.origin || 'Chưa có tư liệu kiểm chứng.'}
            </p>
          </section>

          {/* Hệ thống nghi thức chính */}
          <section className="bg-white p-6 rounded-xl border border-[#E7DED0] space-y-3">
            <h2 className="font-serif text-lg font-bold text-[#183E3A] border-b border-[#E7DED0] pb-2">
              Hệ thống nghi thức & Lễ tế
            </h2>
            {festival.rituals && festival.rituals.length > 0 ? (
              <ul className="space-y-2.5 text-sm text-[#292623]">
                {festival.rituals.map((ritual, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#183E3A]/10 text-[#183E3A] text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{ritual}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-[#746C61] italic">Chưa có tư liệu kiểm chứng.</p>
            )}
          </section>

          {/* Hoạt động chính & Diễn xướng */}
          <section className="bg-white p-6 rounded-xl border border-[#E7DED0] space-y-3">
            <h2 className="font-serif text-lg font-bold text-[#183E3A] border-b border-[#E7DED0] pb-2">
              Hoạt động hội & Diễn xướng dân gian
            </h2>
            {festival.activities && festival.activities.length > 0 ? (
              <ul className="space-y-2 text-sm text-[#292623]">
                {festival.activities.map((act, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#8F2724] font-bold">▪</span>
                    <span className="leading-relaxed">{act}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-[#746C61] italic">Chưa có tư liệu kiểm chứng.</p>
            )}
          </section>

          {/* Đặc trưng địa phương */}
          <section className="bg-white p-6 rounded-xl border border-[#E7DED0] space-y-3">
            <h2 className="font-serif text-lg font-bold text-[#183E3A] border-b border-[#E7DED0] pb-2">
              Đặc trưng địa phương & Kỹ thuật đua thuyền
            </h2>
            {festival.characteristics && festival.characteristics.length > 0 ? (
              <ul className="space-y-2 text-sm text-[#292623]">
                {festival.characteristics.map((c, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#C5A36B] font-bold">◆</span>
                    <span className="leading-relaxed">{c}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-[#746C61] italic">Chưa có tư liệu kiểm chứng.</p>
            )}
          </section>
        </div>

        {/* Cột bên (1/3): Không gian, Thời gian các kỳ tổ chức & Nguồn tư liệu */}
        <div className="space-y-6">
          {/* Thông tin không gian & Địa điểm */}
          <div className="bg-white p-5 rounded-xl border border-[#E7DED0] space-y-3">
            <h3 className="font-serif text-sm font-bold text-[#183E3A] uppercase tracking-wider">
              Không gian tổ chức
            </h3>
            <div className="text-xs text-[#292623] space-y-1.5">
              <p>
                <strong className="text-[#746C61]">Tỉnh/Thành:</strong> {festival.province}
              </p>
              <p>
                <strong className="text-[#746C61]">Địa điểm:</strong>{' '}
                {festival.location || 'Chưa có tư liệu kiểm chứng'}
              </p>
              <p>
                <strong className="text-[#746C61]">Cộng đồng chủ thể:</strong>{' '}
                {festival.community || 'Chưa có tư liệu kiểm chứng'}
              </p>
            </div>
          </div>

          {/* Các kỳ tổ chức có dữ liệu (FestivalEdition) */}
          <div className="bg-white p-5 rounded-xl border border-[#E7DED0] space-y-3">
            <h3 className="font-serif text-sm font-bold text-[#183E3A] uppercase tracking-wider flex items-center gap-1.5">
              <CalendarDays className="w-4 h-4 text-[#8F2724]" />
              <span>Các kỳ tổ chức có dữ liệu</span>
            </h3>

            {festivalEditions.length > 0 ? (
              <div className="space-y-3">
                {festivalEditions.map(ed => (
                  <div key={ed.id} className="p-3 rounded-lg bg-[#F8F4EA] border border-[#E7DED0] text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-[#183E3A]">
                      <span>Năm {ed.year}</span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        Đã xác minh
                      </span>
                    </div>
                    {ed.lunarDate && (
                      <p className="text-[#746C61]">
                        <strong>Âm lịch:</strong> {ed.lunarDate}
                      </p>
                    )}
                    {ed.solarStartDate && (
                      <p className="text-[#746C61]">
                        <strong>Dương lịch:</strong> {formatSolarDate(ed.solarStartDate)}
                        {ed.solarEndDate ? ` - ${formatSolarDate(ed.solarEndDate)}` : ''}
                      </p>
                    )}
                    {ed.venue && (
                      <p className="text-[#746C61]">
                        <strong>Địa điểm:</strong> {ed.venue}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#746C61] italic">
                Chưa có lịch kỳ tổ chức nào được xác minh.
              </p>
            )}
          </div>

          {/* Nguồn tư liệu kiểm chứng */}
          <div className="bg-white p-5 rounded-xl border border-[#E7DED0] space-y-3">
            <h3 className="font-serif text-sm font-bold text-[#183E3A] uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-[#C5A36B]" />
              <span>Nguồn tư liệu kiểm chứng ({linkedSources.length})</span>
            </h3>

            {linkedSources.length > 0 ? (
              <ul className="space-y-3 text-xs">
                {linkedSources.map(s => (
                  <li key={s.id} className="p-2.5 rounded border border-[#E7DED0] bg-[#F8F4EA]/50 space-y-1">
                    <p className="font-semibold text-[#183E3A] leading-snug">{s.title}</p>
                    <p className="text-[11px] text-[#746C61]">
                      {s.authorOrOrganization} ({s.publicationDate || 'Không rõ năm'})
                    </p>
                    {s.url && (
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-[#8F2724] hover:underline"
                      >
                        <span>Xem liên kết</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-[#746C61] italic">
                Chưa có tư liệu kiểm chứng nào được liên kết.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
