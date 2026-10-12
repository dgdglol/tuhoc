'use client';

import React, { useState, useEffect } from 'react';

// 1. Định nghĩa cấu trúc dữ liệu trả về từ timeapi.io
export interface TimeData {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  seconds: number;
  time: string;
  date: string;
  timeZone: string;
  dayOfWeek: string;
}

interface RegionConfig {
  name: string;
  zone: string;
  flag: string;
}

const REGIONS: RegionConfig[] = [
  { name: 'Hà Nội (Việt Nam)', zone: 'Asia/Ho_Chi_Minh', flag: '🇻🇳' },
  { name: 'Tokyo (Nhật Bản)', zone: 'Asia/Tokyo', flag: '🇯🇵' },
  { name: 'London (Anh)', zone: 'Europe/London', flag: '🇬🇧' },
  { name: 'New York (Mỹ)', zone: 'America/New_York', flag: '🇺🇸' },
  { name: 'Sydney (Úc)', zone: 'Australia/Sydney', flag: '🇦🇺' },
];

export default function ThoiGianDemo() {
  const [dataList, setDataList] = useState<Record<string, TimeData>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<string | null>(null);

  // 2. Hàm gọi fetch API để lấy dữ liệu từ timeapi.io
  const handleFetchTime = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    const results: Record<string, TimeData> = {};

    try {
      // Dùng Promise.all để gọi API cùng lúc cho nhiều khu vực (chạy song song cho nhanh)
      const fetchPromises = REGIONS.map(async (region) => {
        const url = `https://timeapi.io/api/time/current/zone?timeZone=${region.zone}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Lỗi HTTP ${response.status} khi lấy giờ của ${region.name}`);
        }

        const data: TimeData = await response.json();
        return { zone: region.zone, data };
      });

      const responses = await Promise.all(fetchPromises);

      responses.forEach(({ zone, data }) => {
        results[zone] = data;
      });

      setDataList(results);
      setLastFetched(new Date().toLocaleTimeString('vi-VN'));
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Đã có lỗi không xác định xảy ra khi fetch dữ liệu.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Tự động fetch lần đầu khi component vừa xuất hiện
  useEffect(() => {
    handleFetchTime();
  }, []);

  return (
    <div className="w-full my-8 p-6 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm">
      {/* Tiêu đề & Nút bấm */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            🌍 Đồng Hồ Thế Giới (Client Fetch)
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Nguồn dữ liệu: <code className="bg-white border px-1.5 py-0.5 rounded text-blue-600 font-mono">timeapi.io</code>
            {lastFetched && <span className="ml-2 font-medium">• Lần cập nhật cuối: {lastFetched}</span>}
          </p>
        </div>

        <button
          onClick={handleFetchTime}
          disabled={isLoading}
          className={`px-5 py-2.5 rounded-lg text-white font-medium transition-all shadow-sm flex items-center justify-center gap-2 ${
            isLoading
              ? 'bg-blue-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
          }`}
        >
          <span>{isLoading ? '⏳' : '🔄'}</span>
          <span>{isLoading ? 'Đang tải...' : 'Lấy giờ mới'}</span>
        </button>
      </div>

      {/* Thông báo lỗi nếu có */}
      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
          <span>⚠️</span>
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Danh sách hiển thị các khu vực */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {REGIONS.map((region) => {
          const timeInfo = dataList[region.zone];

          return (
            <div
              key={region.zone}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{region.flag}</span>
                <span className="font-semibold text-slate-700 text-sm">
                  {region.name}
                </span>
              </div>

              {isLoading && !timeInfo ? (
                <div className="animate-pulse space-y-2 py-4">
                  <div className="h-8 bg-slate-200 rounded w-2/3"></div>
                  <div className="h-4 bg-slate-100 rounded w-full"></div>
                </div>
              ) : timeInfo ? (
                <div>
                  <div className="text-3xl font-extrabold text-blue-600 tracking-tight my-1">
                    {timeInfo.time}
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    {timeInfo.dayOfWeek}, {timeInfo.date}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-2 font-mono truncate">
                    Múi giờ: {timeInfo.timeZone}
                  </div>
                </div>
              ) : (
                <div className="text-sm text-slate-400 italic py-4">
                  Chưa có dữ liệu
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Hiển thị dữ liệu JSON thô để bạn dễ hình dung fetch được cái gì về */}
      <div className="mt-8 bg-slate-900 text-slate-100 p-4 rounded-xl text-xs overflow-x-auto shadow-inner">
        <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-700 text-slate-400">
          <span className="font-semibold">📦 Dữ liệu JSON thô vừa fetch về từ API:</span>
          <span>{Object.keys(dataList).length} khu vực</span>
        </div>
        <pre className="font-mono text-emerald-400">
          {Object.keys(dataList).length > 0
            ? JSON.stringify(dataList, null, 2)
            : '// Đang chờ dữ liệu...'}
        </pre>
      </div>
    </div>
  );
}
