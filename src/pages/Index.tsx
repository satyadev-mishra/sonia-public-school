import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { FileText, Shield } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary via-background to-accent">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-4xl font-bold text-foreground md:text-5xl">
            Welcome to <span className="text-primary">Sonia Public School</span>
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Pre-Board Examination Portal 2025-26
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/preboard-form">
              <Button size="lg" className="gap-2 px-8">
                <FileText className="h-5 w-5" />
                Fill Preboard Form
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="gap-2 px-8">
                <Shield className="h-5 w-5" />
                Admin Login
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
