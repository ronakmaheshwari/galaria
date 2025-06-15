import './App.css'
import { Button } from './components/ui/button'

function App() {
  return (
    <div className='flex gap-2 min-h-svh flex-col items-center justify-center bg-zinc-50'>
      <h1 className="font-bold underline text-5xl">
        Hello world!, Run pnpm run dev 
      </h1>
      <Button>Click me</Button>
    </div>
  )
}

export default App
