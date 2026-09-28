'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// 1. Định nghĩa Schema xác thực dữ liệu bằng Zod
const formSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Họ và tên không được để trống')
    .min(3, 'Họ tên phải có ít nhất 3 ký tự'),
  email: z
    .string()
    .min(1, 'Email không được để trống')
    .email('Định dạng email không hợp lệ'),
  role: z.string().min(1, 'Vui lòng chọn vai trò'),
  age: z
    .number()
    .min(18, 'Tuổi phải từ 18 trở lên')
    .max(100, 'Tuổi không hợp lệ'),
  terms: z.boolean().refine((val) => val === true, {
    message: 'Bạn cần đồng ý với điều khoản sử dụng',
  }),
});

// Suy luận kiểu TypeScript từ Schema
type FormData = z.infer<typeof formSchema>;

export default function HookFormDemo() {
  const [submittedData, setSubmittedData] = useState<FormData | null>(null);

  // 2. Khởi tạo useForm
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      role: '',
      age: 18,
      terms: false,
    },
    mode: 'onTouched', // Validate khi người dùng blur hoặc gõ
  });

  // Xem giá trị thời gian thực của fullName bằng watch()
  const liveFullName = watch('fullName');

  // 3. Hàm xử lý khi form hợp lệ (Submit thành công)
  const onSubmit = async (data: FormData) => {
    // Giả lập gọi API mất 1 giây
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSubmittedData(data);
    alert('Đăng ký thành công!');
  };

  const handleReset = () => {
    reset();
    setSubmittedData(null);
  };

  return (
    <div className="w-full max-w-xl bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800">Demo React Hook Form + Zod</h3>
        <p className="text-sm text-gray-500 mt-1">
          Quản lý form hiệu quả, không re-render toàn bộ component và validate chuẩn chỉ.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Họ và tên */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Họ và tên
          </label>
          <input
            {...register('fullName')}
            type="text"
            placeholder="Ví dụ: Nguyễn Văn A"
            className={`w-full px-3 py-2 border rounded-lg outline-none transition ${
              errors.fullName
                ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
            }`}
          />
          {errors.fullName && (
            <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>
          )}
          {liveFullName && !errors.fullName && (
            <p className="text-xs text-gray-400 mt-1">Đang nhập: {liveFullName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            {...register('email')}
            type="email"
            placeholder="example@gmail.com"
            className={`w-full px-3 py-2 border rounded-lg outline-none transition ${
              errors.email
                ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
            }`}
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Tuổi & Vai trò (2 cột) */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tuổi (tối thiểu 18)
            </label>
            <input
              {...register('age', { valueAsNumber: true })}
              type="number"
              className={`w-full px-3 py-2 border rounded-lg outline-none transition ${
                errors.age
                  ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
              }`}
            />
            {errors.age && (
              <p className="text-xs text-red-500 mt-1">{errors.age.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vai trò
            </label>
            <select
              {...register('role')}
              className={`w-full px-3 py-2 border rounded-lg outline-none transition bg-white ${
                errors.role
                  ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
              }`}
            >
              <option value="">-- Chọn vai trò --</option>
              <option value="frontend">Frontend Developer</option>
              <option value="backend">Backend Developer</option>
              <option value="fullstack">Fullstack Developer</option>
            </select>
            {errors.role && (
              <p className="text-xs text-red-500 mt-1">{errors.role.message}</p>
            )}
          </div>
        </div>

        {/* Checkbox Điều khoản */}
        <div className="pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              {...register('terms')}
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">
              Tôi đồng ý với các điều khoản dịch vụ
            </span>
          </label>
          {errors.terms && (
            <p className="text-xs text-red-500 mt-1">{errors.terms.message}</p>
          )}
        </div>

        {/* Nút hành động */}
        <div className="flex gap-3 pt-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition disabled:bg-blue-300 cursor-pointer disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Đang xử lý...' : 'Gửi thông tin'}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition cursor-pointer"
          >
            Reset
          </button>
        </div>
      </form>

      {/* Hiển thị kết quả sau khi Submit */}
      {submittedData && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
          <h4 className="text-sm font-semibold text-green-800 mb-2">
            Dữ liệu đã submit thành công:
          </h4>
          <pre className="text-xs bg-white p-3 rounded border border-green-100 text-gray-800 overflow-x-auto">
            {JSON.stringify(submittedData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
