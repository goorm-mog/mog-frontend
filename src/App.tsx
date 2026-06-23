import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Example from './pages/Example/Example';
import DesignSystemPage from './pages/Example/DesignSystemPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Example />} />
        <Route path="/design-system" element={<DesignSystemPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
