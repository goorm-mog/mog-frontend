import { Route, Routes } from 'react-router-dom';
import Example from '@/pages/Example/Example';
import DesignSystemPage from '@/pages/Example/DesignSystemPage';
import CalendarPage from '@/pages/Example/CalendarPage';
import TitlePage from '@/pages/Example/TitlePage';

function ExampleRoutes() {
  return (
    <Routes>
      <Route index element={<Example />} />
      <Route path="design-system" element={<DesignSystemPage />} />
      <Route path="calendar-component" element={<CalendarPage />} />
      <Route path="title-component" element={<TitlePage />} />
    </Routes>
  );
}

export default ExampleRoutes;
