# 🌟 Bùi Vũ Dũng — Personal CV & Fullstack React Engineering Lab

Dự án **Portfolio cá nhân** kết hợp **Phòng thí nghiệm (Engineering Lab)** thực hành các kiến trúc phần mềm, Design Patterns, hệ thống xác thực & phân quyền toàn cục (`GlobalBlurGuard`), và kiểm thử tự động trong hệ sinh thái **Next.js 16 (App Router)** & **React 19**.

---

## 🚀 Công Nghệ Sử Dụng (Tech Stack)

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Server Components, Route Handlers API)
- **Thư viện UI:** [React 19](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/) (dựa trên `@base-ui/react`)
- **Ngôn ngữ:** [TypeScript 5](https://www.typescriptlang.org/) (Strict mode, Generic typing, Interface chuẩn mực)
- **Quản lý Form & Validation:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Biểu tượng (Icons):** [Lucide React](https://lucide.dev/)
- **Kiểm thử tự động (Testing):** [Vitest](https://vitest.dev/) (TDD Unit Tests)
- **Trình quản lý gói:** [pnpm](https://pnpm.io/)

---

## 📂 Cấu Trúc Thư Mục (Project Architecture)

```text
lamcv/
├── app/
│   ├── (main)/                 # Trang CV cá nhân chính (/)
│   │   ├── page.tsx            # Giao diện CV 2 cột responsive
│   │   ├── loading.tsx         # Skeleton Loading chống giật bố cục (CLS)
│   │   └── globals.css         # CSS bố cục CV & Media Queries thiết bị di động
│   ├── api/                    # Hệ thống Backend API (Next.js Route Handlers)
│   │   ├── auth/
│   │   │   ├── login/route.ts      # API xác thực tài khoản từ data/users.json
│   │   │   └── register/route.ts   # API đăng ký & ghi tài khoản mới vào data/users.json
│   │   └── users/route.ts          # API truy xuất danh sách người dùng dành cho Admin
│   ├── login/                  # Hệ thống Xác thực (Dùng chung cho cả trang riêng & Modal)
│   │   ├── page.tsx            # Component LoginPage + quản lý vùng lưu trữ lamcv_auth_user
│   │   └── register/page.tsx   # Trang đăng ký tài khoản mới
│   ├── projects/               # Trang danh mục tổng hợp các dự án (/projects)
│   ├── nghichlinhtinh/         # Phòng Lab thực hành React Design Patterns (/nghichlinhtinh)
│   │   ├── withcounter.tsx     # Generic HOC Counter (bảo toàn props, chặn số âm)
│   │   ├── withCart.tsx        # Generic HOC Giỏ hàng với xử lý state bất biến (immutable)
│   │   ├── ShoppingCart.tsx    # Giao diện giỏ hàng Tailwind CSS
│   │   ├── withAuth.tsx        # AuthContext + HOC Authentication/Authorization đồng bộ phiên thật
│   │   ├── ProtectedComponents.tsx # Component phân quyền User & Admin Data Panel
│   │   └── HookFormDemo.tsx    # Demo React Hook Form + Zod validate onTouched
│   ├── game/                   # Mini-game Dự Đoán Xúc Xắc (/game)
│   │   ├── page.tsx            # Giao diện trò chơi đồng bộ điểm tích lũy theo tài khoản
│   │   ├── thuattoan.tsx       # Component xử lý lượt tung & tính điểm
│   │   ├── game-logic.ts       # Các hàm thuần (pure functions) xử lý quy tắc & xác suất
│   │   └── game-logic.test.ts  # Bộ 17 bài kiểm thử tự động với Vitest (TDD)
│   ├── fetch-demo/             # Demo Data Fetching (Server Cache Revalidation & Client Promise.all)
│   ├── dashboardpage/          # Bảng điều khiển Quản trị viên (/dashboardpage - Admin Only)
│   │   ├── layout.tsx          # Layout quản trị tích hợp Collapsible Sidebar
│   │   ├── dashboard-sidebar.tsx # Thanh điều hướng quản trị thu gọn thông minh
│   │   ├── page.tsx            # Thống kê KPI & Bảng dữ liệu người dùng thực tế
│   │   └── users/page.tsx      # Trang quản lý danh sách tài khoản hệ thống
│   └── layout.tsx              # Root Layout tích hợp lớp bảo vệ GlobalBlurGuard toàn cục
├── components/ui/              # Hệ thống UI Component tái sử dụng
│   ├── GlobalBlurGuard.tsx     # Lớp bảo vệ làm mờ, chống nhìn trộm khi rời tab & phân quyền Role
│   ├── globalblurguard.md      # Tài liệu chi tiết kiến trúc và luồng hoạt động của GlobalBlurGuard
│   └── ...                     # Các component nền tảng (sidebar, sheet, skeleton, tooltip, button...)
└── data/
    └── users.json              # Cơ sở dữ liệu JSON lưu trữ tài khoản, vai trò (role) và điểm tích lũy
```

---

## 🔐 Hệ Thống Bảo Vệ & Phân Quyền Toàn Cục (`GlobalBlurGuard`)

Toàn bộ ứng dụng được bảo vệ bởi [`GlobalBlurGuard.tsx`](./components/ui/GlobalBlurGuard.tsx) (xem chi tiết tại [`components/ui/globalblurguard.md`](./components/ui/globalblurguard.md)):

1. **Dùng chung 1 thuật toán & 1 nguồn lưu trữ duy nhất với `/login`:**
   - Tái sử dụng trực tiếp component [`LoginPage`](./app/login/page.tsx) dưới dạng Modal nổi khi chưa đăng nhập.
   - Đồng bộ tức thì qua `localStorage` (`lamcv_auth_user`) và Custom Event (`lamcv-auth-change`) giữa tất cả các trang.
2. **Phân quyền 3 cấp độ (`Guest` / `User` / `Admin`):**
   - **👀 `guest` (Khách):** Chỉ được xem trang CV cá nhân (`/`). Khi chuyển sang trang khác sẽ tự động làm mờ và yêu cầu đăng nhập.
   - **👤 `user` (Thành viên):** Được xem CV (`/`), Dự án (`/projects`), Phòng Lab (`/nghichlinhtinh`), chơi Mini-game (`/game`), nhưng **bị chặn truy cập trang Quản trị và dữ liệu người dùng** (`/dashboardpage`).
   - **👑 `admin` (Quản trị viên):** Toàn quyền truy cập mọi trang, có nút **`📊 Data người dùng`** trên thanh trạng thái và truy cập bảng điều khiển [`/dashboardpage`](./app/dashboardpage/page.tsx) để xem dữ liệu từ `data/users.json`.
3. **Chống nhìn trộm khi rời Tab (`Privacy Screen`):**
   - Tự động làm mờ toàn bộ màn hình ngay khi người dùng chuyển sang tab khác hoặc thu nhỏ trình duyệt (`visibilitychange` & `window.blur`).

---

## 💡 Các Điểm Nhấn Kiến Trúc Khác (Architecture Highlights)

1. **Higher-Order Components (HOC) chuẩn TypeScript:**
   - Sử dụng Generic `<P extends object>` để bảo toàn kiểu dữ liệu của component gốc (`P & CartProps`, `P & WithCounterProps`).
   - Cập nhật state bất biến (`setCartItems(prev => ...)`) chống lỗi race condition khi thao tác nhanh.
2. **Form Validation với React Hook Form & Zod:**
   - Xác thực dữ liệu chặt chẽ từ một nguồn schema duy nhất (`z.infer<typeof schema>`), hỗ trợ `mode: 'onTouched'` và ép kiểu số tự động (`valueAsNumber`).
3. **Kiểm thử phần mềm theo hướng TDD (Test-Driven Development):**
   - Tách biệt hoàn toàn logic nghiệp vụ của Mini-game Xúc Xắc ra file thuần [`game-logic.ts`](./app/game/game-logic.ts) và kiểm chứng bằng 17 kịch bản test tự động trong [`game-logic.test.ts`](./app/game/game-logic.test.ts).
4. **Tối ưu hóa Data Fetching:**
   - Kết hợp Server Component caching (`next: { revalidate: 3600 }`) và Client parallel fetching (`Promise.all`) kèm xử lý Loading Skeleton.

---

## 🛠️ Hướng Dẫn Cài Đặt & Khởi Chạy (Getting Started)

Dự án sử dụng **pnpm** làm trình quản lý gói.

### 1. Cài đặt thư viện phụ thuộc:
```bash
pnpm install
```

### 2. Chạy môi trường phát triển (Development):
```bash
pnpm dev
```
Truy cập tại: [http://localhost:3000](http://localhost:3000)

### 3. Chạy kiểm thử tự động (Unit Tests):
```bash
pnpm test
```

### 4. Đóng gói sản phẩm (Production Build):
```bash
pnpm build
```

---

## 👤 Tác Giả

- **Bùi Vũ Dũng** — Sinh viên Công nghệ Thông tin (Global ICT - IT-E7), Đại học Bách Khoa Hà Nội (HUST).
- **Email:** `vudung2003071@gmail.com`
- **Điện thoại:** `0823 039 583`
