import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router";
import './App.css'
import Main from './Predictive_Analytics/Main';
import Risk from './Predictive_Analytics/Risk'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<p>Home</p>} />
        <Route path='/analytics' element={<Main />} />
        <Route path='/risk' element={<Risk />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App