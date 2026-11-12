/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Trang 404 - Không tìm thấy trang (Not Found)
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6">
      <div className="w-20 h-20 mx-auto rounded-full bg-[#8F2724]/10 text-[#8F2724] flex items-center justify-center font-serif text-3xl font-bold">
        404
      </div>

      <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#183E3A]">
        Không tìm thấy trang yêu cầu
      </h1>

      <p className="text-sm sm:text-base text-[#746C61] max-w-md mx-auto leading-relaxed">
        Đường dẫn bạn đang tìm kiếm không tồn tại hoặc đã được chuyển dời trong bảo tàng số HỘI SẮC VIỆT.
      </p>

      <div className="flex items-center justify-center gap-3 pt-2">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-[#8F2724] text-white hover:bg-[#751F1C] transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Về trang chủ</span>
        </Link>

        <Link
          to="/le-hoi"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-white border border-[#E7DED0] text-[#183E3A] hover:bg-[#F8F4EA] transition-colors"
        >
          <Compass className="w-4 h-4" />
          <span>Khám phá thư viện</span>
        </Link>
      </div>
    </div>
  );
};
