/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Footer bảo tàng số HỘI SẮC VIỆT
 * Chứa đầy đủ thông tin đề tài D04, sinh viên thực hiện và chương trình IMTA TECH × FPT Polytechnic
 * Tuyệt đối không có thông tin liên hệ giả hay telemetry giả.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Landmark, ShieldCheck, HeartHandshake } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#183E3A] text-[#F8F4EA] border-t border-[#C5A36B]/30 pt-16 pb-12 mt-20 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Cột 1: Thông tin thương hiệu bảo tàng */}
          <div className="space-y-4 lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded bg-[#8F2724] text-[#F8F4EA] flex items-center justify-center font-serif text-lg font-bold">
                H
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-white">
                HỘI SẮC VIỆT
              </span>
            </div>
            <p className="text-xs text-[#C5A36B] font-medium tracking-widest uppercase">
              Một dòng sông – Muôn sắc hội
            </p>
            <p className="text-xs text-[#F8F4EA]/80 leading-relaxed">
              Bảo tàng số nghiên cứu, bảo tồn và đối sánh các thực hành lễ hội đua thuyền truyền thống tại các địa phương Việt Nam trên nền tảng tư liệu xác thực.
            </p>
            <div className="flex items-center gap-2 pt-2 text-xs text-[#C5A36B]">
              <HeartHandshake className="w-4 h-4 shrink-0" />
              <span>Dự án xã hội phi lợi nhuận</span>
            </div>
          </div>

          {/* Cột 2: Điều hướng nhanh */}
          <div>
            <h4 className="font-serif text-sm font-semibold text-[#C5A36B] tracking-wider uppercase mb-4">
              Không gian bảo tàng
            </h4>
            <ul className="space-y-2.5 text-xs text-[#F8F4EA]/80">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link to="/le-hoi" className="hover:text-white transition-colors">
                  Thư viện hồ sơ lễ hội
                </Link>
              </li>
              <li>
                <Link to="/so-sanh" className="hover:text-white transition-colors">
                  Đối sánh thực hành văn hoá
                </Link>
              </li>
              <li>
                <Link to="/lich-le-hoi" className="hover:text-white transition-colors">
                  Lịch kỳ hội truyền thống
                </Link>
              </li>
              <li>
                <Link to="/tro-ly" className="hover:text-white transition-colors">
                  Trợ lý Di sản Việt
                </Link>
              </li>
              <li>
                <Link to="/gioi-thieu" className="hover:text-white transition-colors">
                  Danh mục nguồn tư liệu & Giới thiệu
                </Link>
              </li>
              <li className="pt-1 border-t border-white/10">
                <Link to="/quan-tri" className="text-[#C5A36B] hover:text-white transition-colors flex items-center gap-1.5 font-medium">
                  <span>Khu vực Quản trị & Thẩm định D04</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3: Cam kết học thuật & Di sản */}
          <div>
            <h4 className="font-serif text-sm font-semibold text-[#C5A36B] tracking-wider uppercase mb-4">
              Nguyên tắc tư liệu
            </h4>
            <ul className="space-y-2.5 text-xs text-[#F8F4EA]/80">
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-[#C5A36B] mt-0.5" />
                <span>Không sử dụng tư liệu chưa qua kiểm chứng khoa học.</span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-[#C5A36B] mt-0.5" />
                <span>Tôn trọng tri thức bản địa và cộng đồng chủ thể di sản.</span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-[#C5A36B] mt-0.5" />
                <span>Không tạo ảnh AI giả cảnh sinh hoạt di sản thật.</span>
              </li>
            </ul>
          </div>

          {/* Cột 4: Thông tin đề tài & người thực hiện */}
          <div className="bg-white/5 p-4 rounded-lg border border-white/10 space-y-2.5 text-xs">
            <h4 className="font-serif text-sm font-semibold text-[#C5A36B] tracking-wider uppercase flex items-center gap-2">
              <Landmark className="w-4 h-4" />
              <span>Hồ sơ đề tài D04</span>
            </h4>
            <div className="text-[#F8F4EA]/90 space-y-1">
              <p><strong className="text-white">Đề tài:</strong> So sánh thực hành lễ hội đua thuyền truyền thống tại các địa phương Việt Nam</p>
              <p><strong className="text-white">Người thực hiện:</strong> Vũ Hoàng Hiệp</p>
              <p><strong className="text-white">Mã sinh viên:</strong> PH64339</p>
              <p><strong className="text-white">Nhóm:</strong> 2</p>
              <p className="pt-1 text-[#C5A36B] font-medium">
                Thực tập sinh Đợt 15 – IMTA TECH × FPT Polytechnic
              </p>
            </div>
          </div>
        </div>

        {/* Bản quyền và kết luận */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#F8F4EA]/60 gap-4">
          <p>© 2026 HỘI SẮC VIỆT. Dự án học thuật & bảo tồn di sản phi lợi nhuận.</p>
          <p className="italic">"Một dòng sông – Muôn sắc hội"</p>
        </div>
      </div>
    </footer>
  );
};
