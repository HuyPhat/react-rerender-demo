import { useRef } from 'react'

// Đếm số lần component render. Ghi ref trong lúc render là "impure", nhưng đủ cho demo
// (StrictMode đã tắt trong main.tsx, nếu không dev sẽ render 2 lần mỗi lần).
export function useRenderCount() {
  const n = useRef(0)
  n.current += 1
  return n.current
}
