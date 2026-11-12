
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * HỘI SẮC VIỆT - D04
 * Trang Nguồn tư liệu & Giới thiệu
 * Route: /gioi-thieu
 */

import React, { useMemo, useState } from 'react';

import {
  BookOpen,
  Info,
  Search,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock3,
} from 'lucide-react';

import { useHeritage } from '../context/HeritageContext';
import { EmptyState } from '../components/common/EmptyState';
import { searchMatches } from '../utils/text';
import type { SourceType } from '../types/heritage';

type TabType = 'sources' | 'about';

const TYPE_LABELS: Record<SourceType, string> = {
  official: 'Nguồn nhóm chính thống',
  research: 'Nghiên cứu khoa học',
  community: 'Tư liệu cộng đồng',
  reference: 'Tài liệu tham khảo',
};

export const AboutSourcesPage: React.FC = () => {
  const { sources, festivals } = useHeritage();

  const [activeTab, setActiveTab] =
    useState<TabType>('about');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');

  // Lọc nguồn theo từ khóa và loại nguồn.
  const filteredSources = useMemo(() => {
    return sources.filter(source => {
      if (searchTerm.trim()) {
        const matchesTitle = searchMatches(
          source.title || '',
          searchTerm
        );

        const matchesAuthor = searchMatches(
          source.authorOrOrganization || '',
          searchTerm
        );

        const matchesDescription = searchMatches(
          source.description || '',
          searchTerm
        );

        if (
          !matchesTitle &&
          !matchesAuthor &&
          !matchesDescription
        ) {
          return false;
        }
      }

      if (
        selectedType &&
        source.type !== selectedType
      ) {
        return false;
      }

      return true;
    });
  }, [sources, searchTerm, selectedType]);

  // Thống kê dựa trên dữ liệu thực tế.
  const sourceStats = useMemo(() => {
    return {
      total: sources.length,

      officialCount: sources.filter(
        source => source.type === 'official'
      ).length,

      researchCount: sources.filter(
        source => source.type === 'research'
      ).length,

      communityCount: sources.filter(
        source => source.type === 'community'
      ).length,

      verifiedCount: sources.filter(
        source => source.status === 'verified'
      ).length,

      pendingCount: sources.filter(
        source => source.status === 'pending'
      ).length,
    };
  }, [sources]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedType('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

      {/* TIÊU ĐỀ TRANG */}
      <div className="border-b border-[#E7DED0] pb-6">
        <span className="text-xs font-semibold tracking-wider text-[#C5A36B] uppercase">
          Minh bạch học thuật & Tôn chỉ đề tài
        </span>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#183E3A] mt-1">
          Nguồn tư liệu & Giới thiệu
        </h1>

        <p className="text-sm text-[#746C61] mt-2 max-w-2xl leading-relaxed">
          Tra cứu danh mục các nguồn tư liệu được sử dụng
          để thẩm định hồ sơ lễ hội và tìm hiểu thông tin
          học thuật về đề tài nghiên cứu D04.
        </p>
      </div>

      {/* HAI TAB CHÍNH */}
      <div
        className="flex items-center gap-2 border-b border-[#E7DED0]"
        role="tablist"
        aria-label="Nội dung trang giới thiệu"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'about'}
          onClick={() => setActiveTab('about')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'about'
              ? 'border-[#8F2724] text-[#8F2724]'
              : 'border-transparent text-[#746C61] hover:text-[#183E3A]'
          }`}
        >
          <Info className="w-4 h-4" />
          <span>Giới thiệu dự án</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'sources'}
          onClick={() => setActiveTab('sources')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'sources'
              ? 'border-[#8F2724] text-[#8F2724]'
              : 'border-transparent text-[#746C61] hover:text-[#183E3A]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Nguồn tư liệu ({sources.length})</span>
        </button>
      </div>

      {/* TAB NGUỒN TƯ LIỆU */}
      {activeTab === 'sources' && (
        <div className="space-y-6">

          {/* THỐNG KÊ NGUỒN */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

            <div className="bg-white p-4 rounded-xl border border-[#E7DED0]">
              <span className="block text-xs text-[#746C61]">
                Tổng số nguồn:
              </span>

              <span className="font-serif text-2xl font-bold text-[#183E3A] tabular-nums">
                {sourceStats.total}
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#E7DED0]">
              <span className="block text-xs text-[#746C61]">
                Nguồn nhóm chính thống:
              </span>

              <span className="font-serif text-2xl font-bold text-[#8F2724] tabular-nums">
                {sourceStats.officialCount}
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#E7DED0]">
              <span className="block text-xs text-[#746C61]">
                Nghiên cứu học thuật:
              </span>

              <span className="font-serif text-2xl font-bold text-[#183E3A] tabular-nums">
                {sourceStats.researchCount}
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#E7DED0]">
              <span className="block text-xs text-[#746C61]">
                Tư liệu cộng đồng:
              </span>

              <span className="font-serif text-2xl font-bold text-[#C5A36B] tabular-nums">
                {sourceStats.communityCount}
              </span>
            </div>
          </div>

          {/* THỐNG KÊ TRẠNG THÁI */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1.5 text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
              {sourceStats.verifiedCount} nguồn được ghi nhận
              đã xác minh
            </span>

            <span className="inline-flex items-center gap-1.5 text-amber-700">
              <Clock3 className="w-4 h-4" />
              {sourceStats.pendingCount} nguồn đang thẩm định
            </span>
          </div>

          {/* THÔNG BÁO MINH BẠCH */}
          <div className="flex items-start gap-3 rounded-xl border border-[#E7DED0] bg-[#F8F4EA] p-4">
            <Info className="w-5 h-5 shrink-0 mt-0.5 text-[#8F2724]" />

            <p className="text-xs sm:text-sm leading-relaxed text-[#746C61]">
              Trạng thái xác minh được hiển thị theo dữ
              liệu quản lý của dự án. Nguồn được ghi nhận
              đã xác minh không đồng nghĩa với việc mọi
              nhận định trong hồ sơ lễ hội đã được kiểm
              chứng độc lập. Các nguồn đang thẩm định
              chỉ được sử dụng làm tư liệu tham khảo
              sơ bộ.
            </p>
          </div>

          {/* TÌM KIẾM VÀ LỌC */}
          <div className="bg-white p-4 rounded-xl border border-[#E7DED0] flex flex-col sm:flex-row gap-3 items-center">

            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#746C61]" />

              <input
                type="text"
                value={searchTerm}
                onChange={event =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Tìm nguồn theo tên tài liệu, tác giả, cơ quan..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#E7DED0] text-xs sm:text-sm focus:border-[#8F2724]"
              />
            </div>

            <div className="w-full sm:w-auto">
              <label
                htmlFor="source-type-select"
                className="sr-only"
              >
                Loại nguồn
              </label>

              <select
                id="source-type-select"
                value={selectedType}
                onChange={event =>
                  setSelectedType(event.target.value)
                }
                className="w-full sm:w-auto px-3 py-2 rounded-lg border border-[#E7DED0] text-xs text-[#292623] bg-white"
              >
                <option value="">
                  Tất cả loại nguồn
                </option>

                <option value="official">
                  Nguồn cơ quan nhà nước / báo chí chính thống
                </option>

                <option value="research">
                  Nghiên cứu khoa học (Viện / Tạp chí)
                </option>

                <option value="community">
                  Quy ước & Tri thức cộng đồng chủ thể
                </option>

                <option value="reference">
                  Tài liệu tham khảo chuyên ngành
                </option>
              </select>
            </div>
          </div>

          {/* DANH SÁCH NGUỒN */}
          {filteredSources.length > 0 ? (
            <div className="space-y-4">
              {filteredSources.map(source => {
                const linkedFestivals = festivals.filter(
                  festival =>
                    festival.sourceIds?.includes(source.id)
                );

                const isVerified =
                  source.status === 'verified';

                const isPending =
                  source.status === 'pending';

                return (
                  <div
                    key={source.id}
                    className="p-5 rounded-xl bg-white border border-[#E7DED0] hover:border-[#C5A36B] transition-all space-y-3 text-xs text-[#292623]"
                  >

                    {/* LOẠI NGUỒN VÀ NGÀY TRA CỨU */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="font-semibold text-[#8F2724] uppercase tracking-wider text-[11px]">
                        {TYPE_LABELS[source.type] ||
                          source.type}
                      </span>

                      <span className="text-[#746C61] text-[11px]">
                        {source.accessedAt
                          ? `Ngày tra cứu: ${source.accessedAt}`
                          : 'Chưa ghi nhận ngày tra cứu'}
                      </span>
                    </div>

                    {/* TÊN TÀI LIỆU */}
                    <h3 className="font-serif text-base font-bold text-[#183E3A] leading-snug">
                      {source.title}
                    </h3>

                    {/* TRẠNG THÁI KIỂM CHỨNG */}
                    <div className="flex flex-wrap items-center gap-2">
                      {isVerified ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Đã ghi nhận xác minh
                        </span>
                      ) : isPending ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                          <Clock3 className="w-3.5 h-3.5" />
                          Đang thẩm định
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold bg-gray-50 text-gray-700 border border-gray-200">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Chưa xác định trạng thái
                        </span>
                      )}
                    </div>

                    {/* TÁC GIẢ / CƠ QUAN */}
                    <p className="text-[#746C61]">
                      <strong>
                        Cơ quan ban hành / Tác giả:
                      </strong>{' '}
                      {source.authorOrOrganization}

                      {source.publicationDate
                        ? ` · Ngày xuất bản: ${source.publicationDate}`
                        : ''}
                    </p>

                    {/* MÔ TẢ */}
                    {source.description && (
                      <p className="text-[#292623] bg-[#F8F4EA]/40 p-2.5 rounded border border-[#E7DED0]/60 leading-relaxed">
                        {source.description}
                      </p>
                    )}

                    {/* QUYỀN SỬ DỤNG */}
                    {source.usageRights && (
                      <p className="text-[#746C61] text-[11px] italic">
                        <strong>Quyền sử dụng:</strong>{' '}
                        {source.usageRights}
                      </p>
                    )}

                    {/* HỒ SƠ LIÊN QUAN */}
                    {linkedFestivals.length > 0 && (
                      <div className="pt-2 border-t border-[#E7DED0] flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-[#746C61]">
                          Hồ sơ liên quan:
                        </span>

                        {linkedFestivals.map(festival => (
                          <span
                            key={festival.id}
                            className="bg-[#183E3A]/5 text-[#183E3A] px-2 py-0.5 rounded text-[11px] font-medium"
                          >
                            {festival.officialName}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* LIÊN KẾT NGUỒN */}
                    {source.url && (
                      <div className="pt-1">
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[#8F2724] hover:underline font-semibold"
                        >
                          <span>
                            Truy cập nguồn trực tuyến
                          </span>

                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : sources.length === 0 ? (
            <EmptyState
              title="Dữ liệu di sản đang được thu thập và kiểm chứng"
              description="Danh mục nguồn tư liệu đang trong quá trình thu thập, đối soát và thẩm định."
            />
          ) : (
            <EmptyState
              title="Không tìm thấy nguồn tư liệu"
              description="Không có tài liệu nào phù hợp với bộ lọc hiện tại."
              actionText="Xoá tìm kiếm"
              onActionClick={clearFilters}
            />
          )}
        </div>
      )}

      {/* TAB GIỚI THIỆU DỰ ÁN */}
      {activeTab === 'about' && (
        <div className="space-y-10">

          {/* THÔNG TIN ĐỀ TÀI */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E7DED0] shadow-xs space-y-6">

            <div className="border-b border-[#E7DED0] pb-4 flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="text-xs font-semibold tracking-widest text-[#8F2724] uppercase">
                  Thông tin đề tài nghiên cứu
                </span>

                <h2 className="font-serif text-2xl font-bold text-[#183E3A] mt-1">
                  Đề tài D04: So sánh thực hành lễ hội
                  đua thuyền truyền thống tại các địa
                  phương Việt Nam
                </h2>
              </div>

              <span className="px-3 py-1 rounded-md bg-[#183E3A] text-white text-xs font-semibold">
                Mã D04
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">

              <div className="space-y-3">
                <p>
                  <strong className="text-[#183E3A]">
                    Tên ứng dụng:
                  </strong>{' '}
                  <span className="font-semibold text-[#8F2724]">
                    HỘI SẮC VIỆT
                  </span>
                </p>

                <p>
                  <strong className="text-[#183E3A]">
                    Khẩu hiệu:
                  </strong>{' '}
                  "Một dòng sông – Muôn sắc hội"
                </p>

                <p>
                  <strong className="text-[#183E3A]">
                    Người thực hiện:
                  </strong>{' '}
                  Vũ Hoàng Hiệp
                </p>

                <p>
                  <strong className="text-[#183E3A]">
                    Mã sinh viên:
                  </strong>{' '}
                  PH64339
                </p>

                <p>
                  <strong className="text-[#183E3A]">
                    Nhóm:
                  </strong>{' '}
                  2
                </p>
              </div>

              <div className="space-y-3">
                <p>
                  <strong className="text-[#183E3A]">
                    Chương trình:
                  </strong>{' '}
                  Thực tập sinh Đợt 15 – IMTA TECH ×
                  FPT Polytechnic
                </p>

                <p>
                  <strong className="text-[#183E3A]">
                    Hình thức:
                  </strong>{' '}
                  Dự án xã hội phi lợi nhuận
                </p>

                <p>
                  <strong className="text-[#183E3A]">
                    Ngôn ngữ chính:
                  </strong>{' '}
                  Tiếng Việt
                </p>

                <p>
                  <strong className="text-[#183E3A]">
                    Đối tượng:
                  </strong>{' '}
                  Học sinh, sinh viên, giáo viên,
                  nhà nghiên cứu, người yêu văn hoá
                  Việt Nam
                </p>
              </div>
            </div>

            {/* MỤC TIÊU */}
            <div className="pt-4 border-t border-[#E7DED0]">
              <strong className="block text-xs font-bold text-[#183E3A] uppercase tracking-wider mb-2">
                Mục tiêu của ứng dụng:
              </strong>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#746C61]">

                {[
                  'Tư liệu hoá các lễ hội đua thuyền truyền thống',
                  'Tra cứu thông tin có nguồn gốc xác thực',
                  'So sánh cấu trúc thực hành giữa các vùng miền',
                  'Hỗ trợ bảo tồn, giáo dục và lan toả di sản',
                  'Tôn trọng tuyệt đối cộng đồng chủ thể di sản',
                ].map(goal => (
                  <div
                    key={goal}
                    className="flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8F2724] shrink-0" />
                    <span>{goal}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* GIỚI HẠN DỰ ÁN */}
          <div className="p-6 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-3">

            <div className="flex items-center gap-2 text-amber-900 font-serif text-lg font-bold">
              <AlertTriangle className="w-5 h-5 text-amber-700" />
              <h3>Giới hạn của dự án</h3>
            </div>

            <p className="text-xs sm:text-sm text-amber-950/80 leading-relaxed">
              Dữ liệu của dự án HỘI SẮC VIỆT hiện đang
              trong quá trình bổ sung, thẩm định và
              chuẩn hoá theo từng giai đoạn nghiên cứu.
              Mọi thông tin chưa qua kiểm chứng tối
              thiểu 3 nguồn khoa học độc lập hoặc chưa
              được xác nhận bởi cộng đồng chủ thể sẽ{' '}
              <strong>
                tuyệt đối không được công bố như sự thật
                lịch sử
              </strong>
              . Nhóm nghiên cứu cam kết không tự suy
              diễn ý nghĩa văn hoá hay tạo lập dữ liệu
              nhân tạo.
            </p>
          </div>

          {/* CAM KẾT SỬ DỤNG TƯ LIỆU */}
          <div className="p-6 rounded-2xl bg-white border border-[#E7DED0] space-y-4">

            <div className="flex items-center gap-2 text-[#183E3A] font-serif text-lg font-bold">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              <h3>
                Cam kết sử dụng tư liệu & Quyền sở hữu
                di sản
              </h3>
            </div>

            <ul className="space-y-3 text-xs sm:text-sm text-[#746C61] leading-relaxed">

              <li className="flex items-start gap-2">
                <span className="font-bold text-[#8F2724]">
                  1.
                </span>

                <span>
                  <strong>
                    Tôn trọng cộng đồng chủ thể:
                  </strong>{' '}
                  Di sản văn hoá phi vật thể thuộc về
                  cộng đồng cư dân nơi lễ hội ra đời
                  và được thực hành. Dự án đóng vai
                  trò cầu nối số hoá phi thương mại,
                  tôn trọng phong tục, tập quán và
                  đức tin truyền thống.
                </span>
              </li>

              <li className="flex items-start gap-2">
                <span className="font-bold text-[#8F2724]">
                  2.
                </span>

                <span>
                  <strong>
                    Ghi nguồn và tác quyền:
                  </strong>{' '}
                  Mọi trích dẫn tư liệu, công trình
                  nghiên cứu, bài báo khoa học và
                  hình ảnh tư liệu đều được định danh
                  cơ quan ban hành, tác giả, năm xuất
                  bản và ngày tra cứu rõ ràng.
                </span>
              </li>

              <li className="flex items-start gap-2">
                <span className="font-bold text-[#8F2724]">
                  3.
                </span>

                <span>
                  <strong>
                    Chính sách tiếp nhận và gỡ bỏ
                    (Takedown Policy):
                  </strong>{' '}
                  Nếu có bất kỳ sai sót tư liệu hoặc
                  yêu cầu hợp lệ từ cộng đồng chủ thể,
                  cơ quan quản lý văn hoá hoặc tác giả,
                  ban biên tập cam kết xác minh và
                  gỡ bỏ hoặc chỉnh lý tư liệu trong
                  thời gian sớm nhất.
                </span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
