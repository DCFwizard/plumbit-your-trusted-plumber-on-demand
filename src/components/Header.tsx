import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Menu, Wrench, Languages } from 'lucide-react';
import { useAuthStore } from '@/lib/auth-store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserRole } from '@shared/types';
import { Container } from './layout/Container';
export function Header() {
  const { t, i18n } = useTranslation();
  const [isSheetOpen, setSheetOpen] = useState(false);
  const currentUser = useAuthStore((state) => state.currentUser);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const publicNavLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/services', label: t('nav.services') },
    { to: '/how-it-works', label: t('nav.howItWorks') },
    { to: '/for-plumbers', label: t('nav.forPlumbers') },
    { to: '/faq', label: t('nav.faq') },
  ];
  const portalLinks = {
    [UserRole.CUSTOMER]: [{ to: '/customer/dashboard', label: 'My Jobs' }],
    [UserRole.PLUMBER]: [
      { to: '/plumber/dashboard', label: 'Jobs Dashboard' },
      { to: '/plumber/earnings', label: 'Earnings' },
      { to: '/plumber/profile', label: 'Profile' },
    ],
    [UserRole.ADMIN]: [
      { to: '/admin/dashboard', label: 'Dashboard' },
      { to: '/admin/users', label: 'Users' },
      { to: '/admin/plumbers', label: 'Plumbers' },
      { to: '/admin/jobs', label: 'Jobs' },
      { to: '/admin/reviews', label: 'Reviews' },
      { to: '/admin/validation', label: 'Validation' },
    ],
  };
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  const navLinks = currentUser?.role ? portalLinks[currentUser.role] : publicNavLinks;
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };
  const LanguageSwitcher = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Languages className="h-5 w-5" />
          <span className="sr-only">{t('lang.language')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t('lang.language')}</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => changeLanguage('it')}>{t('lang.italian')}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage('en')}>{t('lang.english')}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container className="flex h-16 items-center">
        <Link to="/" className="flex items-center gap-2 font-display text-2xl font-bold mr-auto">
          <Wrench className="h-7 w-7 text-blue-500" />
          <span>Plumbit</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium mx-auto">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `transition-colors hover:text-foreground/80 ${isActive ? 'text-foreground' : 'text-foreground/60'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2 ml-auto">
          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${currentUser.name}`} alt={currentUser.name} />
                    <AvatarFallback>{getInitials(currentUser.name)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{currentUser.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{currentUser.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>{t('auth.login')}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link to="/login">{t('auth.login')}</Link>
              </Button>
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link to="/signup">{t('auth.signup')}</Link>
              </Button>
            </div>
          )}
          <LanguageSwitcher />
          <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-6 p-6">
                <SheetClose asChild>
                  <Link to="/" className="flex items-center gap-2 font-display text-2xl font-bold">
                    <Wrench className="h-7 w-7 text-blue-500" />
                    <span>Plumbit</span>
                  </Link>
                </SheetClose>
                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <SheetClose asChild key={link.to}>
                      <NavLink to={link.to} className="text-lg font-medium text-foreground/80 hover:text-foreground">
                        {link.label}
                      </NavLink>
                    </SheetClose>
                  ))}
                </nav>
                {!currentUser && (
                  <div className="flex flex-col gap-2 mt-4">
                    <SheetClose asChild>
                      <Button variant="outline" asChild>
                        <Link to="/login">{t('auth.login')}</Link>
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button asChild className="bg-blue-600 hover:bg-blue-700">
                        <Link to="/signup">{t('auth.signup')}</Link>
                      </Button>
                    </SheetClose>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </header>
  );
}