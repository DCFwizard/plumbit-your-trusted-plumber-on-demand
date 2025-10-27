import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
export function SignUpPage() {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] py-12 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">{t('auth.signupTitle')}</CardTitle>
          <CardDescription>{t('auth.signupDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">{t('auth.fullName')}</Label>
            <Input id="name" placeholder="Mario Rossi" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">{t('auth.email')}</Label>
            <Input id="email" type="email" placeholder="mario@example.com" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">{t('auth.password')}</Label>
            <Input id="password" type="password" required />
          </div>
          <div className="grid gap-2">
            <Label>{t('auth.iAmA')}</Label>
            <RadioGroup defaultValue="customer" className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="customer" id="r1" />
                <Label htmlFor="r1">{t('auth.customer')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="plumber" id="r2" />
                <Label htmlFor="r2">{t('auth.plumber')}</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full bg-blue-600 hover:bg-blue-700">{t('auth.createAccount')}</Button>
          <div className="text-center text-sm text-muted-foreground">
            {t('auth.haveAccount')}{' '}
            <Link to="/login" className="underline hover:text-primary">
              {t('auth.login')}
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}