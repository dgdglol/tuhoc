# 🌟 Bùi Vũ Dũng - Personal CV & React Engineering Lab

Dự án Portfolio cá nhân kết hợp Phòng thí nghiệm (Lab) thực hành các kiến trúc, Design Patterns và công nghệ hiện đại trong hệ sinh thái **Next.js 16 (App Router)** và **React 19**.

---

## 🚀 Công Nghệ Sử Dụng (Tech Stack)

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack, Server Components & Route Handlers)
- **Thư viện UI:** [React 19](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/) (dựa trên `@base-ui/react`)
- **Ngôn ngữ:** [TypeScript 5](https://www.typescriptlang.org/) (Strict mode, Generic typing, Interface chuẩn mực)
- **Quản lý Form & Validation:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Icon:** [Lucide React](https://lucide.dev/)
- **Kiểm thử (Testing):** [Vitest](https://vitest.dev/)
- **Package Manager:** [pnpm](https://pnpm.io/)

---

## 📂 Cấu Trúc Thư Mục (Project Architecture)

```text
lamcv/
├── app/
│   ├── (main)/                 # Trang CV cá nhân chính
│   │   ├── page.tsx            # Bố cục CV chuyên nghiệp, responsive
│   │   ├── loading.tsx         # Skeleton Loading chống CLS
│   │   ├── globals.css         # CSS bố cục CV, hỗ trợ Media Queries mobile
│   │   └── app-sidebar.tsx     # Sidebar shadcn/Base UI
│   ├── projects/               # Trang danh mục dự án chi tiết
│   ├── nghichlinhtinh/         # Lab thực hành React Patterns & State Management
│   │   ├── withcounter.tsx     # Generic HOC Counter (bảo toàn props, chặn số âm)
│   │   ├── withCart.tsx        # Generic HOC Giỏ hàng với xử lý state bất biến (immutable)
│   │   ├── ShoppingCart.tsx    # Giao diện giỏ hàng chuẩn Tailwind CSS
│   │   ├── withAuth.tsx        # AuthContext + HOC Authentication/Authorization + Role Switcher Live
│   │   └── HookFormDemo.tsx    # Demo React Hook Form + Zod validate onTouched
│   ├── apptaixiu/              # Mini-game Tài Xỉu (Game Logic + 17 Vitest unit tests + API)
│   ├── fetch-demo/             # Demo Data Fetching (Server Caching vs Client Parallel Fetching)
│   ├── dashboardpage/          # Giao diện Dashboard số liệu phân tích
│   └── layout.tsx              # Root Layout duy nhất chứa <html> và <body>
├── components/ui/              # Các UI component tái sử dụng (shadcn / Base UI)
└── data/                       # Dữ liệu JSON tĩnh cho các mini-app
```

---

## 🛠️ Hướng Dẫn Cài Đặt & Khởi Chạy (Getting Started)

Dự án sử dụng **pnpm** làm trình quản lý gói chính thức.

### 1. Cài đặt các thư viện phụ thuộc:
```bash
pnpm install
```

### 2. Khởi chạy môi trường phát triển (Development):
```bash
pnpm dev
```
Mở trình duyệt tại: [http://localhost:3000](http://localhost:3000)

### 3. Chạy kiểm thử tự động (Unit Tests):
```bash
pnpm test
```

### 4. Build kiểm tra sản phẩm (Production Build):
```bash
pnpm build
```

---

## 💡 Các Điểm Nhấn Kiến Trúc (Architecture Highlights)

1. **Higher-Order Components (HOC) chuẩn mực:**
   - Sử dụng Generic `<P extends object>` để không làm mất type của component gốc (`P & CartProps`, `P & WithCounterProps`).
   - Thiết lập `displayName` hỗ trợ debug trên React DevTools.
   - Thao tác state cập nhật hàm số (`setCartItems(prev => ...)`) tránh race condition khi người dùng click nhanh.

2. **Hệ thống phân quyền AuthContext & HOC:**
   - Quản lý trạng thái `user` và `loading` tập trung thông qua `AuthContext`.
   - Cung cấp bộ chuyển vai trò trực quan (`AuthRoleSwitcher`) cho phép trải nghiệm trực tiếp các trạng thái Chưa đăng nhập (Guest), Người dùng (User), Quản trị viên (Admin) mà không phải can thiệp mã nguồn.

3. **Form & Validation chuẩn mực:**
   - Single source of truth với schema Zod, suy luận kiểu dữ liệu tự động với `z.infer`.
   - Cấu hình `mode: 'onTouched'` và `valueAsNumber` đem lại trải nghiệm nhập liệu thân thiện.

4. **Tối ưu hóa Data Fetching:**
   - Server Component sử dụng `next: { revalidate: 3600 }` giúp lưu cache dữ liệu và tăng tốc độ tải trang.
   - Tối ưu fetch song song phía Client với `Promise.all`.

---

## 👤 Tác Giả

- **Bùi Vũ Dũng** - Sinh viên Khoa học Máy tính / Global ICT (IT-E7), Đại học Bách Khoa Hà Nội (HUST).
- Email: `vudung2003071@gmail.com`
