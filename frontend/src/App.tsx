import { useState } from 'react';
import { Navigation, Page } from './components/Navigation';
import JobLeadsPage from './pages/JobLeadsPage';
import LinkedInLeadsPage from './pages/LinkedInLeadsPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('job-leads');

  return (
    <>
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      {currentPage === 'job-leads' && <JobLeadsPage />}
      {currentPage === 'linkedin-leads' && <LinkedInLeadsPage />}
    </>
  );
}
