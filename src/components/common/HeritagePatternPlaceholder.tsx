/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Placeholder đồ hoạ trừu tượng mang âm hưởng hoa văn sóng nước và hoạ tiết thuyền truyền thống Việt Nam.
 * Tuyệt đối tuân thủ nguyên tắc: Không tạo ảnh AI giả cảnh lễ hội thật; ghi rõ nhãn chưa có ảnh tư liệu.
 */

import React from 'react';
import { ShieldAlert, Image as ImageIcon } from 'lucide-react';

interface Props {
  className?: string;
  title?: string;
  aspectRatio?: 'landscape' | 'square' | 'portrait';
  variant?: 'red' | 'green' | 'gold';
}

export const HeritagePatternPlaceholder: React.FC<Props> = ({
  className = '',
  title = 'Lễ hội đua thuyền truyền thống',
  aspectRatio = 'landscape',
  variant = 'green',
}) => {
  const ratioClasses = {
    landscape: 'aspect-[16/10]',
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
  }[aspectRatio];

  const themeClasses = {
    green: 'bg-[#183E3A] text-[#F8F4EA]',
    red: 'bg-[#8F2724] text-[#F8F4EA]',
    gold: 'bg-[#C5A36B] text-[#292623]',
  }[variant];

  return (
    <div
      className={`relative w-full overflow-hidden flex flex-col justify-between p-5 select-none rounded-t-lg ${ratioClasses} ${themeClasses} ${className}`}
      aria-label={`Hình hoạ trừu tượng đại diện cho ${title}`}
    >
      {/* Nền hoa văn sóng nước và hoạ tiết hình học Đông Sơn trừu tượng bằng SVG */}
      <svg
        className="absolute inset-0 w-full h-full opacity-15 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 400 250"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern id="heritage-waves" width="80" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M 0 20 Q 20 0 40 20 T 80 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            />
            <path
              d="M 0 32 Q 20 12 40 32 T 80 32"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="4,4"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#heritage-waves)" />
        {/* Đường cong hình tượng mạn thuyền đua truyền thống */}
        <path
          d="M 20 210 Q 200 240 380 180 Q 250 200 40 190 Z"
          fill="currentColor"
          opacity="0.3"
        />
        <circle cx="200" cy="80" r="45" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3,3" />
        <circle cx="200" cy="80" r="30" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>

      {/* Nhãn phân loại trên góc */}
      <div className="relative z-10 flex items-center justify-between text-xs tracking-wider uppercase font-medium opacity-85">
        <span className="flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Tư liệu hình ảnh số</span>
        </span>
        <span className="border border-current/30 px-2 py-0.5 rounded text-[10px]">
          Mã D04
        </span>
      </div>

      {/* Biểu trưng trung tâm */}
      <div className="relative z-10 my-auto text-center px-4">
        <p className="font-serif text-lg md:text-xl font-medium tracking-wide line-clamp-2">
          {title}
        </p>
      </div>

      {/* Nhãn cam kết xác thực bắt buộc theo quy định Giai đoạn 1 */}
      <div className="relative z-10 pt-2 border-t border-current/20 flex items-center gap-1.5 text-[11px] opacity-90">
        <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-[#C5A36B]" />
        <span className="font-medium tracking-wide">
          Chưa có ảnh tư liệu được xác minh
        </span>
      </div>
    </div>
  );
};
