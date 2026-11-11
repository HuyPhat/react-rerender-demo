import { Broken } from './Broken'
import { Compiled } from './Compiled'
import { Fixed } from './Fixed'
import { Skipped } from './Skipped'

export default function App() {
  return (
    <main style={{ display: 'flex', gap: 48, padding: 24, fontFamily: 'system-ui' }}>
      <section><Broken /></section>
      <section><Fixed /></section>
      <section><Compiled /></section>
      <section><Skipped /></section>
    </main>
  )
}
