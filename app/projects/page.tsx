import React from 'react';
import Link from 'next/link';

interface ProjectItem {
  id: string;
  title: string;
  category: string;
  description: string;
  highlights: string[];
  techStack: string[];
  href: string;
  status: 'Hoàn thành' | 'Đang phát triển';
}

const PROJECTS: ProjectItem[] = [
  {
    id: 'portfolio-cv',
    title: 'Interactive CV & Personal Portfolio',
    category: 'Web Portfolio',
    description:
      'Trang hồ sơ cá nhân hiện đại với giao diện tinh tế, hỗ trợ Skeleton Loading khi chuyển hướng, responsive hoàn chỉnh trên thiết bị di động.',
    highlights: [
      'Bố cục 2 cột chuyên nghiệp tối ưu cho nhà tuyển dụng xem trên cả desktop và mobile.',
      'Sử dụng App Router của Next.js 16 và React 19.',
      'Tích hợp theme nhất quán và tải trang tức thì không giật layout.',
    ],
    techStack: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind CSS', 'CSS Grid'],
    href: '/',
    status: 'Hoàn thành',
  },
  {
    id: 'react-patterns-lab',
    title: 'React Patterns & Form Validation Lab',
    category: 'Architecture & Design Patterns',
    description:
      'Hệ thống phòng lab nghiên cứu các kiến trúc và pattern nâng cao trong React: HOC, Context API, và xác thực form nghiêm ngặt.',
    highlights: [
      'HOC WithCounter và withCart xử lý state bất biến và generic TypeScript type-safe.',
      'HOC withAuthentication & withAuthorization kết hợp AuthContext và live Role Switcher.',
      'React Hook Form kết hợp Zod schema validation với valueAsNumber và UX onTouched.',
    ],
    techStack: ['React HOC', 'React Hook Form', 'Zod', 'Context API', 'TypeScript'],
    href: '/nghichlinhtinh',
    status: 'Hoàn thành',
  },
  {
    id: 'dice-game',
    title: 'Tài Xỉu Mini-game & Probability Logic',
    category: 'Fullstack Game & Testing',
    description:
      'Mini-game xúc xắc trực tuyến với hệ thống xác thực tài khoản, lịch sử cược và thuật toán tính thưởng xác suất.',
    highlights: [
      'Bao phủ 100% logic trò chơi với 17 bài kiểm thử Vitest tự động.',
      'Quản lý phiên chơi và xác thực người dùng.',
      'Next.js Route Handlers backend API.',
    ],
    techStack: ['Next.js API Routes', 'Vitest', 'Game Logic', 'TypeScript'],
    href: '/apptaixiu',
    status: 'Hoàn thành',
  },
  {
    id: 'data-fetching-demo',
    title: 'Next.js Data Fetching & World Clock Demo',
    category: 'Performance & Caching',
    description:
      'Thực hành mô hình Data Fetching hiện đại: Server Component fetch có revalidation cache kết hợp Client parallel fetch đa múi giờ.',
    highlights: [
      'Fetch Server Component cache 1 giờ (revalidate: 3600) giảm tải API.',
      'Fetch dữ liệu thời gian thực thế giới với Promise.all chạy song song.',
      'Xử lý toàn diện các trạng thái Loading skeleton, Error boundary và Empty state.',
    ],
    techStack: ['Server Components', 'Client Fetch', 'Cache Revalidation', 'Promise.all'],
    href: '/fetch-demo',
    status: 'Hoàn thành',
  },
  {
    id: 'admin-dashboard',
    title: 'Analytics & Management Dashboard',
    category: 'Enterprise UI',
    description:
      'Giao diện bảng điều khiển quản trị số liệu phân tích với sidebar thông minh từ shadcn/Base UI.',
    highlights: [
      'Sidebar thu gọn linh hoạt theo icon hoặc danh mục.',
      'Bố cục chuẩn mực cho các trang phân tích số liệu nội bộ.',
    ],
    techStack: ['Base UI', 'shadcn/ui', 'Tailwind CSS', 'Lucide Icons'],
    href: '/dashboardpage',
    status: 'Đang phát triển',
  },
];

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Navigation & Header */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-600 mb-2">
              <span>🚀</span> Danh mục dự án
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Dự Án Đã Thực Hiện
            </h1>
            <p className="mt-2 text-slate-600 max-w-2xl text-sm sm:text-base">
              Tổng hợp các sản phẩm, ứng dụng và bài thực hành kiến trúc frontend / fullstack mà mình đã thiết kế và phát triển.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-xs w-fit"
          >
            ← Quay lại CV
          </Link>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PROJECTS.map((project) => (
            <article
              key={project.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {project.category}
                  </span>
                  <span
                    className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                      project.status === 'Hoàn thành'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {project.status}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-slate-900 mb-2">
                  {project.title}
                </h2>

                <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                  {project.description}
                </p>

                <div className="mb-5 space-y-1.5">
                  <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                    Điểm nổi bật:
                  </p>
                  <ul className="text-xs text-slate-600 space-y-1 pl-4 list-disc">
                    {project.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-1.5 mb-4">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-600"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <Link
                  href={project.href}
                  className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-xs"
                >
                  Trải nghiệm dự án →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
