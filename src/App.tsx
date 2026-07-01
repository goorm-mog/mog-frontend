import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ExampleRoutes from '@/routes/ExampleRoutes';
import HomePage from '@/pages/Home/HomePage';
import LoginPage from '@/pages/Login/LoginPage';
import PromiseDetailPage from '@/pages/PromiseDetail/PromiseDetailPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/promise-detail" element={<PromiseDetailPage />} />
        <Route path="/example/*" element={<ExampleRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
