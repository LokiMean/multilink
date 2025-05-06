import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import PlatformPage from '../pages/PlatformPage';
 
export default function Navigation() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/platform/:platformName" element={<PlatformPage />} />
      </Routes>
    </Router>
  );
}
