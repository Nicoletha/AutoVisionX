import { createContext, useContext } from 'react';
import useDetection from './useDetection';

const DetectionContext = createContext(null);

export function DetectionProvider({ children }) {
  const detection = useDetection();
  return (
    <DetectionContext.Provider value={detection}>
      {children}
    </DetectionContext.Provider>
  );
}

export function useDetectionContext() {
  const ctx = useContext(DetectionContext);
  if (!ctx) {
    throw new Error('useDetectionContext debe usarse dentro de DetectionProvider');
  }
  return ctx;
}

export default DetectionContext;
