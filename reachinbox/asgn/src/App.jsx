import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Mail from './pages/Mail';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path = '/login' element={<Login/>} />
        <Route path = '/' element={<Mail/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
