import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ExampleRoutes from '@/routes/ExampleRoutes';
import HomePage from '@/pages/Home/HomePage';
import LoginPage from '@/pages/Login/LoginPage';
import MeetRecord from '@/pages/MeetRecord/MeetRecord';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        {/* <Route path="/" element={<Main />} /> */}
        <Route path="/meet-record" element={<MeetRecord />} />
        <Route path="/example/*" element={<ExampleRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
