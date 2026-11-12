/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Bảng đối sánh di sản đa tiêu chí (Heritage Comparison Table & Analysis)
 * Hỗ trợ xuất kết quả dưới dạng văn bản và in/lưu PDF qua window.print()
 */

import React, { useState } from 'react';
import { Copy, Printer, Check, AlertTriangle, Layers, BookCheck } from 'lucide-react';
import { ComparisonReport } from '../../types/heritage';

interface Props {
  report: ComparisonReport;
}

export const ComparisonTable: React.FC<Props> = ({ report }) => {
  const [copied, setCopied] = useState(false);

  const { festival1: f1, festival2: f2, criteria, similarities, differences, sources1, sources2, warningNotice } = report;

  // Xử lý sao chép văn bản đầy đủ kèm nguồn tham chiếu
  const handleCopyText = async () => {
    let text = `BẢO TÀNG SỐ HỘI SẮC VIỆT - KẾT QUẢ ĐỐI SÁNH THỰC HÀNH LỄ HỘI ĐUA THUYỀN\n`;
    text += `Đề tài D04: So sánh thực hành lễ hội đua thuyền truyền thống tại các địa phương Việt Nam\n`;
    text += `Người thực hiện: Vũ Hoàng Hiệp - MSSV: PH64339 - Nhóm 2 - IMTA TECH × FPT Polytechnic\n`;
    text += `======================================================================\n\n`;
    text += `LỄ HỘI A: ${f1.officialName} (${f1.province})\n`;
    text += `LỄ HỘI B: ${f2.officialName} (${f2.province})\n\n`;

    text += `I. CÁC TIÊU CHÍ ĐỐI SÁNH CHI TIẾT:\n`;
    criteria.forEach((c, idx) => {
      const v1 = Array.isArray(c.val1) ? c.val1.join('; ') : c.val1;
      const v2 = Array.isArray(c.val2) ? c.val2.join('; ') : c.val2;
      text += `[${idx + 1}] ${c.label}:\n`;
      text += `  - Lễ hội A: ${v1}\n`;
      text += `  - Lễ hội B: ${v2}\n`;
      text += `  - Đánh giá: ${
        c.status === 'identical'
          ? 'Tương đồng'
          : c.status === 'different'
          ? 'Khác biệt'
          : c.status === 'partial'
          ? 'Giao thoa một phần'
          : 'Chưa đủ tư liệu để kết luận'
      }\n\n`;
    });

    text += `II. TỔNG HỢP ĐIỂM TƯƠNG ĐỒNG:\n`;
    if (similarities.length > 0) {
      similarities.forEach(s => {
        text += `- ${s.label}: ${s.detail}\n`;
      });
    } else {
      text += `- Chưa ghi nhận điểm tương đồng tuyệt đối trên các tiêu chí chuẩn hoá.\n`;
    }

    text += `\nIII. TỔNG HỢP ĐIỂM KHÁC BIỆT:\n`;
    if (differences.length > 0) {
      differences.forEach(d => {
        text += `- ${d.label}: ${d.detail}\n`;
      });
    } else {
      text += `- Chưa ghi nhận điểm khác biệt lớn.\n`;
    }

    text += `\nIV. NGUỒN TƯ LIỆU THAM CHIẾU XÁC MINH:\n`;
    text += `* Nguồn của ${f1.officialName}:\n`;
    sources1.forEach(s => {
      text += `  + ${s.title} (${s.authorOrOrganization}, ${s.publicationDate || 'Không rõ năm'})\n`;
    });
    text += `* Nguồn của ${f2.officialName}:\n`;
    sources2.forEach(s => {
      text += `  + ${s.title} (${s.authorOrOrganization}, ${s.publicationDate || 'Không rõ năm'})\n`;
    });

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Bỏ qua nếu môi trường chặn clipboard
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Tiêu đề in chuyên dụng (chỉ xuất hiện khi in trang) */}
      <div className="hidden print:block mb-6 border-b pb-4">
        <h1 className="text-2xl font-serif font-bold text-black">
          HỘI SẮC VIỆT – BÁO CÁO ĐỐI SÁNH THỰC HÀNH LỄ HỘI ĐUA THUYỀN
        </h1>
        <p className="text-xs text-gray-700 mt-1">
          Mã đề tài: D04 · Người thực hiện: Vũ Hoàng Hiệp (MSSV: PH64339, Nhóm 2) · IMTA TECH × FPT Polytechnic
        </p>
      </div>

      {/* Cảnh báo học thuật nếu khác nhóm văn hoá */}
      {warningNotice && (
        <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs md:text-sm flex items-start gap-3 leading-relaxed">
          <AlertTriangle className="w-5 h-5 shrink-0 text-amber-700 mt-0.5" />
          <p>{warningNotice}</p>
        </div>
      )}

      {/* Thanh hành động xuất kết quả */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-white border border-[#E7DED0] shadow-xs no-print">
        <div className="flex items-center gap-2 text-xs text-[#746C61]">
          <span className="font-semibold text-[#183E3A]">Hồ sơ đối chiếu:</span>
          <span>{f1.officialName}</span>
          <span className="text-[#C5A36B] font-bold">vs</span>
          <span>{f2.officialName}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyText}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-[#E7DED0] bg-white text-[#292623] hover:border-[#8F2724] hover:text-[#8F2724] transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Đã sao chép văn bản' : 'Sao chép kết quả'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#183E3A] text-white hover:bg-[#235550] transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>In / Lưu PDF</span>
          </button>
        </div>
      </div>

      {/* KHỐI PHÂN TÍCH TƯƠNG ĐỒNG & KHÁC BIỆT (Section 8.4) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Khối Điểm Tương Đồng */}
        <div className="p-6 rounded-xl bg-white border border-[#E7DED0] shadow-xs">
          <div className="flex items-center gap-2 pb-3 mb-4 border-b border-[#E7DED0]">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <h3 className="font-serif text-base font-bold text-[#183E3A]">
              Điểm tương đồng (Dựa trên dữ liệu chuẩn hoá)
            </h3>
          </div>

          {similarities.length > 0 ? (
            <ul className="space-y-3">
              {similarities.map((item, idx) => (
                <li key={idx} className="text-xs md:text-sm text-[#292623] leading-relaxed flex items-start gap-2">
                  <span className="text-emerald-700 font-bold shrink-0">✓</span>
                  <div>
                    <strong className="text-[#183E3A]">{item.label}:</strong> {item.detail}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-[#746C61] italic py-3">
              Chưa ghi nhận điểm tương đồng tuyệt đối trên các trường dữ liệu có cấu trúc.
            </p>
          )}
        </div>

        {/* Khối Điểm Khác Biệt */}
        <div className="p-6 rounded-xl bg-white border border-[#E7DED0] shadow-xs">
          <div className="flex items-center gap-2 pb-3 mb-4 border-b border-[#E7DED0]">
            <div className="w-2.5 h-2.5 rounded-full bg-[#8F2724]" />
            <h3 className="font-serif text-base font-bold text-[#183E3A]">
              Điểm khác biệt & Sắc thái địa phương
            </h3>
          </div>

          {differences.length > 0 ? (
            <ul className="space-y-3">
              {differences.map((item, idx) => (
                <li key={idx} className="text-xs md:text-sm text-[#292623] leading-relaxed flex items-start gap-2">
                  <span className="text-[#8F2724] font-bold shrink-0">◆</span>
                  <div>
                    <strong className="text-[#183E3A]">{item.label}:</strong> {item.detail}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-[#746C61] italic py-3">
              Chưa ghi nhận điểm khác biệt rõ nét trên các tiêu chí kiểm chứng.
            </p>
          )}
        </div>
      </div>

      {/* BẢNG SO SÁNH HAI CỘT ĐẶT CẠNH NHAU (Desktop) & THẺ CRITERIA (Mobile) */}
      <div className="bg-white rounded-xl border border-[#E7DED0] shadow-xs overflow-hidden print-full-width">
        <div className="p-4 bg-[#F8F4EA] border-b border-[#E7DED0] flex items-center justify-between">
          <h3 className="font-serif text-base font-bold text-[#183E3A] flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#C5A36B]" />
            <span>Bảng đối sánh các trường thông tin di sản</span>
          </h3>
          <span className="text-[11px] text-[#746C61]">
            {criteria.length} tiêu chí đối chiếu
          </span>
        </div>

        {/* Bảng dạng Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm border-collapse">
            <thead>
              <tr className="bg-[#183E3A] text-white">
                <th className="py-3 px-4 w-1/4 font-semibold text-xs tracking-wider uppercase">
                  Tiêu chí đối sánh
                </th>
                <th className="py-3 px-4 w-[37.5%] font-serif font-bold text-sm bg-[#183E3A]">
                  {f1.officialName}
                  <span className="block text-[11px] font-sans font-normal text-[#C5A36B]">
                    {f1.province}
                  </span>
                </th>
                <th className="py-3 px-4 w-[37.5%] font-serif font-bold text-sm bg-[#235550]">
                  {f2.officialName}
                  <span className="block text-[11px] font-sans font-normal text-[#C5A36B]">
                    {f2.province}
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7DED0]">
              {criteria.map((c, idx) => {
                const isIdentical = c.status === 'identical';
                const isInsufficient = c.status === 'insufficient_data';
                return (
                  <tr
                    key={c.key}
                    className={`hover:bg-[#F8F4EA]/40 transition-colors ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-[#F8F4EA]/20'
                    }`}
                  >
                    <td className="py-3.5 px-4 font-medium text-[#183E3A] align-top border-r border-[#E7DED0]">
                      <div className="flex items-center justify-between">
                        <span>{c.label}</span>
                        {isIdentical && (
                          <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">
                            Trùng khớp
                          </span>
                        )}
                        {isInsufficient && (
                          <span className="text-[10px] text-[#746C61]/70 italic">
                            Chưa đủ tư liệu
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Giá trị Lễ hội 1 */}
                    <td className="py-3.5 px-4 text-[#292623] align-top border-r border-[#E7DED0] leading-relaxed">
                      {Array.isArray(c.val1) ? (
                        <ul className="list-disc pl-4 space-y-1">
                          {c.val1.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      ) : (
                        <span>{c.val1}</span>
                      )}
                    </td>

                    {/* Giá trị Lễ hội 2 */}
                    <td className="py-3.5 px-4 text-[#292623] align-top leading-relaxed">
                      {Array.isArray(c.val2) ? (
                        <ul className="list-disc pl-4 space-y-1">
                          {c.val2.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      ) : (
                        <span>{c.val2}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Bố cục dạng Thẻ cho Mobile (Không tràn màn hình) */}
        <div className="md:hidden divide-y divide-[#E7DED0]">
          {criteria.map(c => (
            <div key={c.key} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs uppercase text-[#183E3A]">
                  {c.label}
                </span>
                <span
                  className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
                    c.status === 'identical'
                      ? 'bg-emerald-100 text-emerald-800'
                      : c.status === 'different'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {c.status === 'identical'
                    ? 'Tương đồng'
                    : c.status === 'different'
                    ? 'Khác biệt'
                    : 'Chưa đủ tư liệu'}
                </span>
              </div>

              {/* Box 1 */}
              <div className="p-2.5 rounded bg-[#F8F4EA] border border-[#E7DED0]">
                <span className="block text-[11px] font-bold text-[#8F2724] mb-1">
                  {f1.officialName}:
                </span>
                <div className="text-xs text-[#292623]">
                  {Array.isArray(c.val1) ? c.val1.join('; ') : c.val1}
                </div>
              </div>

              {/* Box 2 */}
              <div className="p-2.5 rounded bg-[#F8F4EA] border border-[#E7DED0]">
                <span className="block text-[11px] font-bold text-[#183E3A] mb-1">
                  {f2.officialName}:
                </span>
                <div className="text-xs text-[#292623]">
                  {Array.isArray(c.val2) ? c.val2.join('; ') : c.val2}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DANH MỤC NGUỒN TƯ LIỆU THAM CHIẾU CỦA CẢ HAI LỄ HỘI */}
      <div className="p-6 rounded-xl bg-white border border-[#E7DED0] shadow-xs">
        <h4 className="font-serif text-sm font-bold text-[#183E3A] uppercase tracking-wider mb-4 flex items-center gap-2">
          <BookCheck className="w-4 h-4 text-[#8F2724]" />
          <span>Nguồn tư liệu kiểm chứng của các hồ sơ đối sánh</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div>
            <h5 className="font-semibold text-[#8F2724] mb-2">{f1.officialName}:</h5>
            {sources1.length > 0 ? (
              <ul className="space-y-2 text-[#746C61]">
                {sources1.map(s => (
                  <li key={s.id} className="border-l-2 border-[#8F2724] pl-2.5">
                    <strong className="text-[#292623]">{s.title}</strong>
                    <div className="text-[11px] text-[#746C61]">
                      {s.authorOrOrganization} · {s.publicationDate || 'Không rõ năm'}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="italic text-[#746C61]">Chưa có tư liệu kiểm chứng được liên kết.</p>
            )}
          </div>

          <div>
            <h5 className="font-semibold text-[#183E3A] mb-2">{f2.officialName}:</h5>
            {sources2.length > 0 ? (
              <ul className="space-y-2 text-[#746C61]">
                {sources2.map(s => (
                  <li key={s.id} className="border-l-2 border-[#183E3A] pl-2.5">
                    <strong className="text-[#292623]">{s.title}</strong>
                    <div className="text-[11px] text-[#746C61]">
                      {s.authorOrOrganization} · {s.publicationDate || 'Không rõ năm'}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="italic text-[#746C61]">Chưa có tư liệu kiểm chứng được liên kết.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
