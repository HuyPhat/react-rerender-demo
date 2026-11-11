import babel from '@rolldown/plugin-babel'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// In ra component nào bị compiler BỎ QUA và vì sao (mặc định nó im lặng). Một lỗi có thể được log nhiều lần → lọc trùng.
const seen = new Set<string>()
const logger = {
  logEvent(file: string | null, event: any) {
    if (event.kind !== 'CompileError') return
    const msg = `[react-compiler] SKIPPED ${file?.split('/').pop()}:${event.fnLoc?.start.line} — ${event.detail?.reason}`
    if (!seen.has(msg)) {
      seen.add(msg)
      console.warn(msg)
    }
  },
}

// Dev: đổi jsxImportSource sang why-did-you-render để nó "nghe" được mọi lần render.
export default defineConfig(({ mode, command }) => ({
  // GitHub Pages phục vụ tại /react-rerender-demo/ → asset phải có prefix này khi build (dev vẫn ở "/").
  base: command === 'build' ? '/react-rerender-demo/' : '/',
  plugins: [
    react(mode === 'development' ? { jsxImportSource: '@welldone-software/why-did-you-render' } : {}),
    // React Compiler chỉ biên dịch component có directive 'use memo' → Broken/Fixed giữ nguyên để so sánh.
    babel({ presets: [reactCompilerPreset({ compilationMode: 'annotation', logger })] }),
  ],
}))
