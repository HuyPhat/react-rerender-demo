import { useState, useCallback } from 'react'
import { Row } from './Row'
import { ThemeBadge, ThemeCtx } from './ThemeBadge'
import { useRenderCount } from './useRenderCount'

const IDS = [1, 2, 3, 4, 5]
// Hoist ra module scope: object nằm trong callback của .map thì compiler không memo từng row,
// nên style inline sẽ là object mới mỗi lần `selected` đổi → cả 5 Row render lại dù có memo.
const rowStyle = { padding: 4, cursor: 'pointer' }

// Phần lớn giống Broken, được React Compiler tự memo nhờ 'use memo'.
// Hai chỗ compiler chưa lo được nên phải viết tay: rowStyle (hoist) và onSelect (useCallback).
export function Compiled() {
  'use memo'
  const renders = useRenderCount()
  const [text, setText] = useState('')
  const [count, setCount] = useState(0)
  const [selected, setSelected] = useState(0)

  // Nhận id thay vì closure `() => setSelected(id)` trong .map → tham chiếu ổn định, Row không thấy prop đổi.
  const onSelect = useCallback((id: number) => setSelected(id), [])

  return (
    <ThemeCtx.Provider value={{ theme: 'light' }}>
      <h2>🤖 Compiled</h2>
      <p>Parent renders: <b>{renders}</b></p>
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="gõ thử..." />
      <button onClick={() => setCount((c) => c + 1)}>+1 ({count})</button>
      <ThemeBadge />
      <ul>
        {IDS.map((id) => (
          <Row
            key={id}
            id={id}
            selected={selected === id}
            style={rowStyle}
            onSelect={onSelect}
          />
        ))}
      </ul>
    </ThemeCtx.Provider>
  )
}
