import React from "react";

export interface BlogPost {
  id: number;
  title: string;
  content?: string;
  author?: string;
  date?: string;
}

export default async function BlogPostsList() {
  try {
    const res = await fetch("https://api.vercel.app/blog", {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`Lỗi kết nối API blog (HTTP ${res.status})`);
    }

    const posts: BlogPost[] = await res.json();

    return (
      <div className="space-y-3">
        <h3 className="text-base font-bold text-slate-800">Danh sách bài viết mẫu:</h3>
        <ul className="space-y-2">
          {posts.slice(0, 5).map((item) => (
            <li
              key={item.id}
              className="p-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 hover:border-slate-300 transition-colors"
            >
              <h4 className="font-semibold">{item.title}</h4>
              {item.author && <p className="text-xs text-slate-500 mt-1">Tác giả: {item.author}</p>}
            </li>
          ))}
        </ul>
      </div>
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Lỗi không xác định khi tải dữ liệu";
    return (
      <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
        Không thể tải danh sách bài viết: {errorMessage}
      </div>
    );
  }
}