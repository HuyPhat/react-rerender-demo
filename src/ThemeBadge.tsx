import { createContext, memo, useContext } from 'react'
import { useRenderCount } from './useRenderCount'

export const ThemeCtx = createContext({ theme: 'light' })

// memo chặn được render do parent, nhưng KHÔNG chặn được render do context: `value` đổi tham chiếu là consumer render lại.
export const ThemeBadge = memo(function ThemeBadge() {
  const { theme } = useContext(ThemeCtx)
  const n = useRenderCount()
  return <p>ThemeBadge ({theme}) — renders: <b>{n}</b></p>
})
