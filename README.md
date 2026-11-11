# Debug React unnecessary re-renders

App demo so sánh **❌ Broken** và **✅ Fixed** cạnh nhau. Mỗi component hiển thị `renders: N` để thấy ngay số lần render.

```bash
pnpm install
pnpm dev   # http://localhost:5173
```

Thử: gõ vào input, bấm `+1`, click một item — rồi so sánh hai cột.

## Kết quả đo được (sau khi gõ 3 ký tự → bấm +1 → chọn Item 3)

| Component | ❌ Broken | ✅ Fixed |
|---|---|---|
| Parent | 6 | 3 |
| ThemeBadge (context consumer) | 6 | 1 |
| Row 1,2,4,5 | 6 | 1 |
| Row 3 (được chọn) | 6 | 2 |
| SearchBox (chỗ gõ phím) | — | 4 |

Fixed: gõ phím chỉ render `SearchBox`; `+1` chỉ render parent; chọn item chỉ render đúng row đổi `selected`.

## 3 nguyên nhân (đều có trong `src/Broken.tsx`)

1. **State đặt quá cao** — `text` của input nằm ở parent nên mỗi phím gõ re-render cả cây.
2. **Props mới mỗi lần render** — `style={{...}}` và `onSelect={() => ...}` inline là object/function mới, nên `React.memo` ở `Row` so sánh `Object.is` luôn thấy "khác" → memo vô dụng.
3. **Context value mới mỗi lần render** — `value={{ theme: 'light' }}` khiến mọi consumer render lại, `React.memo` cũng không chặn được context.

## Cách debug (từ nhanh đến sâu)

**1. Nhìn thấy trước — React DevTools**
- Settings (⚙) → General → bật **Highlight updates when components render**. Thao tác trên app, component nào nháy viền là đang render. Gõ 1 phím mà cả danh sách nháy → nghi ngờ.

**2. Biết *vì sao* — Profiler**
- Settings → Profiler → bật **Record why each component rendered while profiling**.
- Tab Profiler → Record → thao tác → Stop. Click component trong flamegraph, bên phải ghi lý do: `Props changed: style, onSelect` / `Context changed` / `Parent component rendered` / `Hook 1 changed`.
- Component màu xám = không render. Màu càng nóng = render càng lâu.

**3. Log lý do ngay trong console — why-did-you-render**
- Đã cấu hình sẵn: `src/wdyr.ts`, `vite.config.ts` (`jsxImportSource` chỉ ở dev), và `Row.whyDidYouRender = true`.
- Bấm `+1` ở cột Broken, console ghi: `props.style: different objects that are equal by value` và `props.onSelect: different functions with the same name`. Đây chính là bằng chứng "props bằng nhau về giá trị nhưng khác tham chiếu".
- Cột Fixed không log gì vì `Row` không render lại.

**4. Đếm thủ công — `useRenderCount`** (`src/useRenderCount.ts`): đủ để viết test/so sánh trước-sau. Tắt `<StrictMode>` khi đếm vì dev cố ý render 2 lần.

**Quy trình**: tái hiện → highlight để khoanh vùng → Profiler "why rendered" để biết nguyên nhân → sửa → đo lại (số render phải giảm). Đừng memo trước khi đo.

## Cách fix (so sánh `Broken.tsx` ↔ `Fixed.tsx`)

| Nguyên nhân | Fix |
|---|---|
| State quá cao | **Colocate state**: tách `SearchBox` giữ state riêng. Rẻ nhất, không cần memo. |
| Object/style inline | Hoist ra ngoài component (`const rowStyle = {...}`) hoặc `useMemo` nếu phụ thuộc props/state. |
| Function inline | `useCallback`, và truyền `id` qua tham số (`onSelect(id)`) thay vì closure riêng từng row. |
| Context value | `useMemo` cho `value`; nếu có state hay đổi lẫn state ít đổi thì tách thành nhiều context. |
| Component con tốn kém | `React.memo` — **chỉ hiệu quả khi props đã ổn định** (nên làm bước trên trước). |

Lưu ý:
- `setState` từ `useState` đã ổn định, không cần bọc `useCallback`.
- Đừng `useMemo`/`useCallback` mọi thứ: tự nó cũng tốn chi phí và làm code khó đọc. Chỉ làm khi Profiler cho thấy có vấn đề.
- **React Compiler** (`babel-plugin-react-compiler`) tự memo hầu hết các trường hợp trên. Project này cố ý *không* bật để lỗi còn tái hiện được.
