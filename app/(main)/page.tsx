import Link from "next/link";

const skills = [
  "React / Next.js",
  "TypeScript",
  "Tailwind CSS",
  "React Hook Form & Zod",
  "UI/UX Design",
  "REST API",
  "C / C++",
  "Git & GitHub",
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="cv-section-title">{children}</h2>;
}

export default async function Page() {
  return (
    <main className="cv-shell">
      <aside className="cv-sidebar">
        <section className="profile-card">
          <h1>Bùi Vũ Dũng</h1>
          <p className="role">Frontend / Software Engineer Intern</p>
        </section>

        <section className="contact-list" aria-label="Thông tin liên hệ">
          <p className="sidebar-label">Liên hệ</p>
          <p>0823 039 583</p>
          <p>vudung2003071@gmail.com</p>
          <p>Thanh Xuân, Hà Nội</p>
        </section>

        <nav className="sidebar-navigation" aria-label="Điều hướng trang cá nhân">
          <p className="sidebar-label">Khám phá thêm</p>
          <Link href="/projects">Dự án cá nhân</Link>
          <Link href="/nghichlinhtinh">Nghịch linh tinh (Lab)</Link>
        </nav>

        <section className="sidebar-section">
          <p className="sidebar-label">Kỹ năng</p>
          <div className="skill-tags">
            {skills.map((skill) => (
              <span key={skill}>{skill}</span>
            ))}
          </div>
        </section>

        <section className="sidebar-section">
          <p className="sidebar-label">Học vấn</p>
          <div className="sidebar-entry">
            <strong>Đại học Bách Khoa Hà Nội (HUST)</strong>
            <span>Công nghệ Thông tin (Global ICT - IT-E7) · 2024 — nay</span>
          </div>
          <div className="sidebar-entry">
            <strong>THPT Chuyên Thái Nguyên</strong>
            <span>Chuyên Toán · 2021 — 2024</span>
          </div>
        </section>

        <section className="sidebar-section language-section">
          <p className="sidebar-label">Ngôn ngữ</p>
          <div className="language">
            <span>Tiếng Việt</span>
            <b>Bản ngữ</b>
          </div>
          <div className="language">
            <span>Tiếng Anh</span>
            <b>Intermediate (B2)</b>
          </div>
        </section>
      </aside>

      <article className="cv-content">
        <header className="cv-heading">
          <p className="eyebrow">Xin chào, mình là</p>
          <h2>
            Bùi Vũ Dũng<span>.</span>
          </h2>
          <p className="lead">
            Sinh viên Công nghệ Thông tin đam mê phát triển phần mềm, yêu thích việc biến những ý tưởng logic thành sản phẩm số mượt mà, trực quan và tối ưu cho người dùng.
          </p>
        </header>

        <section className="content-section">
          <SectionTitle>Giới thiệu</SectionTitle>
          <p>
            Mình là sinh viên năm hai trong Chương trình Đào tạo Quốc tế Global ICT (IT-E7) tại Đại học Bách Khoa Hà Nội (HUST). Xuất phát từ nền tảng vững chắc về toán học và tư duy giải quyết vấn đề logic, mình sở hữu kỹ năng lập trình tốt với C/C++ cùng các công nghệ web hiện đại như React, Next.js, TypeScript và Tailwind CSS. Mình luôn mong muốn vận dụng tư duy phân tích nhạy bén để xây dựng các giải pháp phần mềm chất lượng cao, bền vững và tối ưu trải nghiệm người dùng.
          </p>
        </section>

        <section className="content-section">
          <SectionTitle>Kinh nghiệm và dự án</SectionTitle>
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-date">2024 — nay</div>
              <div>
                <h3>
                  Portfolio cá nhân & Lab thực hành <span>· Dự án cá nhân</span>
                </h3>
                <p>
                  Xây dựng trang cá nhân responsive hiện đại với Next.js App Router, TypeScript và Tailwind CSS; thiết kế tối ưu giao diện cho cả máy tính và thiết bị di động.
                </p>
                <ul>
                  <li>Thiết kế hệ thống component tái sử dụng, phân tách rõ ràng luồng Client/Server Component.</li>
                  <li>Áp dụng các React Design Patterns nâng cao (Higher-Order Components, Context API, Custom Hooks).</li>
                  <li>Tích hợp React Hook Form kết hợp Zod schema validation nhằm đảm bảo an toàn kiểu dữ liệu và trải nghiệm người dùng mượt mà.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="content-section">
          <SectionTitle>Hoạt động & Mục tiêu</SectionTitle>
          <div className="activity-grid">
            <div className="activity-card">
              <h3>Học hỏi không ngừng</h3>
              <p>Chủ động cập nhật các công nghệ mới, tìm hiểu kiến trúc phần mềm và thực hành các best practice trong hệ sinh thái React / Next.js.</p>
            </div>
            <div className="activity-card">
              <h3>Tư duy logic & Giải thuật</h3>
              <p>Rèn luyện khả năng tư duy giải thuật từ nền tảng toán học cạnh tranh để tối ưu cấu trúc dữ liệu và hiệu năng ứng dụng.</p>
            </div>
          </div>
        </section>
      </article>
    </main>
  );
}
