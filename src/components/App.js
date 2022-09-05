import { Routes, Route } from 'react-router-dom';
import TodoScreen from './TodoScreen';
import Login from './Login';

import '../style/App.css';

export default function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Todos" element={<TodoScreen />} />
      </Routes>
    </div>
  );
}