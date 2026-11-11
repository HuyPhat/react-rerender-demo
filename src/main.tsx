import './wdyr'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Không dùng <StrictMode>: nó cố ý render 2 lần ở dev, làm số đếm khó đọc.
createRoot(document.getElementById('root')!).render(<App />)
