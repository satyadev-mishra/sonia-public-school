import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useDocumentTitle = (titles: Record<string, string>) => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    const title = titles[path] || 'Sonia Public Sr. Sec. School';
    document.title = title;
  }, [location.pathname, titles]);
};
