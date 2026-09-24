import Link from "next/link";

const skills = ["React / Next.js", "TypeScript", "Tailwind CSS", "UI/UX Design", "REST API"];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="cv-section-title">{children}</h2>;
}

export default async function Page() {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return (
    <main className="cv-shell">
      <aside className="cv-sidebar">
        <section className="profile-card">
          <p></p>
          <h1>Bùi Vũ Dũng</h1>
          <p className="role"> Intern</p>
        </section>

        <section className="contact-list" aria-label="Thông tin liên hệ">
          <p className="sidebar-label">Liên hệ</p>
          <p>0823 039 583</p>
          <p>vudung2003071@gmail.com</p>
          <p>Thanh Xuân, Hà Nội</p>
        </section>

        <nav className="sidebar-navigation" aria-label="Điều hướng trang cá nhân">
          <p className="sidebar-label">Khám phá thêm</p>
          <Link href="/projects">Dự án</Link>
          <Link href="/nghichlinhtinh">Nghịch linh tinh</Link>
        </nav>

        <section className="sidebar-section">
          <p className="sidebar-label">Học vấn</p>
          <div className="sidebar-entry">
            <strong>Đại học Khoa học & Công nghệ Hà Nội</strong>
            <span>Công nghệ Thông tin · 2025 — nay</span>
          </div>
          <div className="sidebar-entry">
            <strong>THPT CTN</strong>
            <span>2022 — 2025</span>
          </div>
        </section>
        <section className="sidebar-section language-section">
          <p className="sidebar-label">Ngôn ngữ</p>
          <div className="language"><span>Tiếng Việt</span><b>Native</b></div>
          <div className="language"><span>Tiếng Anh</span><b>Intermediate</b></div>
        </section>
      </aside>

      <article className="cv-content">
        <header className="cv-heading">
          <p className="eyebrow">Xin chào, mình là</p>
          <h2>Bùi Vũ Dũng<span>.</span></h2>
          <p className="lead">Sinh viên Công nghệ Thông tin yêu thích việc biến những ý tưởng rõ ràng thành trải nghiệm số mượt mà và dễ dùng.</p>
        </header>

        <section className="content-section">
          <SectionTitle>Giới thiệu</SectionTitle>
          <p>Mình là sinh viên năm hai tích cực trong Chương trình ICT Toàn cầu (IT-E7) tại Đại học Bách Khoa Hà Nội (HUST), có nền tảng vững chắc về toán học cạnh tranh và khả năng giải quyết vấn đề logic. Mình có kỹ năng lập trình tốt với C/C++ và các công nghệ phát triển web hiện đại như HTML, CSS, và TypeScript. Mình đam mê tận dụng khả năng phân tích và sự linh hoạt kỹ thuật để xây dựng các giải pháp phần mềm sáng tạo, hiệu quả và hướng đến người dùng.</p>
        </section>

        <section className="content-section">
          <SectionTitle>Kinh nghiệm và dự án</SectionTitle>
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-date">2025 — nay</div>
              <div>
                <h3>Dang lam <span>· Dự án cá nhân</span></h3>
                <p>Xây dựng các trang web responsive với Next.js, TypeScript và Tailwind CSS; tối ưu bố cục cho cả desktop lẫn điện thoại.</p>
                <ul><li>Thiết kế component tái sử dụng, code rõ ràng và dễ mở rộng.</li><li>Tích hợp API, xử lý trạng thái tải và trải nghiệm người dùng.</li></ul>
              </div>
            </div>
          </div>
        </section>

        <section className="content-section">
          <SectionTitle>Hoạt động nổi bật</SectionTitle>
          <div className="activity-grid">
            <div className="activity-card"><h3>Học hỏi không ngừng</h3><p>Chủ động cập nhật kiến thức .</p></div>
            <div className="activity-card"><h3>Tư duy</h3><p>Phát triển tư duy phản biện và sáng tạo trong giải quyết vấn đề.</p></div>
          </div>
        </section>
      </article>
    </main>
  );
}
