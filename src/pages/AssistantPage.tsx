/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Trang Trợ lý Di sản Việt (Route: /tro-ly)
 * Giao diện trò chuyện hiện đại theo phong cách bảo tàng.
 * Giai đoạn 1: Chuẩn bị giao diện, hợp đồng API và thông báo trung thực.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Send, Trash2, Bot, User, AlertCircle, Info, Sparkles } from 'lucide-react';
import { askHeritageAssistant } from '../services/heritageDataService';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  citations?: string[];
  timestamp: string;
  isDisclaimer?: boolean;
}

const SUGGESTED_QUESTIONS = [
  'Điểm khác biệt chính giữa thuyền Tứ linh và ghe Ngo là gì?',
  'Ý nghĩa của lễ cúng Thần Nước trong các hội đua thuyền miền Trung?',
  'Hồ sơ nào cần tối thiểu 3 nguồn tư liệu trước khi xác minh?',
  'Thực hành đua thuyền nào đã được ghi danh di sản quốc gia?',
];

export const AssistantPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Xin chào! Tôi là Trợ lý Di sản Việt thuộc dự án HỘI SẮC VIỆT (Đề tài D04). Tôi đang trong quá trình chuẩn bị cấu trúc kết nối với mô hình ngôn ngữ và nạp dữ liệu di sản đã được kiểm chứng khoa học.',
      timestamp: 'Hệ thống',
      isDisclaimer: true,
    },
  ]);

  const [inputQuestion, setInputQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (questionText: string) => {
    const trimmed = questionText.trim();
    if (!trimmed || isLoading) return;

    if (trimmed.length > 500) {
      alert('Câu hỏi tối đa 500 ký tự. Vui lòng rút gọn.');
      return;
    }

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuestion('');
    setIsLoading(true);

    try {
      const response = await askHeritageAssistant(trimmed);
      const assistantMsg: Message = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: response.answer,
        citations: response.citations,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        isDisclaimer: true,
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch {
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: 'Có lỗi xảy ra trong quá trình phản hồi. Vui lòng thử lại sau.',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: 'welcome',
        sender: 'assistant',
        text: 'Cuộc trò chuyện đã được làm mới. Trợ lý Di sản Việt đang sẵn sàng đón nhận câu hỏi của bạn.',
        timestamp: 'Hệ thống',
        isDisclaimer: true,
      },
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      {/* Tiêu đề trang */}
      <div className="flex items-center justify-between border-b border-[#E7DED0] pb-5">
        <div>
          <span className="text-xs font-semibold tracking-wider text-[#8F2724] uppercase">
            Không gian đối thoại di sản
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#183E3A] mt-1">
            Trợ lý Di sản Việt
          </h1>
          <p className="text-xs text-[#746C61] mt-1">
            Hỗ trợ giải đáp và tra cứu tư liệu các thực hành lễ hội đua thuyền truyền thống.
          </p>
        </div>

        <button
          type="button"
          onClick={handleClear}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-[#E7DED0] bg-white text-[#746C61] hover:text-[#8F2724] hover:border-[#8F2724] transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Xoá hội thoại</span>
        </button>
      </div>

      {/* Thông báo minh bạch Giai đoạn 1 */}
      <div className="p-4 rounded-xl bg-[#F8F4EA] border border-[#E7DED0] text-xs text-[#292623] flex items-start gap-3">
        <Info className="w-5 h-5 shrink-0 text-[#183E3A] mt-0.5" />
        <div className="leading-relaxed space-y-1">
          <p className="font-semibold text-[#183E3A]">
            Thông báo kỹ thuật Giai đoạn 1 (Architecture & UI Ready):
          </p>
          <p className="text-[#746C61]">
            Giao diện Trợ lý Di sản và hợp đồng dịch vụ đã được chuẩn hoá. Trong giai đoạn này, hệ thống tuân thủ nguyên tắc không tạo sinh câu trả lời giả mạo. Kết nối Gemini API trên máy chủ backend sẽ được hoàn thiện trong Giai đoạn 3 khi kho dữ liệu học thuật được thẩm định đầy đủ.
          </p>
        </div>
      </div>

      {/* KHU VỰC HIỂN THỊ TIN NHẮN */}
      <div className="bg-white rounded-2xl border border-[#E7DED0] shadow-xs flex flex-col h-[520px] overflow-hidden">
        <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-[#F8F4EA]/20">
          {messages.map(msg => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold ${
                    isUser
                      ? 'bg-[#183E3A] text-white'
                      : 'bg-[#8F2724] text-white'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Bong bóng tin nhắn */}
                <div
                  className={`max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs ${
                    isUser
                      ? 'bg-[#183E3A] text-white rounded-tr-xs'
                      : 'bg-white text-[#292623] border border-[#E7DED0] rounded-tl-xs'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Nguồn trích dẫn nếu có */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-[#E7DED0] text-[11px] text-[#746C61] space-y-1">
                      <strong className="text-[#183E3A]">Nguồn tham chiếu:</strong>
                      <ul className="list-disc pl-4 space-y-0.5">
                        {msg.citations.map((cite, i) => (
                          <li key={i}>{cite}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <span
                    className={`block text-[10px] mt-2 ${
                      isUser ? 'text-white/60 text-right' : 'text-[#746C61]/70'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#8F2724] text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-[#E7DED0] rounded-2xl rounded-tl-xs p-4 text-xs text-[#746C61] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#8F2724] animate-ping" />
                <span>Trợ lý đang xử lý dữ liệu...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* GỢI Ý CÂU HỎI */}
        <div className="p-3 bg-white border-t border-[#E7DED0] overflow-x-auto flex items-center gap-2">
          <span className="text-[11px] text-[#746C61] font-medium shrink-0 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A36B]" />
            <span>Gợi ý:</span>
          </span>
          {SUGGESTED_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(q)}
              className="px-3 py-1 rounded-full text-[11px] bg-[#F8F4EA] hover:bg-[#E7DED0] text-[#292623] whitespace-nowrap transition-colors border border-[#E7DED0] cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* KHUNG NHẬP CÂU HỎI */}
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend(inputQuestion);
          }}
          className="p-4 bg-[#F8F4EA]/40 border-t border-[#E7DED0] flex items-center gap-3"
        >
          <input
            type="text"
            value={inputQuestion}
            onChange={e => setInputQuestion(e.target.value)}
            maxLength={500}
            placeholder="Đặt câu hỏi về lễ hội đua thuyền, nghi lễ, nguồn tư liệu..."
            className="flex-1 px-4 py-2.5 rounded-lg border border-[#E7DED0] bg-white text-xs sm:text-sm focus:border-[#8F2724] focus:ring-2 focus:ring-[#8F2724]/10 transition-colors"
          />
          <button
            type="submit"
            disabled={!inputQuestion.trim() || isLoading}
            className="px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold bg-[#8F2724] text-white hover:bg-[#751F1C] disabled:bg-[#E7DED0] disabled:text-[#746C61]/60 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Gửi</span>
          </button>
        </form>
      </div>
    </div>
  );
};
