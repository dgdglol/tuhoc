# Đôi lời nhận xét

## 1. Tổng quan project có gì

Project stack:

- `package.json:` `next@16.3.5`, `react@19.2.8`, `typescript@5, @base-ui/react, react-hook-form, zod, shadcn, tailwindcss, lucide-react`
- `app/(main)/page.tsx`: trang CV cá nhân (sidebar + nội dung)
- `app/(main)/loading.tsx`: skeleton loading cho trang CV
- `app/(main)/fetchapi.tsx`: file fetch thử, hiện là code chết
- `app/(main)/markcontext.tsx`: Context mẫu quản lý `marks`
- `app/(main)/app-sidebar.tsx` + `app/(main)/layout.tsx`: sidebar shadcn + layout riêng
- `app/nghichlinhtinh/`: học pattern React:
  - `counter.tsx` + `withcounter.tsx`: HOC Counter
  - `withCart.tsx` + `ShoppingCart.tsx`: HOC giỏ hàng
  - `withAuth.tsx` + `ProtectedComponents.tsx`: HOC xác thực / phân quyền
  - `HookFormDemo.tsx`: form với React Hook Form + Zod
  - `page.tsx`, `layout.tsx`, `nghich.css`

- `app/fetch-demo/page.tsx`: demo fetch Server Component đúng chuẩn
- `app/projects/page.tsx`: trang placeholder
- `components/ui/`, `lib/utils.ts`, `hooks/use-mobile.ts`: shadcn/ui có sẵn

Nhận xét nhanh: nhìn thì em đã qua mức "cắt HTML/CSS tĩnh", em đang học các phần như: component, state, HOC, form, fetch, Server/Client Component.

---

## 2. Điểm mạnh — và vì sao nó đúng

### 2.1. Chọn stack đúng hướng

Việc dùng Next.js App Router + TypeScript + Tailwind + shadcn + React Hook Form + Zod là lựa chọn của nhiều production hiện nay, không phải stack lỗi thời. Em cũng có áp dụng zod để quản lý state và react-hook-form, tuy chưa tuỳ biến sâu nhưng hiện tại vậy là ổn

### 2.2. HOC giỏ hàng viết tốt

File `app/nghichlinhtinh/withCart.tsx:25-81` là phần anh đánh giá cao.

```ts
const withCart = <P extends object>(
  WrappedComponent: React.ComponentType<P & CartProps>
) => {
  return function WithCart(props: P) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    // ...
    const totalPrice = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    return <WrappedComponent cartItems={cartItems} /* ... */ totalPrice={totalPrice} {...props} />;
  };
};
```

Vì sao đoạn này đúng:

1. **Generic `<P extends object>` đúng:** HOC không nuốt props gốc. `P` giữ lại props của component được bọc, `P & CartProps` nói rõ "component này cần thêm props giỏ hàng". Nếu không có generic, TypeScript sẽ mất type của props gốc hoặc phải dùng `any`.
2. **`addToCart` / `removeFromCart` dùng functional update đúng:**

   ```ts
   setCartItems((prevItems) => /* ... */)
   ```

   Vì `setState` trong React là bất đồng bộ, dùng `prevItems` đảm bảo luôn tính trên state mới nhất khi bấm liên tục. Nếu viết `setCartItems([...cartItems, newItem])` sẽ dễ mất update khi bấm nhanh 2 lần.

3. **Không mutate state:** dùng `map` + `{ ...item, quantity: item.quantity + 1 }` và `filter`, tạo mảng mới. React so sánh tham chiếu để re-render, mutate trực tiếp sẽ không re-render.
4. **`totalPrice` bằng `reduce` là đúng:**

   ```ts
   cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
   ```

   - `total` là accumulator (giá trị cộng dồn), khởi đầu là `0` (tham số thứ hai của `reduce`).
   - Mỗi vòng lặp lấy `price * quantity` của một item cộng vào `total`.
   - Ví dụ: `[{price: 150000, quantity: 1}, {price: 350000, quantity: 2}]` chạy như sau: bắt đầu `0` → `0 + 150000*1 = 150000` → `150000 + 350000*2 = 850000`.
   - Khi giỏ trống (`[]`), `reduce` trả về đúng giá trị khởi tạo là `0`, nên không cần `if (cartItems.length === 0)` riêng. Nếu quên số `0` này, `reduce` trên mảng rỗng sẽ throw lỗi.
   - `reduce` không làm thay đổi `cartItems`, phù hợp tư duy immutable của React.
   - Cách viết tương đương bằng `for` cũng đúng, nhưng dài hơn và dễ quên reset biến tổng. `reduce` thể hiện đúng ý đồ "gộp nhiều item thành một con số".

Điểm trừ nhỏ: với giỏ hàng lớn nên bọc bằng `useMemo`, nhưng ở quy mô demo thì tính trực tiếp như hiện tại là chấp nhận được.

### 2.3. React Hook Form + Zod làm chuẩn

File `app/nghichlinhtinh/HookFormDemo.tsx:9-51` làm đúng quy trình chuẩn:

1. **Schema là single source of truth:**

   ```ts
   const formSchema = z.object({
     fullName: z.string().min(1, "...").min(3, "..."),
     email: z.string().min(1, "...").email("..."),
     age: z.number().min(18, "...").max(100, "..."),
     terms: z.boolean().refine((val) => val === true, { message: "..." }),
   });
   type FormData = z.infer<typeof formSchema>;
   ```

   Vì sao đúng: chỉ định nghĩa rule một lần bằng Zod, rồi dùng `z.infer` suy ra type TypeScript. Không bị lệch giữa "rule validate" và "type". Nếu sửa rule mà quên sửa type thủ công sẽ sinh bug, ở đây không bị.

2. **`valueAsNumber` cho input number là bắt buộc:**

   ```ts
   {...register('age', { valueAsNumber: true })}
   ```

   Vì DOM luôn trả về string, schema lại yêu cầu `z.number()`. Không có `valueAsNumber`, nhập `18` sẽ thành `"18"` và luôn fail validate. Phần này em đã xử lý đúng chỗ nhiều người mới hay sai.

3. **`mode: 'onTouched'` + `isSubmitting` đúng UX:** validate khi blur thay vì validate ngay khi gõ gây khó chịu, disable nút khi đang submit tránh double-submit. Hiển thị lỗi theo từng field và `watch('fullName')` preview live là hiểu lifecycle của form.

### 2.4. Fetch trên Server Component đúng

File `app/fetch-demo/page.tsx:15-26`:

```ts
export default async function FetchDemoPage() {
  const res = await fetch('https://jsonplaceholder.typicode.com/users', {
    next: { revalidate: 3600 }
  });
  if (!res.ok) throw new Error('Failed to fetch data');
  const users: User[] = await res.json();
```

Vì sao đúng:

- Fetch ở Server Component nên không lộ logic ra client, không cần `useEffect` + `useState` + `loading` thủ công.
- `next: { revalidate: 3600 }` nghĩa là cache 1 giờ rồi mới fetch lại — giảm tải API, tăng tốc response. Không có dòng này thì hoặc fetch mỗi request (chậm) hoặc cache vĩnh viễn (cũ).
- Check `!res.ok` rồi `throw` để Next.js bắt bằng error boundary, thay vì cố render `res.json()` lỗi và crash trang trắng.
- Định nghĩa `interface User` đầy đủ, không dùng `any`.

### 2.5. Biết làm loading skeleton và Context

- `app/(main)/loading.tsx`: Next.js tự hiển thị file này khi route đang load. Dùng `Skeleton` khớp layout CV nên không bị giật layout (CLS). Có `aria-busy="true"` hỗ trợ accessibility.
- `app/(main)/markcontext.tsx`: Context viết đúng 5 bước: type `Mark` → type `MarksContextType` → `createContext(undefined)` → `MarksProvider` → custom hook `useMarks` có check `if (!context) throw`. Cách check này giúp báo lỗi sớm nếu quên bọc Provider, thay vì lỗi `undefined` khó debug về sau.

---

## 3. Điểm yếu/lỗi

### 3.1. Lỗi nặng nhất: tạo HOC trong render [BUG]

File `app/nghichlinhtinh/page.tsx:13-14`:

```ts
export default function Page() {
  const EnhancedCounter = WithCounter(Counter);
  const EnhancedCart = withCart(ShoppingCartUI);
```

Vì sao sai:

- Mỗi lần `Page` re-render, `WithCounter(Counter)` tạo ra một **function component mới hoàn toàn** (tham chiếu khác).
- React reconciliation so sánh type component bằng tham chiếu. Thấy type khác, React hiểu là "component khác", sẽ **unmount cây cũ và mount cây mới**, thay vì update.
- Hậu quả: state `count` trong `WithCounter` bị reset về `0`, input đang gõ mất focus, hiệu năng kém, `useEffect` chạy lại không cần thiết.
- Cách sửa: đưa ra ngoài component, chỉ tạo một lần:

  ```ts
  const EnhancedCounter = WithCounter(Counter);
  const EnhancedCart = withCart(ShoppingCartUI);

  export default function Page() {
    return (/* ... */);
  }
  ```

### 3.2. Logic loading của auth không bao giờ chạy [BUG]

File `app/nghichlinhtinh/withAuth.tsx:10-35`:

```ts
const [user, setUser] = useState<{ name: string; role: string } | null>(null);
// ...
if (user === undefined) {
  return <div>Đang kiểm tra thông tin đăng nhập...</div>;
}
```

Vì sao sai:

- `useState` khởi tạo là `null`, và trong `useEffect` cũng chỉ `setUser({ ... })` hoặc `setUser(null)`. `user` không bao giờ mang giá trị `undefined`.
- Điều kiện `user === undefined` vì thế luôn `false`, nhánh loading là code chết.
- Thực tế sẽ xảy ra: 500ms đầu `user === null` → `isAuthenticated = !!null = false` → hiện ngay "Bạn chưa đăng nhập" dù đang chờ API, gây chớp UI sai.
- Cách sửa: thêm state loading riêng:
  ```ts
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  // trong useEffect sau khi fetch xong: setLoading(false)
  if (loading) return <div>Đang kiểm tra...</div>;
  ```

Lỗi liên quan: `ProtectedUserProfile` và `ProtectedAdminDashboard` mỗi cái gọi `useAuth()` riêng, tức là 2 timer fetch auth độc lập, có thể lệch nhau. Đúng ra `useAuth` phải đọc từ một AuthContext dùng chung.

### 3.3. File fetch chết + sai URL + `any` [BUG]

File `app/(main)/fetchapi.tsx:1-13`:

```ts
const Data = await fetch('https://api.vercal.app/blog');
const post = await Data.json();
{post.map((item: any) => (/* ... */))}
```

Vì sao sai toàn diện:

1. `vercal.app` sai chính tả, đúng là `vercel.app`. Domain này có tồn tại nhưng ra một trang cờ bạc ???. Nếu trang không tồn tại`fetch` throw, trang crash nếu file được dùng.
2. Không check `res.ok`, không `try/catch`, không type. `item: any` làm mất toàn bộ lợi ích TypeScript: gõ sai `item.titile` cũng không báo lỗi.
3. File này không được import ở đâu, là code chết, hoặc em chưa implement. Code chết để lâu gây hiểu nhầm "API blog ở đây", người sau sửa nhầm chỗ.
4. Cách sửa: hoặc xóa file, hoặc sửa thành mẫu như `fetch-demo/page.tsx` (URL đúng + `res.ok` + interface).

### 3.4. Delay giả 3 giây trên trang chủ [UX]

File `app/(main)/page.tsx:9-10`:

```ts
export default async function Page() {
  await new Promise((resolve) => setTimeout(resolve, 3000));
```

Vì sao sai:

- Đây là sleep nhân tạo để chờ`loading.tsx`, không phải chờ dữ liệu thật. Mục đích để demo thì ok.
- Nhưng nếu áp dụng trên product: người dùng vào trang CV phải chờ 3s trắng/skeleton vô lý, SEO và Lighthouse tụt, không có giá trị production.
- Em có thể giữ delay trong trường hợp cần demo hoặc có chủ đích làm chậm trang

### 3.5. Kiến trúc layout bị nhân đôi `<html>`

Hiện có 2 layout đều render gốc:

- `app/(main)/layout.tsx:11-16`: `<html lang="vi"><body>{children}</body></html>`
- `app/nghichlinhtinh/layout.tsx:12-28`: `<html lang="vi"><body><SidebarProvider>...`

Vì sao sai:

- Next.js App Router yêu cầu **một** root layout `app/layout.tsx` chứa `<html><body>`. Route group `(main)` và route thường không nên mỗi cái một `<html>`.
- Hậu quả: metadata, font, viewport, theme bị phân mảnh theo route, dễ lỗi hydration, khó thêm provider chung (theme, auth).
- Dòng `app/(main)/layout.tsx:5`: `import "../(main)/loading"` là import side-effect vô nghĩa, không dùng biến nào, chỉ làm bundle rối.
- Cách sửa: tạo `app/layout.tsx` duy nhất chứa `<html><body>`, các layout con chỉ trả về `<div>/<section>`.

### 3.6. CV chưa responsive

File `app/(main)/globals.css:35-44`:

```css
.cv-shell {
  display: grid;
  grid-template-columns: minmax(270px, 31%) 1fr;
}
```

Vì sao sai: cả file 423 dòng không có một `@media` nào. Trên điện thoại 360px, sidebar 270px + content sẽ bị ép, chữ tràn, phải cuộn ngang. Trang CV là nơi nhà tuyển dụng mở bằng điện thoại nhiều nhất. Cần thêm ví dụ:

```css
@media (max-width: 768px) {
  .cv-shell {
    grid-template-columns: 1fr;
  }
}
```

### 3.7. Type `any` và naming (cái này là quy chuẩn, không bắt buộc)

- `app/nghichlinhtinh/withcounter.tsx:4`: `(WrappedComponent: React.ComponentType<any>)` và `(props: any)`. Vì sao sai: `any` tắt toàn bộ kiểm tra type, truyền thiếu `count` hay sai tên prop cũng không báo. Đã làm tốt ở `withCart` với generic thì nên làm đồng bộ ở đây.
- Tên `function Withcounter` sai casing (đúng là `WithCounter`), không có `displayName` nên React DevTools hiện tên chung chung, khó debug HOC lồng nhau.
- `app/(main)/page.tsx:3`: `const skills = [...]` khai báo không dùng → báo lint `unused-var`, gây nhiễu. Dòng 15 có `<p></p>` trống → anh chưa hiểu mục đích HTML này.

### 3.8. Nội dung CV thiếu chỉn chu (nhận xét thêm)

1. **CV mâu thuẫn:** sidebar ghi "Đại học Khoa học & Công nghệ Hà Nội · 2025 — nay" nhưng body ghi "sinh viên năm hai ... IT-E7 tại Đại học Bách Khoa Hà Nội (HUST)". Anh đọc thì thấy là hai trường khác nhau, hai khóa khác nhau. Nếu mục đích em làm CV thì nên ghi cẩn thận và chỉn chu để cho nhà tuyển dụng thấy được.
2. **`app/projects/page.tsx` placeholder:** chỉ có 2 dòng "Danh sách dự án sẽ được cập nhật". Route `/projects` được link từ trang chủ nhưng vào thì trống.
3. **`README.md`em để nguyên template` create-next-app`:** không hướng dẫn cài chạy thật (`pnpm install`, `pnpm dev`), không mô tả project.
4. **Lộ thông tin cá nhân:** SĐT, email, địa chỉ public trên repo. Nên dùng form liên hệ hoặc biến môi trường, cũng nên cân nhắc trước khi public repo này lên github trong trường hợp em dùng thông tin thật.

### 3.9. Các lỗi nhỏ khác

- `HookFormDemo.tsx:61`: dùng `alert('Đăng ký thành công!')` chặn UI, không đẹp, nên dùng toast hoặc khối success đã có sẵn.
- `ShoppingCart.tsx`: dùng toàn `style={{...}}` inline trong khi cả project dùng Tailwind. Không sai chức năng nhưng không nhất quán, khó bảo trì theme.
- `counter.tsx`: `decrement` cho âm vô hạn, nên chặn ở `0` nếu là counter số lượng.
- `withAuth.tsx`: comment "mở file sửa code để test role" là quy trình test sai. Nên làm dropdown chuyển role `admin/user/null` trên UI để demo trực quan.

---

## 4. Chấm điểm

| Tiêu chí                               | Điểm/10 | Nhận xét                                   |
| -------------------------------------- | ------- | ------------------------------------------ |
| Tư duy React (HOC, state, props)       | 8.5     | Hiểu bản chất                              |
| TypeScript                             | 7.0     | Biết generic/interface nhưng còn`any`      |
| Form + validate                        | 8.5     | Tốt nhất project                           |
| Next.js App Router                     | 7.0     | Biết Server Component nhưng layout còn rối |
| UI/CSS                                 | 7.0     | CV ok trên desktop, hỏng trên mobile       |
| Tính chỉn chu (lint, README, nội dung) | 5.5     | Nhiều đoạn code chưa dùng, naming sai      |
| **Tổng**                               | **7.5** | **GOOD**                                   |
