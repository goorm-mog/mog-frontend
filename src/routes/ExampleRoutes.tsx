import { Route, Routes } from 'react-router-dom';
import Example from '@/pages/Example/Example';
import DesignSystemPage from '@/pages/Example/DesignSystemPage';

function ExampleRoutes() {
  return (
    <Routes>
      <Route index element={<Example />} />
      <Route path="design-system" element={<DesignSystemPage />} />
    </Routes>
  );
}

export default ExampleRoutes;
