
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * HỘI SẮC VIỆT - D04
 * So sánh chính thức và so sánh nghiên cứu sơ bộ.
 */

import React, { useMemo, useState } from 'react';
import {
  Scale,
  AlertCircle,
  FlaskConical,
} from 'lucide-react';

import { useHeritage } from '../context/HeritageContext';
import { ComparisonSelector } from '../components/comparison/ComparisonSelector';
import { ComparisonTable } from '../components/comparison/ComparisonTable';
import { EmptyState } from '../components/common/EmptyState';
import { compareFestivals } from '../services/heritageDataService';

export const ComparisonPage: React.FC = () => {
  const {
    festivals,
    verifiedFestivals,
    sources,
  } = useHeritage();

  const [selectedIds, setSelectedIds] = useState<
    [string | null, string | null]
  >([null, null]);

  const [hasCompared, setHasCompared] = useState(false);

  const firstFestival = useMemo(
    () => festivals.find(f => f.id === selectedIds[0]),
    [festivals, selectedIds]
  );

  const secondFestival = useMemo(
    () => festivals.find(f => f.id === selectedIds[1]),
    [festivals, selectedIds]
  );

  const canCompare = Boolean(
    firstFestival &&
    secondFestival &&
    firstFestival.id !== secondFestival.id
  );

  const isOfficialComparison = Boolean(
    firstFestival &&
    secondFestival &&
    verifiedFestivals.some(f => f.id === firstFestival.id) &&
    verifiedFestivals.some(f => f.id === secondFestival.id)
  );

  const handleSelectionChange = (
    ids: [string | null, string | null]
  ) => {
    setSelectedIds(ids);
    setHasCompared(false);
  };

  const handleCompare = () => {
    if (!canCompare) return;
    setHasCompared(true);
  };

  const report = useMemo(() => {
    if (
      !hasCompared ||
      !canCompare ||
      !firstFestival ||
      !secondFestival
    ) {
      return null;
    }

    return compareFestivals(
      firstFestival,
      secondFestival,
      sources
    );
  }, [
    hasCompared,
    canCompare,
    firstFestival,
    secondFestival,
    sources,
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8F2724]/10 text-[#8F2724] text-xs font-semibold uppercase tracking-wider">
          <Scale className="w-3.5 h-3.5" />
          Hạt nhân nghiên cứu đề tài D04
        </span>

        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#183E3A]">
          So sánh sắc hội
        </h1>

        <p className="text-sm sm:text-base text-[#746C61] leading-relaxed">
          Đối chiếu các thực hành lễ hội đua thuyền
          truyền thống dựa trên dữ liệu được ghi nhận
          và nguồn tư liệu liên kết.
        </p>
      </div>

      {festivals.length >= 2 ? (
        <ComparisonSelector
          festivals={festivals}
          selectedIds={selectedIds}
          onSelectionChange={handleSelectionChange}
          canCompare={canCompare}
          onCompare={handleCompare}
        />
      ) : (
        <EmptyState
          title="Chưa đủ hồ sơ để so sánh"
          description="Cần ít nhất hai hồ sơ lễ hội."
          icon={<Scale className="w-8 h-8 text-[#8F2724]" />}
          actionText="Khám phá thư viện lễ hội"
          actionTo="/le-hoi"
        />
      )}

      {canCompare && hasCompared && report ? (
        <div className="space-y-6">
          {!isOfficialComparison ? (
            <div
              role="status"
              className="flex items-start gap-3 p-5 rounded-xl border border-amber-300 bg-amber-50"
            >
              <FlaskConical className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />

              <div className="space-y-1">
                <h3 className="font-semibold text-amber-900">
                  Đối sánh dữ liệu nghiên cứu sơ bộ
                </h3>

                <p className="text-sm text-amber-900 leading-relaxed">
                  Ít nhất một hồ sơ chưa được xác minh
                  đầy đủ. Bảng đối sánh chỉ phục vụ
                  nghiên cứu và kiểm thử, không phải
                  kết luận khoa học chính thức.
                  Những nhận định chưa có nguồn phù hợp
                  cần được đối chiếu trước khi sử dụng.
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-[#C7DED3] bg-[#F0F7F2] p-4 text-sm text-[#183E3A]">
              Hai hồ sơ đáp ứng điều kiện công bố
              theo dữ liệu thẩm định của hệ thống.
            </div>
          )}

          <ComparisonTable report={report} />
        </div>
      ) : festivals.length >= 2 ? (
        <div className="bg-white p-8 rounded-xl border border-[#E7DED0] text-center space-y-4 max-w-2xl mx-auto">
          <div className="w-12 h-12 rounded-full bg-[#F8F4EA] mx-auto flex items-center justify-center text-[#8F2724]">
            <AlertCircle className="w-6 h-6" />
          </div>

          <h3 className="font-serif text-lg font-bold text-[#183E3A]">
            Vui lòng chọn 2 hồ sơ lễ hội để bắt đầu
          </h3>

          <p className="text-sm text-[#746C61] leading-relaxed">
            Chọn hai lễ hội khác nhau rồi nhấn
            “Bắt đầu so sánh”. Hồ sơ đang thẩm định
            chỉ được sử dụng để đối chiếu sơ bộ.
          </p>
        </div>
      ) : null}
    </div>
  );
};
