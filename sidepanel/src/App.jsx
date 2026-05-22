import React from 'react'
import Homepage from './pages/Homepage'
import { useProblem } from './useProblem'

function App() {

  const { problem, loading } = useProblem();

  return (
    <div className='sidebar'>
      <Homepage data={{problem:{problem}, loading:{loading}}}/>
    </div>
  )
}

export default App
