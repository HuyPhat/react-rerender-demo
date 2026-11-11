import { memo, useCallback, useMemo, useState } from 'react'
import { Row } from './Row'
import { ThemeBadge, ThemeCtx } from './ThemeBadge'
import { useRenderCount } from './useRenderCount'

const IDS = [1, 2, 3, 4, 5]
// ✅ #2a: hằng số ở module scope → tham chiếu không bao giờ đổi
const rowStyle = { padding: 4, cursor: 'pointer' }

// ✅ #1: state colocation — state của input sống trong component riêng, parent không biết gì
const SearchBox = memo(function SearchBox() {
  const [text, setText] = useState('')
  const n = useRenderCount()
  return (
    <>
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="gõ thử..." />
      <small> SearchBox renders: <b>{n}</b></small>
    </>
  )
})

export function Fixed() {
  const renders = useRenderCount()
  const [count, setCount] = useState(0)
  const [selected, setSelected] = useState(0)

  // ✅ #2b: handler ổn định (nhận id thay vì closure theo từng row)
  const onSelect = useCallback((id: number) => setSelected(id), [])
  // ✅ #3: value của context được memo
  const theme = useMemo(() => ({ theme: 'light' }), [])

  return (
    <ThemeCtx.Provider value={theme}>
      <h2>✅ Fixed</h2>
      <p>Parent renders: <b>{renders}</b></p>
      <SearchBox />
      <button onClick={() => setCount((c) => c + 1)}>+1 ({count})</button>
      <ThemeBadge />
      <ul>
        {IDS.map((id) => (
          <Row key={id} id={id} selected={selected === id} style={rowStyle} onSelect={onSelect} />
        ))}
      </ul>
    </ThemeCtx.Provider>
  )
}
