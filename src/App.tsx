import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastProvider } from '@/contexts/ToastContext';
import ExampleRoutes from '@/routes/ExampleRoutes';
import HomePage from '@/pages/Home/HomePage';
import LoginPage from '@/pages/Login/LoginPage';
import HostReschedule from '@/pages/Reschedule/HostReschedule';
import ParticipantReschedule from '@/pages/Reschedule/ParticipantReschedule';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/reschedule/host/:roomId" element={<HostReschedule />} />
          <Route path="/reschedule/participant/:roomId" element={<ParticipantReschedule />} />
          <Route path="/example/*" element={<ExampleRoutes />} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
