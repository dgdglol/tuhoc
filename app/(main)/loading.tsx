import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="cv-shell" aria-busy="true" aria-label="Đang tải nội dung">
      <aside className="cv-sidebar">
        <div className="loading-profile">
          <Skeleton className="loading-title" />
          <Skeleton className="loading-line loading-role" />
        </div>

        <div className="loading-sidebar-section">
          <Skeleton className="loading-label" />
          <Skeleton className="loading-line" />
          <Skeleton className="loading-line loading-line-wide" />
          <Skeleton className="loading-line loading-line-medium" />
        </div>
      </aside>

      <article className="cv-content">
        <Skeleton className="loading-label loading-heading-label" />
        <Skeleton className="loading-heading" />
        <Skeleton className="loading-line loading-intro" />
        <Skeleton className="loading-line loading-intro-short" />

        <div className="loading-content-section">
          <Skeleton className="loading-section-title" />
          <Skeleton className="loading-line" />
          <Skeleton className="loading-line" />
          <Skeleton className="loading-line loading-line-medium" />
        </div>
      </article>
    </main>
  );
}