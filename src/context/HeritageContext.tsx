
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * HỘI SẮC VIỆT - D04
 * Quản lý dữ liệu di sản toàn ứng dụng.
 *
 * Chỉ hồ sơ đủ điều kiện mới được công bố.
 * Dữ liệu kiểm thử không được dùng làm dữ liệu chính thức.
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import type {
  DetailedQualityReport,
  Festival,
  FestivalEdition,
  FestivalFilters,
  HeritageDataBundle,
  HeritageSource,
  ValidationReport,
} from '../types/heritage';

import officialFestivals from '../data/festivals.json';
import officialEditions from '../data/editions.json';
import officialSources from '../data/sources.json';

import {
  canPublishFestival,
  generateQualityReport,
  isVerifiedSource,
  validateHeritageData,
} from '../utils/validation';

type Result = {
  success: boolean;
  message: string;
};

interface HeritageContextType {
  festivals: Festival[];
  verifiedFestivals: Festival[];
  editions: FestivalEdition[];
  sources: HeritageSource[];
  validationReport: ValidationReport;
  detailedQualityReport: DetailedQualityReport;

  comparisonSlots: [string | null, string | null];
  addToComparison: (id: string) => boolean;
  removeFromComparison: (index: 0 | 1) => void;
  removeFestivalFromComparison: (id: string) => void;
  swapComparisonSlots: () => void;
  clearComparison: () => void;
  isFestivalSelected: (id: string) => boolean;

  filters: FestivalFilters;
  setSearchTerm: (term: string) => void;
  setFilter: <K extends keyof FestivalFilters>(
    key: K,
    value: FestivalFilters[K]
  ) => void;
  resetFilters: () => void;

  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;

  useTestFixtures: boolean;
  setUseTestFixtures: (value: boolean) => void;

  importDataBundle: (bundle: HeritageDataBundle) => Result;
  importFestivals: (list: Festival[]) => Result;
  importEditions: (list: FestivalEdition[]) => Result;
  importSources: (list: HeritageSource[]) => Result;

  addFestival: (festival: Festival) => void;
  updateFestival: (festival: Festival) => void;
  deleteFestival: (id: string) => void;

  addEdition: (edition: FestivalEdition) => void;
  updateEdition: (edition: FestivalEdition) => void;
  deleteEdition: (id: string) => void;

  addSource: (source: HeritageSource) => void;
  updateSource: (source: HeritageSource) => void;
  deleteSource: (id: string) => void;

  verifyFestival: (
    id: string,
    checked: boolean,
    notes?: string
  ) => Result;

  resetToEmptyOfficial: () => void;
  hasCustomData: boolean;
}

const defaultFilters: FestivalFilters = {
  searchTerm: '',
  province: '',
  practiceGroup: '',
  year: '',
  verificationStatus: '',
};

const HeritageContext =
  createContext<HeritageContextType | undefined>(undefined);

const KEYS = {
  festivals: 'hoi_sac_viet_custom_festivals',
  editions: 'hoi_sac_viet_custom_editions',
  sources: 'hoi_sac_viet_custom_sources',
  comparison: 'hoi_sac_viet_comparison',
};

function readStoredArray<T>(key: string): T[] | null {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return null;
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed as T[] : null;
  } catch {
    return null;
  }
}

function saveStoredArray<T>(
  key: string,
  value: T[] | null
): void {
  try {
    if (value === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch {
    // Trình duyệt có thể chặn lưu trữ.
  }
}

function readComparison(): [string | null, string | null] {
  try {
    const raw = sessionStorage.getItem(KEYS.comparison);
    if (!raw) return [null, null];

    const value: unknown = JSON.parse(raw);

    if (
      Array.isArray(value) &&
      value.length === 2 &&
      value.every(
        v => v === null || typeof v === 'string'
      )
    ) {
      return [
        value[0] as string | null,
        value[1] as string | null,
      ];
    }
  } catch {
    // Dữ liệu phiên không hợp lệ.
  }

  return [null, null];
}

function getErrorMessage(report: ValidationReport): string {
  return report.errors
    .slice(0, 5)
    .map(error => `- ${error.message}`)
    .join('\n');
}

function validateImport(
  festivals: Festival[],
  editions: FestivalEdition[],
  sources: HeritageSource[]
): Result {
  const report = validateHeritageData(
    festivals,
    editions,
    sources
  );

  if (!report.isValid) {
    return {
      success: false,
      message:
        `Phát hiện ${report.errors.length} lỗi dữ liệu:\n` +
        getErrorMessage(report),
    };
  }

  return {
    success: true,
    message: 'Dữ liệu hợp lệ.',
  };
}

export const HeritageProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [customFestivals, setCustomFestivals] =
    useState<Festival[] | null>(() =>
      readStoredArray<Festival>(KEYS.festivals)
    );

  const [customEditions, setCustomEditions] =
    useState<FestivalEdition[] | null>(() =>
      readStoredArray<FestivalEdition>(KEYS.editions)
    );

  const [customSources, setCustomSources] =
    useState<HeritageSource[] | null>(() =>
      readStoredArray<HeritageSource>(KEYS.sources)
    );

  const [comparisonSlots, setComparisonSlots] =
    useState<[string | null, string | null]>(
      readComparison
    );

  const [filters, setFilters] =
    useState<FestivalFilters>(defaultFilters);

  const [isMobileMenuOpen, setIsMobileMenuOpen] =
    useState(false);

  // Giữ API tương thích, nhưng không cho bật dữ liệu
  // kiểm thử trong hệ thống công khai.
  const useTestFixtures = false;

  const setUseTestFixtures = (_value: boolean) => {
    // Cố ý không kích hoạt dữ liệu kiểm thử.
  };

  useEffect(() => {
    saveStoredArray(KEYS.festivals, customFestivals);
  }, [customFestivals]);

  useEffect(() => {
    saveStoredArray(KEYS.editions, customEditions);
  }, [customEditions]);

  useEffect(() => {
    saveStoredArray(KEYS.sources, customSources);
  }, [customSources]);

  useEffect(() => {
    try {
      sessionStorage.setItem(
        KEYS.comparison,
        JSON.stringify(comparisonSlots)
      );
    } catch {
      // Không ảnh hưởng chức năng chính.
    }
  }, [comparisonSlots]);

  const festivals = useMemo<Festival[]>(
    () =>
      customFestivals ??
      (officialFestivals as Festival[]),
    [customFestivals]
  );

  const editions = useMemo<FestivalEdition[]>(
    () =>
      customEditions ??
      (officialEditions as FestivalEdition[]),
    [customEditions]
  );

  const sources = useMemo<HeritageSource[]>(
    () =>
      customSources ??
      (officialSources as HeritageSource[]),
    [customSources]
  );

  // Chỉ trả về hồ sơ thực sự đủ điều kiện.
  const verifiedFestivals = useMemo(
    () =>
      festivals.filter(festival =>
        canPublishFestival(festival, sources)
      ),
    [festivals, sources]
  );

  const validationReport = useMemo(
    () => validateHeritageData(
      festivals,
      editions,
      sources
    ),
    [festivals, editions, sources]
  );

  const detailedQualityReport = useMemo(
    () => generateQualityReport(
      festivals,
      editions,
      sources
    ),
    [festivals, editions, sources]
  );

  const hasCustomData =
    customFestivals !== null ||
    customEditions !== null ||
    customSources !== null;

  // Xóa lựa chọn so sánh không còn đủ điều kiện.
  useEffect(() => {
    const allowed = new Set(
      verifiedFestivals.map(f => f.id)
    );

    setComparisonSlots(previous => {
      const next: [string | null, string | null] = [
        previous[0] && allowed.has(previous[0])
          ? previous[0]
          : null,
        previous[1] && allowed.has(previous[1])
          ? previous[1]
          : null,
      ];

      return (
        next[0] === previous[0] &&
        next[1] === previous[1]
      ) ? previous : next;
    });
  }, [verifiedFestivals]);

  // NHẬP DỮ LIỆU

  const importDataBundle = (
    bundle: HeritageDataBundle
  ): Result => {
    if (
      !bundle ||
      !Array.isArray(bundle.festivals) ||
      !Array.isArray(bundle.editions) ||
      !Array.isArray(bundle.sources)
    ) {
      return {
        success: false,
        message: 'Gói dữ liệu không đúng định dạng.',
      };
    }

    const result = validateImport(
      bundle.festivals,
      bundle.editions,
      bundle.sources
    );

    if (!result.success) return result;

    setCustomFestivals(bundle.festivals);
    setCustomEditions(bundle.editions);
    setCustomSources(bundle.sources);

    return {
      success: true,
      message:
        `Đã nhập ${bundle.festivals.length} hồ sơ, ` +
        `${bundle.editions.length} kỳ tổ chức và ` +
        `${bundle.sources.length} nguồn tư liệu.`,
    };
  };

  const importFestivals = (list: Festival[]): Result => {
    if (!Array.isArray(list)) {
      return {
        success: false,
        message: 'Danh sách hồ sơ không hợp lệ.',
      };
    }

    const result = validateImport(
      list,
      editions,
      sources
    );

    if (!result.success) return result;

    setCustomFestivals(list);

    return {
      success: true,
      message: `Đã nhập ${list.length} hồ sơ lễ hội.`,
    };
  };

  const importEditions = (
    list: FestivalEdition[]
  ): Result => {
    if (!Array.isArray(list)) {
      return {
        success: false,
        message: 'Danh sách kỳ tổ chức không hợp lệ.',
      };
    }

    const result = validateImport(
      festivals,
      list,
      sources
    );

    if (!result.success) return result;

    setCustomEditions(list);

    return {
      success: true,
      message: `Đã nhập ${list.length} kỳ tổ chức.`,
    };
  };

  const importSources = (
    list: HeritageSource[]
  ): Result => {
    if (!Array.isArray(list)) {
      return {
        success: false,
        message: 'Danh sách nguồn không hợp lệ.',
      };
    }

    const result = validateImport(
      festivals,
      editions,
      list
    );

    if (!result.success) return result;

    setCustomSources(list);

    return {
      success: true,
      message: `Đã nhập ${list.length} nguồn tư liệu.`,
    };
  };

  // CRUD HỒ SƠ

  const addFestival = (festival: Festival) => {
    if (festivals.some(f => f.id === festival.id)) return;

    const next = [...festivals, festival];
    if (validateImport(next, editions, sources).success) {
      setCustomFestivals(next);
    }
  };

  const updateFestival = (festival: Festival) => {
    if (!festivals.some(f => f.id === festival.id)) return;

    const next = festivals.map(f =>
      f.id === festival.id ? festival : f
    );

    if (validateImport(next, editions, sources).success) {
      setCustomFestivals(next);
    }
  };

  const deleteFestival = (id: string) => {
    // Không xóa hồ sơ còn kỳ tổ chức liên kết.
    if (editions.some(e => e.festivalId === id)) return;

    setCustomFestivals(previous =>
      (previous ?? festivals).filter(f => f.id !== id)
    );

    setComparisonSlots(previous => [
      previous[0] === id ? null : previous[0],
      previous[1] === id ? null : previous[1],
    ]);
  };

  // CRUD KỲ TỔ CHỨC

  const addEdition = (edition: FestivalEdition) => {
    if (editions.some(e => e.id === edition.id)) return;

    const next = [...editions, edition];
    if (validateImport(festivals, next, sources).success) {
      setCustomEditions(next);
    }
  };

  const updateEdition = (edition: FestivalEdition) => {
    if (!editions.some(e => e.id === edition.id)) return;

    const next = editions.map(e =>
      e.id === edition.id ? edition : e
    );

    if (validateImport(festivals, next, sources).success) {
      setCustomEditions(next);
    }
  };

  const deleteEdition = (id: string) => {
    setCustomEditions(previous =>
      (previous ?? editions).filter(e => e.id !== id)
    );
  };

  // CRUD NGUỒN TƯ LIỆU

  const addSource = (source: HeritageSource) => {
    if (sources.some(s => s.id === source.id)) return;

    const next = [...sources, source];
    if (validateImport(festivals, editions, next).success) {
      setCustomSources(next);
    }
  };

  const updateSource = (source: HeritageSource) => {
    if (!sources.some(s => s.id === source.id)) return;

    const next = sources.map(s =>
      s.id === source.id ? source : s
    );

    if (validateImport(festivals, editions, next).success) {
      setCustomSources(next);
    }
  };

  const deleteSource = (id: string) => {
    // Không xóa nguồn đang được hồ sơ hoặc kỳ tổ chức sử dụng.
    const inFestival = festivals.some(f =>
      f.sourceIds?.includes(id)
    );

    const inEdition = editions.some(e =>
      e.sourceIds?.includes(id)
    );

    if (inFestival || inEdition) return;

    setCustomSources(previous =>
      (previous ?? sources).filter(s => s.id !== id)
    );
  };

  // THẨM ĐỊNH HỒ SƠ

  const verifyFestival = (
    id: string,
    checked: boolean,
    notes?: string
  ): Result => {
    const festival = festivals.find(f => f.id === id);

    if (!festival) {
      return {
        success: false,
        message: 'Không tìm thấy hồ sơ.',
      };
    }

    const ids = [
      ...new Set(festival.sourceIds || []),
    ];

    const linkedSources = ids
      .map(sourceId =>
        sources.find(s => s.id === sourceId)
      )
      .filter((s): s is HeritageSource => Boolean(s));

    const verifiedSources = linkedSources.filter(
      isVerifiedSource
    );

    if (
      ids.length < 3 ||
      linkedSources.length !== ids.length ||
      verifiedSources.length !== ids.length
    ) {
      return {
        success: false,
        message:
          `Hồ sơ có ${verifiedSources.length} nguồn ` +
          'đáp ứng điều kiện xác minh. ' +
          'Cần tối thiểu 3 nguồn phù hợp, ' +
          'được kiểm tra và đối chiếu trực tiếp.',
      };
    }

    if (!checked) {
      return {
        success: false,
        message:
          'Quản trị viên chưa xác nhận đối chiếu tài liệu gốc.',
      };
    }

    if (!notes?.trim()) {
      return {
        success: false,
        message:
          'Vui lòng ghi rõ căn cứ và kết quả thẩm định.',
      };
    }

    const now = new Date().toISOString();

    const updated: Festival = {
      ...festival,
      verificationStatus: 'verified',
      contentCheckedAgainstOriginal: true,
      adminReviewNotes: notes.trim(),
      lastReviewedAt: now,
      updatedAt: now,
    };

    if (!canPublishFestival(updated, sources)) {
      return {
        success: false,
        message:
          'Hồ sơ chưa đáp ứng đầy đủ điều kiện công bố.',
      };
    }

    const next = festivals.map(f =>
      f.id === id ? updated : f
    );

    const result = validateImport(
      next,
      editions,
      sources
    );

    if (!result.success) return result;

    setCustomFestivals(next);

    return {
      success: true,
      message:
        `Hồ sơ "${festival.officialName}" ` +
        'đã được ghi nhận phê duyệt.',
    };
  };

  // SO SÁNH

  const addToComparison = (id: string): boolean => {
    if (!verifiedFestivals.some(f => f.id === id)) {
      return false;
    }

    if (comparisonSlots.includes(id)) return false;

    if (!comparisonSlots[0]) {
      setComparisonSlots([
        id,
        comparisonSlots[1],
      ]);
    } else if (!comparisonSlots[1]) {
      setComparisonSlots([
        comparisonSlots[0],
        id,
      ]);
    } else {
      setComparisonSlots([
        comparisonSlots[0],
        id,
      ]);
    }

    return true;
  };

  const removeFromComparison = (index: 0 | 1) => {
    setComparisonSlots(previous => {
      const next: [string | null, string | null] = [
        ...previous,
      ];
      next[index] = null;
      return next;
    });
  };

  const removeFestivalFromComparison = (id: string) => {
    setComparisonSlots(previous => [
      previous[0] === id ? null : previous[0],
      previous[1] === id ? null : previous[1],
    ]);
  };

  const swapComparisonSlots = () => {
    setComparisonSlots(previous => [
      previous[1],
      previous[0],
    ]);
  };

  const clearComparison = () => {
    setComparisonSlots([null, null]);
  };

  const isFestivalSelected = (id: string): boolean =>
    comparisonSlots.includes(id);

  // TÌM KIẾM VÀ BỘ LỌC

  const setSearchTerm = (term: string) => {
    setFilters(previous => ({
      ...previous,
      searchTerm: term,
    }));
  };

  const setFilter = <K extends keyof FestivalFilters>(
    key: K,
    value: FestivalFilters[K]
  ) => {
    setFilters(previous => ({
      ...previous,
      [key]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({ ...defaultFilters });
  };

  // KHÔI PHỤC DỮ LIỆU TỪ FILE GỐC
  // Không xóa nội dung festivals.json, sources.json
  // hoặc editions.json trong dự án.

  const resetToEmptyOfficial = () => {
    setCustomFestivals(null);
    setCustomEditions(null);
    setCustomSources(null);
    setComparisonSlots([null, null]);
  };

  const value: HeritageContextType = {
    festivals,
    verifiedFestivals,
    editions,
    sources,
    validationReport,
    detailedQualityReport,

    comparisonSlots,
    addToComparison,
    removeFromComparison,
    removeFestivalFromComparison,
    swapComparisonSlots,
    clearComparison,
    isFestivalSelected,

    filters,
    setSearchTerm,
    setFilter,
    resetFilters,

    isMobileMenuOpen,
    setIsMobileMenuOpen,

    useTestFixtures,
    setUseTestFixtures,

    importDataBundle,
    importFestivals,
    importEditions,
    importSources,

    addFestival,
    updateFestival,
    deleteFestival,

    addEdition,
    updateEdition,
    deleteEdition,

    addSource,
    updateSource,
    deleteSource,

    verifyFestival,
    resetToEmptyOfficial,
    hasCustomData,
  };

  return (
    <HeritageContext.Provider value={value}>
      {children}
    </HeritageContext.Provider>
  );
};

export function useHeritage(): HeritageContextType {
  const context = useContext(HeritageContext);

  if (!context) {
    throw new Error(
      'useHeritage must be used within a HeritageProvider'
    );
  }

  return context;
}
