import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuthStore } from '@/lib/auth-store';
import { api } from '@/lib/api-client';
import type { User } from '@shared/types';
import { toast } from 'sonner';
export function LoginPage() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  useEffect(() => {
    api<User[]>('/api/users')
      .then((data) => {
        setUsers(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Failed to fetch users:', error);
        toast.error('Failed to load user data for login.');
        setIsLoading(false);
      });
  }, []);
  const handleLogin = () => {
    const userToLogin = users.find((u) => u.id === selectedUserId);
    if (userToLogin) {
      login(userToLogin);
      toast.success(`Welcome back, ${userToLogin.name}!`);
      switch (userToLogin.role) {
        case 'CUSTOMER':
          navigate('/customer/dashboard');
          break;
        case 'PLUMBER':
          navigate('/plumber/dashboard');
          break;
        case 'ADMIN':
          navigate('/admin/dashboard');
          break;
        default:
          navigate('/');
      }
    } else {
      toast.error('Please select a user to log in.');
    }
  };
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] py-12 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">{t('auth.loginTitle')}</CardTitle>
          <CardDescription>{t('auth.loginDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="user-select">{t('auth.customer')}</Label>
            <Select onValueChange={setSelectedUserId} value={selectedUserId} disabled={isLoading}>
              <SelectTrigger id="user-select">
                <SelectValue placeholder={isLoading ? t('auth.loadingUsers') : t('auth.selectUser')} />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name} ({user.role})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleLogin} disabled={!selectedUserId}>
            {t('auth.login')}
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            {t('auth.noAccount')}{' '}
            <Link to="/signup" className="underline hover:text-primary">
              {t('auth.signup')}
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}