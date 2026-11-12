
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * HỘI SẮC VIỆT - D04
 * Bộ chọn lễ hội phục vụ đối sánh nghiên cứu.
 */

import React from 'react';
import {
  ArrowLeftRight,
  Trash2,
  AlertCircle,
} from 'lucide-react';

import type { Festival } from '../../types/heritage';

interface Props {
  festivals: Festival[];
  selectedIds: [string | null, string | null];
  onSelectionChange: (
    ids: [string | null, string | null]
  ) => void;
  onCompare: () => void;
  canCompare: boolean;
}

export const ComparisonSelector: React.FC<Props> = ({
  festivals,
  selectedIds,
  onSelectionChange,
  onCompare,
  canCompare,
}) => {
  const [firstId, secondId] = selectedIds;

  const slot1 = festivals.find(f => f.id === firstId);
  const slot2 = festivals.find(f => f.id === secondId);

  const isSameSelected = Boolean(
    firstId && secondId && firstId === secondId
  );

  const handleSelect = (
    index: 0 | 1,
    value: string
  ) => {
    const next: [string | null, string | null] = [
      ...selectedIds,
    ];

    next[index] = value || null;

    if (
      next[0] &&
      next[1] &&
      next[0] === next[1]
    ) {
      next[index === 0 ? 1 : 0] = null;
    }

    onSelectionChange(next);
  };

  const clearSelection = () => {
    onSelectionChange([null, null]);
  };

  const swapSelection = () => {
    onSelectionChange([secondId, firstId]);
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-[#E7DED0] shadow-xs mb-8 no-print">
      <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-[#E7DED0]">
        <div>
          <h2 className="font-serif text-lg font-bold text-[#183E3A]">
            Chọn hai hồ sơ để đối sánh
          </h2>

          <p className="text-xs text-[#746C61] mt-1">
            Có thể chọn hồ sơ đang thẩm định để
            nghiên cứu sơ bộ. Kết quả chưa được
            xem là kết luận chính thức.
          </p>
        </div>

        {(firstId || secondId) && (
          <button
            type="button"
            onClick={clearSelection}
            className="inline-flex items-center gap-1 text-xs text-[#8F2724] hover:text-[#751F1C] transition-colors cursor-pointer shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Xóa lựa chọn</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
        <div className="md:col-span-5 p-4 rounded-lg border border-[#E7DED0] bg-[#F8F4EA]/40">
          <label
            htmlFor="slot-1-select"
            className="block text-xs font-semibold text-[#183E3A] uppercase tracking-wider mb-2"
          >
            Hồ sơ lễ hội thứ nhất (Vị thế A)
          </label>

          <select
            id="slot-1-select"
            value={firstId || ''}
            onChange={e => handleSelect(0, e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border border-[#E7DED0] bg-white text-sm text-[#292623] focus:border-[#8F2724]"
          >
            <option value="">
              -- Chọn lễ hội thứ nhất --
            </option>

            {festivals.map(festival => (
              <option
                key={festival.id}
                value={festival.id}
                disabled={festival.id === secondId}
              >
                {festival.officialName} ({festival.province})
              </option>
            ))}
          </select>

          {slot1 && (
            <div className="mt-2 space-y-1">
              <p className="text-xs text-[#746C61]">
                Nhóm:{' '}
                <strong className="text-[#183E3A]">
                  {slot1.practiceGroup}
                </strong>
              </p>

              <p className="text-xs text-[#746C61]">
                Trạng thái:{' '}
                {slot1.verificationStatus === 'verified'
                  ? 'Đã ghi nhận xác minh'
                  : 'Đang thẩm định'}
              </p>
            </div>
          )}
        </div>

        <div className="md:col-span-1 flex justify-center">
          <button
            type="button"
            onClick={swapSelection}
            disabled={!firstId && !secondId}
            className="p-3 rounded-full border border-[#E7DED0] bg-white text-[#183E3A] hover:bg-[#F8F4EA] transition-colors shadow-xs disabled:opacity-40 cursor-pointer"
            title="Hoán đổi hai lễ hội"
            aria-label="Hoán đổi hai lễ hội"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>
        </div>

        <div className="md:col-span-5 p-4 rounded-lg border border-[#E7DED0] bg-[#F8F4EA]/40">
          <label
            htmlFor="slot-2-select"
            className="block text-xs font-semibold text-[#183E3A] uppercase tracking-wider mb-2"
          >
            Hồ sơ lễ hội thứ hai (Vị thế B)
          </label>

          <select
            id="slot-2-select"
            value={secondId || ''}
            onChange={e => handleSelect(1, e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border border-[#E7DED0] bg-white text-sm text-[#292623] focus:border-[#8F2724]"
          >
            <option value="">
              -- Chọn lễ hội thứ hai --
            </option>

            {festivals.map(festival => (
              <option
                key={festival.id}
                value={festival.id}
                disabled={festival.id === firstId}
              >
                {festival.officialName} ({festival.province})
              </option>
            ))}
          </select>

          {slot2 && (
            <div className="mt-2 space-y-1">
              <p className="text-xs text-[#746C61]">
                Nhóm:{' '}
                <strong className="text-[#183E3A]">
                  {slot2.practiceGroup}
                </strong>
              </p>

              <p className="text-xs text-[#746C61]">
                Trạng thái:{' '}
                {slot2.verificationStatus === 'verified'
                  ? 'Đã ghi nhận xác minh'
                  : 'Đang thẩm định'}
              </p>
            </div>
          )}
        </div>
      </div>

      {isSameSelected && (
        <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          Vui lòng chọn hai lễ hội khác nhau.
        </div>
      )}

      <div className="mt-5 pt-4 border-t border-[#E7DED0] flex items-center justify-end">
        <button
          type="button"
          onClick={onCompare}
          disabled={!canCompare}
          className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-xs ${
            canCompare
              ? 'bg-[#8F2724] text-white hover:bg-[#751F1C] cursor-pointer'
              : 'bg-[#E7DED0] text-[#746C61]/60 cursor-not-allowed'
          }`}
        >
          Bắt đầu so sánh
        </button>
      </div>
    </div>
  );
};
