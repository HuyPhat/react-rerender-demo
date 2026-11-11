import { Broken } from './Broken'
import { Fixed } from './Fixed'

export default function App() {
  return (
    <main style={{ display: 'flex', gap: 48, padding: 24, fontFamily: 'system-ui' }}>
      <section><Broken /></section>
      <section><Fixed /></section>
    </main>
  )
}
