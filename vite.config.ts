import babel from '@rolldown/plugin-babel'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Dev: đổi jsxImportSource sang why-did-you-render để nó "nghe" được mọi lần render.
export default defineConfig(({ mode }) => ({
  plugins: [
    react(mode === 'development' ? { jsxImportSource: '@welldone-software/why-did-you-render' } : {}),
    // React Compiler chỉ biên dịch component có directive 'use memo' → Broken/Fixed giữ nguyên để so sánh.
    babel({ presets: [reactCompilerPreset({ compilationMode: 'annotation' })] }),
  ],
}))
