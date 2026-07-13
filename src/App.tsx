import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastProvider } from '@/contexts/ToastContext';
import ExampleRoutes from '@/routes/ExampleRoutes';
import HomePage from '@/pages/Home/HomePage';
import LoginPage from '@/pages/Login/LoginPage';
import KakaoOAuthCallbackPage from '@/pages/Login/KakaoOAuthCallbackPage';
import HostReschedule from '@/pages/Reschedule/HostReschedule';
import ParticipantReschedule from '@/pages/Reschedule/ParticipantReschedule';
import DeparturePage from '@/pages/Reschedule/DeparturePage';
import MidpointPage from '@/pages/Reschedule/MidpointPage';
import MeetDetailPage from '@/pages/MeetDetail/MeetDetailPage';
import MeetRecord from '@/pages/MeetRecord/MeetRecord';
import MogCardPage from '@/pages/MogCard/MogCardPage';
import SettlementPage from '@/pages/Settlement/SettlementPage';
import MeetChatPage from '@/pages/MeetChat/MeetChatPage';
import RoomGuard from '@/components/common/RoomGuard';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/oauth/kakao" element={<KakaoOAuthCallbackPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/reschedule/host/:roomId" element={<RoomGuard><HostReschedule /></RoomGuard>} />
          <Route path="/reschedule/participant/:roomId" element={<RoomGuard><ParticipantReschedule /></RoomGuard>} />
          <Route path="/departure/host/:roomId" element={<RoomGuard><DeparturePage /></RoomGuard>} />
          <Route path="/departure/participant/:roomId" element={<RoomGuard><DeparturePage /></RoomGuard>} />
          <Route path="/midpoint/host/:roomId" element={<RoomGuard><MidpointPage /></RoomGuard>} />
          <Route path="/midpoint/participant/:roomId" element={<RoomGuard><MidpointPage /></RoomGuard>} />
          <Route path="/meet-detail" element={<MeetDetailPage />} />
          <Route path="/:roomId/meet-detail" element={<MeetDetailPage />} />
          <Route path="/:roomId/meet-record" element={<MeetRecord />} />
          <Route path="/:roomId/mog-card" element={<MogCardPage />} />
          <Route path="/:roomId/settlement" element={<SettlementPage />} />
          <Route path="/:roomId/chat" element={<MeetChatPage />} />
          <Route path="/example/*" element={<ExampleRoutes />} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
