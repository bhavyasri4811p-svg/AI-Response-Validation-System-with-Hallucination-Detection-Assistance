import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { EvaluationProvider } from './store/EvaluationContext';
import { Layout } from './components/Layout/Layout';
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { HistoryPage } from './pages/HistoryPage';
import { KnowledgeBasePage } from './pages/KnowledgeBasePage';
import { SettingsPage } from './pages/SettingsPage';
import { AboutPage } from './pages/AboutPage';
import BatchEvaluationPage from './pages/BatchEvaluationPage.tsx';

function App() {
  return (
    <EvaluationProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/knowledge" element={<KnowledgeBasePage />} />
            <Route path="/batch" element={<BatchEvaluationPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </EvaluationProvider>
  );
}

export default App;
