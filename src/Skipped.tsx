import { useRef, useState } from 'react'
import { Row } from './Row'
import { ThemeBadge, ThemeCtx } from './ThemeBadge'
import { useRenderCount } from './useRenderCount'

const IDS = [1, 2, 3, 4, 5]

// Y hệt Compiled (có 'use memo') nhưng vi phạm quy tắc React → compiler BỎ QUA, không báo lỗi gì.
export function Skipped() {
  'use memo'
  const renders = useRenderCount()
  const [text, setText] = useState('')
  const [count, setCount] = useState(0)
  const [selected, setSelected] = useState(0)

  // ❌ ghi + đọc ref.current ngay trong lúc render → compiler không thể chứng minh an toàn để memo
  const keystrokes = useRef(0)
  keystrokes.current += 1

  return (
    <ThemeCtx.Provider value={{ theme: 'light' }}>
      <h2>🚫 Skipped</h2>
      <p>Parent renders: <b>{renders}</b> · ref: {keystrokes.current}</p>
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="gõ thử..." />
      <button onClick={() => setCount((c) => c + 1)}>+1 ({count})</button>
      <ThemeBadge />
      <ul>
        {IDS.map((id) => (
          <Row
            key={id}
            id={id}
            selected={selected === id}
            style={{ padding: 4, cursor: 'pointer' }}
            onSelect={() => setSelected(id)}
          />
        ))}
      </ul>
    </ThemeCtx.Provider>
  )
}
