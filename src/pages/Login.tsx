import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { signIn } from '@/lib/auth';
import { useAuthContext } from '@/contexts/AuthContext';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import schoolLogo from '@/assets/school-logo.png';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, isAdminUser, loading: authLoading } = useAuthContext();
  const hasShownToast = useRef(false);
  const loginAttemptRef = useRef(false);

  useEffect(() => {
    // Handle redirect after login when auth context updates
    if (!authLoading && isAuthenticated) {
      if (isAdminUser) {
        setIsLoading(false);
        hasShownToast.current = false;
        loginAttemptRef.current = false;
        navigate('/admin/dashboard', { replace: true });
      } else if (loginAttemptRef.current && !hasShownToast.current) {
        // User just logged in but is not admin
        setIsLoading(false);
        hasShownToast.current = true;
        loginAttemptRef.current = false;
        toast({
          title: "Access Denied",
          description: "You do not have admin privileges. Please contact an administrator.",
          variant: "destructive"
        });
      }
    } else if (!authLoading && !isAuthenticated && loginAttemptRef.current) {
      // Auth failed to initialize after login attempt
      setIsLoading(false);
      hasShownToast.current = false;
      loginAttemptRef.current = false;
    }
  }, [authLoading, isAuthenticated, isAdminUser, navigate, toast]);

  // Handle redirect if user is already logged in when page loads
  useEffect(() => {
    if (!authLoading && isAuthenticated && isAdminUser) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [authLoading, isAuthenticated, isAdminUser, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    hasShownToast.current = false;
    loginAttemptRef.current = true;

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0] === 'email') fieldErrors.email = err.message;
        if (err.path[0] === 'password') fieldErrors.password = err.message;
      });
      setErrors(fieldErrors);
      loginAttemptRef.current = false;
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await signIn(email, password);

      if (error) {
        setIsLoading(false);
        hasShownToast.current = false;
        loginAttemptRef.current = false;
        toast({
          title: "Login Failed",
          description: error.message === 'Invalid login credentials' 
            ? 'Invalid email or password. Please try again.'
            : error.message,
          variant: "destructive"
        });
        return;
      }

      // If login successful, wait for auth context to update via onAuthStateChange
      // The useEffect above will handle the redirect once auth context is ready
      if (!data?.session?.user) {
        setIsLoading(false);
        hasShownToast.current = false;
        loginAttemptRef.current = false;
        toast({
          title: "Login Failed",
          description: "Unable to retrieve session. Please try again.",
          variant: "destructive"
        });
        return;
      }

      // Show success toast immediately, but keep loading state
      // The useEffect will handle navigation once auth context confirms admin status
      toast({
        title: "Login successful!",
        description: "Checking admin privileges...",
      });
      
      // Keep isLoading=true and let useEffect handle the redirect/error
      // Set a timeout as fallback in case auth context takes too long
      setTimeout(() => {
        if (loginAttemptRef.current && isLoading) {
          setIsLoading(false);
          loginAttemptRef.current = false;
          toast({
            title: "Timeout",
            description: "Authentication check is taking too long. Please refresh the page.",
            variant: "destructive"
          });
        }
      }, 10000); // 10 second timeout
      
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      hasShownToast.current = false;
      loginAttemptRef.current = false;
      toast({
        title: "Login Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    }
  };

  const clearForm = () => {
    setErrors({});
    setEmail('');
    setPassword('');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-secondary via-background to-accent p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <img 
              src={schoolLogo} 
              alt="Sonia Public School" 
              className="mx-auto h-20 w-20 object-contain"
            />
          </div>
          <CardTitle className="text-2xl text-primary">Admin Portal</CardTitle>
          <CardDescription>
            Sign in to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={errors.email ? 'border-destructive' : ''}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="login-password">Password</Label>
              <div className="relative">
                <Input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={errors.password ? 'border-destructive pr-10' : 'pr-10'}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}