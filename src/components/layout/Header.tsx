import { Link } from 'react-router-dom';
import schoolLogo from '@/assets/school-logo.png';

interface HeaderProps {
  showNav?: boolean;
}

export const Header = ({ showNav = true }: HeaderProps) => {
  return (
    <header className="border-b border-border bg-card shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-center gap-4">
          <img 
            src={schoolLogo} 
            alt="Sonia Public School Logo" 
            className="h-16 w-16 object-contain"
          />
          <div className="text-center">
            <h1 className="text-2xl font-bold text-primary md:text-3xl">
              SONIA PUBLIC SR. SEC. SCHOOL
            </h1>
            <p className="text-sm text-muted-foreground italic">
              "Learn, Grow, Achieve, Succeed"
            </p>
          </div>
        </div>
        {showNav && (
          <nav className="mt-4 flex justify-center gap-4">
            <Link 
              to="/preboard-form" 
              className="rounded-full bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              PRE BOARD FORM 2025-26
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};
