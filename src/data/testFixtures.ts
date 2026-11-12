/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * ============================================================================
 * TỆP FIXTURE KIỂM THỬ KỸ THUẬT (TECHNICAL TEST FIXTURES ONLY)
 * CẢNH BÁO: Đây CHỈ là bộ dữ liệu cấu trúc phục vụ kiểm thử đơn vị, kiểm tra logic
 * thuật toán so sánh và quy trình thẩm định trong giai đoạn phát triển phần mềm.
 * KHÔNG PHẢI TƯ LIỆU LỊCH SỬ CHÍNH THỨC CỦA DỰ ÁN HỘI SẮC VIỆT.
 * Dữ liệu chính thức nằm tại festivals.json, editions.json và sources.json.
 * ============================================================================
 */

import { Festival, FestivalEdition, HeritageSource } from '../types/heritage';

export const TEST_FIXTURE_SOURCES: HeritageSource[] = [
  {
    id: 'src-test-01',
    title: 'Hồ sơ Di sản văn hoá phi vật thể quốc gia Lễ hội đua thuyền truyền thống (Tài liệu kiểm thử)',
    authorOrOrganization: 'Cục Di sản văn hoá - Bộ Văn hoá, Thể thao và Du lịch',
    type: 'official',
    url: null,
    publicationDate: '2021-05-15',
    accessedAt: '2026-11-01',
    description: 'Hồ sơ khoa học lưu trữ kiểm thử kỹ thuật số 01.',
    usageRights: 'Tài liệu hành chính lưu trữ phục vụ nghiên cứu',
  },
  {
    id: 'src-test-02',
    title: 'Nghi lễ thờ cúng và lễ hội sông nước miền Trung (Tài liệu kiểm thử)',
    authorOrOrganization: 'Viện Văn hoá Nghệ thuật Quốc gia Việt Nam',
    type: 'research',
    url: null,
    publicationDate: '2019-10-20',
    accessedAt: '2026-11-01',
    description: 'Công trình nghiên cứu nhân học văn hoá kiểm thử kỹ thuật số 02.',
    usageRights: 'Trích dẫn mục đích học thuật phi thương mại',
  },
  {
    id: 'src-test-03',
    title: 'Hương ước và tục bơi đua thuyền tứ linh vùng ven biển (Tài liệu kiểm thử)',
    authorOrOrganization: 'Ban Quản lý Di tích Địa phương & Hội đồng Trưởng lão',
    type: 'community',
    url: null,
    publicationDate: '2018-02-12',
    accessedAt: '2026-11-01',
    description: 'Tư liệu dân gian ghi chép truyền khẩu và quy ước làng xã kiểm thử kỹ thuật số 03.',
    usageRights: 'Bảo tồn di sản cộng đồng chủ thể',
  },
  {
    id: 'src-test-04',
    title: 'Tục đua ghe Ngo trong lễ hội Ok Om Bok của đồng bào Khmer Nam Bộ (Tài liệu kiểm thử)',
    authorOrOrganization: 'Sở Văn hoá, Thể thao và Du lịch Sóc Trăng',
    type: 'official',
    url: null,
    publicationDate: '2022-11-08',
    accessedAt: '2026-11-01',
    description: 'Kỷ yếu nghiên cứu thực hành văn hoá tôn giáo Khmer kiểm thử.',
    usageRights: 'Tài liệu phổ biến văn hoá',
  },
  {
    id: 'src-test-05',
    title: 'Khảo sát tín ngưỡng thờ nước và tục đua thuyền Nam Bộ (Tài liệu kiểm thử)',
    authorOrOrganization: 'Tạp chí Nghiên cứu Dân tộc học',
    type: 'research',
    url: null,
    publicationDate: '2020-06-15',
    accessedAt: '2026-11-01',
    description: 'Khảo luận chuyên ngành về nghi thức đua thuyền phương Nam.',
    usageRights: 'Trích dẫn học thuật',
  },
  {
    id: 'src-test-06',
    title: 'Quy ước trang trí ghe Ngo và luật tục chùa Khmer (Tài liệu kiểm thử)',
    authorOrOrganization: 'Hội đồng Sư cả Chùa Kh’leang',
    type: 'community',
    url: null,
    publicationDate: '2017-08-30',
    accessedAt: '2026-11-01',
    description: 'Bản quy ước ghi chép nội bộ nhà chùa.',
    usageRights: 'Cộng đồng sở hữu',
  },
];

export const TEST_FIXTURE_FESTIVALS: Festival[] = [
  {
    id: 'fest-test-01',
    officialName: '[Kiểm thử] Lễ hội Đua thuyền Tứ linh Đảo Lý Sơn',
    alternativeNames: ['Hội đua thuyền truyền thống Lý Sơn', 'Hội đua thuyền Tứ linh'],
    practiceGroup: 'Duyên hải Nam Trung Bộ & Đảo biển',
    province: 'Quảng Ngãi',
    location: 'Huyện đảo Lý Sơn, tỉnh Quảng Ngãi',
    community: 'Cộng đồng cư dân tiền tiêu đất đảo Lý Sơn',
    culturalContext: 'Tín ngưỡng tạ ơn thần linh, tưởng nhớ Đội hùng binh Hoàng Sa kiêm quản Bắc Hải, cầu quốc thái dân an, biển yên sóng lặng.',
    origin: 'Khoảng thế kỷ XVII-XVIII gắn với quá trình khai hoang và hoạt động của Đội Hoàng Sa.',
    rituals: [
      'Lễ tế cáo thần linh tại đình làng An Hải và đình làng An Vĩnh',
      'Lễ cáo thần sông biển, hạ thuỷ bốn chiếc thuyền Tứ linh (Long, Lân, Quy, Phụng)',
      'Lễ tạ thần và hoàn sắc sau khi kết thúc cuộc đua'
    ],
    activities: [
      'Bơi đua thuyền 4 con giáp Tứ linh trên luồng lạch biển',
      'Cổ vũ theo thuyền đại diện giáp xóm làng',
      'Hát bả trạo và sinh hoạt văn hoá dân gian biển'
    ],
    characteristics: [
      'Thuyền mang hình tượng tứ linh chạm khắc tinh xảo',
      'Đua trực tiếp trên mặt biển ngoài khơi gần rạn san hô',
      'Gắn liền với ký ức lịch sử về hải đội Hoàng Sa'
    ],
    heritageStatus: 'Di sản văn hoá phi vật thể quốc gia (Năm 2020)',
    sourceIds: ['src-test-01', 'src-test-02', 'src-test-03'],
    verificationStatus: 'verified',
    imageIds: [],
    createdAt: '2026-11-01T00:00:00Z',
    updatedAt: '2026-11-01T00:00:00Z',
  },
  {
    id: 'fest-test-02',
    officialName: '[Kiểm thử] Lễ hội Đua ghe Ngo Sóc Trăng (Lễ hội Ok Om Bok)',
    alternativeNames: ['Đua ghe Ngo Chơ-rôi Tum-núp', 'Lễ hội Đua ghe Ngo đồng bào Khmer'],
    practiceGroup: 'Đồng bằng sông Cửu Long',
    province: 'Sóc Trăng',
    location: 'Sông Maspero, thành phố Sóc Trăng, tỉnh Sóc Trăng',
    community: 'Cộng đồng người Khmer Nam Bộ',
    culturalContext: 'Lễ tạ ơn thần Mặt Trăng (Thần Nước và Thần Đất) sau mùa thu hoạch lúa nước, cầu chúc mùa màng tươi tốt ấm no.',
    origin: 'Tín ngưỡng nông nghiệp lúa nước kết hợp Phật giáo Nam tông Khmer lâu đời.',
    rituals: [
      'Lễ cúng Thần Mặt Trăng (Đút cốm dẹp Om Bok)',
      'Lễ hạ thuỷ ghe Ngo (Lễ mở mắt ghe tại chùa)',
      'Nghi thức tụng kinh cầu bình an và may mắn cho các tay bơi trước khi xuất quân'
    ],
    activities: [
      'Đua ghe Ngo nam và nữ trên đường đua 1.200m và 1.000m',
      'Thả đèn gió (Lôi Protip) và đèn nước trên sông rực rỡ',
      'Trình diễn ca múa nhạc Rô-băm, Dù-kê dân gian Khmer'
    ],
    characteristics: [
      'Thân ghe Ngo dài gần 30 mét, chạm khắc rắn thần Naga linh thiêng',
      'Mỗi ghe do một ngôi chùa Khmer bảo tồn và cử đội bơi đại diện',
      'Quy mô hàng chục ngàn người cổ vũ dọc đôi bờ sông Maspero'
    ],
    heritageStatus: 'Di sản văn hoá phi vật thể quốc gia (Năm 2014)',
    sourceIds: ['src-test-04', 'src-test-05', 'src-test-06'],
    verificationStatus: 'verified',
    imageIds: [],
    createdAt: '2026-11-01T00:00:00Z',
    updatedAt: '2026-11-01T00:00:00Z',
  },
];

export const TEST_FIXTURE_EDITIONS: FestivalEdition[] = [
  {
    id: 'ed-test-01',
    festivalId: 'fest-test-01',
    year: 2026,
    lunarDate: 'Mùng 4 đến mùng 8 tháng Giêng âm lịch',
    solarStartDate: '2026-02-20',
    solarEndDate: '2026-02-24',
    venue: 'Vùng biển trước đình An Hải, đảo Lý Sơn, tỉnh Quảng Ngãi',
    notes: 'Kỳ hội mừng xuân Bính Ngọ và tưởng nhớ tiền hiền khai khẩn.',
    sourceIds: ['src-test-01', 'src-test-03'],
    verificationStatus: 'verified',
  },
  {
    id: 'ed-test-02',
    festivalId: 'fest-test-02',
    year: 2026,
    lunarDate: 'Rằm tháng 10 âm lịch (14-15/10 âm lịch)',
    solarStartDate: '2026-11-23',
    solarEndDate: '2026-11-24',
    venue: 'Đường đua sông Maspero, TP. Sóc Trăng',
    notes: 'Kỳ hội Ok Om Bok truyền thống cấp khu vực ĐBSCL.',
    sourceIds: ['src-test-04', 'src-test-05'],
    verificationStatus: 'verified',
  },
];
