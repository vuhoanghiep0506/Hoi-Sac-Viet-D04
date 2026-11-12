/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HỘI SẮC VIỆT – BẢO TÀNG SỐ DI SẢN VĂN HOÁ VIỆT NAM (GIAI ĐOẠN 1)
 * Đề tài D04: So sánh thực hành lễ hội đua thuyền truyền thống tại các địa phương Việt Nam
 * Người thực hiện: Vũ Hoàng Hiệp - MSSV: PH64339 - Nhóm 2 (IMTA TECH × FPT Polytechnic)
 */

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { HeritageProvider } from './context/HeritageContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { FestivalsPage } from './pages/FestivalsPage';
import { FestivalDetailPage } from './pages/FestivalDetailPage';
import { ComparisonPage } from './pages/ComparisonPage';
import { AssistantPage } from './pages/AssistantPage';
import { CalendarPage } from './pages/CalendarPage';
import { AboutSourcesPage } from './pages/AboutSourcesPage';
import { AdminPage } from './pages/AdminPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Tự động cuộn lên đầu trang khi chuyển tuyến đường
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default function App() {
  return (
    <ErrorBoundary>
      <HeritageProvider>
        <BrowserRouter>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col bg-[#F8F4EA] text-[#292623] font-sans selection:bg-[#8F2724] selection:text-white">
            <Header />
            <main className="flex-1">
              <Routes>
                {/* 1. Trang chủ */}
                <Route path="/" element={<HomePage />} />

                {/* 2. Thư viện lễ hội */}
                <Route path="/le-hoi" element={<FestivalsPage />} />

                {/* Trang chi tiết lễ hội (Trang con của thư viện) */}
                <Route path="/le-hoi/:id" element={<FestivalDetailPage />} />

                {/* 3. So sánh lễ hội */}
                <Route path="/so-sanh" element={<ComparisonPage />} />

                {/* 4. Trợ lý Di sản Việt */}
                <Route path="/tro-ly" element={<AssistantPage />} />

                {/* 5. Lịch lễ hội */}
                <Route path="/lich-le-hoi" element={<CalendarPage />} />

                {/* 6. Nguồn tư liệu & Giới thiệu */}
                <Route path="/gioi-thieu" element={<AboutSourcesPage />} />

                {/* Quản trị & Thẩm định dữ liệu (Giai đoạn 2) */}
                <Route path="/quan-tri" element={<AdminPage />} />

                {/* Trang 404 */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </HeritageProvider>
    </ErrorBoundary>
  );
}
