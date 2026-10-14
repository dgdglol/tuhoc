"use client";

import dynamic from "next/dynamic";
import { lazy, Suspense, useState } from "react";

// Counter nhỏ, luôn cần dùng -> import bình thường (nằm trong bundle chính)
import Counter from "./counter";

function EnhancedCounter() {
  const [count, setCount] = useState(0);

  const increment = () => setCount((value) => value + 1);
  const decrement = () => setCount((value) => value - 1);
  const reset = () => setCount(0);

  return (
    <Counter
      count={count}
      increment={increment}
      decrement={decrement}
      reset={reset}
    />
  );
}

/**
 * CÁCH 1: next/dynamic
 * - Component chỉ được tải khi nó thực sự được render.
 * - `loading`: hiển thị trong lúc đang tải file JS.
 * - `ssr: false`: không render ở server (hợp với component dùng window/document).
 */
const HookFormDemo = dynamic(() => import("./HookFormDemo"), {
  loading: () => <p>Đang tải HookFormDemo...</p>,
  ssr: false,
});

/**
 * CÁCH 2: React.lazy + Suspense
 * - Cách chuẩn của React, không phụ thuộc Next.js.
 * - BẮT BUỘC bọc trong <Suspense fallback={...}>.
 * - Nếu module default không khớp với kiểu component, cần ép kiểu trong lazy().
 */
const FeedbackForm = lazy(async () => {
  const module = await import("./feedbackform");
  return { default: module.default as any };
});

export default function SplitCodeDemo() {
  const [showHookForm, setShowHookForm] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  return (
    <main style={{ padding: 24, display: "grid", gap: 16 }}>
      <h1>Code Splitting Demo</h1>

      {/* Luôn có trong bundle chính */}
      <EnhancedCounter />

      {/* Chỉ tải HookFormDemo khi bấm nút */}
      <section>
        <button onClick={() => setShowHookForm((v) => !v)}>
          {showHookForm ? "Ẩn" : "Hiện"} HookFormDemo (next/dynamic)
        </button>
        {showHookForm && <HookFormDemo />}
      </section>

      {/* Chỉ tải FeedbackForm khi bấm nút */}
      <section>
        <button onClick={() => setShowFeedback((v) => !v)}>
          {showFeedback ? "Ẩn" : "Hiện"} FeedbackForm (React.lazy)
        </button>
        {showFeedback && (
          <Suspense fallback={<p>Đang tải FeedbackForm...</p>}>
            <FeedbackForm />
          </Suspense>
        )}
      </section>
    </main>
  );
}

/**
 * CÁCH 3 (không dùng component): import() động cho hàm/thư viện nặng
 *
 *   async function handleExport() {
 *     const { exportToPdf } = await import("./exportToPdf"); // chỉ tải khi bấm
 *     exportToPdf();
 *   }
 */