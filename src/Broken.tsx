import { useState } from 'react'
import { Row } from './Row'
import { ThemeBadge, ThemeCtx } from './ThemeBadge'
import { useRenderCount } from './useRenderCount'

const IDS = [1, 2, 3, 4, 5]

export function Broken() {
  const renders = useRenderCount()
  const [text, setText] = useState('')
  const [count, setCount] = useState(0)
  const [selected, setSelected] = useState(0)
  const id = Math.random()

  return (
    // ❌ #3: object literal mới mỗi lần render → mọi consumer re-render
    <ThemeCtx.Provider value={{ theme: 'light' }}>
      <h2>❌ Broken</h2>
      <p>Parent renders: <b>{renders}</b></p>
      {/* ❌ #1: state của input nằm ở parent → gõ phím là re-render cả cây */}
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="gõ thử..." />
      <button onClick={() => setCount((c) => c + 1)}>+1 ({count})</button>
      <ThemeBadge />
      <ul>
        {IDS.map((id) => (
          <Row
            key={id}
            id={id}
            selected={selected === id}
            // ❌ #2: object + function inline → tham chiếu mới mỗi lần → React.memo vô dụng
            style={{ padding: 4, cursor: 'pointer' }}
            onSelect={() => setSelected(id)}
          />
        ))}
      </ul>
    </ThemeCtx.Provider>
  )
}
