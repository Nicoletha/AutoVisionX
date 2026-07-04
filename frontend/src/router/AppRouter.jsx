import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import ScanProcessingPage from '../pages/ScanProcessingPage';
import DetectionResultPage from '../pages/DetectionResultPage';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/escaneo" element={<ScanProcessingPage />} />
      <Route path="/resultado" element={<DetectionResultPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
