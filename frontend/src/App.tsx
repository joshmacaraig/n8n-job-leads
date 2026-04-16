import { useState } from 'react';
import { Navigation, Page } from './components/Navigation';
import JobLeadsPage from './pages/JobLeadsPage';
import LinkedInLeadsPage from './pages/LinkedInLeadsPage';
import LoginPage from './pages/LoginPage';
import { clearToken, getToken } from './services/auth';

export default function App() {
  const [authed, setAuthed] = useState(() => Boolean(getToken()));
  const [currentPage, setCurrentPage] = useState<Page>('job-leads');

  const handleLogout = () => {
    clearToken();
    setAuthed(false);
  };

  if (!authed) {
    return <LoginPage onSuccess={() => setAuthed(true)} />;
  }

  return (
    <>
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} onLogout={handleLogout} />
      {currentPage === 'job-leads' && <JobLeadsPage />}
      {currentPage === 'linkedin-leads' && <LinkedInLeadsPage />}
    </>
  );
}
