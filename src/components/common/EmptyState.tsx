/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Trạng thái dữ liệu chưa có (Empty State) theo phong cách bảo tàng số trang nhã
 */

import React, { ReactNode } from 'react';
import { Archive, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  title: string;
  description: string;
  icon?: ReactNode;
  actionText?: string;
  actionTo?: string;
  onActionClick?: () => void;
  secondaryAction?: ReactNode;
}

export const EmptyState: React.FC<Props> = ({
  title,
  description,
  icon,
  actionText,
  actionTo,
  onActionClick,
  secondaryAction,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto my-12 p-8 md:p-12 text-center rounded-xl border border-[#E7DED0] bg-[#FFFFFF] shadow-xs">
      <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-[#F8F4EA] border border-[#E7DED0] flex items-center justify-center text-[#8F2724]">
        {icon || <Archive className="w-8 h-8 stroke-[1.5]" />}
      </div>

      <h3 className="font-serif text-xl md:text-2xl font-semibold text-[#183E3A] mb-3">
        {title}
      </h3>

      <p className="text-sm md:text-base text-[#746C61] leading-relaxed max-w-md mx-auto mb-6">
        {description}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {actionTo && actionText && (
          <Link
            to={actionTo}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-[#8F2724] text-white hover:bg-[#751F1C] transition-colors focus:ring-2 focus:ring-[#8F2724]/20"
          >
            <Compass className="w-4 h-4" />
            <span>{actionText}</span>
          </Link>
        )}

        {onActionClick && actionText && (
          <button
            type="button"
            onClick={onActionClick}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-[#8F2724] text-white hover:bg-[#751F1C] transition-colors focus:ring-2 focus:ring-[#8F2724]/20 cursor-pointer"
          >
            <span>{actionText}</span>
          </button>
        )}

        {secondaryAction}
      </div>
    </div>
  );
};
