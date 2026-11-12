/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Trang chủ HỘI SẮC VIỆT (Route: /)
 * Đáp ứng đầy đủ các mục 6.1 -> 6.7 trong tài liệu yêu cầu.
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  Compass,
  Scale,
  ShieldCheck,
  Users,
  Cpu,
  ChevronRight,
  Database,
  MapPin,
  FileCheck,
} from 'lucide-react';
import { useHeritage } from '../context/HeritageContext';
import { FestivalCard } from '../components/festivals/FestivalCard';
import { EmptyState } from '../components/common/EmptyState';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { verifiedFestivals, sources, setSearchTerm } = useHeritage();
  const [localSearch, setLocalSearch] = useState('');

  // 6.2. Xử lý tìm kiếm và điều hướng sang thư viện
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      setSearchTerm(localSearch.trim());
      navigate('/le-hoi');
    }
  };

  // 6.3. Tính toán số liệu thống kê tự động từ dữ liệu JSON (không tạo số liệu giả)
  const verifiedFestivalCount = verifiedFestivals.length;
  const uniqueProvincesCount = new Set(
    verifiedFestivals.map(f => f.province).filter(Boolean)
  ).size;
  const verifiedSourcesCount = sources.length;

  // 6.4. Lễ hội nổi bật (tối đa 6 bản ghi đã xác minh)
  const featuredFestivals = verifiedFestivals.slice(0, 6);

  return (
    <div className="space-y-20 pb-16">
      {/* 6.1. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Nội dung bên trái */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs md:text-sm font-semibold tracking-widest text-[#8F2724] uppercase">
                Khám phá di sản văn hoá Việt Nam
              </span>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#183E3A] leading-[1.15] text-balance">
                Một dòng sông, <br />
                <span className="text-[#8F2724] italic">Muôn sắc hội</span>
              </h1>

              <p className="text-base sm:text-lg text-[#746C61] leading-relaxed max-w-xl">
                Khám phá những lễ hội đua thuyền truyền thống qua từng vùng đất, tìm hiểu sự tương đồng và khác biệt trong đời sống văn hoá cộng đồng Việt Nam.
              </p>

              {/* Hai nút hành động chính */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/le-hoi"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold bg-[#8F2724] text-white hover:bg-[#751F1C] transition-all shadow-xs"
                >
                  <Compass className="w-4 h-4" />
                  <span>Khám phá lễ hội</span>
                </Link>

                <Link
                  to="/so-sanh"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold bg-white border border-[#E7DED0] text-[#183E3A] hover:border-[#183E3A] hover:bg-[#F8F4EA] transition-all shadow-xs"
                >
                  <Scale className="w-4 h-4" />
                  <span>So sánh ngay</span>
                </Link>
              </div>
            </div>

            {/* Bố cục nghệ thuật bên phải (sử dụng hình khối, sóng nước cách điệu bằng SVG/CSS, không dùng ảnh AI) */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/3] rounded-2xl bg-gradient-to-br from-[#183E3A] via-[#235550] to-[#183E3A] p-8 text-[#F8F4EA] shadow-xl overflow-hidden flex flex-col justify-between border border-[#C5A36B]/40">
                {/* Hoa văn SVG hình học trừu tượng */}
                <svg
                  className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 500 400"
                >
                  <circle cx="250" cy="200" r="160" fill="none" stroke="#C5A36B" strokeWidth="2" strokeDasharray="6,6" />
                  <circle cx="250" cy="200" r="110" fill="none" stroke="#F8F4EA" strokeWidth="1.5" />
                  <path
                    d="M 50 320 C 150 260, 350 360, 450 300"
                    fill="none"
                    stroke="#C5A36B"
                    strokeWidth="3"
                  />
                  <path
                    d="M 50 350 C 180 290, 320 390, 450 330"
                    fill="none"
                    stroke="#F8F4EA"
                    strokeWidth="1.5"
                    strokeDasharray="4,4"
                  />
                  {/* Đường nét cách điệu mạn thuyền rồng truyền thống */}
                  <path
                    d="M 80 280 Q 250 340 420 230 Q 300 310 100 270 Z"
                    fill="#C5A36B"
                    opacity="0.35"
                  />
                </svg>

                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-[11px] font-semibold tracking-widest uppercase text-[#C5A36B] border border-[#C5A36B]/50 px-2.5 py-1 rounded">
                    Bảo tàng số Di sản D04
                  </span>
                  <span className="text-xs text-white/70">IMTA TECH × FPT Poly</span>
                </div>

                <div className="relative z-10 my-auto text-center space-y-2 py-6">
                  <p className="font-serif text-2xl md:text-3xl font-medium text-white tracking-wide">
                    Thực hành Lễ hội Sông nước
                  </p>
                  <p className="text-xs text-[#C5A36B] font-light max-w-xs mx-auto">
                    Biểu trưng của sức mạnh đoàn kết, tín ngưỡng thờ Nước và truyền thống tiền nhân
                  </p>
                </div>

                <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-[#F8F4EA]/80">
                  <span>Kho dữ liệu nghiên cứu</span>
                  <span className="font-medium text-[#C5A36B]">Giai đoạn 1</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6.2. THANH TÌM KIẾM HERO */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <form
          onSubmit={handleSearchSubmit}
          className="bg-white p-3 sm:p-4 rounded-xl border border-[#E7DED0] shadow-md flex flex-col sm:flex-row items-center gap-3"
        >
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#746C61]" />
            <input
              type="text"
              value={localSearch}
              onChange={e => setLocalSearch(e.target.value)}
              placeholder="Bạn muốn khám phá lễ hội nào?"
              className="w-full pl-11 pr-4 py-3 rounded-lg bg-[#F8F4EA]/40 text-sm md:text-base border border-transparent focus:border-[#8F2724] focus:bg-white transition-colors"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 rounded-lg text-sm font-semibold bg-[#8F2724] text-white hover:bg-[#751F1C] transition-colors shrink-0 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Tìm kiếm</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </form>
      </section>

      {/* 6.3. THỐNG KÊ (Tính toán tự động từ JSON; hiển thị 0 khi chưa có; không tạo giả) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Số hồ sơ lễ hội đã xác minh */}
          <div className="p-6 rounded-xl bg-white border border-[#E7DED0] shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#8F2724]/10 text-[#8F2724] flex items-center justify-center shrink-0">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="font-serif text-3xl font-bold text-[#183E3A] tabular-nums">
                {verifiedFestivalCount}
              </div>
              <div className="text-xs font-medium text-[#746C61] mt-0.5">
                Hồ sơ lễ hội đã xác minh
              </div>
            </div>
          </div>

          {/* Card 2: Số địa phương có dữ liệu */}
          <div className="p-6 rounded-xl bg-white border border-[#E7DED0] shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#183E3A]/10 text-[#183E3A] flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <div className="font-serif text-3xl font-bold text-[#183E3A] tabular-nums">
                {uniqueProvincesCount}
              </div>
              <div className="text-xs font-medium text-[#746C61] mt-0.5">
                Địa phương có dữ liệu
              </div>
            </div>
          </div>

          {/* Card 3: Số nguồn tư liệu đã xác minh */}
          <div className="p-6 rounded-xl bg-white border border-[#E7DED0] shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#C5A36B]/20 text-[#8F2724] flex items-center justify-center shrink-0">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="font-serif text-3xl font-bold text-[#183E3A] tabular-nums">
                {verifiedSourcesCount}
              </div>
              <div className="text-xs font-medium text-[#746C61] mt-0.5">
                Nguồn tư liệu đã xác minh
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6.4. LỄ HỘI NỔI BẬT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 pb-4 border-b border-[#E7DED0]">
          <div>
            <span className="text-xs font-semibold tracking-wider text-[#C5A36B] uppercase">
              Hồ sơ bảo tồn
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#183E3A] mt-1">
              Lễ hội nổi bật đã xác minh
            </h2>
          </div>

          {featuredFestivals.length > 0 && (
            <Link
              to="/le-hoi"
              className="text-xs font-semibold text-[#8F2724] hover:text-[#751F1C] flex items-center gap-1"
            >
              <span>Xem tất cả</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {featuredFestivals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredFestivals.map((fest, idx) => (
              <FestivalCard
                key={fest.id}
                festival={fest}
                variantColor={idx % 3 === 0 ? 'green' : idx % 3 === 1 ? 'red' : 'gold'}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Dữ liệu di sản đang được thu thập và kiểm chứng"
            description="Hệ thống đang trong quy trình thu thập và thẩm định tư liệu khoa học. Khi các hồ sơ đáp ứng đủ tối thiểu 3 nguồn xác thực và qua quy trình đối chiếu thực tế, thông tin sẽ được công bố chính thức."
            actionText="Tới thư viện lễ hội"
            actionTo="/le-hoi"
          />
        )}
      </section>

      {/* 6.5. GIỚI THIỆU CHỨC NĂNG SO SÁNH */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-2xl bg-white border border-[#E7DED0] shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <span className="text-xs font-semibold tracking-widest text-[#8F2724] uppercase">
              Phương pháp nghiên cứu đối sánh
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#183E3A]">
              Cùng một loại hình, những sắc thái riêng
            </h2>
            <p className="text-sm sm:text-base text-[#746C61] leading-relaxed max-w-2xl">
              Cùng là hoạt động đua thuyền truyền thống bắt nguồn từ tín ngưỡng cư dân nông nghiệp và miền biển, nhưng các địa phương trên khắp Việt Nam có sự phân hoá sâu sắc về thời gian tổ chức, nghi thức tâm linh, kỹ thuật chế tác thuyền và vai trò của cộng đồng bản địa.
            </p>
            <div className="pt-2">
              <Link
                to="/so-sanh"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-[#8F2724] text-white hover:bg-[#751F1C] transition-colors shadow-xs"
              >
                <Scale className="w-4 h-4" />
                <span>Bắt đầu so sánh</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-4 p-6 rounded-xl bg-[#F8F4EA] border border-[#E7DED0] space-y-3 text-xs text-[#292623]">
            <h3 className="font-serif text-sm font-bold text-[#183E3A]">
              Các trục tiêu chí đối sánh chính:
            </h3>
            <ul className="space-y-2 text-[#746C61]">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8F2724]" />
                <span>Không gian thuỷ văn (Sông nội địa vs Biển đảo)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8F2724]" />
                <span>Hệ thống lễ tế, mở mắt thuyền, xuất quân</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8F2724]" />
                <span>Hình tượng linh vật (Tứ linh, Rồng, Rắn thần Naga)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8F2724]" />
                <span>Quy ước làng xã và tính gắn kết cộng đồng</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 6.6. GIÁ TRỊ DỰ ÁN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold tracking-wider text-[#C5A36B] uppercase">
            Tôn chỉ bảo tồn
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#183E3A] mt-1">
            Giá trị cốt lõi của Hội Sắc Việt
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Giá trị 1 */}
          <div className="p-6 rounded-xl bg-white border border-[#E7DED0] space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#8F2724]/10 text-[#8F2724] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#183E3A]">
              Tư liệu có nguồn xác thực
            </h3>
            <p className="text-xs text-[#746C61] leading-relaxed">
              Mọi dữ liệu di sản đều phải dựa trên các công trình nghiên cứu nhân học, hồ sơ khoa học của cơ quan quản lý văn hoá và quy ước làng xã có thể truy nguyên.
            </p>
          </div>

          {/* Giá trị 2 */}
          <div className="p-6 rounded-xl bg-white border border-[#E7DED0] space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#183E3A]/10 text-[#183E3A] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#183E3A]">
              Tôn trọng cộng đồng chủ thể
            </h3>
            <p className="text-xs text-[#746C61] leading-relaxed">
              Coi trọng tiếng nói, tri thức bản địa và thực hành thực tế của cộng đồng dân cư địa phương - những người trực tiếp gìn giữ và nuôi dưỡng di sản.
            </p>
          </div>

          {/* Giá trị 3 */}
          <div className="p-6 rounded-xl bg-white border border-[#E7DED0] space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#C5A36B]/20 text-[#8F2724] flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#183E3A]">
              Khám phá bằng công nghệ số
            </h3>
            <p className="text-xs text-[#746C61] leading-relaxed">
              Ứng dụng cấu trúc dữ liệu hiện đại, đối sánh trực quan và chuẩn bị nền tảng AI có kiểm soát để đưa di sản truyền thống đến gần hơn với thế hệ trẻ.
            </p>
          </div>
        </div>
      </section>

      {/* 6.7. CTA CUỐI TRANG */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-10 sm:p-14 rounded-2xl bg-[#183E3A] text-white text-center space-y-6 border border-[#C5A36B]/40">
          <p className="text-xs font-semibold tracking-widest text-[#C5A36B] uppercase">
            HỘI SẮC VIỆT · DỰ ÁN D04
          </p>

          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold max-w-2xl mx-auto leading-snug">
            Di sản được gìn giữ khi những câu chuyện được kể đúng.
          </h2>

          <p className="text-xs sm:text-sm text-[#F8F4EA]/80 max-w-xl mx-auto leading-relaxed">
            Cùng đồng hành trong hành trình số hoá, nghiên cứu và bảo tồn những giá trị văn hoá sông nước đậm đà bản sắc dân tộc Việt Nam.
          </p>

          <div className="pt-2">
            <Link
              to="/le-hoi"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold bg-[#8F2724] text-white hover:bg-[#751F1C] transition-colors shadow-md"
            >
              <span>Khám phá thư viện</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
