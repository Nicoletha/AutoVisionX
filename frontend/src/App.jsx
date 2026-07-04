import { BrowserRouter } from 'react-router-dom';
import AppRouter from './router/AppRouter';
import { DetectionProvider } from './hooks/DetectionContext';

function App() {
  return (
    <BrowserRouter>
      <DetectionProvider>
        <AppRouter />
      </DetectionProvider>
    </BrowserRouter>
  );
}

export default App;
