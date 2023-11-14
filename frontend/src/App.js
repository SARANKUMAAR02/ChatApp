
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/login/Login';
import Chat from './pages/chat/Chat';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />}/>
        <Route path='/chat' element={<Chat />}/>
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;
