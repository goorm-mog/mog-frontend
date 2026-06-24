import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ExampleRoutes from '@/routes/ExampleRoutes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/example" replace />} />
        {/* <Route path="/" element={<Main />} /> */}
        <Route path="/example/*" element={<ExampleRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
