
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * HỘI SẮC VIỆT - D04
 * Hệ thống kiểu dữ liệu di sản văn hóa số.
 *
 * Quy tắc:
 * - Không công bố dữ liệu chưa kiểm chứng.
 * - Không suy luận tình trạng ghi danh di sản.
 * - Không sử dụng tư liệu chưa rõ quyền công bố.
 * - Mọi hồ sơ phải liên kết nguồn tham khảo.
 */

export type VerificationStatus =
  | 'draft'
  | 'pending'
  | 'verified';

export type SourceVerificationStatus =
  | 'pending'
  | 'verified';

export type SourceType =
  | 'official'
  | 'research'
  | 'community'
  | 'reference';

export type MediaPermissionStatus =
  | 'verified_free'
  | 'creative_commons'
  | 'permission_granted'
  | 'unverified';

export interface Festival {
  id: string;
  officialName: string;
  alternativeNames: string[];
  practiceGroup: string;

  province: string;
  location: string;
  community: string;

  culturalContext: string;
  origin: string | null;

  rituals: string[];
  activities: string[];
  characteristics: string[];

  heritageStatus: string | null;
  sourceIds: string[];

  verificationStatus: VerificationStatus;
  imageIds: string[];

  createdAt: string;
  updatedAt: string;

  contentCheckedAgainstOriginal?: boolean;
  adminReviewNotes?: string;
  lastReviewedAt?: string;

  // Thông tin bổ sung phục vụ kiểm chứng.
  verificationNotes?: string;
  verifiedBy?: string | null;

  // Giữ nguyên địa danh theo tài liệu gốc.
  historicalLocationNote?: string | null;
}

export interface FestivalEdition {
  id: string;
  festivalId: string;
  year: number;

  lunarDate: string | null;
  solarStartDate: string | null;
  solarEndDate: string | null;

  venue: string | null;
  notes: string | null;

  sourceIds: string[];
  verificationStatus: VerificationStatus;
}

/**
 * Nguồn tư liệu.
 *
 * authorOrOrganization / accessedAt là tên trường
 * được sử dụng trong cấu trúc ứng dụng ban đầu.
 *
 * author / accessDate được hỗ trợ để tương thích
 * với dữ liệu JSON đã nhập.
 *
 * Chú ý: khai báo kiểu không tự chuyển đổi dữ liệu.
 * Việc chuẩn hóa phải được thực hiện trong lớp
 * đọc dữ liệu và validation.
 */
export interface HeritageSource {
  id: string;
  title: string;

  authorOrOrganization: string;
  type: SourceType;

  url: string | null;
  publicationDate: string | null;
  accessedAt: string | null;

  description: string;
  usageRights: string | null;

  status: SourceVerificationStatus;

  // Trường tương thích với JSON hiện tại.
  author?: string;
  accessDate?: string | null;

  // Thông tin thẩm định bổ sung.
  verificationNotes?: string;
  verifiedBy?: string | null;
  lastCheckedAt?: string | null;
}

export interface MediaAsset {
  id: string;
  festivalId: string;

  type: 'image' | 'audio' | 'video';
  url: string;

  title: string;
  description: string;

  creator: string;
  provider: string;
  sourceId: string;

  permissionStatus: MediaPermissionStatus;

  allowedUsage: string;
  credit: string;
  takedownRequested: boolean;

  permissionEvidence?: string | null;
  permissionCheckedAt?: string | null;
}

export interface ValidationIssue {
  type: 'error' | 'warning';
  field: string;
  message: string;
  recordId?: string;
}

export interface ValidationReport {
  isValid: boolean;

  errors: ValidationIssue[];
  warnings: ValidationIssue[];

  totalFestivals: number;
  verifiedFestivals: number;

  totalSources: number;
  verifiedSources: number;

  totalEditions: number;
}

export interface DetailedQualityReport {
  totalFestivals: number;
  verifiedFestivals: number;
  pendingFestivals: number;
  draftFestivals: number;

  totalSources: number;

  officialSourcesCount: number;
  researchSourcesCount: number;
  communitySourcesCount: number;
  referenceSourcesCount: number;

  totalEditions: number;

  festivalsMissingSources: {
    festival: Festival;
    currentSourceCount: number;
    reason: string;
  }[];

  unpublishableRecords: {
    festival: Festival;
    reasons: string[];
  }[];

  brokenSourceReferences: {
    festivalId: string;
    missingSourceId: string;
  }[];

  brokenEditionReferences: {
    editionId: string;
    missingFestivalId: string;
  }[];
}

export interface HeritageDataBundle {
  version: string;
  exportedAt: string;
  projectCode: string;

  festivals: Festival[];
  editions: FestivalEdition[];
  sources: HeritageSource[];
}

export interface ComparisonCriterion {
  key: string;
  label: string;

  val1: string | string[];
  val2: string | string[];

  status:
    | 'identical'
    | 'different'
    | 'partial'
    | 'insufficient_data';

  notes?: string;
}

export interface ComparisonReport {
  festival1: Festival;
  festival2: Festival;

  sources1: HeritageSource[];
  sources2: HeritageSource[];

  criteria: ComparisonCriterion[];

  similarities: {
    key: string;
    label: string;
    value: string;
    detail: string;
  }[];

  differences: {
    key: string;
    label: string;
    val1: string;
    val2: string;
    detail: string;
  }[];

  isSamePracticeGroup: boolean;
  canCompare: boolean;
  warningNotice?: string;
}

export interface FestivalFilters {
  searchTerm: string;
  province: string;
  practiceGroup: string;
  year: string;
  verificationStatus: string;
}

export interface HeritageAssistantResponse {
  answer: string;
  citations: string[];
  relatedFestivalIds: string[];

  status:
    | 'ready'
    | 'preparing'
    | 'error';
}
