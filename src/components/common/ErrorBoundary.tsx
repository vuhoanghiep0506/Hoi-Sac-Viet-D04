/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Bắt lỗi giao diện (Error Boundary) bảo vệ trải nghiệm người dùng
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Lỗi giao diện:', error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-[#E7DED0] shadow-md space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-red-100 text-[#8F2724] flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h2 className="font-serif text-2xl font-bold text-[#183E3A]">
              Đã xảy ra sự cố không mong muốn
            </h2>

            <p className="text-xs text-[#746C61] leading-relaxed">
              Ứng dụng ghi nhận một lỗi hiển thị. Bạn có thể làm mới trang hoặc quay trở về trang chủ.
            </p>

            <button
              type="button"
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold bg-[#8F2724] text-white hover:bg-[#751F1C] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Làm mới & Về trang chủ</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
