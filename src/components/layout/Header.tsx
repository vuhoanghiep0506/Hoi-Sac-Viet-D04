/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Header bảo tàng số HỘI SẮC VIỆT
 * Tuân thủ Top Bar Contract: 3 zones (Brand wordmark - Nav links - Primary action)
 * Tuyệt đối không hiển thị cờ kiểm thử kỹ thuật trên giao diện công khai
 */

import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, Scale } from 'lucide-react';
import { useHeritage } from '../../context/HeritageContext';

export const Header: React.FC = () => {
  const {
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    comparisonSlots,
  } = useHeritage();

  const selectedCount = comparisonSlots.filter(Boolean).length;

  const navLinks = [
    { to: '/', label: 'Trang chủ' },
    { to: '/le-hoi', label: 'Khám phá' },
    { to: '/so-sanh', label: 'So sánh' },
    { to: '/lich-le-hoi', label: 'Lịch lễ hội' },
    { to: '/tro-ly', label: 'Trợ lý AI' },
    { to: '/gioi-thieu', label: 'Giới thiệu' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#F8F4EA]/95 backdrop-blur-md border-b border-[#E7DED0] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <Link
          to="/"
          className="flex items-center gap-3.5 group shrink-0"
          aria-label="Trang chủ Hội Sắc Việt"
        >
          <div className="w-10 h-10 rounded-lg bg-[#8F2724] text-[#F8F4EA] flex items-center justify-center font-serif text-xl font-bold shadow-xs transition-transform group-hover:scale-105">
            <span>H</span>
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#183E3A]">
              HỘI SẮC VIỆT
            </span>
            <span className="text-[11px] font-medium tracking-widest text-[#C5A36B] uppercase hidden sm:inline">
              Một dòng sông – Muôn sắc hội
            </span>
          </div>
        </Link>

        {/* Zone 2: Navigation Links (Single-line, quiet typography) */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#292623]">
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `whitespace-nowrap transition-colors py-1 relative hover:text-[#8F2724] ${
                  isActive
                    ? 'text-[#8F2724] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#8F2724]'
                    : 'text-[#292623]'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Zone 3: Primary Action & Comparison Badge */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Nút vào trang so sánh */}
          <Link
            to="/so-sanh"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-medium bg-[#8F2724] text-white hover:bg-[#751F1C] transition-all shadow-xs whitespace-nowrap"
          >
            <Scale className="w-4 h-4" />
            <span>So sánh</span>
            {selectedCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-white text-[#8F2724] text-xs font-bold flex items-center justify-center">
                {selectedCount}
              </span>
            )}
          </Link>

          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-[#292623] hover:bg-[#E7DED0]/50 transition-colors cursor-pointer"
            aria-label="Mở danh mục điều hướng"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E7DED0] bg-[#F8F4EA] px-4 pt-3 pb-6 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                  isActive
                    ? 'bg-[#8F2724] text-white'
                    : 'text-[#292623] hover:bg-[#E7DED0]/50'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          <div className="pt-2 border-t border-[#E7DED0] mt-2">
            <NavLink
              to="/quan-tri"
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  isActive ? 'bg-[#183E3A] text-white' : 'text-[#746C61] hover:text-[#8F2724]'
                }`
              }
            >
              Khu vực Quản trị D04
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
};
