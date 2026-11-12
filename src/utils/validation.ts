
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * HỘI SẮC VIỆT - D04
 * Kiểm tra dữ liệu di sản và điều kiện công bố.
 */

import type {
  DetailedQualityReport,
  Festival,
  FestivalEdition,
  HeritageSource,
  ValidationIssue,
  ValidationReport,
} from '../types/heritage';

const MINIMUM_SOURCES = 3;

type LegacySource = HeritageSource & {
  author?: string;
  accessDate?: string | null;
};

function hasText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function uniqueIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return [
    ...new Set(value.filter((id): id is string => hasText(id))),
  ];
}

function isValidDate(value: unknown): boolean {
  if (!hasText(value)) return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

/**
 * Chỉ kiểm tra cú pháp URL.
 * Không kiểm tra khả năng truy cập hoặc nội dung tài liệu.
 */
export function isValidUrl(
  value: string | null | undefined
): boolean {
  if (!hasText(value)) return false;

  try {
    const url = new URL(value);
    return (
      ['http:', 'https:'].includes(url.protocol) &&
      Boolean(url.hostname) &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
}

function getSourceAuthor(source: HeritageSource): string {
  const legacy = source as LegacySource;

  return source.authorOrOrganization || legacy.author || '';
}

function getSourceAccessDate(
  source: HeritageSource
): string | null {
  const legacy = source as LegacySource;

  return source.accessedAt || legacy.accessDate || null;
}

/**
 * Đây là kiểm tra trạng thái xác minh đã được ghi nhận.
 * Không thể tự chứng minh rằng người quản trị đã đọc
 * và đối chiếu nội dung tài liệu gốc.
 */
export function isVerifiedSource(
  source: HeritageSource
): boolean {
  return (
    source.status === 'verified' &&
    hasText(source.id) &&
    hasText(source.title) &&
    hasText(getSourceAuthor(source)) &&
    isValidUrl(source.url) &&
    isValidDate(getSourceAccessDate(source))
  );
}

function getExistingSources(
  ids: string[] | undefined,
  sources: HeritageSource[]
): HeritageSource[] {
  const sourceMap = new Map(
    sources.map(source => [source.id, source])
  );

  return uniqueIds(ids)
    .map(id => sourceMap.get(id))
    .filter((source): source is HeritageSource =>
      source !== undefined
    );
}

function hasDuplicateIds(
  records: Array<{ id: string }>
): boolean {
  const ids = records.map(record => record.id);

  return new Set(ids).size !== ids.length;
}

/**
 * Kiểm tra điều kiện công bố.
 *
 * Chỉ công bố khi:
 * - Hồ sơ đã được quản trị viên phê duyệt.
 * - Nội dung đã được đối chiếu với tài liệu gốc.
 * - Có tối thiểu 3 nguồn riêng biệt.
 * - Các nguồn tồn tại và có trạng thái xác minh hợp lệ.
 * - Không có ID nguồn trùng trong kho.
 *
 * Lưu ý: số lượng nguồn không chứng minh nguồn phù hợp
 * với từng khẳng định. Việc này cần thẩm định thủ công.
 */
export function canPublishFestival(
  festival: Festival,
  sources: HeritageSource[]
): boolean {
  if (festival.verificationStatus !== 'verified') {
    return false;
  }

  if (festival.contentCheckedAgainstOriginal !== true) {
    return false;
  }

  if (
    !hasText(festival.id) ||
    !hasText(festival.officialName) ||
    !hasText(festival.province) ||
    !hasText(festival.practiceGroup)
  ) {
    return false;
  }

  if (hasDuplicateIds(sources)) return false;

  if (!Array.isArray(festival.sourceIds)) return false;

  const ids = uniqueIds(festival.sourceIds);

  if (
    ids.length < MINIMUM_SOURCES ||
    ids.length !== festival.sourceIds.length
  ) {
    return false;
  }

  const linkedSources = getExistingSources(ids, sources);

  if (linkedSources.length !== ids.length) {
    return false;
  }

  return linkedSources.every(isVerifiedSource);
}

/**
 * Kiểm tra toàn vẹn dữ liệu.
 */
export function validateHeritageData(
  festivals: Festival[],
  editions: FestivalEdition[],
  sources: HeritageSource[]
): ValidationReport {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];

  const sourceIds = new Set<string>();
  const festivalIds = new Set<string>();
  const editionIds = new Set<string>();

  const addIssue = (
    type: 'error' | 'warning',
    field: string,
    message: string,
    recordId?: string
  ) => {
    const issue: ValidationIssue = {
      type,
      field,
      message,
      recordId,
    };

    if (type === 'error') {
      errors.push(issue);
    } else {
      warnings.push(issue);
    }
  };

  // 1. Nguồn tư liệu
  for (const source of sources) {
    const id = source.id;

    if (!hasText(id)) {
      addIssue('error', 'id', 'Nguồn thiếu ID');
    } else if (sourceIds.has(id)) {
      addIssue('error', 'id', `ID nguồn trùng: ${id}`, id);
    } else {
      sourceIds.add(id);
    }

    if (!hasText(source.title)) {
      addIssue('error', 'title', 'Nguồn thiếu tiêu đề', id);
    }

    if (!hasText(getSourceAuthor(source))) {
      addIssue(
        'error',
        'authorOrOrganization',
        'Nguồn thiếu cơ quan hoặc tác giả',
        id
      );
    }

    if (!isValidUrl(source.url)) {
      addIssue(
        'warning',
        'url',
        'URL chưa hợp lệ hoặc chưa được cung cấp',
        id
      );
    }

    if (!isValidDate(getSourceAccessDate(source))) {
      addIssue(
        'warning',
        'accessedAt',
        'Chưa có ngày truy cập hợp lệ',
        id
      );
    }

    if (!isVerifiedSource(source)) {
      addIssue(
        'warning',
        'status',
        'Nguồn chưa đáp ứng điều kiện xác minh',
        id
      );
    }
  }

  // 2. Hồ sơ lễ hội
  for (const festival of festivals) {
    const id = festival.id;

    if (!hasText(id)) {
      addIssue('error', 'id', 'Hồ sơ thiếu ID');
    } else if (festivalIds.has(id)) {
      addIssue('error', 'id', `ID lễ hội trùng: ${id}`, id);
    } else {
      festivalIds.add(id);
    }

    if (!hasText(festival.officialName)) {
      addIssue('error', 'officialName', 'Thiếu tên lễ hội', id);
    }

    if (!hasText(festival.province)) {
      addIssue('error', 'province', 'Thiếu địa phương', id);
    }

    if (!hasText(festival.practiceGroup)) {
      addIssue(
        'error',
        'practiceGroup',
        'Thiếu nhóm thực hành',
        id
      );
    }

    const rawIds = festival.sourceIds;
    const ids = uniqueIds(rawIds);

    if (
      !Array.isArray(rawIds) ||
      ids.length !== rawIds.length
    ) {
      addIssue(
        'error',
        'sourceIds',
        'Danh sách nguồn có ID trùng hoặc không hợp lệ',
        id
      );
    }

    for (const sourceId of ids) {
      if (!sourceIds.has(sourceId)) {
        addIssue(
          'error',
          'sourceIds',
          `Nguồn không tồn tại: ${sourceId}`,
          id
        );
      }
    }

    if (ids.length < MINIMUM_SOURCES) {
      addIssue(
        'warning',
        'sourceIds',
        `Chỉ có ${ids.length}/${MINIMUM_SOURCES} nguồn`,
        id
      );
    }

    if (festival.contentCheckedAgainstOriginal !== true) {
      addIssue(
        'warning',
        'contentCheckedAgainstOriginal',
        'Chưa xác nhận đối chiếu tài liệu gốc',
        id
      );
    }

    if (festival.verificationStatus === 'verified') {
      if (!canPublishFestival(festival, sources)) {
        addIssue(
          'error',
          'verificationStatus',
          'Đã gắn nhãn verified nhưng chưa đủ điều kiện công bố',
          id
        );
      }
    } else {
      addIssue(
        'warning',
        'verificationStatus',
        'Hồ sơ chưa được phê duyệt',
        id
      );
    }
  }

  // 3. Kỳ tổ chức lễ hội
  for (const edition of editions) {
    const id = edition.id;

    if (!hasText(id)) {
      addIssue('error', 'id', 'Kỳ tổ chức thiếu ID');
    } else if (editionIds.has(id)) {
      addIssue('error', 'id', `ID kỳ tổ chức trùng: ${id}`, id);
    } else {
      editionIds.add(id);
    }

    const parent = festivals.find(
      festival => festival.id === edition.festivalId
    );

    if (!parent) {
      addIssue(
        'error',
        'festivalId',
        'Không tìm thấy hồ sơ lễ hội gốc',
        id
      );
    }

    const rawIds = edition.sourceIds;
    const ids = uniqueIds(rawIds);

    if (
      !Array.isArray(rawIds) ||
      ids.length !== rawIds.length
    ) {
      addIssue(
        'error',
        'sourceIds',
        'Nguồn kỳ tổ chức trùng hoặc không hợp lệ',
        id
      );
    }

    for (const sourceId of ids) {
      if (!sourceIds.has(sourceId)) {
        addIssue(
          'error',
          'sourceIds',
          `Nguồn không tồn tại: ${sourceId}`,
          id
        );
      }
    }

    if (edition.verificationStatus === 'verified') {
      if (!parent || !canPublishFestival(parent, sources)) {
        addIssue(
          'error',
          'verificationStatus',
          'Lễ hội gốc chưa đủ điều kiện công bố',
          id
        );
      }

      const linked = getExistingSources(ids, sources);

      if (
        ids.length === 0 ||
        linked.length !== ids.length ||
        !linked.every(isVerifiedSource)
      ) {
        addIssue(
          'error',
          'sourceIds',
          'Kỳ tổ chức chưa có nguồn xác minh hợp lệ',
          id
        );
      }
    }
  }

  const hasGlobalIdConflict =
    hasDuplicateIds(sources) ||
    hasDuplicateIds(festivals) ||
    hasDuplicateIds(editions);

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    totalFestivals: festivals.length,
    verifiedFestivals: hasGlobalIdConflict
      ? 0
      : festivals.filter(festival =>
          canPublishFestival(festival, sources)
        ).length,
    totalSources: sources.length,
    verifiedSources: hasDuplicateIds(sources)
      ? 0
      : sources.filter(isVerifiedSource).length,
    totalEditions: editions.length,
  };
}

/**
 * Báo cáo chất lượng dữ liệu cho trang quản trị.
 */
export function generateQualityReport(
  festivals: Festival[],
  editions: FestivalEdition[],
  sources: HeritageSource[]
): DetailedQualityReport {
  const sourceIdSet = new Set(sources.map(s => s.id));
  const festivalIdSet = new Set(festivals.map(f => f.id));

  const festivalsMissingSources:
    DetailedQualityReport['festivalsMissingSources'] = [];

  const unpublishableRecords:
    DetailedQualityReport['unpublishableRecords'] = [];

  const brokenSourceReferences:
    DetailedQualityReport['brokenSourceReferences'] = [];

  const brokenEditionReferences:
    DetailedQualityReport['brokenEditionReferences'] = [];

  const globalConflict =
    hasDuplicateIds(sources) ||
    hasDuplicateIds(festivals) ||
    hasDuplicateIds(editions);

  for (const festival of festivals) {
    const ids = uniqueIds(festival.sourceIds);
    const reasons: string[] = [];

    if (ids.length < MINIMUM_SOURCES) {
      const reason =
        `Chỉ có ${ids.length}/${MINIMUM_SOURCES} nguồn tối thiểu`;

      festivalsMissingSources.push({
        festival,
        currentSourceCount: ids.length,
        reason,
      });

      reasons.push(reason);
    }

    if (
      !Array.isArray(festival.sourceIds) ||
      festival.sourceIds.length !== ids.length
    ) {
      reasons.push('Danh sách nguồn trùng hoặc không hợp lệ');
    }

    for (const sourceId of ids) {
      if (!sourceIdSet.has(sourceId)) {
        brokenSourceReferences.push({
          festivalId: festival.id,
          missingSourceId: sourceId,
        });

        reasons.push(`Không tìm thấy nguồn ${sourceId}`);
      }
    }

    const linked = getExistingSources(ids, sources);
    const verifiedCount = linked.filter(isVerifiedSource).length;

    if (verifiedCount < MINIMUM_SOURCES) {
      reasons.push(
        `Chỉ có ${verifiedCount}/${MINIMUM_SOURCES} nguồn đã xác minh`
      );
    }

    if (!hasText(festival.officialName)) {
      reasons.push('Thiếu tên lễ hội');
    }

    if (!hasText(festival.province)) {
      reasons.push('Thiếu địa phương');
    }

    if (!hasText(festival.practiceGroup)) {
      reasons.push('Thiếu nhóm thực hành');
    }

    if (festival.contentCheckedAgainstOriginal !== true) {
      reasons.push('Chưa đối chiếu tài liệu gốc');
    }

    if (festival.verificationStatus !== 'verified') {
      reasons.push(
        `Trạng thái hiện tại: ${festival.verificationStatus}`
      );
    }

    if (globalConflict) {
      reasons.push('Kho dữ liệu có ID trùng');
    }

    if (globalConflict || !canPublishFestival(festival, sources)) {
      unpublishableRecords.push({
        festival,
        reasons: reasons.length
          ? [...new Set(reasons)]
          : ['Chưa đủ điều kiện công bố'],
      });
    }
  }

  for (const edition of editions) {
    if (!festivalIdSet.has(edition.festivalId)) {
      brokenEditionReferences.push({
        editionId: edition.id,
        missingFestivalId: edition.festivalId,
      });
    }
  }

  return {
    totalFestivals: festivals.length,
    verifiedFestivals: globalConflict
      ? 0
      : festivals.filter(f =>
          canPublishFestival(f, sources)
        ).length,
    pendingFestivals: festivals.filter(
      f => f.verificationStatus === 'pending'
    ).length,
    draftFestivals: festivals.filter(
      f => f.verificationStatus === 'draft'
    ).length,
    totalSources: sources.length,
    officialSourcesCount: sources.filter(
      s => s.type === 'official'
    ).length,
    researchSourcesCount: sources.filter(
      s => s.type === 'research'
    ).length,
    communitySourcesCount: sources.filter(
      s => s.type === 'community'
    ).length,
    referenceSourcesCount: sources.filter(
      s => s.type === 'reference'
    ).length,
    totalEditions: editions.length,
    festivalsMissingSources,
    unpublishableRecords,
    brokenSourceReferences,
    brokenEditionReferences,
  };
}
