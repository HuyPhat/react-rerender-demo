import { memo, type CSSProperties } from 'react'
import { useRenderCount } from './useRenderCount'

type Props = {
  id: number
  selected: boolean
  style: CSSProperties
  onSelect: (id: number) => void
}

// React.memo: bỏ qua render nếu props bằng nhau theo Object.is (so sánh nông).
export const Row = memo(function Row({ id, selected, style, onSelect }: Props) {
  const n = useRenderCount()
  return (
    <li style={{ ...style, fontWeight: selected ? 700 : 400 }} onClick={() => onSelect(id)}>
      Item {id} — renders: <b>{n}</b>
    </li>
  )
})

Row.whyDidYouRender = true // bật log "vì sao render lại" cho Row (xem wdyr.ts)
