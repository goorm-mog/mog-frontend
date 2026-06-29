import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ExampleRoutes from '@/routes/ExampleRoutes';
import HomePage from '@/pages/Home/HomePage';
import LoginPage from '@/pages/Login/LoginPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/example/*" element={<ExampleRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
