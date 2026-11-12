
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * HỘI SẮC VIỆT - D04
 * Dịch vụ dữ liệu và đối sánh lễ hội truyền thống.
 *
 * Nguyên tắc:
 * - Không tự tạo sự kiện lịch sử hay nghi lễ.
 * - Không đồng nhất khác biệt câu chữ với khác biệt văn hóa.
 * - Phân biệt hồ sơ nghiên cứu với hồ sơ đủ điều kiện công bố.
 */

import officialFestivals from '../data/festivals.json';
import officialEditions from '../data/editions.json';
import officialSources from '../data/sources.json';

import {
  TEST_FIXTURE_EDITIONS,
  TEST_FIXTURE_FESTIVALS,
  TEST_FIXTURE_SOURCES,
} from '../data/testFixtures';

import type {
  ComparisonCriterion,
  ComparisonReport,
  Festival,
  FestivalEdition,
  HeritageAssistantResponse,
  HeritageSource,
} from '../types/heritage';

import { normalizeVietnamese } from '../utils/text';

// ======================================================
// 1. TRUY XUẤT DỮ LIỆU
// ======================================================

export function getVerifiedFestivals(
  useTestFixtures = false
): Festival[] {
  const dataset = getAllFestivals(useTestFixtures);

  return dataset.filter(
    festival => festival.verificationStatus === 'verified'
  );
}

export function getAllFestivals(
  useTestFixtures = false
): Festival[] {
  return useTestFixtures
    ? TEST_FIXTURE_FESTIVALS
    : officialFestivals as Festival[];
}

export function getFestivalById(
  id: string,
  useTestFixtures = false
): Festival | undefined {
  return getAllFestivals(useTestFixtures).find(
    festival => festival.id === id
  );
}

export function getVerifiedEditions(
  useTestFixtures = false
): FestivalEdition[] {
  const dataset = useTestFixtures
    ? TEST_FIXTURE_EDITIONS
    : officialEditions as FestivalEdition[];

  return dataset.filter(
    edition => edition.verificationStatus === 'verified'
  );
}

export function getEditionsByFestivalId(
  festivalId: string,
  useTestFixtures = false
): FestivalEdition[] {
  return getVerifiedEditions(useTestFixtures).filter(
    edition => edition.festivalId === festivalId
  );
}

export function getSources(
  useTestFixtures = false
): HeritageSource[] {
  return useTestFixtures
    ? TEST_FIXTURE_SOURCES
    : officialSources as HeritageSource[];
}

export function getSourcesByIds(
  sourceIds: string[],
  useTestFixtures = false
): HeritageSource[] {
  const idSet = new Set(sourceIds);

  return getSources(useTestFixtures).filter(
    source => idSet.has(source.id)
  );
}

export function getSourcesByFestivalId(
  festivalId: string,
  useTestFixtures = false
): HeritageSource[] {
  const festival = getFestivalById(
    festivalId,
    useTestFixtures
  );

  if (!festival) return [];

  return getSourcesByIds(
    festival.sourceIds || [],
    useTestFixtures
  );
}

// ======================================================
// 2. CÁC HÀM CHUẨN HÓA ĐỐI SÁNH
// ======================================================

const MISSING = 'Chưa có tư liệu kiểm chứng';

function cleanText(value: unknown): string {
  if (typeof value !== 'string') return '';

  return value.trim();
}

function isMissing(value: unknown): boolean {
  const text = cleanText(value);

  if (!text) return true;

  const normalized = normalizeVietnamese(text);

  return (
    normalized === normalizeVietnamese(MISSING) ||
    normalized === normalizeVietnamese('Chưa rõ') ||
    normalized === normalizeVietnamese('Chưa xác định') ||
    normalized === normalizeVietnamese('Không có dữ liệu')
  );
}

function normalizeValue(value: string): string {
  return normalizeVietnamese(value.trim());
}

function cleanList(values: string[] | undefined): string[] {
  if (!Array.isArray(values)) return [];

  const result: string[] = [];
  const seen = new Set<string>();

  for (const item of values) {
    if (isMissing(item)) continue;

    const text = item.trim();
    const key = normalizeValue(text);

    if (!seen.has(key)) {
      seen.add(key);
      result.push(text);
    }
  }

  return result;
}

function compareLists(
  first: string[],
  second: string[]
): {
  status: ComparisonCriterion['status'];
  shared: string[];
  onlyFirst: string[];
  onlySecond: string[];
} {
  if (first.length === 0 || second.length === 0) {
    return {
      status: 'insufficient_data',
      shared: [],
      onlyFirst: first,
      onlySecond: second,
    };
  }

  const firstMap = new Map(
    first.map(item => [normalizeValue(item), item])
  );

  const secondMap = new Map(
    second.map(item => [normalizeValue(item), item])
  );

  const shared = first.filter(
    item => secondMap.has(normalizeValue(item))
  );

  const onlyFirst = first.filter(
    item => !secondMap.has(normalizeValue(item))
  );

  const onlySecond = second.filter(
    item => !firstMap.has(normalizeValue(item))
  );

  let status: ComparisonCriterion['status'];

  if (onlyFirst.length === 0 && onlySecond.length === 0) {
    status = 'identical';
  } else if (shared.length > 0) {
    status = 'partial';
  } else {
    status = 'different';
  }

  return {
    status,
    shared,
    onlyFirst,
    onlySecond,
  };
}

// ======================================================
// 3. THUẬT TOÁN ĐỐI SÁNH
// ======================================================

export function compareFestivals(
  f1: Festival,
  f2: Festival,
  allSources: HeritageSource[]
): ComparisonReport {
  const sources1 = allSources.filter(
    source => f1.sourceIds?.includes(source.id)
  );

  const sources2 = allSources.filter(
    source => f2.sourceIds?.includes(source.id)
  );

  const isSamePracticeGroup =
    !isMissing(f1.practiceGroup) &&
    !isMissing(f2.practiceGroup) &&
    normalizeValue(f1.practiceGroup) ===
      normalizeValue(f2.practiceGroup);

  const criteria: ComparisonCriterion[] = [];
  const similarities: ComparisonReport['similarities'] = [];
  const differences: ComparisonReport['differences'] = [];

  // ----------------------------------------------
  // 3.1. Đối sánh các trường văn bản
  // ----------------------------------------------

  const compareField = (
    key: string,
    label: string,
    value1: string | null | undefined,
    value2: string | null | undefined,
    options?: {
      semantic?: boolean;
    }
  ) => {
    const val1 = isMissing(value1)
      ? MISSING
      : cleanText(value1);

    const val2 = isMissing(value2)
      ? MISSING
      : cleanText(value2);

    let status: ComparisonCriterion['status'];

    if (val1 === MISSING || val2 === MISSING) {
      status = 'insufficient_data';
    } else if (
      normalizeValue(val1) === normalizeValue(val2)
    ) {
      status = 'identical';
    } else {
      status = 'different';
    }

    const semantic = options?.semantic === true;

    criteria.push({
      key,
      label,
      val1,
      val2,
      status,
      notes:
        status === 'different' && semantic
          ? 'Hai mô tả khác nhau về nội dung văn bản; cần đối chiếu nguồn trước khi kết luận mức độ khác biệt văn hóa.'
          : undefined,
    });

    if (status === 'identical') {
      similarities.push({
        key,
        label,
        value: val1,
        detail:
          `Cả hai hồ sơ cùng ghi nhận "${val1}" ` +
          `ở tiêu chí "${label}". ` +
          'Đây là sự tương đồng được xác định từ dữ liệu hiện có.',
      });
    }

    if (status === 'different') {
      differences.push({
        key,
        label,
        val1,
        val2,
        detail: semantic
          ? `Hai hồ sơ ghi nhận nội dung khác nhau ` +
            `về "${label}". ` +
            `Hồ sơ Kiến Giang hoặc vị thế A: "${val1}". ` +
            `Hồ sơ vị thế B: "${val2}". ` +
            'Cần đối chiếu nguồn tư liệu trước khi ' +
            'diễn giải đây là khác biệt văn hóa.'
          : `Tiêu chí "${label}" có hai giá trị ` +
            `được ghi nhận khác nhau: ` +
            `vị thế A là "${val1}", ` +
            `vị thế B là "${val2}".`,
      });
    }
  };

  // ----------------------------------------------
  // 3.2. Các tiêu chí cơ bản
  // ----------------------------------------------

  compareField(
    'officialName',
    'Tên lễ hội chính thức',
    f1.officialName,
    f2.officialName
  );

  compareField(
    'practiceGroup',
    'Nhóm vùng miền / Thực hành văn hoá',
    f1.practiceGroup,
    f2.practiceGroup
  );

  compareField(
    'province',
    'Địa phương (Tỉnh / Thành phố)',
    f1.province,
    f2.province
  );

  compareField(
    'location',
    'Không gian tổ chức (Sông / Biển / Lạch)',
    f1.location,
    f2.location
  );

  compareField(
    'community',
    'Cộng đồng chủ thể thực hành',
    f1.community,
    f2.community
  );

  compareField(
    'culturalContext',
    'Bối cảnh văn hoá & Tín ngưỡng',
    f1.culturalContext,
    f2.culturalContext,
    { semantic: true }
  );

  compareField(
    'origin',
    'Nguồn gốc lịch sử ghi nhận',
    f1.origin,
    f2.origin,
    { semantic: true }
  );

  compareField(
    'heritageStatus',
    'Tình trạng ghi danh di sản',
    f1.heritageStatus,
    f2.heritageStatus
  );

  // ----------------------------------------------
  // 3.3. Đối sánh các danh mục thực hành
  // ----------------------------------------------

  const compareListField = (
    key: string,
    label: string,
    values1: string[] | undefined,
    values2: string[] | undefined
  ) => {
    const first = cleanList(values1);
    const second = cleanList(values2);

    const result = compareLists(first, second);

    criteria.push({
      key,
      label,
      val1: first.length ? first : [MISSING],
      val2: second.length ? second : [MISSING],
      status: result.status,
      notes:
        result.status === 'insufficient_data'
          ? 'Ít nhất một hồ sơ chưa có đủ dữ liệu cho tiêu chí này.'
          : result.shared.length > 0
          ? `Có ${result.shared.length} mục trùng khớp về cách ghi nhận.`
          : 'Chưa phát hiện mục trùng khớp chính xác; không đồng nghĩa đã chứng minh hai thực hành hoàn toàn khác nhau.',
    });

    if (
      result.shared.length > 0 &&
      result.status !== 'insufficient_data'
    ) {
      similarities.push({
        key,
        label,
        value: result.shared.join('; '),
        detail:
          `Hai hồ sơ cùng ghi nhận: ` +
          `${result.shared.join('; ')}. ` +
          'Sự trùng khớp này dựa trên danh mục dữ liệu, ' +
          'chưa thay thế việc thẩm định thực hành thực tế.',
      });
    }

    if (
      result.status === 'different' ||
      result.status === 'partial'
    ) {
      differences.push({
        key,
        label,
        val1: first.join('; '),
        val2: second.join('; '),
        detail:
          `Ở tiêu chí "${label}", ` +
          `vị thế A ghi nhận: ${first.join('; ')}. ` +
          `Vị thế B ghi nhận: ${second.join('; ')}. ` +
          (result.status === 'partial'
            ? 'Hai hồ sơ có một số mục trùng khớp và một số mục được ghi nhận riêng.'
            : 'Chưa tìm thấy mục trùng khớp chính xác trong dữ liệu hiện có; cần tiếp tục đối chiếu nguồn.'),
      });
    }
  };

  compareListField(
    'rituals',
    'Hệ thống nghi thức & Lễ tế',
    f1.rituals,
    f2.rituals
  );

  compareListField(
    'activities',
    'Hoạt động hội & Diễn xướng dân gian',
    f1.activities,
    f2.activities
  );

  compareListField(
    'characteristics',
    'Đặc trưng phương tiện đua & Biểu tượng văn hoá',
    f1.characteristics,
    f2.characteristics
  );

  // ----------------------------------------------
  // 3.4. Cảnh báo nghiên cứu
  // ----------------------------------------------

  const warnings: string[] = [];

  if (
    f1.verificationStatus !== 'verified' ||
    f2.verificationStatus !== 'verified' ||
    f1.contentCheckedAgainstOriginal !== true ||
    f2.contentCheckedAgainstOriginal !== true
  ) {
    warnings.push(
      'Ít nhất một hồ sơ chưa hoàn tất thẩm định nội dung. ' +
      'Kết quả chỉ phục vụ đối sánh nghiên cứu sơ bộ.'
    );
  }

  const unverifiedSources = [
    ...sources1,
    ...sources2,
  ].filter(source => source.status !== 'verified');

  if (unverifiedSources.length > 0) {
    warnings.push(
      'Danh sách nguồn liên kết có tài liệu đang chờ xác minh. ' +
      'Không nên coi tất cả nguồn là tài liệu đã kiểm chứng.'
    );
  }

  if (!isSamePracticeGroup) {
    warnings.push(
      'Hai hồ sơ không có nhóm thực hành trùng khớp ' +
      'trong dữ liệu hiện tại. Cần xác định phạm vi ' +
      'so sánh trước khi rút ra kết luận.'
    );
  }

  if (
    criteria.some(
      criterion => criterion.status === 'insufficient_data'
    )
  ) {
    warnings.push(
      'Một số tiêu chí chưa đủ tư liệu để kết luận. ' +
      'Thiếu dữ liệu không được xem là bằng chứng khác biệt.'
    );
  }

  return {
    festival1: f1,
    festival2: f2,
    sources1,
    sources2,
    criteria,
    similarities,
    differences,
    isSamePracticeGroup,
    canCompare: f1.id !== f2.id,
    warningNotice:
      warnings.length > 0
        ? warnings.join(' ')
        : undefined,
  };
}

// ======================================================
// 4. TRỢ LÝ DI SẢN VIỆT
// Giữ nguyên trạng thái chuẩn bị API
// ======================================================

export async function askHeritageAssistant(
  question: string,
  _context?: unknown
): Promise<HeritageAssistantResponse> {
  const trimmed = question.trim();

  if (!trimmed) {
    return {
      answer:
        'Vui lòng nhập câu hỏi của bạn về lễ hội đua thuyền truyền thống.',
      citations: [],
      relatedFestivalIds: [],
      status: 'error',
    };
  }

  if (trimmed.length > 500) {
    return {
      answer:
        'Câu hỏi vượt quá giới hạn cho phép (tối đa 500 ký tự). Vui lòng rút gọn câu hỏi.',
      citations: [],
      relatedFestivalIds: [],
      status: 'error',
    };
  }

  await new Promise(resolve => setTimeout(resolve, 600));

  return {
    answer:
      'Trợ lý AI đang được chuẩn bị. Chức năng hỏi đáp sẽ hoạt động sau khi kết nối Gemini và nạp dữ liệu đã kiểm chứng.',
    citations: [],
    relatedFestivalIds: [],
    status: 'preparing',
  };
}
